/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Document } from '../types';
import { useApp } from '../context/AppContext';
import { Eye, Download, Heart, Calendar, MoreVertical, Trash2, Globe, EyeOff } from 'lucide-react';

interface DocumentCardProps {
  document: Document;
  viewMode?: 'grid' | 'row';
}

export const DocumentCard: React.FC<DocumentCardProps> = ({ document, viewMode = 'grid' }) => {
  const { navigate, toggleBookmark, bookmarks, currentUser, deleteDocument, toggleDocumentVisibility } = useApp();
  const [showMenu, setShowMenu] = React.useState(false);

  const isSaved = currentUser && bookmarks.some(b => b.userId === currentUser.id && b.documentId === document.id);
  const isOwner = currentUser && currentUser.id === document.uploadedBy;

  // File Badge Colors
  const getBadgeStyles = (type: string | undefined) => {
    const t = type || (document.fileUrl ? document.fileUrl.split('?')[0].split('.').pop() : '') || 'pdf';
    switch (t.toLowerCase()) {
      case 'pdf': return 'bg-red-50 text-red-700 border-red-200';
      case 'ppt':
      case 'pptx': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'xls':
      case 'xlsx': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'doc':
      case 'docx': return 'bg-blue-50 text-blue-700 border-blue-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const formattedDate = new Date(document.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  if (viewMode === 'row') {
    return (
      <div 
        className="group relative flex flex-row overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm hover:border-gray-200 hover:shadow-md transition-all duration-300 h-48 sm:h-44"
        id={`doc-card-${document.id}`}
      >
        {/* Bookmarking trigger (Top Right) */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            toggleBookmark(document.id);
          }}
          className={`absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-sm transition-transform active:scale-95 ${
            isSaved ? 'text-blue-600' : 'text-gray-400 hover:text-blue-600'
          }`}
          title="Save document"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill={isSaved ? 'currentColor' : 'none'} 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="h-4 w-4"
          >
            <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
          </svg>
        </button>

        {/* Owner Menu Trigger (Top Left) */}
        {isOwner && (
          <div className="absolute top-3 left-3 z-20">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm text-gray-500 shadow-sm hover:text-gray-800 transition-transform active:scale-95"
              title="Document options"
              id={`doc-options-btn-${document.id}`}
            >
              <MoreVertical className="h-4 w-4" />
            </button>
            
            {/* Dropdown menu */}
            {showMenu && (
              <>
                {/* Overlay backdrop to close */}
                <div 
                  className="fixed inset-0 z-30" 
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenu(false);
                  }}
                />
                <div className="absolute left-0 mt-1.5 w-40 origin-top-left rounded-xl border border-gray-100 bg-white p-1.5 shadow-lg ring-1 ring-black/5 z-40">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleDocumentVisibility(document.id);
                      setShowMenu(false);
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                    id={`toggle-visibility-${document.id}`}
                  >
                    {document.visibility === 'private' ? (
                      <>
                        <Globe className="h-3.5 w-3.5 text-blue-500" />
                        Make Public
                      </>
                    ) : (
                      <>
                        <EyeOff className="h-3.5 w-3.5 text-amber-500" />
                        Make Private
                      </>
                    )}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm('Are you sure you want to delete this document?')) {
                        deleteDocument(document.id);
                      }
                      setShowMenu(false);
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
                    id={`delete-doc-${document.id}`}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Styled Cover (Left Side) */}
        <div 
          onClick={() => navigate('document', document.id)}
          className="relative flex h-full w-28 sm:w-36 shrink-0 cursor-pointer items-center justify-center p-3 text-center select-none overflow-hidden transition-all duration-500 group-hover:scale-[1.02]"
          style={{ background: document.coverImage }}
        >
          {/* Subtle grid pattern overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:16px_16px] opacity-25"></div>
          
          {/* Document Title over Cover */}
          <div className="z-10 flex flex-col items-center justify-center gap-1.5">
            <p className="line-clamp-2 px-1 text-xs font-extrabold tracking-tight text-white drop-shadow-sm leading-tight">
              {document.title}
            </p>
            <div className="flex flex-col items-center gap-1">
              <div className="rounded bg-white/20 px-1.5 py-0.5 text-[9px] font-bold text-white backdrop-blur-md uppercase tracking-wider">
                {document.fileType || (document.fileUrl ? document.fileUrl.split('?')[0].split('.').pop() : 'pdf')}
              </div>
              {document.visibility === 'private' && (
                <div className="flex items-center gap-0.5 rounded bg-amber-500/85 px-1.5 py-0.5 text-[8px] font-extrabold text-white uppercase tracking-wider shadow-sm backdrop-blur-sm">
                  <EyeOff className="h-2.5 w-2.5" />
                  Private
                </div>
              )}
            </div>
          </div>

          {/* Glossy Reflection overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/20"></div>
        </div>

        {/* Document Information Right Side */}
        <div className="flex flex-1 flex-col p-4 overflow-hidden justify-between">
          <div>
            {/* Category & Badge */}
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider truncate">
                {document.category}
              </span>
              <span className={`rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase ${getBadgeStyles(document.fileType)}`}>
                {document.totalPages} pgs
              </span>
            </div>

            {/* Heading */}
            <h3 
              onClick={() => navigate('document', document.id)}
              className="mt-1.5 line-clamp-1 cursor-pointer font-sans text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors"
              title={document.title}
            >
              {document.title}
            </h3>

            {/* Short details */}
            <p className="mt-1 line-clamp-2 text-[11px] text-gray-500 leading-normal">
              {document.description}
            </p>

            {/* Tags Row */}
            <div className="mt-2 flex flex-wrap gap-1">
              {document.tags.slice(0, 2).map((tag, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    (window as any).__custom_tag_filter = tag;
                    navigate('explore');
                    window.dispatchEvent(new CustomEvent('custom-tag', { detail: tag }));
                  }}
                  className="rounded-full bg-gray-50 px-2 py-0.5 text-[9px] font-medium text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>

          <div>
            {/* Author Line */}
            <div className="pt-2 border-t border-gray-50 flex items-center justify-between gap-2">
              <button
                onClick={() => navigate('profile', null, document.uploadedBy)}
                className="flex items-center gap-1 text-left focus:outline-none overflow-hidden"
              >
                <img 
                  src={document.authorAvatar} 
                  alt={document.authorName} 
                  className="h-4.5 w-4.5 rounded-full object-cover border border-gray-100 shrink-0"
                />
                <span className="truncate text-[10px] font-semibold text-gray-600 hover:text-blue-600 transition-colors">
                  {document.authorName}
                </span>
              </button>
              <span className="flex items-center gap-0.5 text-[9px] text-gray-400 whitespace-nowrap shrink-0">
                <Calendar className="h-2.5 w-2.5" />
                {formattedDate}
              </span>
            </div>

            {/* Read / Views Statistics panel */}
            <div className="mt-1.5 flex items-center justify-between bg-gray-50/50 rounded-lg px-2 py-1 text-[10px] font-medium text-gray-500">
              <span className="flex items-center gap-0.5">
                <Eye className="h-3 w-3 text-gray-400" />
                {document.views.toLocaleString()}
              </span>
              <span className="flex items-center gap-0.5">
                <Download className="h-3 w-3 text-gray-400" />
                {document.downloads}
              </span>
              <span className="flex items-center gap-0.5">
                <Heart className="h-3 w-3 text-red-400 fill-red-100" />
                {document.likes}
              </span>
              <span className="text-gray-400 font-semibold text-[9px]">
                {document.fileSize}
              </span>
            </div>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div 
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm hover:border-gray-200 hover:shadow-md transition-all duration-300"
      id={`doc-card-${document.id}`}
    >
      {/* Bookmarking trigger (Top Right) */}
      <button 
        onClick={(e) => {
          e.stopPropagation();
          toggleBookmark(document.id);
        }}
        className={`absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-sm transition-transform active:scale-95 ${
          isSaved ? 'text-blue-600' : 'text-gray-400 hover:text-blue-600'
        }`}
        title="Save document"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill={isSaved ? 'currentColor' : 'none'} 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="h-4 w-4"
        >
          <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
        </svg>
      </button>

      {/* Owner Menu Trigger (Top Left) */}
      {isOwner && (
        <div className="absolute top-3 left-3 z-20">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm text-gray-500 shadow-sm hover:text-gray-800 transition-transform active:scale-95"
            title="Document options"
            id={`doc-options-btn-${document.id}`}
          >
            <MoreVertical className="h-4 w-4" />
          </button>
          
          {/* Dropdown menu */}
          {showMenu && (
            <>
              {/* Overlay backdrop to close */}
              <div 
                className="fixed inset-0 z-30" 
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(false);
                }}
              />
              <div className="absolute left-0 mt-1.5 w-40 origin-top-left rounded-xl border border-gray-100 bg-white p-1.5 shadow-lg ring-1 ring-black/5 z-40">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleDocumentVisibility(document.id);
                    setShowMenu(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                  id={`toggle-visibility-${document.id}`}
                >
                  {document.visibility === 'private' ? (
                    <>
                      <Globe className="h-3.5 w-3.5 text-blue-500" />
                      Make Public
                    </>
                  ) : (
                    <>
                      <EyeOff className="h-3.5 w-3.5 text-amber-500" />
                      Make Private
                    </>
                  )}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm('Are you sure you want to delete this document?')) {
                      deleteDocument(document.id);
                    }
                    setShowMenu(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
                  id={`delete-doc-${document.id}`}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Styled Cover (Simulates realistic book covers with nice gradients and typography!) */}
      <div 
        onClick={() => navigate('document', document.id)}
        className="relative flex h-48 w-full cursor-pointer items-center justify-center p-6 text-center select-none overflow-hidden transition-all duration-500 group-hover:scale-[1.02]"
        style={{ background: document.coverImage }}
      >
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:16px_16px] opacity-25"></div>
        
        {/* Document Title over Cover */}
        <div className="z-10 flex flex-col items-center justify-center gap-2">
          <p className="line-clamp-2 px-2 text-base font-bold tracking-tight text-white drop-shadow-sm">
            {document.title}
          </p>
          <div className="flex flex-col items-center gap-1.5">
            <div className="rounded bg-white/20 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-md uppercase tracking-wider">
              {document.fileType || (document.fileUrl ? document.fileUrl.split('?')[0].split('.').pop() : 'pdf')} • {document.totalPages} Pages
            </div>
            {document.visibility === 'private' && (
              <div className="flex items-center gap-1 rounded bg-amber-500/85 px-2.5 py-0.5 text-[9px] font-extrabold text-white uppercase tracking-wider shadow-sm backdrop-blur-sm">
                <EyeOff className="h-3 w-3" />
                Private
              </div>
            )}
          </div>
        </div>

        {/* Glossy Reflection overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/20"></div>
      </div>

      {/* Document Information Card */}
      <div className="flex flex-1 flex-col p-4">
        
        {/* Category & Badge */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
            {document.category}
          </span>
          <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase ${getBadgeStyles(document.fileType)}`}>
            {document.fileType || (document.fileUrl ? document.fileUrl.split('?')[0].split('.').pop() : 'pdf')}
          </span>
        </div>

        {/* Heading */}
        <h3 
          onClick={() => navigate('document', document.id)}
          className="mt-2 line-clamp-1 cursor-pointer font-sans text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors"
          title={document.title}
        >
          {document.title}
        </h3>

        {/* Short details */}
        <p className="mt-1 line-clamp-2 text-xs text-gray-500 leading-relaxed">
          {document.description}
        </p>

        {/* Tags Row */}
        <div className="mt-3 flex flex-wrap gap-1">
          {document.tags.slice(0, 3).map((tag, idx) => (
            <button
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                // Set tag and search
                (window as any).__custom_tag_filter = tag;
                navigate('explore');
                window.dispatchEvent(new CustomEvent('custom-tag', { detail: tag }));
              }}
              className="rounded-full bg-gray-50 px-2 py-0.5 text-[10px] font-medium text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
            >
              #{tag}
            </button>
          ))}
        </div>

        {/* Author Line */}
        <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between gap-2">
          <button
            onClick={() => navigate('profile', null, document.uploadedBy)}
            className="flex items-center gap-1.5 text-left focus:outline-none"
          >
            <img 
              src={document.authorAvatar} 
              alt={document.authorName} 
              className="h-5 w-5 rounded-full object-cover border border-gray-100"
            />
            <span className="truncate text-xs font-medium text-gray-600 hover:text-blue-600 transition-colors">
              {document.authorName}
            </span>
          </button>
          <span className="flex items-center gap-1 text-[10px] text-gray-400">
            <Calendar className="h-3 w-3" />
            {formattedDate}
          </span>
        </div>

        {/* Read / Views Statistics panel */}
        <div className="mt-2 flex items-center justify-between bg-gray-50/50 rounded-lg px-2.5 py-1.5 text-[11px] font-medium text-gray-500">
          <span className="flex items-center gap-1">
            <Eye className="h-3.5 w-3.5 text-gray-400" />
            {document.views.toLocaleString()}
          </span>
          <span className="flex items-center gap-1">
            <Download className="h-3.5 w-3.5 text-gray-400" />
            {document.downloads}
          </span>
          <span className="flex items-center gap-1">
            <Heart className="h-3.5 w-3.5 text-red-400 fill-red-100" />
            {document.likes}
          </span>
          <span className="text-gray-400">
            {document.fileSize}
          </span>
        </div>

      </div>
    </div>
  );
};
