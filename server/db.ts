/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

export let isConnected = false;

// Connection helper
export async function connectToDatabase() {
  if (!MONGODB_URI) {
    console.warn('⚠️ MONGODB_URI environment variable is missing. Running in high-performance Demo mode.');
    return false;
  }

  if (isConnected) return true;

  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log('✅ Connected to MongoDB successfully.');
    
    // Seed initial mock data if collections are empty
    await seedDatabaseIfNeeded();
    return true;
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error);
    isConnected = false;
    return false;
  }
}

// User Schema
const UserSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  avatar: { type: String, required: true },
  bio: { type: String, default: '' },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  followersCount: { type: Number, default: 0 },
  followingCount: { type: Number, default: 0 },
  followers: { type: [String], default: [] },
  following: { type: [String], default: [] },
  socialLinks: {
    facebook: { type: String, default: '' },
    instagram: { type: String, default: '' },
    telegram: { type: String, default: '' },
    linkedin: { type: String, default: '' }
  },
  createdAt: { type: String, required: true }
}, { timestamps: false });

export const DbUser: mongoose.Model<any> = mongoose.models.User || mongoose.model('User', UserSchema);

// Document Schema
const DocumentSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  title: { type: String, required: true },
  slug: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  tags: { type: [String], default: [] },
  language: { type: String, required: true },
  coverImage: { type: String, required: true },
  fileType: { type: String, required: true },
  fileSize: { type: String, required: true },
  totalPages: { type: Number, required: true },
  views: { type: Number, default: 0 },
  downloads: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  likedBy: { type: [String], default: [] },
  visibility: { type: String, enum: ['public', 'private'], default: 'public' },
  uploadedBy: { type: String, required: true },
  authorName: { type: String, required: true },
  authorAvatar: { type: String, required: true },
  pages: { type: [String], required: true },
  fileUrl: { type: String },
  originalname: { type: String },
  createdAt: { type: String, required: true },
  updatedAt: { type: String, required: true }
}, { timestamps: false });

export const DbDocument: mongoose.Model<any> = mongoose.models.Document || mongoose.model('Document', DocumentSchema);

// Comment Schema
const CommentSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  userAvatar: { type: String, required: true },
  documentId: { type: String, required: true, index: true },
  message: { type: String, required: true },
  createdAt: { type: String, required: true }
}, { timestamps: false });

export const DbComment: mongoose.Model<any> = mongoose.models.Comment || mongoose.model('Comment', CommentSchema);

// Bookmark Schema
const BookmarkSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: String, required: true, index: true },
  documentId: { type: String, required: true },
  savedAt: { type: String, required: true }
}, { timestamps: false });

export const DbBookmark: mongoose.Model<any> = mongoose.models.Bookmark || mongoose.model('Bookmark', BookmarkSchema);

// Reading History Schema
const ReadingHistorySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: String, required: true, index: true },
  documentId: { type: String, required: true },
  viewedAt: { type: String, required: true }
}, { timestamps: false });

export const DbReadingHistory: mongoose.Model<any> = mongoose.models.ReadingHistory || mongoose.model('ReadingHistory', ReadingHistorySchema);

// Helper to seed data if empty
async function seedDatabaseIfNeeded() {
  try {
    const userCount = await DbUser.countDocuments();
    const docCount = await DbDocument.countDocuments();
    const commentCount = await DbComment.countDocuments();

    if (userCount === 0 || docCount === 0) {
      console.log('🌱 Seeding initial database records into MongoDB...');
      
      // Dynamic import of mock data to keep server startup independent
      const { MOCK_USERS, MOCK_DOCUMENTS, MOCK_COMMENTS } = await import('../src/data/mockData.js');

      if (userCount === 0) {
        await DbUser.insertMany(MOCK_USERS as any);
        console.log(`✅ Seeded ${MOCK_USERS.length} users.`);
      }

      if (docCount === 0) {
        // Double check documents schema structure before insertion
        await DbDocument.insertMany(MOCK_DOCUMENTS as any);
        console.log(`✅ Seeded ${MOCK_DOCUMENTS.length} documents.`);
      }

      if (commentCount === 0 && MOCK_COMMENTS && MOCK_COMMENTS.length > 0) {
        await DbComment.insertMany(MOCK_COMMENTS as any);
        console.log(`✅ Seeded ${MOCK_COMMENTS.length} comments.`);
      }
    }
  } catch (err) {
    console.error('⚠️ Could not complete database seeding:', err);
  }
}
