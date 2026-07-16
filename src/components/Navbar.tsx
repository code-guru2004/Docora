/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Search, 
  Upload, 
  BookOpen, 
  User, 
  LogOut, 
  Menu, 
  X, 
  Bookmark, 
  History, 
  LayoutDashboard,
  FileText
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    currentUser, 
    logout, 
    navigate, 
    documents,
    searchQuery,
    showToast,
    dbStatus
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState('');
  const [suggestions, setSuggestions] = useState<typeof documents>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (localSearch.trim().length > 1) {
      const filtered = documents.filter(doc => 
        doc.title.toLowerCase().includes(localSearch.toLowerCase()) ||
        doc.tags.some(t => t.toLowerCase().includes(localSearch.toLowerCase())) ||
        doc.category.toLowerCase().includes(localSearch.toLowerCase()) ||
        doc.authorName.toLowerCase().includes(localSearch.toLowerCase())
      ).slice(0, 5);
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [localSearch, documents]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localSearch.trim()) {
      setShowSuggestions(false);
      // We set global state or go to search view directly
      navigate('explore');
      // Set filtering state indirectly
      (window as any).__custom_search_query = localSearch;
      window.dispatchEvent(new CustomEvent('custom-search', { detail: localSearch }));
    }
  };

  const selectSuggestion = (doc: typeof documents[0]) => {
    setLocalSearch('');
    setShowSuggestions(false);
    navigate('document', doc.id);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('home')} 
            className="flex items-center gap-2 text-left font-sans text-xl font-bold tracking-tight text-gray-900 focus:outline-none"
            id="nav-logo-btn"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm shadow-blue-300">
              <BookOpen className="h-5 w-5" />
            </div>
            <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">DocShare</span>
          </button>

          {/* MongoDB Connection Status Badge */}
          {dbStatus && (
            <div 
              title={dbStatus.message}
              className={`hidden items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold sm:flex ${
                dbStatus.isConnected 
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                  : 'bg-amber-50 text-amber-700 border border-amber-200/60'
              }`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${dbStatus.isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
              <span className="font-mono text-[10px] tracking-tight uppercase">
                {dbStatus.isConnected ? 'MongoDB Active' : 'Offline Demo'}
              </span>
            </div>
          )}
        </div>

        {/* Global Search Bar (Tablet/Desktop) */}
        <form 
          onSubmit={handleSearchSubmit} 
          className="relative hidden max-w-md flex-1 px-8 md:block"
        >
          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-4.5 w-4.5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search documents, books, tags, and authors..."
              value={localSearch}
              onChange={(e) => {
                setLocalSearch(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              className="w-full rounded-full border border-gray-200 bg-gray-50/50 py-2 pr-4 pl-10 text-sm font-sans text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
              id="search-input-desktop"
            />
          </div>

          {/* Autocomplete Suggestions */}
          {showSuggestions && suggestions.length > 0 && (
            <div 
              ref={suggestionRef} 
              className="absolute top-full left-8 z-50 mt-2 w-[calc(100%-4rem)] rounded-xl border border-gray-100 bg-white p-2 shadow-xl"
            >
              <div className="px-3 py-1.5 text-xs font-semibold text-gray-400">Suggested Documents</div>
              {suggestions.map(doc => (
                <button
                  key={doc.id}
                  onClick={() => selectSuggestion(doc)}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-all"
                >
                  <div className="flex h-8 w-6 shrink-0 items-center justify-center rounded bg-gray-100 text-[9px] font-bold text-gray-500 uppercase">
                    {doc.fileType}
                  </div>
                  <div className="overflow-hidden">
                    <p className="truncate font-medium text-gray-900">{doc.title}</p>
                    <p className="truncate text-xs text-gray-500">by {doc.authorName}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </form>

        {/* Action Controls (Desktop) */}
        <nav className="hidden items-center gap-6 md:flex">
          <button 
            onClick={() => navigate('explore')} 
            className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
            id="nav-explore-btn"
          >
            Explore
          </button>

          <button 
            onClick={() => {
              if (currentUser) {
                localStorage.setItem('dashboard_tab', 'saved');
                navigate('dashboard');
              } else {
                showToast('Please login to view your bookmarks', 'info');
                navigate('login');
              }
            }} 
            className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
            id="nav-bookmarks-btn"
          >
            <Bookmark className="h-4 w-4" />
            Bookmarks
          </button>
          
          <button 
            onClick={() => {
              if (currentUser) {
                navigate('upload');
              } else {
                showToast('Please login to upload documents', 'info');
                navigate('login');
              }
            }} 
            className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
            id="nav-upload-btn"
          >
            <Upload className="h-4 w-4" />
            Upload
          </button>

          {/* User Auth Portal */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 rounded-full p-1 border border-gray-100 hover:bg-gray-50 transition-all focus:outline-none"
                id="user-profile-menu-btn"
              >
                <img 
                  src={currentUser.avatar} 
                  alt={currentUser.name} 
                  className="h-8 w-8 rounded-full object-cover"
                />
                <span className="max-w-[100px] truncate pr-2 text-sm font-medium text-gray-700">{currentUser.name.split(' ')[0]}</span>
              </button>

              {/* User Dropdown */}
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl border border-gray-100 bg-white p-2 shadow-xl focus:outline-none">
                  <div className="border-b border-gray-50 px-3 py-2.5">
                    <p className="text-sm font-semibold text-gray-900">{currentUser.name}</p>
                    <p className="truncate text-xs text-gray-500">{currentUser.email}</p>
                  </div>
                  
                  <div className="py-1">
                    <button
                      onClick={() => { navigate('dashboard'); setUserDropdownOpen(false); }}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <LayoutDashboard className="h-4 w-4 text-gray-500" />
                      Dashboard
                    </button>
                    <button
                      onClick={() => { navigate('profile', null, currentUser.id); setUserDropdownOpen(false); }}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <User className="h-4 w-4 text-gray-500" />
                      My Profile
                    </button>
                    <button
                      onClick={() => { navigate('dashboard'); setUserDropdownOpen(false); }} // Will open saved section automatically in dashboard
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Bookmark className="h-4 w-4 text-gray-500" />
                      Saved Books
                    </button>
                  </div>

                  <div className="border-t border-gray-50 pt-1">
                    <button
                      onClick={() => { logout(); setUserDropdownOpen(false); navigate('home'); }}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50/50 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button 
                onClick={() => navigate('login')} 
                className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors"
                id="nav-login-btn"
              >
                Sign In
              </button>
              <button 
                onClick={() => navigate('register')} 
                className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 hover:shadow transition-all"
                id="nav-register-btn"
              >
                Register
              </button>
            </div>
          )}
        </nav>

        {/* Mobile Hamburger Controls */}
        <div className="flex items-center gap-4 md:hidden">
          {currentUser && (
            <button 
              onClick={() => navigate('dashboard')}
              className="p-1 focus:outline-none"
            >
              <img 
                src={currentUser.avatar} 
                alt={currentUser.name} 
                className="h-8 w-8 rounded-full object-cover border border-gray-200"
              />
            </button>
          )}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-1 text-gray-600 hover:bg-gray-100 focus:outline-none"
            id="mobile-menu-toggle-btn"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-gray-100 bg-white px-4 pt-3 pb-6 shadow-lg md:hidden">
          <form onSubmit={handleSearchSubmit} className="relative mb-4">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search documents, books, authors..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-full rounded-full border border-gray-200 bg-gray-50/50 py-2 pr-4 pl-9 text-sm font-sans outline-none focus:border-blue-500 focus:bg-white"
              id="search-input-mobile"
            />
          </form>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => { navigate('explore'); setMobileMenuOpen(false); }}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <FileText className="h-4 w-4 text-gray-500" />
              Explore All Documents
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (currentUser) {
                  localStorage.setItem('dashboard_tab', 'saved');
                  navigate('dashboard');
                } else {
                  showToast('Please login to view your bookmarks', 'info');
                  navigate('login');
                }
              }}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <Bookmark className="h-4 w-4 text-gray-500" />
              Bookmarks
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (currentUser) {
                  navigate('upload');
                } else {
                  showToast('Please login to upload documents', 'info');
                  navigate('login');
                }
              }}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <Upload className="h-4 w-4 text-gray-500" />
              Upload Document
            </button>
            
            {currentUser ? (
              <>
                <button
                  onClick={() => { navigate('dashboard'); setMobileMenuOpen(false); }}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <LayoutDashboard className="h-4 w-4 text-gray-500" />
                  User Dashboard
                </button>
                <button
                  onClick={() => { navigate('profile', null, currentUser.id); setMobileMenuOpen(false); }}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <User className="h-4 w-4 text-gray-500" />
                  My Profile
                </button>
                <hr className="my-1 border-gray-100" />
                <button
                  onClick={() => { logout(); setMobileMenuOpen(false); navigate('home'); }}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => { navigate('login'); setMobileMenuOpen(false); }}
                  className="rounded-full border border-gray-200 py-2 text-center text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Sign In
                </button>
                <button
                  onClick={() => { navigate('register'); setMobileMenuOpen(false); }}
                  className="rounded-full bg-blue-600 py-2 text-center text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Register
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
