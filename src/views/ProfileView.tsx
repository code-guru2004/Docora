/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../context/AppContext';
import { DocumentCard } from '../components/DocumentCard';
import { 
  FileText, 
  Users, 
  ArrowLeft, 
  Heart, 
  Sparkles, 
  UserCheck, 
  Grid, 
  List, 
  Edit, 
  Facebook, 
  Instagram, 
  Send, 
  Linkedin, 
  X, 
  Smile 
} from 'lucide-react';

const PREDEFINED_AVATARS = [
  { name: 'Felix', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Felix' },
  { name: 'Aneka', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Aneka' },
  { name: 'Buster', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Buster' },
  { name: 'Garfield', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Garfield' },
  { name: 'Harley', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Harley' },
  { name: 'Lucky', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Lucky' },
  { name: 'Max', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Max' },
  { name: 'Lilou', url: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Lilou' },
  { name: 'Oliver', url: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Oliver' },
  { name: 'Sasha', url: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Sasha' },
];

export const ProfileView: React.FC = () => {
  const { selectedUserId, users, documents, currentUser, toggleFollow, navigate, updateProfile } = useApp();
  const [viewMode, setViewMode] = React.useState<'grid' | 'row'>('grid');

  // Edit form states
  const [isEditing, setIsEditing] = React.useState(false);
  const [editName, setEditName] = React.useState('');
  const [editBio, setEditBio] = React.useState('');
  const [editAvatar, setEditAvatar] = React.useState('');
  const [editFacebook, setEditFacebook] = React.useState('');
  const [editInstagram, setEditInstagram] = React.useState('');
  const [editTelegram, setEditTelegram] = React.useState('');
  const [editLinkedin, setEditLinkedin] = React.useState('');

  // Find targeted user
  const author = users.find(u => u.id === selectedUserId);

  if (!author) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-gray-900">User Profile Not Found</h2>
        <p className="mt-2 text-sm text-gray-500">The contributor profile you are looking for does not exist.</p>
        <button onClick={() => navigate('home')} className="mt-4 rounded-full bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white">
          Back to Home
        </button>
      </div>
    );
  }

  // Find their uploads
  const isOwnProfile = currentUser && currentUser.id === author.id;
  const authorDocs = documents.filter(doc => doc.uploadedBy === author.id && (isOwnProfile || doc.visibility === 'public'));

  // Sum up total likes on their uploads
  const totalLikes = authorDocs.reduce((sum, d) => sum + d.likes, 0);

  const isFollowing = currentUser && currentUser.following.includes(author.id);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8 font-sans">
      
      {/* Back button */}
      <button 
        onClick={() => navigate('home')}
        className="mb-6 flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-blue-600 focus:outline-none"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </button>

      {/* Author Profile Header */}
      <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-col items-center gap-6 text-center md:flex-row md:text-left">
          
          <img 
            src={author.avatar} 
            alt={author.name} 
            className="h-24 w-24 rounded-full object-cover border-2 border-white ring-4 ring-gray-100 shadow-sm"
          />

          <div className="flex-1 space-y-3">
            <div className="flex flex-col items-center gap-2 md:flex-row md:items-start md:justify-between">
              <div>
                <h1 className="text-2xl font-extrabold text-gray-900">{author.name}</h1>
                <p className="text-xs text-gray-400 capitalize font-semibold mt-0.5">{author.role} contributor</p>
              </div>

              {/* Follow control */}
              {currentUser?.id !== author.id ? (
                <button
                  onClick={() => toggleFollow(author.id)}
                  className={`flex items-center gap-1.5 rounded-full px-5 py-2 text-xs font-bold transition-all shadow-sm ${
                    isFollowing
                      ? 'border border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {isFollowing ? (
                    <>
                      <UserCheck className="h-3.5 w-3.5" />
                      Following
                    </>
                  ) : 'Follow Contributor'}
                </button>
              ) : (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 hidden sm:inline-block">
                    Your Public Profile
                  </span>
                  <button
                    onClick={() => {
                      setIsEditing(true);
                      if (currentUser) {
                        setEditName(currentUser.name || '');
                        setEditBio(currentUser.bio || '');
                        setEditAvatar(currentUser.avatar || '');
                        setEditFacebook(currentUser.socialLinks?.facebook || '');
                        setEditInstagram(currentUser.socialLinks?.instagram || '');
                        setEditTelegram(currentUser.socialLinks?.telegram || '');
                        setEditLinkedin(currentUser.socialLinks?.linkedin || '');
                      }
                    }}
                    className="flex items-center gap-1.5 rounded-full bg-gray-100 hover:bg-gray-200 px-4 py-2 text-xs font-bold text-gray-700 transition-all shadow-sm active:scale-95"
                    id="edit-profile-btn"
                  >
                    <Edit className="h-3.5 w-3.5 text-gray-500" />
                    Edit Profile
                  </button>
                </div>
              )}
            </div>

            <p className="text-sm text-gray-600 leading-relaxed max-w-2xl">
              {author.bio || "Active academic researcher sharing curated guide booklets, templates, and spreadsheets."}
            </p>

            {/* Author metrics counts */}
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-2 md:justify-start text-xs font-bold text-gray-500">
              <span className="flex items-center gap-1">
                <FileText className="h-4.5 w-4.5 text-gray-400" />
                <strong className="text-gray-900">{authorDocs.length}</strong> Publications
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-4.5 w-4.5 text-gray-400" />
                <strong className="text-gray-900">{author.followersCount}</strong> Followers
              </span>
              <span className="flex items-center gap-1">
                <Heart className="h-4.5 w-4.5 text-red-400 fill-red-100" />
                <strong className="text-gray-900">{totalLikes}</strong> Net Likes
              </span>
            </div>

            {/* Social Media Links */}
            <div className="pt-4 flex flex-wrap gap-2 justify-center md:justify-start border-t border-gray-100 mt-4">
              {author.socialLinks?.facebook && (
                <a 
                  href={author.socialLinks.facebook.startsWith('http') ? author.socialLinks.facebook : `https://${author.socialLinks.facebook}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 rounded-full border border-gray-100 bg-gray-50 hover:bg-blue-50 hover:border-blue-100 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:text-blue-600 transition-all shadow-xs"
                  title="Facebook"
                >
                  <Facebook className="h-3.5 w-3.5 text-blue-600" />
                  <span>Facebook</span>
                </a>
              )}
              {author.socialLinks?.instagram && (
                <a 
                  href={author.socialLinks.instagram.startsWith('http') ? author.socialLinks.instagram : `https://${author.socialLinks.instagram}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 rounded-full border border-gray-100 bg-gray-50 hover:bg-pink-50 hover:border-pink-100 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:text-pink-600 transition-all shadow-xs"
                  title="Instagram"
                >
                  <Instagram className="h-3.5 w-3.5 text-pink-500" />
                  <span>Instagram</span>
                </a>
              )}
              {author.socialLinks?.telegram && (
                <a 
                  href={author.socialLinks.telegram.startsWith('http') ? author.socialLinks.telegram : `https://${author.socialLinks.telegram}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 rounded-full border border-gray-100 bg-gray-50 hover:bg-sky-50 hover:border-sky-100 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:text-sky-600 transition-all shadow-xs"
                  title="Telegram"
                >
                  <Send className="h-3.5 w-3.5 text-sky-500" />
                  <span>Telegram</span>
                </a>
              )}
              {author.socialLinks?.linkedin && (
                <a 
                  href={author.socialLinks.linkedin.startsWith('http') ? author.socialLinks.linkedin : `https://${author.socialLinks.linkedin}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 rounded-full border border-gray-100 bg-gray-50 hover:bg-blue-50 hover:border-blue-100 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:text-blue-700 transition-all shadow-xs"
                  title="LinkedIn"
                >
                  <Linkedin className="h-3.5 w-3.5 text-blue-700" />
                  <span>LinkedIn</span>
                </a>
              )}
              {isOwnProfile && !(author.socialLinks?.facebook || author.socialLinks?.instagram || author.socialLinks?.telegram || author.socialLinks?.linkedin) && (
                <button
                  onClick={() => {
                    setIsEditing(true);
                    if (currentUser) {
                      setEditName(currentUser.name || '');
                      setEditBio(currentUser.bio || '');
                      setEditAvatar(currentUser.avatar || '');
                      setEditFacebook(currentUser.socialLinks?.facebook || '');
                      setEditInstagram(currentUser.socialLinks?.instagram || '');
                      setEditTelegram(currentUser.socialLinks?.telegram || '');
                      setEditLinkedin(currentUser.socialLinks?.linkedin || '');
                    }
                  }}
                  className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline bg-transparent border-none p-0 cursor-pointer"
                >
                  + Add Facebook, Instagram, Telegram, LinkedIn profile links
                </button>
              )}
            </div>

          </div>

        </div>
      </div>

      {/* Publications Grid section */}
      <div className="mt-12 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-100 pb-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-gray-900">
              {isOwnProfile ? 'Your Publications' : `Publications by ${author.name}`}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {isOwnProfile 
                ? 'Manage and view your shared public and private reference documents' 
                : 'Browse free public reference materials shared by this author'}
            </p>
          </div>
          <div className="flex items-center gap-1 bg-gray-50 p-0.5 rounded-xl border border-gray-100 self-start sm:self-auto">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'grid'
                  ? 'bg-white text-blue-600 shadow-sm border border-gray-100/50'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
              title="Grid View"
              id="profile-view-grid-btn"
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('row')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'row'
                  ? 'bg-white text-blue-600 shadow-sm border border-gray-100/50'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
              title="Row View"
              id="profile-view-row-btn"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>

        {authorDocs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 py-12 text-center text-xs text-gray-400">
            This contributor has not shared any public publications yet.
          </div>
        ) : (
          <div className={viewMode === 'grid' ? "grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5" : "grid grid-cols-1 gap-4"}>
            {authorDocs.map(doc => (
              <DocumentCard key={doc.id} document={doc} viewMode={viewMode} />
            ))}
          </div>
        )}
      </div>

      {/* Profile Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-3xl border border-gray-100 bg-white p-6 shadow-2xl my-8 max-h-[90vh] overflow-y-auto animate-fade-in">
            <button 
              type="button"
              onClick={() => setIsEditing(false)}
              className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-all focus:outline-none"
            >
              <X className="h-4 w-4" />
            </button>

            <h2 className="text-xl font-extrabold text-gray-900 mb-1">Edit Your Profile</h2>
            <p className="text-xs text-gray-500 mb-6">Customize your name, bio, select a cartoon avatar, and share social links.</p>

            <form onSubmit={async (e) => {
              e.preventDefault();
              const success = await updateProfile(editName, editBio, editAvatar, {
                facebook: editFacebook,
                instagram: editInstagram,
                telegram: editTelegram,
                linkedin: editLinkedin
              });
              if (success) {
                setIsEditing(false);
              }
            }} className="space-y-6">
              
              {/* Profile Name & Bio */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1.5">Display Name</label>
                  <input 
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-xs font-semibold text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1.5">Biography</label>
                  <textarea 
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    rows={3}
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-xs font-semibold text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all resize-none"
                    placeholder="Describe your qualifications, university, research interests, or book themes..."
                  />
                </div>
              </div>

              {/* Predefined Avatars Picker */}
              <div className="border-t border-gray-100 pt-4">
                <label className="block text-xs font-bold text-gray-600 uppercase mb-2 flex items-center gap-1">
                  <Smile className="h-4 w-4 text-blue-500" />
                  Select Avatar (10 Cartoon Styles)
                </label>
                <div className="grid grid-cols-5 gap-3 rounded-2xl bg-gray-50 p-4 border border-gray-100">
                  {PREDEFINED_AVATARS.map((av, index) => {
                    const isSelected = editAvatar === av.url;
                    return (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setEditAvatar(av.url)}
                        className={`group relative flex aspect-square items-center justify-center rounded-2xl p-1 bg-white border transition-all focus:outline-none ${
                          isSelected 
                            ? 'border-blue-500 ring-2 ring-blue-500/20 scale-105' 
                            : 'border-gray-200 hover:border-gray-300 hover:scale-[1.02]'
                        }`}
                        title={av.name}
                      >
                        <img 
                          src={av.url} 
                          alt={av.name} 
                          className="h-full w-full rounded-xl object-contain"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-black/40 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="text-[8px] font-bold text-white text-center px-1 leading-tight">{av.name}</span>
                        </div>
                        {isSelected && (
                          <div className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-white shadow-sm">
                            <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Social Media Links */}
              <div className="border-t border-gray-100 pt-4 space-y-4">
                <label className="block text-xs font-bold text-gray-600 uppercase">Social Media Profiles</label>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Facebook */}
                  <div>
                    <span className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500 uppercase mb-1">
                      <Facebook className="h-3.5 w-3.5 text-blue-600" />
                      Facebook Profile URL
                    </span>
                    <input 
                      type="text"
                      value={editFacebook}
                      onChange={(e) => setEditFacebook(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                      placeholder="facebook.com/username"
                    />
                  </div>

                  {/* Instagram */}
                  <div>
                    <span className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500 uppercase mb-1">
                      <Instagram className="h-3.5 w-3.5 text-pink-500" />
                      Instagram Profile URL
                    </span>
                    <input 
                      type="text"
                      value={editInstagram}
                      onChange={(e) => setEditInstagram(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                      placeholder="instagram.com/username"
                    />
                  </div>

                  {/* Telegram */}
                  <div>
                    <span className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500 uppercase mb-1">
                      <Send className="h-3.5 w-3.5 text-sky-500" />
                      Telegram Link
                    </span>
                    <input 
                      type="text"
                      value={editTelegram}
                      onChange={(e) => setEditTelegram(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                      placeholder="t.me/username"
                    />
                  </div>

                  {/* LinkedIn */}
                  <div>
                    <span className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500 uppercase mb-1">
                      <Linkedin className="h-3.5 w-3.5 text-blue-700" />
                      LinkedIn URL
                    </span>
                    <input 
                      type="text"
                      value={editLinkedin}
                      onChange={(e) => setEditLinkedin(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                      placeholder="linkedin.com/in/username"
                    />
                  </div>
                </div>
              </div>

              {/* Form Buttons */}
              <div className="border-t border-gray-100 pt-5 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="rounded-full border border-gray-200 hover:bg-gray-50 px-5 py-2 text-xs font-bold text-gray-500 transition-all active:scale-95"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-blue-600 hover:bg-blue-700 px-6 py-2 text-xs font-bold text-white transition-all shadow-md active:scale-95"
                  id="save-profile-btn"
                >
                  Save Changes
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
};
