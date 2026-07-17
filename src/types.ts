/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio?: string;
  role: 'user' | 'admin';
  followersCount: number;
  followingCount: number;
  followers: string[]; // user IDs
  following: string[]; // user IDs
  createdAt: string;
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    telegram?: string;
    linkedin?: string;
  };
}

export interface Document {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  tags: string[];
  language: string;
  coverImage: string; // URL or background CSS gradient
  fileType: 'pdf' | 'ppt' | 'pptx' | 'doc' | 'docx' | 'xls' | 'xlsx';
  fileSize: string;
  totalPages: number;
  views: number;
  downloads: number;
  viewedBy?: string[]; // user/guest IDs who viewed it
  downloadedBy?: string[]; // user/guest IDs who downloaded it
  likes: number;
  likedBy: string[]; // user IDs who liked it
  visibility: 'public' | 'private';
  uploadedBy: string; // User ID
  authorName: string;
  authorAvatar: string;
  createdAt: string;
  updatedAt: string;
  pages: string[]; // content lines/paragraphs for each page to support view, zoom, and text search
  fileUrl?: string; // actual PDF URL or object URL or base64 data URL
  originalname?: string; // original filename before upload
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string; // Lucide icon name
  count: number;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  documentId: string;
  message: string;
  createdAt: string;
}

export interface ReadingHistory {
  id: string;
  userId: string;
  documentId: string;
  viewedAt: string;
}

export interface Bookmark {
  id: string;
  userId: string;
  documentId: string;
  savedAt: string;
}
