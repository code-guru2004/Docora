/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DocumentCard } from '../components/DocumentCard';
import { MOCK_CATEGORIES } from '../data/mockData';
import { 
  Search, 
  TrendingUp, 
  Clock, 
  Sparkles, 
  ChevronRight, 
  Users, 
  Cpu, 
  HeartPulse, 
  Code, 
  TrendingUp as TrendingIcon,
  GraduationCap, 
  Atom, 
  BookOpen 
} from 'lucide-react';

export const HomeView: React.FC = () => {
  const { documents, users, navigate } = useApp();
  const [searchQueryLocal, setSearchQueryLocal] = useState('');

  // Handle category icon mapping
  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Code': return <Code className="h-6 w-6 text-blue-600" />;
      case 'TrendingUp': return <TrendingIcon className="h-6 w-6 text-emerald-600" />;
      case 'Atom': return <Atom className="h-6 w-6 text-purple-600" />;
      case 'HeartPulse': return <HeartPulse className="h-6 w-6 text-rose-600" />;
      case 'Cpu': return <Cpu className="h-6 w-6 text-amber-600" />;
      case 'BookOpen': return <BookOpen className="h-6 w-6 text-amber-800" />;
      case 'GraduationCap': return <GraduationCap className="h-6 w-6 text-indigo-600" />;
      default: return <BookOpen className="h-6 w-6 text-blue-600" />;
    }
  };

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQueryLocal.trim()) {
      (window as any).__custom_search_query = searchQueryLocal;
      navigate('explore');
      window.dispatchEvent(new CustomEvent('custom-search', { detail: searchQueryLocal }));
    }
  };

  // Filter dynamic document statistics
  const trendingDocs = [...documents].sort((a, b) => b.views - a.views).slice(0, 3);
  const recentDocs = [...documents].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 3);
  const featuredAuthors = users.slice(0, 3);

  // Popular tags aggregated from documents
  const allTags = documents.flatMap(d => d.tags);
  const uniqueTags = Array.from(new Set(allTags)).slice(0, 6);

  return (
    <div className="flex flex-col gap-16 pb-16 font-sans">
      
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/50 via-white to-white py-20 px-4 text-center sm:px-6 lg:px-8">
        {/* Abstract shapes in background */}
        <div className="absolute top-1/4 left-1/2 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-100/40 blur-3xl"></div>
        <div className="absolute top-1/3 left-1/3 -z-10 h-48 w-48 -translate-x-1/2 rounded-full bg-emerald-50/30 blur-2xl"></div>

        <div className="mx-auto max-w-4xl">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3.5 py-1.5 text-xs font-semibold text-blue-700">
            <Sparkles className="h-3.5 w-3.5" />
            Explore the World's Largest Shared Document Repository
          </div>

          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            Read, share, and publish <br />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">knowledge instantly</span>
          </h1>
          
          <p className="mx-auto mt-6 max-w-xl text-base text-gray-500 leading-relaxed sm:text-lg">
            Discover textbook slides, research summaries, financial templates, and academic notes shared by professional educators and industry leaders globally.
          </p>

          {/* Large Hero Search Bar */}
          <form 
            onSubmit={handleHeroSearch}
            className="mx-auto mt-10 max-w-2xl"
          >
            <div className="relative flex items-center rounded-full border border-gray-200 bg-white p-2.5 shadow-md shadow-gray-100/50 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-50/70">
              <Search className="absolute left-5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search spreadsheets, presentations, PDFs, and guides..."
                value={searchQueryLocal}
                onChange={(e) => setSearchQueryLocal(e.target.value)}
                className="w-full rounded-full py-2.5 pr-4 pl-12 text-sm font-medium text-gray-900 placeholder-gray-400 outline-none sm:text-base"
                id="hero-search-input"
              />
              <button
                type="submit"
                className="rounded-full bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors sm:px-8 sm:py-3"
              >
                Search
              </button>
            </div>
          </form>

          {/* Quick tags display */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs font-semibold text-gray-400">Popular:</span>
            {uniqueTags.map((tag, idx) => (
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
      </section>

      {/* 2. Interactive Categories Section */}
      <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between border-b border-gray-100 pb-5">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">Explore by Category</h2>
            <p className="mt-1 text-sm text-gray-500">Discover handpicked documents curated across major divisions</p>
          </div>
          <button 
            onClick={() => navigate('explore')}
            className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700"
          >
            Browse All
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
          {MOCK_CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              onClick={() => {
                (window as any).__custom_category_filter = cat.slug;
                navigate('explore');
                window.dispatchEvent(new CustomEvent('custom-category', { detail: cat.slug }));
              }}
              className="group flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white p-5 text-center shadow-sm hover:border-blue-200 hover:shadow-md transition-all duration-300"
              id={`cat-card-${cat.slug}`}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-50 group-hover:bg-blue-50 transition-colors">
                {getCategoryIcon(cat.icon)}
              </div>
              <h3 className="mt-4 font-sans text-xs font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                {cat.name}
              </h3>
              <p className="mt-1 text-[10px] font-medium text-gray-400">
                {cat.count.toLocaleString()} resources
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Trending Documents Bento Section */}
      <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between border-b border-gray-100 pb-5">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-50">
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">Trending Documents</h2>
              <p className="mt-1 text-sm text-gray-500">Most-viewed documents generating interest today</p>
            </div>
          </div>
          <button 
            onClick={() => navigate('explore')}
            className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700"
          >
            View More
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {trendingDocs.slice(0, 5).map(doc => (
            <DocumentCard key={doc.id} document={doc} />
          ))}
        </div>
      </section>

      {/* 4. Featured Authors Showcase */}
      <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-gray-100 bg-gray-50/50 p-8 sm:p-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Meet Our Featured Contributors</h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-gray-500">
              Follow expert research scientists, financial analysts, and web educators publishing their best materials.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {featuredAuthors.map(author => (
              <div
                key={author.id}
                onClick={() => navigate('profile', null, author.id)}
                className="group flex cursor-pointer flex-col items-center rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm hover:shadow-md transition-all duration-300"
                id={`author-card-${author.id}`}
              >
                <img 
                  src={author.avatar} 
                  alt={author.name} 
                  className="h-16 w-16 rounded-full object-cover border-2 border-white ring-4 ring-gray-100 group-hover:ring-blue-100 transition-all"
                />
                <h3 className="mt-4 font-sans text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {author.name}
                </h3>
                <p className="mt-1 line-clamp-2 text-xs text-gray-400 px-2 leading-relaxed">
                  {author.bio || "Active academic publisher."}
                </p>
                <div className="mt-4 flex items-center gap-1 text-[10px] font-bold text-blue-600">
                  <Users className="h-3.5 w-3.5" />
                  <span>{author.followersCount} Followers</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Recently Uploaded Documents Grid */}
      <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between border-b border-gray-100 pb-5">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-50">
              <Clock className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">Latest Uploads</h2>
              <p className="mt-1 text-sm text-gray-500">Recently published resources shared minutes ago</p>
            </div>
          </div>
          <button 
            onClick={() => navigate('explore')}
            className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700"
          >
            See All Uploads
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {recentDocs.slice(0, 5).map(doc => (
            <DocumentCard key={doc.id} document={doc} />
          ))}
        </div>
      </section>

    </div>
  );
};
