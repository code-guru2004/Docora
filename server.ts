/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { v2 as cloudinary } from 'cloudinary';
import { 
  connectToDatabase, 
  DbUser, 
  DbDocument, 
  DbComment, 
  DbBookmark, 
  DbReadingHistory, 
  isConnected 
} from './server/db';

// Import mock data for local fallback in-memory database
import { MOCK_USERS, MOCK_DOCUMENTS, MOCK_COMMENTS } from './src/data/mockData';

// Setup local fallback states
let localUsers = [...MOCK_USERS];
let localDocuments = [...MOCK_DOCUMENTS];
let localComments = [...MOCK_COMMENTS];
let localBookmarks: any[] = [];
let localReadingHistory: any[] = [];

// Configure Cloudinary
const cloudinaryUrl = process.env.CLOUDINARY_URL;
let isCloudinaryConfigured = false;
let cloudinaryCloudName = process.env.CLOUDINARY_CLOUD_NAME || '';
let cloudinaryApiKey = process.env.CLOUDINARY_API_KEY || '';

if (cloudinaryUrl) {
  try {
    cloudinary.config({
      cloudinary_url: cloudinaryUrl
    });
    isCloudinaryConfigured = true;
    console.log('✅ Cloudinary initialized successfully via CLOUDINARY_URL.');
    const match = cloudinaryUrl.match(/cloudinary:\/\/([^:]+):([^@]+)@(.+)/);
    if (match) {
      cloudinaryApiKey = match[1];
      cloudinaryCloudName = match[3];
    }
  } catch (err) {
    console.error('❌ Failed to initialize Cloudinary via CLOUDINARY_URL:', err);
  }
} else if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    });
    isCloudinaryConfigured = true;
    console.log('✅ Cloudinary initialized successfully via individual credentials.');
  } catch (err) {
    console.error('❌ Failed to initialize Cloudinary via individual credentials:', err);
  }
} else {
  console.log('⚠️ Cloudinary is not configured. Document uploads will fall back to local simulated/temporary files.');
}

// Helper functions for Cloudinary URL signing
function getSignedCloudinaryUrlIfNeeded(url: string | undefined): string | undefined {
  if (!url || !isCloudinaryConfigured) return url;
  if (!url.includes('cloudinary.com') || !url.endsWith('.pdf')) return url;

  try {
    // If it's already signed, return it
    if (url.includes('/s--')) return url;

    // Matches image/upload or raw/upload
    // Example: https://res.cloudinary.com/xa5kkc22/image/upload/v1784129321/docshare_documents/lhowqcn80neul0frzhbt.pdf
    const match = url.match(/cloudinary\.com\/([^/]+)\/([^/]+)\/upload\/(?:v\d+\/)?(.+?)\.pdf$/);
    if (match) {
      const resourceType = match[2]; // 'image' or 'raw'
      const publicId = match[3];

      const signedUrl = cloudinary.url(publicId, {
        sign_url: true,
        secure: true,
        resource_type: resourceType as any,
        type: 'upload',
        format: 'pdf'
      });
      console.log(`[Signed URL] Successfully signed Cloudinary PDF publicId "${publicId}"`);
      return signedUrl;
    }
  } catch (err) {
    console.error('Failed to dynamically sign Cloudinary URL:', err);
  }
  return url;
}

function processDocument(doc: any): any {
  if (!doc) return doc;
  const docObj = doc.toObject ? doc.toObject() : doc;
  if (docObj.fileUrl) {
    docObj.fileUrl = getSignedCloudinaryUrlIfNeeded(docObj.fileUrl);
  }

  // Robust fallback: if fileType is missing, extract extension from stored filename/URL
  if (!docObj.fileType) {
    let fallbackExt = 'pdf';
    const source = docObj.fileUrl || docObj.originalname || docObj.title || '';
    const match = source.split('?')[0].match(/\.([a-zA-Z0-9]+)$/);
    if (match) {
      const ext = match[1].toLowerCase();
      if (['pdf', 'ppt', 'pptx', 'doc', 'docx', 'xls', 'xlsx'].includes(ext)) {
        fallbackExt = ext;
      }
    }
    docObj.fileType = fallbackExt;
  }

  return docObj;
}

async function deleteCloudinaryFile(url: string | undefined): Promise<void> {
  if (!url || !isCloudinaryConfigured || !url.includes('cloudinary.com')) return;
  try {
    // Extract resource type and public ID
    const match = url.match(/cloudinary\.com\/([^/]+)\/([^/]+)\/upload\/(?:v\d+\/)?(.+?)(?:\.[a-zA-Z0-9]+)?$/);
    if (match) {
      const resourceType = match[2]; // 'image' or 'raw'
      let publicId = match[3];
      publicId = decodeURIComponent(publicId);

      console.log(`🗑️ Attempting to delete Cloudinary asset of type "${resourceType}" with publicId "${publicId}"...`);
      const result = await cloudinary.uploader.destroy(publicId, {
        resource_type: resourceType as any
      });
      console.log('🗑️ Cloudinary deletion result:', result);
    } else {
      console.warn(`Could not parse Cloudinary publicId from url: ${url}`);
    }
  } catch (err) {
    console.error('❌ Failed to delete Cloudinary file:', err);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(express.json({ limit: '10mb' }));

  // Initial connection to MongoDB
  await connectToDatabase();

  // 1. API: Connection Status
  app.get('/api/db-status', (req, res) => {
    res.json({
      isConnected: isConnected,
      hasUri: !!process.env.MONGODB_URI,
      message: isConnected 
        ? 'MongoDB Atlas is active and connected.' 
        : 'Running in Local Demo Mode. Set MONGODB_URI in settings to enable durable MongoDB cloud database storage.',
      cloudinary: {
        isConfigured: isCloudinaryConfigured,
        cloudName: cloudinaryCloudName,
        apiKey: cloudinaryApiKey,
        message: isCloudinaryConfigured
          ? 'Cloudinary cloud storage is active and connected.'
          : 'Cloudinary is not configured. Document uploads will fall back to local preview mode.'
      }
    });
  });

  // API: Cloudinary Signature
  app.post('/api/cloudinary-signature', (req, res) => {
    try {
      const { params_to_sign } = req.body;
      if (!params_to_sign) {
        return res.status(400).json({ error: 'params_to_sign is required' });
      }
      
      let finalApiSecret = process.env.CLOUDINARY_API_SECRET || '';
      if (!finalApiSecret && cloudinaryUrl) {
        const match = cloudinaryUrl.match(/cloudinary:\/\/([^:]+):([^@]+)@(.+)/);
        if (match) {
          finalApiSecret = match[2];
        }
      }
      
      if (!finalApiSecret) {
        return res.status(400).json({ error: 'Cloudinary API secret is not configured' });
      }
      
      const signature = cloudinary.utils.api_sign_request(params_to_sign, finalApiSecret);
      res.json({ signature });
    } catch (error: any) {
      console.error('Error signing Cloudinary request:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // 2. API: Get Documents
  app.get('/api/documents', async (req, res) => {
    try {
      const { page, limit = '6', category, type, tag, search, sort = 'latest' } = req.query;

      // Check if paginated response is requested
      const isPaginated = page !== undefined;

      if (isConnected) {
        const query: any = { visibility: { $ne: 'private' } };

        if (category && category !== 'all') {
          query.category = { $regex: new RegExp(`^${category}$`, 'i') };
        }

        if (tag) {
          query.tags = { $regex: new RegExp(`^${tag}$`, 'i') };
        }

        if (type && type !== 'all') {
          if (type === 'pdf') {
            query.fileType = 'pdf';
          } else if (type === 'slides') {
            query.fileType = { $in: ['ppt', 'pptx'] };
          } else if (type === 'spreadsheets') {
            query.fileType = { $in: ['xls', 'xlsx'] };
          } else if (type === 'documents') {
            query.fileType = { $in: ['doc', 'docx'] };
          }
        }

        if (search && typeof search === 'string' && search.trim()) {
          const q = search.trim();
          query.$or = [
            { title: { $regex: q, $options: 'i' } },
            { description: { $regex: q, $options: 'i' } },
            { authorName: { $regex: q, $options: 'i' } },
            { tags: { $regex: q, $options: 'i' } },
            { category: { $regex: q, $options: 'i' } }
          ];
        }

        const sortObj: any = {};
        if (sort === 'views') {
          sortObj.views = -1;
        } else if (sort === 'downloads') {
          sortObj.downloads = -1;
        } else if (sort === 'likes') {
          sortObj.likes = -1;
        } else {
          sortObj.createdAt = -1;
        }

        if (isPaginated) {
          const pageNum = parseInt(page as string) || 1;
          const limitNum = parseInt(limit as string) || 6;
          const skipNum = (pageNum - 1) * limitNum;

          const totalCount = await DbDocument.countDocuments(query);
          const docs = await DbDocument.find(query).sort(sortObj).skip(skipNum).limit(limitNum);
          const processedDocs = docs.map(doc => processDocument(doc));
          const totalPages = Math.ceil(totalCount / limitNum);

          return res.json({
            documents: processedDocs,
            totalCount,
            totalPages,
            currentPage: pageNum,
            limit: limitNum
          });
        } else {
          const docs = await DbDocument.find(query).sort(sortObj);
          const processedDocs = docs.map(doc => processDocument(doc));
          return res.json(processedDocs);
        }
      } else {
        // Local state filtering & sorting
        let docs = [...localDocuments];
        docs = docs.filter(doc => doc.visibility !== 'private');

        if (category && category !== 'all') {
          docs = docs.filter(doc => doc.category.toLowerCase() === (category as string).toLowerCase());
        }

        if (tag) {
          docs = docs.filter(doc => doc.tags.some(t => t.toLowerCase() === (tag as string).toLowerCase()));
        }

        if (type && type !== 'all') {
          if (type === 'pdf') {
            docs = docs.filter(doc => doc.fileType === 'pdf');
          } else if (type === 'slides') {
            docs = docs.filter(doc => doc.fileType === 'ppt' || doc.fileType === 'pptx');
          } else if (type === 'spreadsheets') {
            docs = docs.filter(doc => doc.fileType === 'xls' || doc.fileType === 'xlsx');
          } else if (type === 'documents') {
            docs = docs.filter(doc => doc.fileType === 'doc' || doc.fileType === 'docx');
          }
        }

        if (search && typeof search === 'string' && search.trim()) {
          const q = search.trim().toLowerCase();
          docs = docs.filter(doc => {
            const matchTitle = doc.title?.toLowerCase().includes(q);
            const matchDesc = doc.description?.toLowerCase().includes(q);
            const matchAuthor = doc.authorName?.toLowerCase().includes(q);
            const matchTags = doc.tags?.some(t => t.toLowerCase().includes(q));
            const matchCategory = doc.category?.toLowerCase().includes(q);
            return matchTitle || matchDesc || matchAuthor || matchTags || matchCategory;
          });
        }

        if (sort === 'views') {
          docs.sort((a, b) => (b.views || 0) - (a.views || 0));
        } else if (sort === 'downloads') {
          docs.sort((a, b) => (b.downloads || 0) - (a.downloads || 0));
        } else if (sort === 'likes') {
          docs.sort((a, b) => (b.likes || 0) - (a.likes || 0));
        } else {
          docs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        }

        if (isPaginated) {
          const pageNum = parseInt(page as string) || 1;
          const limitNum = parseInt(limit as string) || 6;
          const startIndex = (pageNum - 1) * limitNum;
          
          const totalCount = docs.length;
          const paginatedDocs = docs.slice(startIndex, startIndex + limitNum);
          const processedDocs = paginatedDocs.map(doc => processDocument(doc));
          const totalPages = Math.ceil(totalCount / limitNum);

          return res.json({
            documents: processedDocs,
            totalCount,
            totalPages,
            currentPage: pageNum,
            limit: limitNum
          });
        } else {
          const processedDocs = docs.map(doc => processDocument(doc));
          return res.json(processedDocs);
        }
      }
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  });

  // 3. API: Create Document
  app.post('/api/documents', async (req, res) => {
    try {
      const { fileBase64, ...docData } = req.body;
      let finalFileUrl = docData.fileUrl;

      if (fileBase64 && isCloudinaryConfigured) {
        try {
          console.log('📤 Uploading document to Cloudinary...');
          const uploadResult = await cloudinary.uploader.upload(fileBase64, {
            resource_type: 'auto',
            folder: 'docshare_documents'
          });
          finalFileUrl = uploadResult.secure_url;
          console.log('✅ Cloudinary upload successful:', finalFileUrl);
        } catch (uploadError: any) {
          console.error('❌ Cloudinary upload failed:', uploadError);
          // Fallback to client fileUrl if upload fails, ensuring high reliability
        }
      }

      // Determine file type from original uploaded filename
      const originalname = req.body.originalname || req.body.fileName || '';
      const file = { originalname };
      const fileType = originalname
        ? path.extname(file.originalname).replace(".", "").toLowerCase()
        : (docData.fileType || 'pdf');

      const newDocId = `doc_${Date.now()}`;
      const newDoc = {
        ...docData,
        fileType,
        id: newDocId,
        fileUrl: finalFileUrl,
        views: 0,
        downloads: 0,
        likes: 0,
        likedBy: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      if (isConnected) {
        const created = await DbDocument.create(newDoc);
        return res.status(201).json(processDocument(created));
      } else {
        localDocuments = [newDoc, ...localDocuments];
        return res.status(201).json(processDocument(newDoc));
      }
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  });

  // 4. API: Update Likes / Toggle Like
  app.post('/api/documents/:id/like', async (req, res) => {
    try {
      const { id } = req.params;
      const { userId } = req.body;

      if (!userId) {
        return res.status(400).json({ error: 'userId is required' });
      }

      if (isConnected) {
        const doc = await DbDocument.findOne({ id } as any);
        if (!doc) return res.status(404).json({ error: 'Document not found' });

        const likedBy = doc.likedBy || [];
        const hasLiked = likedBy.includes(userId);
        const updatedLikedBy = hasLiked 
          ? likedBy.filter((uid: string) => uid !== userId)
          : [...likedBy, userId];

        const updated = await DbDocument.findOneAndUpdate(
          { id } as any,
          { likedBy: updatedLikedBy, likes: updatedLikedBy.length } as any,
          { new: true } as any
        );
        return res.json(processDocument(updated));
      } else {
        const docIdx = localDocuments.findIndex(d => d.id === id);
        if (docIdx === -1) return res.status(404).json({ error: 'Document not found' });

        const doc = localDocuments[docIdx];
        const hasLiked = doc.likedBy.includes(userId);
        const updatedLikedBy = hasLiked
          ? doc.likedBy.filter(uid => uid !== userId)
          : [...doc.likedBy, userId];

        localDocuments[docIdx] = {
          ...doc,
          likedBy: updatedLikedBy,
          likes: updatedLikedBy.length
        };
        return res.json(processDocument(localDocuments[docIdx]));
      }
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  });

  // 5. API: Increment views
  app.post('/api/documents/:id/view', async (req, res) => {
    try {
      const { id } = req.params;
      if (isConnected) {
        const updated = await DbDocument.findOneAndUpdate(
          { id } as any,
          { $inc: { views: 1 } } as any,
          { new: true } as any
        );
        return res.json(processDocument(updated));
      } else {
        const docIdx = localDocuments.findIndex(d => d.id === id);
        if (docIdx === -1) return res.status(404).json({ error: 'Document not found' });
        localDocuments[docIdx] = {
          ...localDocuments[docIdx],
          views: (localDocuments[docIdx].views || 0) + 1
        };
        return res.json(processDocument(localDocuments[docIdx]));
      }
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  });

  // 6. API: Increment downloads
  app.post('/api/documents/:id/download', async (req, res) => {
    try {
      const { id } = req.params;
      if (isConnected) {
        const updated = await DbDocument.findOneAndUpdate(
          { id } as any,
          { $inc: { downloads: 1 } } as any,
          { new: true } as any
        );
        return res.json(processDocument(updated));
      } else {
        const docIdx = localDocuments.findIndex(d => d.id === id);
        if (docIdx === -1) return res.status(404).json({ error: 'Document not found' });
        localDocuments[docIdx] = {
          ...localDocuments[docIdx],
          downloads: (localDocuments[docIdx].downloads || 0) + 1
        };
        return res.json(processDocument(localDocuments[docIdx]));
      }
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  });

  // API: Delete Document
  app.delete('/api/documents/:id', async (req, res) => {
    try {
      const { id } = req.params;
      if (isConnected) {
        const deleted = await DbDocument.findOneAndDelete({ id } as any);
        if (!deleted) return res.status(404).json({ error: 'Document not found' });
        
        // Delete from Cloudinary if applicable
        if (deleted.fileUrl) {
          await deleteCloudinaryFile(deleted.fileUrl);
        }
        
        return res.json({ success: true, message: 'Document deleted successfully' });
      } else {
        const docIdx = localDocuments.findIndex(d => d.id === id);
        if (docIdx === -1) return res.status(404).json({ error: 'Document not found' });
        
        const docToDelete = localDocuments[docIdx];
        localDocuments = localDocuments.filter(d => d.id !== id);
        
        // Delete from Cloudinary if applicable
        if (docToDelete.fileUrl) {
          await deleteCloudinaryFile(docToDelete.fileUrl);
        }

        return res.json({ success: true, message: 'Document deleted successfully' });
      }
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  });

  // API: Update Document Visibility
  app.patch('/api/documents/:id/visibility', async (req, res) => {
    try {
      const { id } = req.params;
      const { visibility } = req.body;

      if (!visibility || (visibility !== 'public' && visibility !== 'private')) {
        return res.status(400).json({ error: 'visibility must be public or private' });
      }

      if (isConnected) {
        const updated = await DbDocument.findOneAndUpdate(
          { id } as any,
          { visibility } as any,
          { new: true } as any
        );
        if (!updated) return res.status(404).json({ error: 'Document not found' });
        return res.json(processDocument(updated));
      } else {
        const docIdx = localDocuments.findIndex(d => d.id === id);
        if (docIdx === -1) return res.status(404).json({ error: 'Document not found' });
        localDocuments[docIdx] = {
          ...localDocuments[docIdx],
          visibility
        };
        return res.json(processDocument(localDocuments[docIdx]));
      }
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  });

  // 7. API: Get Users
  app.get('/api/users', async (req, res) => {
    try {
      if (isConnected) {
        const users = await DbUser.find();
        return res.json(users);
      } else {
        return res.json(localUsers);
      }
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  });

  // 8. API: User Login
  app.post('/api/users/login', async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) return res.status(400).json({ error: 'Email is required' });

      if (isConnected) {
        const user = await DbUser.findOne({ email: new RegExp(`^${email}$`, 'i') } as any);
        if (!user) return res.status(404).json({ error: 'User email not found.' });
        return res.json(user);
      } else {
        const user = localUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (!user) return res.status(404).json({ error: 'User email not found.' });
        return res.json(user);
      }
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  });

  // 9. API: User Registration
  app.post('/api/users/register', async (req, res) => {
    try {
      const { name, email } = req.body;
      if (!name || !email) {
        return res.status(400).json({ error: 'Name and Email are required' });
      }

      const existingUser = isConnected 
        ? await DbUser.findOne({ email: new RegExp(`^${email}$`, 'i') } as any)
        : localUsers.find(u => u.email.toLowerCase() === email.toLowerCase());

      if (existingUser) {
        return res.status(400).json({ error: 'Email address is already registered.' });
      }

      const newUser = {
        id: `user_${Date.now()}`,
        name,
        email,
        avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
        bio: 'Avid reader and document sharing enthusiast.',
        role: 'user' as 'user' | 'admin',
        followersCount: 0,
        followingCount: 0,
        followers: [] as string[],
        following: [] as string[],
        createdAt: new Date().toISOString()
      };

      if (isConnected) {
        const created = await DbUser.create(newUser);
        return res.status(201).json(created);
      } else {
        localUsers.push(newUser);
        return res.status(201).json(newUser);
      }
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  });

  // 9b. API: Update User Profile
  app.put('/api/users/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { name, bio, avatar, socialLinks } = req.body;

      if (isConnected) {
        const updatedUser = await DbUser.findOneAndUpdate(
          { id } as any,
          { 
            $set: { 
              name, 
              bio, 
              avatar, 
              socialLinks: {
                facebook: socialLinks?.facebook || '',
                instagram: socialLinks?.instagram || '',
                telegram: socialLinks?.telegram || '',
                linkedin: socialLinks?.linkedin || ''
              } 
            } 
          } as any,
          { new: true } as any
        );

        if (!updatedUser) {
          return res.status(404).json({ error: 'User not found' });
        }

        // Keep document author info synchronized!
        await DbDocument.updateMany(
          { uploadedBy: id } as any,
          { $set: { authorName: name, authorAvatar: avatar } } as any
        );

        return res.json(updatedUser);
      } else {
        const userIdx = localUsers.findIndex(u => u.id === id);
        if (userIdx === -1) {
          return res.status(404).json({ error: 'User not found' });
        }

        localUsers[userIdx] = {
          ...localUsers[userIdx],
          name,
          bio,
          avatar,
          socialLinks: {
            facebook: socialLinks?.facebook || '',
            instagram: socialLinks?.instagram || '',
            telegram: socialLinks?.telegram || '',
            linkedin: socialLinks?.linkedin || ''
          }
        };

        // Keep local documents synchronized
        localDocuments = localDocuments.map(doc => 
          doc.uploadedBy === id 
            ? { ...doc, authorName: name, authorAvatar: avatar }
            : doc
        );

        return res.json(localUsers[userIdx]);
      }
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  });

  // 10. API: Follow / Unfollow Toggle
  app.post('/api/users/:id/follow', async (req, res) => {
    try {
      const { id: authorId } = req.params; // being followed
      const { userId: currentUserId } = req.body; // who follows

      if (authorId === currentUserId) {
        return res.status(400).json({ error: "You cannot follow yourself!" });
      }

      if (isConnected) {
        const currentUser = await DbUser.findOne({ id: currentUserId } as any);
        const authorUser = await DbUser.findOne({ id: authorId } as any);

        if (!currentUser || !authorUser) {
          return res.status(404).json({ error: 'User not found' });
        }

        const isFollowing = currentUser.following.includes(authorId);
        
        const updatedFollowing = isFollowing 
          ? currentUser.following.filter((uid: string) => uid !== authorId)
          : [...currentUser.following, authorId];

        const updatedFollowers = isFollowing
          ? authorUser.followers.filter((uid: string) => uid !== currentUserId)
          : [...authorUser.followers, currentUserId];

        const updatedCurrentUser = await DbUser.findOneAndUpdate(
          { id: currentUserId } as any,
          { following: updatedFollowing, followingCount: updatedFollowing.length } as any,
          { new: true } as any
        );

        await DbUser.findOneAndUpdate(
          { id: authorId } as any,
          { followers: updatedFollowers, followersCount: updatedFollowers.length } as any,
          {} as any
        );

        return res.json({ currentUser: updatedCurrentUser });
      } else {
        const currentUserIdx = localUsers.findIndex(u => u.id === currentUserId);
        const authorUserIdx = localUsers.findIndex(u => u.id === authorId);

        if (currentUserIdx === -1 || authorUserIdx === -1) {
          return res.status(404).json({ error: 'User not found' });
        }

        const currentUser = localUsers[currentUserIdx];
        const authorUser = localUsers[authorUserIdx];

        const isFollowing = currentUser.following.includes(authorId);

        const updatedFollowing = isFollowing
          ? currentUser.following.filter(uid => uid !== authorId)
          : [...currentUser.following, authorId];

        const updatedFollowers = isFollowing
          ? authorUser.followers.filter(uid => uid !== currentUserId)
          : [...authorUser.followers, currentUserId];

        localUsers[currentUserIdx] = {
          ...currentUser,
          following: updatedFollowing,
          followingCount: updatedFollowing.length
        };

        localUsers[authorUserIdx] = {
          ...authorUser,
          followers: updatedFollowers,
          followersCount: updatedFollowers.length
        };

        return res.json({ currentUser: localUsers[currentUserIdx] });
      }
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  });

  // 11. API: Comments List for a Doc
  app.get('/api/comments', async (req, res) => {
    try {
      const documentId = req.query.documentId as string | undefined;
      if (isConnected) {
        const filter = documentId ? { documentId } : {};
        const comments = await DbComment.find(filter as any).sort({ createdAt: -1 });
        return res.json(comments);
      } else {
        let comments = [...localComments];
        if (documentId) {
          comments = comments.filter(c => c.documentId === documentId);
        }
        comments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        return res.json(comments);
      }
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  });

  // 12. API: Add Comment
  app.post('/api/comments', async (req, res) => {
    try {
      const { userId, userName, userAvatar, documentId, message } = req.body;
      if (!userId || !documentId || !message) {
        return res.status(400).json({ error: 'userId, documentId and message are required' });
      }

      const newComment = {
        id: `comm_${Date.now()}`,
        userId,
        userName,
        userAvatar,
        documentId,
        message,
        createdAt: new Date().toISOString()
      };

      if (isConnected) {
        const created = await DbComment.create(newComment);
        return res.status(201).json(created);
      } else {
        localComments = [newComment, ...localComments];
        return res.status(201).json(newComment);
      }
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  });

  // 13. API: Bookmarks
  app.get('/api/bookmarks', async (req, res) => {
    try {
      const userId = req.query.userId as string | undefined;
      if (!userId) return res.status(400).json({ error: 'userId required' });

      if (isConnected) {
        const bookmarks = await DbBookmark.find({ userId } as any);
        return res.json(bookmarks);
      } else {
        const bookmarks = localBookmarks.filter(b => b.userId === userId);
        return res.json(bookmarks);
      }
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  });

  // 14. API: Toggle Bookmark
  app.post('/api/bookmarks/toggle', async (req, res) => {
    try {
      const { userId, documentId } = req.body;
      if (!userId || !documentId) {
        return res.status(400).json({ error: 'userId and documentId are required' });
      }

      if (isConnected) {
        const existing = await DbBookmark.findOne({ userId, documentId } as any);
        if (existing) {
          await DbBookmark.deleteOne({ userId, documentId } as any);
          return res.json({ removed: true });
        } else {
          const created = await DbBookmark.create({
            id: `bm_${Date.now()}`,
            userId,
            documentId,
            savedAt: new Date().toISOString()
          });
          return res.status(201).json(created);
        }
      } else {
        const existingIdx = localBookmarks.findIndex(b => b.userId === userId && b.documentId === documentId);
        if (existingIdx > -1) {
          localBookmarks.splice(existingIdx, 1);
          return res.json({ removed: true });
        } else {
          const newBookmark = {
            id: `bm_${Date.now()}`,
            userId,
            documentId,
            savedAt: new Date().toISOString()
          };
          localBookmarks = [newBookmark, ...localBookmarks];
          return res.status(201).json(newBookmark);
        }
      }
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  });

  // 15. API: Reading History List
  app.get('/api/reading-history', async (req, res) => {
    try {
      const userId = req.query.userId as string | undefined;
      if (!userId) return res.status(400).json({ error: 'userId required' });

      if (isConnected) {
        const history = await DbReadingHistory.find({ userId } as any).sort({ viewedAt: -1 });
        return res.json(history);
      } else {
        const history = localReadingHistory.filter(h => h.userId === userId);
        history.sort((a, b) => new Date(b.viewedAt).getTime() - new Date(a.viewedAt).getTime());
        return res.json(history);
      }
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  });

  // 16. API: Add/Update Reading History
  app.post('/api/reading-history', async (req, res) => {
    try {
      const { userId, documentId } = req.body;
      if (!userId || !documentId) {
        return res.status(400).json({ error: 'userId and documentId are required' });
      }

      const viewedAt = new Date().toISOString();

      if (isConnected) {
        // Find existing to update timestamp, or create new
        const existing = await DbReadingHistory.findOne({ userId, documentId } as any);
        if (existing) {
          existing.viewedAt = viewedAt;
          await existing.save();
          return res.json(existing);
        } else {
          const created = await DbReadingHistory.create({
            id: `rh_${Date.now()}`,
            userId,
            documentId,
            viewedAt
          });
          return res.status(201).json(created);
        }
      } else {
        const existingIdx = localReadingHistory.findIndex(h => h.userId === userId && h.documentId === documentId);
        if (existingIdx > -1) {
          localReadingHistory[existingIdx] = {
            ...localReadingHistory[existingIdx],
            viewedAt
          };
          return res.json(localReadingHistory[existingIdx]);
        } else {
          const newHistory = {
            id: `rh_${Date.now()}`,
            userId,
            documentId,
            viewedAt
          };
          localReadingHistory = [newHistory, ...localReadingHistory];
          return res.status(201).json(newHistory);
        }
      }
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  });

  // Vite development integration or static serving
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
