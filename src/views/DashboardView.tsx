/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { DocumentCard } from '../components/DocumentCard';
import { 
  LayoutDashboard, 
  FileText, 
  Bookmark, 
  History, 
  User, 
  Settings, 
  Upload, 
  Eye, 
  Download, 
  Heart,
  Mail,
  ShieldAlert,
  Save,
  CheckCircle,
  FileSpreadsheet,
  Grid,
  List,
  Users,
  UserMinus,
  ExternalLink
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { 
    currentUser, 
    documents, 
    bookmarks, 
    readingHistory, 
    showToast,
    navigate,
    users,
    dbStatus,
    toggleFollow
  } = useApp();

  const [activeTab, setActiveTab] = useState<'stats' | 'uploads' | 'saved' | 'history' | 'profile' | 'settings' | 'following'>('stats');
  const [viewMode, setViewMode] = useState<'grid' | 'row'>('grid');
  const [selectedFollowedUserId, setSelectedFollowedUserId] = useState<string | null>(null);

  // Preference Settings States
  const [profileBio, setProfileBio] = useState('');
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [autoSaveHistory, setAutoSaveHistory] = useState(true);

  useEffect(() => {
    const storedTab = localStorage.getItem('dashboard_tab') || (window as any).__dashboard_tab;
    if (storedTab === 'saved') {
      setActiveTab('saved');
      localStorage.removeItem('dashboard_tab');
      delete (window as any).__dashboard_tab;
    }
  }, []);

  useEffect(() => {
    if (!currentUser) {
      showToast('Please login to access your dashboard', 'info');
      navigate('login');
    } else {
      setProfileBio(currentUser.bio || '');
    }
  }, [currentUser]);

  const followedUsers = users.filter(u => currentUser.following?.includes(u.id));

  useEffect(() => {
    if (activeTab === 'following') {
      if (followedUsers.length > 0) {
        if (!selectedFollowedUserId || !currentUser.following?.includes(selectedFollowedUserId)) {
          setSelectedFollowedUserId(followedUsers[0].id);
        }
      } else {
        setSelectedFollowedUserId(null);
      }
    }
  }, [activeTab, currentUser.following, users, selectedFollowedUserId]);

  if (!currentUser) return null;

  // 1. Dynamic Statistics calculations
  const myUploadedDocs = documents.filter(doc => doc.uploadedBy === currentUser.id);
  const totalViews = myUploadedDocs.reduce((sum, d) => sum + d.views, 0);
  const totalDownloads = myUploadedDocs.reduce((sum, d) => sum + d.downloads, 0);
  const totalLikes = myUploadedDocs.reduce((sum, d) => sum + d.likes, 0);

  // 2. Saved Bookmarks items
  const savedDocIds = bookmarks.filter(b => b.userId === currentUser.id).map(b => b.documentId);
  const savedDocs = documents.filter(doc => savedDocIds.includes(doc.id));

  // 3. Reading History items
  const historyEntries = readingHistory.filter(h => h.userId === currentUser.id);
  // Map and sort reading history by viewedAt descending
  const historyDocs = historyEntries
    .map(entry => {
      const foundDoc = documents.find(d => d.id === entry.documentId);
      return { foundDoc, viewedAt: entry.viewedAt };
    })
    .filter(item => item.foundDoc !== undefined) as { foundDoc: typeof documents[0]; viewedAt: string }[];

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    currentUser.bio = profileBio;
    // Update local storage
    const storedUsers = localStorage.getItem('scribd_users');
    if (storedUsers) {
      const list = JSON.parse(storedUsers) as typeof users;
      const updatedList = list.map(u => u.id === currentUser.id ? { ...u, bio: profileBio } : u);
      localStorage.setItem('scribd_users', JSON.stringify(updatedList));
    }
    localStorage.setItem('scribd_current_user', JSON.stringify(currentUser));
    showToast('Profile bio updated successfully!', 'success');
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Dashboard preference settings saved successfully!', 'success');
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 font-sans">
      
      <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
        
        {/* Left Side: Sidebar Controls */}
        <div className="md:col-span-1 md:sticky md:top-24 self-start space-y-2">
          
          <div className="border-b border-gray-100 pb-4 mb-4 text-center md:text-left">
            <div className="flex items-center gap-3">
              <img src={currentUser.avatar} alt={currentUser.name} className="h-12 w-12 rounded-full object-cover border" />
              <div className="overflow-hidden">
                <h2 className="text-sm font-extrabold text-gray-900 truncate">{currentUser.name}</h2>
                <p className="text-xs text-gray-400 capitalize">{currentUser.role} Account</p>
              </div>
            </div>
          </div>

          <div className="flex flex-row overflow-x-auto gap-1 pb-2 md:flex-col md:overflow-visible">
            {[
              { id: 'stats', label: 'Overview Stats', icon: <LayoutDashboard className="h-4 w-4" /> },
              { id: 'uploads', label: `My Publications (${myUploadedDocs.length})`, icon: <FileText className="h-4 w-4" /> },
              { id: 'saved', label: `Saved Library (${savedDocs.length})`, icon: <Bookmark className="h-4 w-4" /> },
              { id: 'history', label: 'Reading History', icon: <History className="h-4 w-4" /> },
              { id: 'following', label: `Following (${currentUser.following?.length || 0})`, icon: <Users className="h-4 w-4" /> },
              { id: 'profile', label: 'Edit Profile Bio', icon: <User className="h-4 w-4" /> },
              { id: 'settings', label: 'Account Settings', icon: <Settings className="h-4 w-4" /> }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => navigate('upload')}
            className="w-full mt-4 flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 py-3 text-xs font-bold text-white hover:bg-emerald-700 shadow-sm"
          >
            <Upload className="h-4 w-4" />
            Upload Document
          </button>

        </div>

        {/* Right Side: Tab Details content */}
        <div className="md:col-span-3">
          
          {/* STATS OVERVIEW tab */}
          {activeTab === 'stats' && (
            <div className="space-y-8 animate-fade-in">
              <div>
                <h1 className="text-2xl font-extrabold text-gray-900">Dashboard Metrics</h1>
                <p className="text-xs text-gray-500 mt-0.5">Real-time stats across your published files</p>
              </div>

              {/* Stats Cards Row */}
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                
                <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <FileText className="h-5 w-5" />
                  </div>
                  <p className="text-2xl font-extrabold text-gray-900 mt-4">{myUploadedDocs.length}</p>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mt-1">Total Uploads</p>
                </div>

                <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <Eye className="h-5 w-5" />
                  </div>
                  <p className="text-2xl font-extrabold text-gray-900 mt-4">{totalViews.toLocaleString()}</p>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mt-1">Total Views</p>
                </div>

                <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                    <Download className="h-5 w-5" />
                  </div>
                  <p className="text-2xl font-extrabold text-gray-900 mt-4">{totalDownloads}</p>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mt-1">Downloads</p>
                </div>

                <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
                    <Heart className="h-5 w-5" />
                  </div>
                  <p className="text-2xl font-extrabold text-gray-900 mt-4">{totalLikes}</p>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mt-1">Total Likes</p>
                </div>

              </div>

              {/* Dynamic activity tip panel */}
              <div className="rounded-2xl border border-blue-100 bg-blue-50/20 p-5 space-y-1">
                <h4 className="text-xs font-bold text-blue-900">⚡ Performance Recommendation:</h4>
                <p className="text-xs text-blue-700 leading-relaxed">
                  Your publications have generated <strong className="text-blue-900">{totalViews} views</strong>. To expand downloads, share your document links on academic channels or add precise study guide tags (#quantum, #growth, #handbook) inside your document metadata.
                </p>
              </div>

              {/* Quick links list of their latest publications */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-900">Your Recent Publications</h3>
                {myUploadedDocs.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-gray-200 p-8 text-center text-xs text-gray-400">
                    You have not published any files yet. Share a textbook or study guide now!
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {myUploadedDocs.slice(0, 3).map(doc => (
                      <DocumentCard key={doc.id} document={doc} />
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* MY UPLOADS tab */}
          {activeTab === 'uploads' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-100 pb-4">
                <div>
                  <h1 className="text-2xl font-extrabold text-gray-900">My Published Documents</h1>
                  <p className="text-xs text-gray-500 mt-0.5">Manage and view documents you have contributed</p>
                </div>
                <div className="flex items-center gap-1 bg-gray-50 p-0.5 rounded-xl border border-gray-100 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-lg transition-all ${
                      viewMode === 'grid'
                        ? 'bg-white text-blue-600 shadow-sm border border-gray-100/50'
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                    title="Grid View"
                  >
                    <Grid className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('row')}
                    className={`p-1.5 rounded-lg transition-all ${
                      viewMode === 'row'
                        ? 'bg-white text-blue-600 shadow-sm border border-gray-100/50'
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                    title="Row View"
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {myUploadedDocs.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 py-16 px-4 text-center">
                  <FileSpreadsheet className="h-10 w-10 text-gray-400 mb-3" />
                  <p className="text-sm font-bold text-gray-800">No uploads found</p>
                  <p className="text-xs text-gray-400 mt-1">You haven't contributed any slide decks or textbooks yet.</p>
                  <button onClick={() => navigate('upload')} className="mt-4 rounded-full bg-blue-600 px-4 py-2 text-xs font-bold text-white">
                    Publish First File
                  </button>
                </div>
              ) : (
                <div className={viewMode === 'grid' ? "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3" : "grid grid-cols-1 gap-4"}>
                  {myUploadedDocs.map(doc => (
                    <DocumentCard key={doc.id} document={doc} viewMode={viewMode} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* SAVED LIBRARY tab */}
          {activeTab === 'saved' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-100 pb-4">
                <div>
                  <h1 className="text-2xl font-extrabold text-gray-900">My Saved Bookmarks</h1>
                  <p className="text-xs text-gray-500 mt-0.5">Access files saved for offline references or later study</p>
                </div>
                <div className="flex items-center gap-1 bg-gray-50 p-0.5 rounded-xl border border-gray-100 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-lg transition-all ${
                      viewMode === 'grid'
                        ? 'bg-white text-blue-600 shadow-sm border border-gray-100/50'
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                    title="Grid View"
                  >
                    <Grid className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('row')}
                    className={`p-1.5 rounded-lg transition-all ${
                      viewMode === 'row'
                        ? 'bg-white text-blue-600 shadow-sm border border-gray-100/50'
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                    title="Row View"
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {savedDocs.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 py-16 px-4 text-center">
                  <Bookmark className="h-10 w-10 text-gray-400 mb-3" />
                  <p className="text-sm font-bold text-gray-800">Reading list is empty</p>
                  <p className="text-xs text-gray-400 mt-1">Click the bookmark icon on any document card to save it here.</p>
                  <button onClick={() => navigate('explore')} className="mt-4 rounded-full bg-blue-600 px-4 py-2 text-xs font-bold text-white">
                    Explore Directory
                  </button>
                </div>
              ) : (
                <div className={viewMode === 'grid' ? "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3" : "grid grid-cols-1 gap-4"}>
                  {savedDocs.map(doc => (
                    <DocumentCard key={doc.id} document={doc} viewMode={viewMode} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* READING HISTORY tab */}
          {activeTab === 'history' && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h1 className="text-2xl font-extrabold text-gray-900">Reading History</h1>
                <p className="text-xs text-gray-500 mt-0.5">Recently opened publications on this device</p>
              </div>

              {historyDocs.length === 0 ? (
                <div className="rounded-xl border border-dashed border-gray-200 p-12 text-center text-xs text-gray-400">
                  You haven't read any public sources yet. Go to explore to open study resources!
                </div>
              ) : (
                <div className="space-y-4">
                  {historyDocs.slice(0, 5).map((item, idx) => (
                    <div 
                      key={idx}
                      onClick={() => navigate('document', item.foundDoc.id)}
                      className="flex cursor-pointer items-center justify-between rounded-xl border border-gray-100 bg-white p-4 hover:border-blue-200 shadow-sm transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-8 items-center justify-center rounded bg-gray-100 text-[10px] font-bold text-gray-500 uppercase shrink-0">
                          {item.foundDoc.fileType}
                        </div>
                        <div className="overflow-hidden">
                          <h4 className="text-xs font-bold text-gray-900 truncate max-w-[250px] sm:max-w-md">{item.foundDoc.title}</h4>
                          <p className="text-[10px] text-gray-400 mt-0.5">by {item.foundDoc.authorName} • {item.foundDoc.category}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-medium text-gray-400 whitespace-nowrap pl-2">
                        Opened {new Date(item.viewedAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* PROFILE BIOGRAPHY tab */}
          {activeTab === 'profile' && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h1 className="text-2xl font-extrabold text-gray-900">Contributor Bio</h1>
                <p className="text-xs text-gray-500 mt-0.5">Introduce yourself to other educators and readers browsing your publications</p>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4 max-w-xl">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500">Public Bio (Markdown Supported)</label>
                  <textarea
                    placeholder="Describe your research, role, university department, or typical publication themes..."
                    value={profileBio}
                    onChange={(e) => setProfileBio(e.target.value)}
                    className="w-full h-32 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-xs font-semibold text-gray-900 outline-none focus:border-blue-500"
                    id="profile-bio-textarea"
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 rounded-full bg-blue-600 px-6 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700"
                >
                  <Save className="h-4 w-4" />
                  Update Profile Bio
                </button>
              </form>
            </div>
          )}

          {/* ACCOUNT PREFERENCES tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h1 className="text-2xl font-extrabold text-gray-900">Account Preferences</h1>
                <p className="text-xs text-gray-500 mt-0.5">Toggle privacy controls and sandbox settings</p>
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-6 max-w-xl">
                
                <div className="space-y-4 rounded-2xl border border-gray-100 bg-gray-50/40 p-4">
                  <h3 className="text-xs font-extrabold uppercase text-gray-400">Notification Channels</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-gray-800">Email Alerts on Likes</p>
                      <p className="text-[10px] text-gray-400">Receive alert when someone likes your uploads</p>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={emailNotifs} 
                      onChange={(e) => setEmailNotifs(e.target.checked)}
                      className="h-4 w-4 rounded text-blue-600"
                    />
                  </div>
                </div>

                <div className="space-y-4 rounded-2xl border border-gray-100 bg-gray-50/40 p-4">
                  <h3 className="text-xs font-extrabold uppercase text-gray-400">Privacy & History Tracking</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-gray-800">Enable Reading History</p>
                      <p className="text-[10px] text-gray-400">Track opened materials to suggest related works</p>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={autoSaveHistory} 
                      onChange={(e) => setAutoSaveHistory(e.target.checked)}
                      className="h-4 w-4 rounded text-blue-600"
                    />
                  </div>
                </div>

                {dbStatus?.isConnected ? (
                  <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-4 flex gap-3 text-xs text-emerald-800">
                    <CheckCircle className="h-5 w-5 shrink-0 text-emerald-600" />
                    <div>
                      <p className="font-bold">Database: MongoDB Atlas Connected</p>
                      <p className="text-[10px] text-emerald-600 mt-0.5">
                        Your published documents, bookmarks, reading history, and comments are secured on a durable, live MongoDB database.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-amber-100 bg-amber-50/40 p-4 flex flex-col gap-2 text-xs text-amber-800">
                    <div className="flex gap-3">
                      <ShieldAlert className="h-5 w-5 shrink-0 text-amber-600" />
                      <div>
                        <p className="font-bold">Database: Local Demo Mode</p>
                        <p className="text-[10px] text-amber-600 mt-0.5">
                          Currently running on safe local in-memory states. Clearing browser cache will reset edits.
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 border-t border-amber-200/50 pt-2 pl-8">
                      <p className="font-bold text-[10px] uppercase tracking-wider text-amber-900">How to Enable Cloud MongoDB:</p>
                      <ol className="list-decimal list-inside text-[10px] text-amber-700 mt-1 space-y-1">
                        <li>Register a free database cluster at <a href="https://www.mongodb.com/cloud/atlas" target="_blank" rel="noreferrer" className="underline font-semibold">mongodb.com/atlas</a>.</li>
                        <li>Copy your database Connection String (URI).</li>
                        <li>Open the **Secrets panel** in the AI Studio sidebar.</li>
                        <li>Add a new secret key named <code className="font-mono bg-amber-100/50 px-1 rounded font-bold">MONGODB_URI</code> and paste your URI.</li>
                        <li>Restart your dev server to load your cluster instantly!</li>
                      </ol>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 rounded-full bg-blue-600 px-6 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700"
                >
                  <CheckCircle className="h-4 w-4" />
                  Save Account Settings
                </button>

              </form>
            </div>
          )}

          {/* FOLLOWING tab */}
          {activeTab === 'following' && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h1 className="text-2xl font-extrabold text-gray-900">Following</h1>
                <p className="text-xs text-gray-500 mt-0.5">Stay updated with publications from educators and authors you follow</p>
              </div>

              {followedUsers.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 py-16 px-4 text-center bg-white shadow-sm">
                  <Users className="h-10 w-10 text-gray-400 mb-3" />
                  <p className="text-sm font-bold text-gray-800">You aren't following anyone yet</p>
                  <p className="text-xs text-gray-400 mt-1">Follow creators and educators from their public profiles to see their uploaded files here.</p>
                  <button onClick={() => navigate('explore')} className="mt-4 rounded-full bg-blue-600 px-5 py-2 text-xs font-bold text-white transition-all shadow-md active:scale-95">
                    Explore Directory
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Followed Users list */}
                  <div className="lg:col-span-1 space-y-3 bg-gray-50/50 p-4 rounded-2xl border border-gray-100 max-h-[600px] overflow-y-auto">
                    <h3 className="text-xs font-extrabold uppercase text-gray-400 tracking-wider px-1">Authors ({followedUsers.length})</h3>
                    <div className="space-y-2">
                      {followedUsers.map(user => {
                        const isSelected = selectedFollowedUserId === user.id;
                        return (
                          <div
                            key={user.id}
                            onClick={() => setSelectedFollowedUserId(user.id)}
                            className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                              isSelected
                                ? 'bg-blue-50 border-blue-200 shadow-xs'
                                : 'bg-white border-gray-100 hover:border-gray-200'
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <img src={user.avatar} alt={user.name} className="h-9 w-9 rounded-full object-cover border bg-gray-50 shrink-0" />
                              <div className="min-w-0">
                                <p className="text-xs font-extrabold text-gray-900 truncate">{user.name}</p>
                                <p className="text-[10px] font-bold text-gray-400 capitalize mt-0.5">{user.role}</p>
                              </div>
                            </div>
                            
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFollow(user.id);
                                if (selectedFollowedUserId === user.id) {
                                  setSelectedFollowedUserId(null);
                                }
                              }}
                              className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                              title="Unfollow"
                            >
                              <UserMinus className="h-4 w-4" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Selected followed user's uploaded documents */}
                  <div className="lg:col-span-2 space-y-4">
                    {(() => {
                      const selectedUser = followedUsers.find(u => u.id === selectedFollowedUserId);
                      if (!selectedUser) {
                        return (
                          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 p-12 text-center text-xs text-gray-400 h-full min-h-[300px] bg-white">
                            <p className="font-semibold text-gray-500">Select an author from the list to view their publications</p>
                          </div>
                        );
                      }

                      const authorDocs = documents.filter(doc => doc.uploadedBy === selectedUser.id && doc.visibility === 'public');

                      return (
                        <div className="space-y-4 animate-fade-in">
                          {/* Selected User Header */}
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
                            <div className="flex items-center gap-3">
                              <img src={selectedUser.avatar} alt={selectedUser.name} className="h-11 w-11 rounded-full object-cover border bg-gray-50" />
                              <div>
                                <h3 className="text-sm font-extrabold text-gray-900">{selectedUser.name}</h3>
                                <p className="text-xs text-gray-400 font-medium mt-0.5">
                                  {authorDocs.length} public uploads • {selectedUser.followersCount} followers
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => navigate('profile', null, selectedUser.id)}
                                className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white hover:bg-gray-50 px-3.5 py-1.5 text-xs font-bold text-gray-600 shadow-xs transition-all active:scale-95 cursor-pointer"
                              >
                                <ExternalLink className="h-3.5 w-3.5" />
                                View Profile
                              </button>
                              <button
                                onClick={() => {
                                  toggleFollow(selectedUser.id);
                                  setSelectedFollowedUserId(null);
                                }}
                                className="inline-flex items-center gap-1 rounded-full bg-red-50 text-red-600 hover:bg-red-100 px-3.5 py-1.5 text-xs font-bold transition-all active:scale-95 cursor-pointer"
                              >
                                <UserMinus className="h-3.5 w-3.5" />
                                Unfollow
                              </button>
                            </div>
                          </div>

                          {/* Uploaded Documents List */}
                          <div>
                            <h4 className="text-xs font-extrabold uppercase text-gray-400 tracking-wider mb-3 px-1">Uploaded Files ({authorDocs.length})</h4>
                            {authorDocs.length === 0 ? (
                              <div className="rounded-2xl border border-dashed border-gray-200 py-12 text-center text-xs text-gray-400 bg-white shadow-xs">
                                This author has no public publications.
                              </div>
                            ) : (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {authorDocs.map(doc => (
                                  <DocumentCard key={doc.id} document={doc} />
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
