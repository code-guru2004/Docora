/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Document, Comment, Bookmark, ReadingHistory } from '../types';
import { MOCK_USERS, MOCK_DOCUMENTS, MOCK_COMMENTS } from '../data/mockData';

interface AppContextType {
  currentUser: User | null;
  users: User[];
  documents: Document[];
  comments: Comment[];
  bookmarks: Bookmark[];
  readingHistory: ReadingHistory[];
  activeRoute: string; // 'home' | 'explore' | 'document' | 'upload' | 'login' | 'register' | 'dashboard' | 'profile' | 'search'
  selectedDocId: string | null;
  selectedUserId: string | null;
  searchQuery: string;
  searchFilterCategory: string;
  searchFilterTag: string;
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
  dbStatus: { 
    isConnected: boolean; 
    hasUri: boolean; 
    message: string; 
    cloudinary?: {
      isConfigured: boolean;
      cloudName?: string;
      apiKey?: string;
      message: string;
    };
  } | null;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  hideToast: () => void;
  navigate: (route: string, docId?: string | null, userId?: string | null) => void;
  login: (email: string) => Promise<boolean>;
  register: (name: string, email: string) => Promise<boolean>;
  logout: () => void;
  uploadDocument: (docData: Omit<Document, 'id' | 'views' | 'downloads' | 'likes' | 'likedBy' | 'uploadedBy' | 'authorName' | 'authorAvatar' | 'createdAt' | 'updatedAt'>, fileBase64?: string) => Promise<void>;
  addComment: (docId: string, message: string) => Promise<void>;
  toggleBookmark: (docId: string) => Promise<void>;
  toggleLike: (docId: string) => Promise<void>;
  toggleFollow: (authorId: string) => Promise<void>;
  recordHistory: (docId: string) => Promise<void>;
  incrementViews: (docId: string) => Promise<void>;
  incrementDownloads: (docId: string) => Promise<void>;
  deleteDocument: (docId: string) => Promise<void>;
  toggleDocumentVisibility: (docId: string) => Promise<void>;
  refreshDbStatus: () => Promise<void>;
  updateProfile: (name: string, bio: string, avatar: string, socialLinks: { facebook?: string; instagram?: string; telegram?: string; linkedin?: string; }) => Promise<boolean>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);

  // Entities
  const [documents, setDocuments] = useState<Document[]>(MOCK_DOCUMENTS);
  const [comments, setComments] = useState<Comment[]>(MOCK_COMMENTS);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [readingHistory, setReadingHistory] = useState<ReadingHistory[]>([]);

  // Simple helper to parse initial path
  const getInitialRoute = () => {
    const path = window.location.pathname;
    const cleaned = path.replace(/\/$/, "");
    if (!cleaned || cleaned === "" || cleaned === "/") {
      return { route: 'home', docId: null, userId: null };
    }
    if (cleaned === '/explore') {
      return { route: 'explore', docId: null, userId: null };
    }
    const exploreDocMatch = cleaned.match(/^\/explore\/([^/]+)$/);
    if (exploreDocMatch) {
      return { route: 'document', docId: exploreDocMatch[1], userId: null };
    }
    if (cleaned === '/upload') {
      return { route: 'upload', docId: null, userId: null };
    }
    if (cleaned === '/login') {
      return { route: 'login', docId: null, userId: null };
    }
    if (cleaned === '/register') {
      return { route: 'register', docId: null, userId: null };
    }
    if (cleaned === '/dashboard') {
      return { route: 'dashboard', docId: null, userId: null };
    }
    if (cleaned === '/profile') {
      return { route: 'profile', docId: null, userId: null };
    }
    const profileMatch = cleaned.match(/^\/profile\/([^/]+)$/);
    if (profileMatch) {
      return { route: 'profile', docId: null, userId: profileMatch[1] };
    }
    return { route: 'home', docId: null, userId: null };
  };

  const initialRouteInfo = getInitialRoute();

  // Navigation / Routing State
  const [activeRoute, setActiveRoute] = useState<string>(initialRouteInfo.route);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(initialRouteInfo.docId);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(initialRouteInfo.userId);

  // Search Context
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchFilterCategory, setSearchFilterCategory] = useState<string>('');
  const [searchFilterTag, setSearchFilterTag] = useState<string>('');

  // Notifications
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  
  // MongoDB database integration status
  const [dbStatus, setDbStatus] = useState<{ 
    isConnected: boolean; 
    hasUri: boolean; 
    message: string; 
    cloudinary?: {
      isConfigured: boolean;
      cloudName?: string;
      apiKey?: string;
      message: string;
    };
  } | null>(null);

  // Initial Load from Server
  const refreshDbStatus = async () => {
    try {
      const res = await fetch('/api/db-status');
      if (res.ok) {
        const data = await res.json();
        setDbStatus(data);
      }
    } catch (err) {
      console.warn('Could not read backend status:', err);
    }
  };

  const loadDocuments = async () => {
    try {
      const res = await fetch('/api/documents');
      if (res.ok) {
        const data = await res.json();
        setDocuments(data);
      }
    } catch (err) {
      console.warn('API error, using local fallback state for documents.');
    }
  };

  const loadUsers = async () => {
    try {
      const res = await fetch('/api/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (err) {
      console.warn('API error, using local fallback state for users.');
    }
  };

  const loadComments = async () => {
    try {
      const res = await fetch('/api/comments');
      if (res.ok) {
        const data = await res.json();
        setComments(data);
      }
    } catch (err) {
      console.warn('API error, using local fallback state for comments.');
    }
  };

  useEffect(() => {
    // Check MongoDB Status and Seed status
    refreshDbStatus();
    loadDocuments();
    loadUsers();
    loadComments();

    // Check Local storage session for user login
    const storedCurrentUser = localStorage.getItem('scribd_current_user');
    if (storedCurrentUser) {
      setCurrentUser(JSON.parse(storedCurrentUser));
    }
  }, []);

  // Synchronize browser history / navigation with back-forward actions
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      const cleaned = path.replace(/\/$/, "");
      if (!cleaned || cleaned === "" || cleaned === "/") {
        setActiveRoute('home');
        setSelectedDocId(null);
        setSelectedUserId(null);
      } else if (cleaned === '/explore') {
        setActiveRoute('explore');
        setSelectedDocId(null);
        setSelectedUserId(null);
      } else {
        const exploreDocMatch = cleaned.match(/^\/explore\/([^/]+)$/);
        if (exploreDocMatch) {
          setActiveRoute('document');
          setSelectedDocId(exploreDocMatch[1]);
          setSelectedUserId(null);
        } else if (cleaned === '/upload') {
          setActiveRoute('upload');
          setSelectedDocId(null);
          setSelectedUserId(null);
        } else if (cleaned === '/login') {
          setActiveRoute('login');
          setSelectedDocId(null);
          setSelectedUserId(null);
        } else if (cleaned === '/register') {
          setActiveRoute('register');
          setSelectedDocId(null);
          setSelectedUserId(null);
        } else if (cleaned === '/dashboard') {
          setActiveRoute('dashboard');
          setSelectedDocId(null);
          setSelectedUserId(null);
        } else if (cleaned === '/profile') {
          setActiveRoute('profile');
          setSelectedDocId(null);
          setSelectedUserId(null);
        } else {
          const profileMatch = cleaned.match(/^\/profile\/([^/]+)$/);
          if (profileMatch) {
            setActiveRoute('profile');
            setSelectedDocId(null);
            setSelectedUserId(profileMatch[1]);
          } else {
            setActiveRoute('home');
            setSelectedDocId(null);
            setSelectedUserId(null);
          }
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // Fetch bookmarks & reading history for logged-in user
  useEffect(() => {
    if (!currentUser) {
      setBookmarks([]);
      setReadingHistory([]);
      return;
    }

    const fetchUserSpecificData = async () => {
      try {
        const bmRes = await fetch(`/api/bookmarks?userId=${currentUser.id}`);
        if (bmRes.ok) {
          const bmData = await bmRes.json();
          setBookmarks(bmData);
        }
        const rhRes = await fetch(`/api/reading-history?userId=${currentUser.id}`);
        if (rhRes.ok) {
          const rhData = await rhRes.json();
          setReadingHistory(rhData);
        }
      } catch (err) {
        console.warn('Failed to load user specific bookmarks or history from DB.');
      }
    };

    fetchUserSpecificData();
  }, [currentUser]);

  // Save changes helper (localStorage fallback)
  const saveToStorage = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
  };

  const hideToast = () => {
    setToast(null);
  };

  const navigate = (route: string, docId: string | null = null, userId: string | null = null) => {
    setActiveRoute(route);
    setSelectedDocId(docId);
    setSelectedUserId(userId);
    if (route !== 'search') {
      setSearchQuery('');
    }

    // Determine the corresponding browser URL
    let url = '/';
    if (route === 'explore') {
      url = '/explore';
    } else if (route === 'document' && docId) {
      url = `/explore/${docId}`;
    } else if (route === 'upload') {
      url = '/upload';
    } else if (route === 'login') {
      url = '/login';
    } else if (route === 'register') {
      url = '/register';
    } else if (route === 'dashboard') {
      url = '/dashboard';
    } else if (route === 'profile') {
      url = userId ? `/profile/${userId}` : '/profile';
    }

    // Only push if different from current path to avoid duplication
    if (window.location.pathname !== url) {
      window.history.pushState(null, '', url);
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const login = async (email: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      if (res.ok) {
        const user = await res.json();
        setCurrentUser(user);
        saveToStorage('scribd_current_user', user);
        showToast(`Welcome back, ${user.name}!`, 'success');
        return true;
      } else {
        const err = await res.json();
        showToast(err.error || 'User email not found', 'error');
        return false;
      }
    } catch (err) {
      console.warn('API error during login, falling back to local credentials.');
      const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (foundUser) {
        setCurrentUser(foundUser);
        saveToStorage('scribd_current_user', foundUser);
        showToast(`Welcome back, ${foundUser.name}! (Demo Mode)`, 'success');
        return true;
      }
      showToast('Email address not found.', 'error');
      return false;
    }
  };

  const register = async (name: string, email: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email })
      });
      if (res.ok) {
        const user = await res.json();
        setCurrentUser(user);
        saveToStorage('scribd_current_user', user);
        loadUsers(); // Refresh
        showToast(`Account created successfully! Welcome, ${name}!`, 'success');
        return true;
      } else {
        const err = await res.json();
        showToast(err.error || 'Registration failed', 'error');
        return false;
      }
    } catch (err) {
      console.warn('API error during registration, falling back to local simulation.');
      const exists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
      if (exists) {
        showToast('Email address is already registered', 'error');
        return false;
      }
      const newUser: User = {
        id: `user_${Date.now()}`,
        name,
        email,
        avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
        bio: 'Avid reader and document sharing enthusiast.',
        role: 'user',
        followersCount: 0,
        followingCount: 0,
        followers: [],
        following: [],
        createdAt: new Date().toISOString()
      };
      setUsers([...users, newUser]);
      setCurrentUser(newUser);
      saveToStorage('scribd_current_user', newUser);
      showToast(`Account created successfully! Welcome, ${name}! (Demo Mode)`, 'success');
      return true;
    }
  };

  const logout = () => {
    if (currentUser) {
      showToast(`Goodbye, ${currentUser.name}!`, 'info');
    }
    setCurrentUser(null);
    localStorage.removeItem('scribd_current_user');
  };

  const uploadDocument = async (
    docData: Omit<Document, 'id' | 'views' | 'downloads' | 'likes' | 'likedBy' | 'uploadedBy' | 'authorName' | 'authorAvatar' | 'createdAt' | 'updatedAt'>,
    fileBase64?: string
  ) => {
    if (!currentUser) return;

    try {
      const res = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...docData,
          uploadedBy: currentUser.id,
          authorName: currentUser.name,
          authorAvatar: currentUser.avatar,
          fileBase64
        })
      });
      if (res.ok) {
        const createdDoc = await res.json();
        setDocuments(prev => [createdDoc, ...prev]);
        showToast('Document uploaded successfully!', 'success');
        navigate('dashboard');
      } else {
        const err = await res.json().catch(() => ({}));
        showToast(err.error || 'Failed to upload document', 'error');
      }
    } catch (err) {
      console.warn('API error on upload, falling back to local simulation.', err);
      const newDoc: Document = {
        ...docData,
        id: `doc_${Date.now()}`,
        views: 0,
        downloads: 0,
        likes: 0,
        likedBy: [],
        uploadedBy: currentUser.id,
        authorName: currentUser.name,
        authorAvatar: currentUser.avatar,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setDocuments([newDoc, ...documents]);
      showToast('Document uploaded successfully! (Demo Mode)', 'success');
      navigate('dashboard');
    }
  };

  const addComment = async (docId: string, message: string) => {
    if (!currentUser) {
      showToast('Please login to comment', 'error');
      return;
    }

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.id,
          userName: currentUser.name,
          userAvatar: currentUser.avatar,
          documentId: docId,
          message
        })
      });
      if (res.ok) {
        const createdComment = await res.json();
        setComments(prev => [createdComment, ...prev]);
        showToast('Comment posted!', 'success');
      }
    } catch (err) {
      console.warn('API error on comment, using local fallback.');
      const newComment: Comment = {
        id: `comm_${Date.now()}`,
        userId: currentUser.id,
        userName: currentUser.name,
        userAvatar: currentUser.avatar,
        documentId: docId,
        message,
        createdAt: new Date().toISOString()
      };
      setComments([newComment, ...comments]);
      showToast('Comment posted! (Demo Mode)', 'success');
    }
  };

  const toggleBookmark = async (docId: string) => {
    if (!currentUser) {
      showToast('Please login to save documents', 'error');
      return;
    }

    try {
      const res = await fetch('/api/bookmarks/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.id,
          documentId: docId
        })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.removed) {
          setBookmarks(prev => prev.filter(b => b.documentId !== docId));
          showToast('Document removed from reading list', 'info');
        } else {
          setBookmarks(prev => [data, ...prev]);
          showToast('Document saved to reading list', 'success');
        }
      }
    } catch (err) {
      console.warn('API error on bookmark, using local fallback.');
      const existingIdx = bookmarks.findIndex(b => b.userId === currentUser.id && b.documentId === docId);
      if (existingIdx > -1) {
        setBookmarks(bookmarks.filter((_, idx) => idx !== existingIdx));
        showToast('Document removed from reading list (Demo Mode)', 'info');
      } else {
        const newBookmark: Bookmark = {
          id: `bm_${Date.now()}`,
          userId: currentUser.id,
          documentId: docId,
          savedAt: new Date().toISOString()
        };
        setBookmarks([newBookmark, ...bookmarks]);
        showToast('Document saved to reading list (Demo Mode)', 'success');
      }
    }
  };

  const toggleLike = async (docId: string) => {
    if (!currentUser) {
      showToast('Please login to like documents', 'error');
      return;
    }

    try {
      const res = await fetch(`/api/documents/${docId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.id })
      });
      if (res.ok) {
        const updatedDoc = await res.json();
        setDocuments(prev => prev.map(d => d.id === docId ? updatedDoc : d));
        const hasLiked = updatedDoc.likedBy.includes(currentUser.id);
        showToast(hasLiked ? 'Document liked!' : 'Removed like', 'success');
      }
    } catch (err) {
      console.warn('API error on liking, using local fallback.');
      const updatedDocs = documents.map(doc => {
        if (doc.id === docId) {
          const hasLiked = doc.likedBy.includes(currentUser.id);
          const likedBy = hasLiked 
            ? doc.likedBy.filter(id => id !== currentUser.id)
            : [...doc.likedBy, currentUser.id];
          return {
            ...doc,
            likedBy,
            likes: likedBy.length
          };
        }
        return doc;
      });
      setDocuments(updatedDocs);
      const doc = documents.find(d => d.id === docId);
      if (doc) {
        const hasLiked = doc.likedBy.includes(currentUser.id);
        showToast(hasLiked ? 'Removed like (Demo Mode)' : 'Document liked! (Demo Mode)', 'success');
      }
    }
  };

  const toggleFollow = async (authorId: string) => {
    if (!currentUser) {
      showToast('Please login to follow authors', 'error');
      return;
    }

    if (currentUser.id === authorId) {
      showToast("You can't follow yourself!", 'info');
      return;
    }

    try {
      const res = await fetch(`/api/users/${authorId}/follow`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.id })
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data.currentUser);
        saveToStorage('scribd_current_user', data.currentUser);
        loadUsers(); // refresh list
        
        const isFollowing = data.currentUser.following.includes(authorId);
        const author = users.find(u => u.id === authorId);
        showToast(isFollowing ? `Following ${author?.name || 'author'}` : `Unfollowed ${author?.name || 'author'}`, 'success');
      }
    } catch (err) {
      console.warn('API error on follow, using local fallback.');
      const updatedUsers = users.map(user => {
        if (user.id === currentUser.id) {
          const isFollowing = user.following.includes(authorId);
          const following = isFollowing
            ? user.following.filter(id => id !== authorId)
            : [...user.following, authorId];
          const followingCount = following.length;
          const updatedCurrentUser = { ...user, following, followingCount };
          setCurrentUser(updatedCurrentUser);
          saveToStorage('scribd_current_user', updatedCurrentUser);
          return updatedCurrentUser;
        }
        if (user.id === authorId) {
          const isFollower = user.followers.includes(currentUser.id);
          const followers = isFollower
            ? user.followers.filter(id => id !== currentUser.id)
            : [...user.followers, currentUser.id];
          const followersCount = followers.length;
          return { ...user, followers, followersCount };
        }
        return user;
      });
      setUsers(updatedUsers);
      const author = users.find(u => u.id === authorId);
      if (author) {
        const isFollowing = currentUser.following.includes(authorId);
        showToast(isFollowing ? `Unfollowed ${author.name} (Demo Mode)` : `Following ${author.name} (Demo Mode)`, 'success');
      }
    }
  };

  const recordHistory = async (docId: string) => {
    if (!currentUser) return;

    try {
      const res = await fetch('/api/reading-history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.id,
          documentId: docId
        })
      });
      if (res.ok) {
        const newHistory = await res.json();
        setReadingHistory(prev => [newHistory, ...prev.filter(h => h.documentId !== docId)]);
      }
    } catch (err) {
      console.warn('API error on recordHistory, using local fallback.');
      const cleanHistory = readingHistory.filter(h => !(h.userId === currentUser.id && h.documentId === docId));
      const newHistory: ReadingHistory = {
        id: `hist_${Date.now()}`,
        userId: currentUser.id,
        documentId: docId,
        viewedAt: new Date().toISOString()
      };
      setReadingHistory([newHistory, ...cleanHistory]);
    }
  };

  const incrementViews = async (docId: string) => {
    try {
      const res = await fetch(`/api/documents/${docId}/view`, {
        method: 'POST'
      });
      if (res.ok) {
        const updatedDoc = await res.json();
        setDocuments(prev => prev.map(d => d.id === docId ? updatedDoc : d));
      }
    } catch (err) {
      console.warn('API error on views, using local fallback.');
      const updatedDocs = documents.map(doc => {
        if (doc.id === docId) {
          return { ...doc, views: doc.views + 1 };
        }
        return doc;
      });
      setDocuments(updatedDocs);
    }
  };

  const incrementDownloads = async (docId: string) => {
    if (!currentUser) {
      showToast('Please login to download', 'error');
      return;
    }

    try {
      const res = await fetch(`/api/documents/${docId}/download`, {
        method: 'POST'
      });
      if (res.ok) {
        const updatedDoc = await res.json();
        setDocuments(prev => prev.map(d => d.id === docId ? updatedDoc : d));
        showToast('Download started successfully!', 'success');
      }
    } catch (err) {
      console.warn('API error on download, using local fallback.');
      const updatedDocs = documents.map(doc => {
        if (doc.id === docId) {
          return { ...doc, downloads: doc.downloads + 1 };
        }
        return doc;
      });
      setDocuments(updatedDocs);
      showToast('Download started successfully! (Demo Mode)', 'success');
    }
  };

  const deleteDocument = async (docId: string) => {
    try {
      const res = await fetch(`/api/documents/${docId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setDocuments(prev => prev.filter(d => d.id !== docId));
        showToast('Document deleted successfully', 'success');
      } else {
        const err = await res.json();
        showToast(err.error || 'Failed to delete document', 'error');
      }
    } catch (err) {
      console.warn('API error on delete, using local fallback.', err);
      setDocuments(prev => prev.filter(d => d.id !== docId));
      showToast('Document deleted successfully (Demo Mode)', 'success');
    }
  };

  const toggleDocumentVisibility = async (docId: string) => {
    const doc = documents.find(d => d.id === docId);
    if (!doc) return;

    const newVisibility = doc.visibility === 'public' ? 'private' : 'public';

    try {
      const res = await fetch(`/api/documents/${docId}/visibility`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visibility: newVisibility })
      });
      if (res.ok) {
        const updatedDoc = await res.json();
        setDocuments(prev => prev.map(d => d.id === docId ? updatedDoc : d));
        showToast(`Document is now ${newVisibility}!`, 'success');
      } else {
        const err = await res.json();
        showToast(err.error || 'Failed to update visibility', 'error');
      }
    } catch (err) {
      console.warn('API error on update visibility, using local fallback.', err);
      setDocuments(prev => prev.map(d => d.id === docId ? { ...d, visibility: newVisibility } : d));
      showToast(`Document is now ${newVisibility}! (Demo Mode)`, 'success');
    }
  };

  const updateProfile = async (
    name: string,
    bio: string,
    avatar: string,
    socialLinks: { facebook?: string; instagram?: string; telegram?: string; linkedin?: string; }
  ): Promise<boolean> => {
    if (!currentUser) return false;
    try {
      const res = await fetch(`/api/users/${currentUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, bio, avatar, socialLinks })
      });
      if (res.ok) {
        const updatedUser = await res.json();
        setCurrentUser(updatedUser);
        saveToStorage('scribd_current_user', updatedUser);
        
        // Refresh users list
        setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));
        
        // Refresh author detail in document lists
        setDocuments(prev => prev.map(doc => 
          doc.uploadedBy === currentUser.id 
            ? { ...doc, authorName: name, authorAvatar: avatar } 
            : doc
        ));

        showToast('Profile updated successfully!', 'success');
        return true;
      } else {
        const err = await res.json();
        showToast(err.error || 'Failed to update profile', 'error');
        return false;
      }
    } catch (err) {
      console.warn('API error during profile update, falling back to local simulation.');
      const updatedUser: User = {
        ...currentUser,
        name,
        bio,
        avatar,
        socialLinks
      };
      setCurrentUser(updatedUser);
      saveToStorage('scribd_current_user', updatedUser);
      
      // Update local users
      setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));
      
      // Update local documents
      setDocuments(prev => prev.map(doc => 
        doc.uploadedBy === currentUser.id 
          ? { ...doc, authorName: name, authorAvatar: avatar } 
          : doc
      ));

      showToast('Profile updated successfully! (Demo Mode)', 'success');
      return true;
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        documents,
        comments,
        bookmarks,
        readingHistory,
        activeRoute,
        selectedDocId,
        selectedUserId,
        searchQuery,
        searchFilterCategory,
        searchFilterTag,
        toast,
        dbStatus,
        showToast,
        hideToast,
        navigate,
        login,
        register,
        logout,
        uploadDocument,
        addComment,
        toggleBookmark,
        toggleLike,
        toggleFollow,
        recordHistory,
        incrementViews,
        incrementDownloads,
        deleteDocument,
        toggleDocumentVisibility,
        refreshDbStatus,
        updateProfile
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
