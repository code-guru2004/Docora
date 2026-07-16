/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { OnlineViewer } from '../components/OnlineViewer';
import { DocumentCard } from '../components/DocumentCard';
import { 
  Eye, 
  Download, 
  Heart, 
  Bookmark, 
  Share2, 
  BookOpen, 
  Calendar, 
  FileText, 
  Plus, 
  Users, 
  ChevronRight,
  Send,
  Lock,
  ArrowLeft
} from 'lucide-react';

export const DocumentDetailView: React.FC = () => {
  const { 
    selectedDocId, 
    documents, 
    comments, 
    bookmarks, 
    currentUser, 
    addComment, 
    toggleBookmark, 
    toggleLike, 
    toggleFollow, 
    recordHistory, 
    incrementViews, 
    incrementDownloads,
    showToast,
    navigate,
    users
  } = useApp();

  const [activeTab, setActiveTab] = useState<'info' | 'viewer' | 'comments'>('info');
  const [commentText, setCommentText] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);

  const doc = documents.find(d => d.id === selectedDocId);

  // Increment views and record reading history on load
  useEffect(() => {
    if (doc) {
      incrementViews(doc.id);
      recordHistory(doc.id);
    }
  }, [selectedDocId]);

  if (!doc) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-gray-900">Document not found</h2>
        <p className="mt-2 text-sm text-gray-500">The document you are looking for might have been deleted or moved.</p>
        <button onClick={() => navigate('home')} className="mt-4 rounded-full bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white">
          Back to Home
        </button>
      </div>
    );
  }

  const isSaved = currentUser && bookmarks.some(b => b.userId === currentUser.id && b.documentId === doc.id);
  const hasLiked = currentUser && doc.likedBy.includes(currentUser.id);

  // Find author bio or details
  const authorProfile = users.find(u => u.id === doc.uploadedBy);
  const isFollowing = currentUser && authorProfile && currentUser.following.includes(authorProfile.id);

  // Filter and Rank Related Documents
  const relatedDocuments = documents
    .filter(d => d.id !== doc.id && d.visibility === 'public')
    .map(d => {
      let score = 0;
      if (d.category === doc.category) score += 5;
      if (d.uploadedBy === doc.uploadedBy) score += 3;
      const matchingTags = d.tags.filter(t => doc.tags.includes(t));
      score += matchingTags.length * 2;
      return { doc: d, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(item => item.doc);

  // Filter comments for this document
  const docComments = comments.filter(c => c.documentId === doc.id);

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      showToast('Please login to leave a comment', 'info');
      navigate('login');
      return;
    }
    if (commentText.trim()) {
      addComment(doc.id, commentText.trim());
      setCommentText('');
    }
  };

  const handleDownloadClick = () => {
    if (!currentUser) {
      showToast('Login is required to download files', 'info');
      navigate('login');
      return;
    }
    incrementDownloads(doc.id);
  };

  const handleShareClick = () => {
    setShowShareModal(true);
  };

  const copyShareLink = () => {
    const url = `${window.location.origin}/document/${doc.slug}`;
    navigator.clipboard.writeText(url);
    showToast('Share link copied to clipboard!', 'success');
    setShowShareModal(false);
  };

  const formattedDate = new Date(doc.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 font-sans">
      
      {/* Breadcrumb controls */}
      <button 
        onClick={() => navigate('explore')}
        className="mb-6 flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-blue-600 focus:outline-none"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Library
      </button>

      {/* Hero Header block of Detail */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        
        {/* Left Side: Animated Cover display */}
        <div className="lg:col-span-4">
          <div 
            className="relative flex aspect-[3/4] w-full items-center justify-center rounded-2xl p-8 text-center overflow-hidden shadow-md"
            style={{ background: doc.coverImage }}
          >
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px] opacity-25"></div>
            <div className="z-10 flex flex-col items-center justify-center gap-4">
              <span className="rounded bg-white/20 px-2.5 py-1 text-xs font-bold uppercase text-white tracking-widest backdrop-blur-md">
                {(doc.fileType || 'pdf').toUpperCase()} format
              </span>
              <p className="line-clamp-3 text-lg font-extrabold text-white drop-shadow-sm px-4">
                {doc.title}
              </p>
              <span className="text-xs font-medium text-white/80">
                {doc.totalPages} Pages • {doc.fileSize}
              </span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/10"></div>
          </div>

          {/* Quick Stats panel underneath */}
          <div className="mt-4 grid grid-cols-3 gap-2 bg-gray-50 rounded-2xl p-4 text-center text-xs font-semibold text-gray-500">
            <div>
              <p className="text-lg font-extrabold text-gray-900">{doc.views.toLocaleString()}</p>
              <p className="text-[10px] uppercase font-bold text-gray-400 mt-0.5">Views</p>
            </div>
            <div className="border-x border-gray-200">
              <p className="text-lg font-extrabold text-gray-900">{doc.downloads}</p>
              <p className="text-[10px] uppercase font-bold text-gray-400 mt-0.5">Downloads</p>
            </div>
            <div>
              <p className="text-lg font-extrabold text-gray-900">{doc.likes}</p>
              <p className="text-[10px] uppercase font-bold text-gray-400 mt-0.5">Likes</p>
            </div>
          </div>
        </div>

        {/* Right Side: Core Meta and Control Buttons */}
        <div className="flex flex-col lg:col-span-8">
          
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 capitalize">
              {doc.category}
            </span>
            <span className="text-xs text-gray-400 font-medium">
              Published on {formattedDate}
            </span>
          </div>

          <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
            {doc.title}
          </h1>

          {/* Author Block */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-y border-gray-100 py-4">
            <div className="flex items-center gap-3">
              <img 
                src={doc.authorAvatar} 
                alt={doc.authorName} 
                className="h-10 w-10 rounded-full object-cover border"
              />
              <div>
                <p className="text-sm font-bold text-gray-900">{doc.authorName}</p>
                <p className="text-xs text-gray-400 truncate max-w-[200px]">
                  {authorProfile?.bio || "Academic contributor"}
                </p>
              </div>
            </div>

            {/* Follow/Unfollow Author */}
            {authorProfile && currentUser?.id !== doc.uploadedBy && (
              <button
                onClick={() => toggleFollow(doc.uploadedBy)}
                className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
                  isFollowing
                    ? 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                    : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
                }`}
              >
                {isFollowing ? 'Following' : 'Follow Author'}
              </button>
            )}
          </div>

          {/* Document Description */}
          <div className="mt-6">
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-gray-400">Description</h3>
            <p className="mt-2 text-sm text-gray-600 leading-relaxed">
              {doc.description}
            </p>
          </div>

          {/* Language & Metadata row */}
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-xl border border-gray-100 p-3 bg-gray-50/20">
              <span className="text-[10px] font-extrabold uppercase text-gray-400">Language</span>
              <p className="mt-0.5 text-xs font-bold text-gray-800">{doc.language}</p>
            </div>
            <div className="rounded-xl border border-gray-100 p-3 bg-gray-50/20">
              <span className="text-[10px] font-extrabold uppercase text-gray-400">Total Pages</span>
              <p className="mt-0.5 text-xs font-bold text-gray-800">{doc.totalPages} Pages</p>
            </div>
            <div className="rounded-xl border border-gray-100 p-3 bg-gray-50/20">
              <span className="text-[10px] font-extrabold uppercase text-gray-400">File Type</span>
              <p className="mt-0.5 text-xs font-bold text-gray-800 uppercase">{(doc.fileType || 'pdf')}</p>
            </div>
            <div className="rounded-xl border border-gray-100 p-3 bg-gray-50/20">
              <span className="text-[10px] font-extrabold uppercase text-gray-400">File Size</span>
              <p className="mt-0.5 text-xs font-bold text-gray-800">{doc.fileSize}</p>
            </div>
          </div>

          {/* Action buttons panel */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            
            <button
              onClick={() => {
                setActiveTab('viewer');
                const element = document.getElementById('document-viewer-anchor');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-blue-100 hover:bg-blue-700 transition-all active:scale-[0.98]"
            >
              <BookOpen className="h-4.5 w-4.5" />
              Read Online
            </button>

            <button
              onClick={handleDownloadClick}
              className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all shadow-sm active:scale-[0.98]"
            >
              <Download className="h-4.5 w-4.5" />
              Download
            </button>

            <button
              onClick={() => toggleLike(doc.id)}
              className={`flex items-center gap-2 rounded-full border px-4 py-3 text-sm font-semibold transition-all shadow-sm active:scale-[0.98] ${
                hasLiked
                  ? 'border-red-200 bg-red-50 text-red-600'
                  : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Heart className={`h-4.5 w-4.5 ${hasLiked ? 'fill-red-600 text-red-600' : ''}`} />
              {hasLiked ? 'Liked' : 'Like'}
            </button>

            <button
              onClick={() => toggleBookmark(doc.id)}
              className={`flex h-11 w-11 items-center justify-center rounded-full border transition-all shadow-sm active:scale-[0.98] ${
                isSaved
                  ? 'border-blue-200 bg-blue-50 text-blue-600'
                  : 'border-gray-200 bg-white text-gray-500 hover:bg-gray-50'
              }`}
              title="Save to Reading list"
            >
              <Bookmark className={`h-4.5 w-4.5 ${isSaved ? 'fill-blue-600' : ''}`} />
            </button>

            <button
              onClick={handleShareClick}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 transition-all shadow-sm active:scale-[0.98]"
              title="Share document"
            >
              <Share2 className="h-4.5 w-4.5" />
            </button>
          </div>

          {/* Tag row */}
          <div className="mt-8">
            <span className="text-xs font-semibold text-gray-400">Tags:</span>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {doc.tags.map((tag, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    (window as any).__custom_tag_filter = tag;
                    navigate('explore');
                    window.dispatchEvent(new CustomEvent('custom-tag', { detail: tag }));
                  }}
                  className="rounded-full bg-gray-50 px-3 py-1 text-xs font-semibold text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Online Viewer Segment (Anchored) */}
      <div id="document-viewer-anchor" className="mt-16 border-t border-gray-100 pt-12">
        <div className="flex border-b border-gray-100">
          <button
            onClick={() => setActiveTab('info')}
            className={`border-b-2 px-6 py-3 text-sm font-bold transition-all ${
              activeTab === 'info' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            Overview Details
          </button>
          <button
            onClick={() => setActiveTab('viewer')}
            className={`border-b-2 px-6 py-3 text-sm font-bold transition-all ${
              activeTab === 'viewer' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            Online File Viewer
          </button>
          <button
            onClick={() => setActiveTab('comments')}
            className={`border-b-2 px-6 py-3 text-sm font-bold transition-all ${
              activeTab === 'comments' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            Discussion ({docComments.length})
          </button>
        </div>

        <div className="mt-6">
          {activeTab === 'info' && (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="space-y-4 md:col-span-2 text-sm text-gray-600 leading-relaxed">
                <h3 className="text-base font-bold text-gray-900">About this Publication</h3>
                <p>
                  This content is published by <strong className="text-gray-800">{doc.authorName}</strong> for community educational sharing. All copyright assertions remain held by the original authors. This platform does not support unauthorized commercial monetization of academic publications.
                </p>
                <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4">
                  <h4 className="text-xs font-bold text-gray-700 uppercase">Usage Guidelines:</h4>
                  <p className="mt-1 text-xs text-gray-500">
                    Feel free to read this public source online, save it to your reading list, or comment with questions. Standard downloads require registration to track community interactions fairly.
                  </p>
                </div>
              </div>

              {/* Quick Author bio box */}
              <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-6">
                <h3 className="font-sans text-sm font-bold text-gray-900">Author Profile</h3>
                <div className="mt-4 flex items-center gap-3">
                  <img src={doc.authorAvatar} alt={doc.authorName} className="h-12 w-12 rounded-full object-cover" />
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">{doc.authorName}</h4>
                    <p className="text-xs text-gray-500">Member since 2024</p>
                  </div>
                </div>
                <p className="mt-3 text-xs text-gray-500 leading-relaxed">
                  {authorProfile?.bio || "Dedicated contributor sharing educational lecture slides and templates."}
                </p>
                <div className="mt-4 flex items-center justify-between text-xs font-semibold text-gray-600">
                  <span>{authorProfile?.followersCount || 0} Followers</span>
                  <span>{authorProfile?.followingCount || 0} Following</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'viewer' && (
            <div className="space-y-4">
              <div className="rounded-xl bg-blue-50/50 px-4 py-3 text-xs text-blue-700 font-medium">
                ⚡ Real-time Online Reader mode is active. You can search text or scale zoom using control bars.
              </div>
              <OnlineViewer document={doc} />
            </div>
          )}

          {activeTab === 'comments' && (
            <div className="mx-auto max-w-3xl space-y-6">
              <h3 className="text-base font-bold text-gray-900">Document Discussions</h3>

              {/* Form to leave comments */}
              <form onSubmit={handlePostComment} className="flex gap-3">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder={currentUser ? "Write a helpful question or comment..." : "Please login to write comments"}
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    disabled={!currentUser}
                    className="w-full rounded-full border border-gray-200 bg-white py-2.5 pr-10 pl-4 text-xs font-medium outline-none focus:border-blue-500 disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={!currentUser || !commentText.trim()}
                    className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full bg-blue-600 p-1.5 text-white hover:bg-blue-700 disabled:opacity-30"
                  >
                    <Send className="h-3 w-3" />
                  </button>
                </div>
              </form>

              {/* List comments */}
              <div className="space-y-4">
                {docComments.length === 0 ? (
                  <p className="text-xs text-gray-400 text-center py-6">
                    No comments yet. Be the first to start the discussion!
                  </p>
                ) : (
                  docComments.map(comment => (
                    <div key={comment.id} className="flex gap-3 border-b border-gray-50 pb-4 last:border-0">
                      <img src={comment.userAvatar} alt={comment.userName} className="h-8 w-8 rounded-full object-cover border" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold text-gray-900">{comment.userName}</p>
                          <span className="text-[10px] text-gray-400">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-gray-600 leading-normal">
                          {comment.message}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Documents Grid Section */}
      {relatedDocuments.length > 0 && (
        <section className="mt-16 border-t border-gray-100 pt-12">
          <div className="flex items-end justify-between border-b border-gray-100 pb-5">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Related Publications</h2>
              <p className="text-xs text-gray-500 mt-0.5">Recommended resources based on overlaps in category and tags</p>
            </div>
            <button onClick={() => navigate('explore')} className="text-xs font-bold text-blue-600 hover:text-blue-700">
              View All
            </button>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relatedDocuments.map(relatedDoc => (
              <DocumentCard key={relatedDoc.id} document={relatedDoc} />
            ))}
          </div>
        </section>
      )}

      {/* Share Modal Dialog */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-6 shadow-xl">
            <h3 className="text-base font-bold text-gray-900">Share this Publication</h3>
            <p className="mt-1 text-xs text-gray-500">Anyone with this link can view the public document and read online.</p>
            
            <div className="mt-4 flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50/50 p-2 text-xs">
              <span className="truncate flex-1 text-gray-600 select-all px-1">
                {window.location.origin}/document/{doc.slug}
              </span>
              <button
                onClick={copyShareLink}
                className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-700"
              >
                Copy
              </button>
            </div>

            <button
              onClick={() => setShowShareModal(false)}
              className="mt-6 w-full rounded-full border border-gray-200 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50"
            >
              Close Panel
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
