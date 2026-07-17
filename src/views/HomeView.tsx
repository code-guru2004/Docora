/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, Suspense, lazy } from 'react';
import { useApp } from '../context/AppContext';
import { Search, Sparkles, ChevronRight, TrendingUp, Clock } from 'lucide-react';
import { CategoryCardSkeleton, DocumentCardSkeleton, TestimonialSkeleton, FAQSkeleton } from '../components/Skeleton';

// Lazily load components that access DB or external elements to optimize rendering
const CategoriesList = lazy(() => import('../components/CategoriesList'));
const TrendingDocuments = lazy(() => import('../components/TrendingDocuments'));
const LatestUploads = lazy(() => import('../components/LatestUploads'));
const Testimonials = lazy(() => import('../components/Testimonials'));
const FAQSection = lazy(() => import('../components/FAQSection'));

export const HomeView: React.FC = () => {
  const { documents, navigate } = useApp();
  const [searchQueryLocal, setSearchQueryLocal] = useState('');

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQueryLocal.trim()) {
      (window as any).__custom_search_query = searchQueryLocal;
      navigate('explore');
      window.dispatchEvent(new CustomEvent('custom-search', { detail: searchQueryLocal }));
    }
  };

  // Aggregating tags dynamically from the active DB documents state
  const allTags = documents.flatMap(d => d.tags || []);
  const uniqueTags = Array.from(new Set(allTags)).slice(0, 6);

  return (
    <div className="flex flex-col gap-20 pb-20 font-sans">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/50 via-white to-white py-24 px-4 text-center sm:px-6 lg:px-8">
        {/* Ambient glow backgrounds */}
        <div className="absolute top-1/4 left-1/2 -z-10 h-80 w-80 -translate-x-1/2 rounded-full bg-blue-100/40 blur-3xl"></div>
        <div className="absolute top-1/3 left-1/3 -z-10 h-56 w-56 -translate-x-1/2 rounded-full bg-indigo-50/30 blur-2xl"></div>

        <div className="mx-auto max-w-4xl">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-4 py-1.5 text-xs font-bold text-blue-700">
            <Sparkles className="h-3.5 w-3.5 text-blue-600 animate-pulse" />
            Empowering over 500,000+ creators and educators worldwide
          </div>

          <h1 className="mt-8 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl leading-tight">
            Read, share, and publish <br />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
              knowledge instantly
            </span>
          </h1>
          
          <p className="mx-auto mt-6 max-w-xl text-base text-gray-500 leading-relaxed sm:text-lg">
            Discover verified textbook slides, comprehensive study guides, research summaries, and spreadsheets shared by educators globally.
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
                placeholder="Search study guides, research notes, spreadsheets, and files..."
                value={searchQueryLocal}
                onChange={(e) => setSearchQueryLocal(e.target.value)}
                className="w-full rounded-full py-2.5 pr-4 pl-12 text-sm font-semibold text-gray-900 placeholder-gray-400 outline-none sm:text-base"
                id="hero-search-input"
              />
              <button
                type="submit"
                className="rounded-full bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors sm:px-8 sm:py-3 cursor-pointer"
              >
                Search
              </button>
            </div>
          </form>

          {/* Dynamic Tag Filters based on DB Data */}
          {uniqueTags.length > 0 && (
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
              <span className="text-xs font-bold text-gray-400">Popular Tags:</span>
              {uniqueTags.map((tag, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    (window as any).__custom_tag_filter = tag;
                    navigate('explore');
                    window.dispatchEvent(new CustomEvent('custom-tag', { detail: tag }));
                  }}
                  className="rounded-full bg-gray-50 px-3.5 py-1.5 text-xs font-semibold text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-all cursor-pointer border border-transparent hover:border-blue-100"
                >
                  #{tag}
                </button>
              ))}
            </div>
          )}

        </div>
      </section>

      {/* 2. DYNAMIC CATEGORIES LIST SECTION */}
      <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between border-b border-gray-100 pb-5 mb-8">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">Explore by Category</h2>
            <p className="mt-1.5 text-sm text-gray-500">Discover shared archives curated across 25 dynamic fields of study</p>
          </div>
          <button 
            onClick={() => navigate('explore')}
            className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 transition-all group cursor-pointer"
          >
            Browse All 
            <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <Suspense fallback={
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
            {Array(16).fill(0).map((_, i) => (
              <CategoryCardSkeleton key={i} />
            ))}
          </div>
        }>
          <CategoriesList />
        </Suspense>
      </section>

      {/* 3. TRENDING DOCUMENTS SECTION */}
      <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between border-b border-gray-100 pb-5 mb-8">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50">
              <TrendingUp className="h-4.5 w-4.5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">Trending Publications</h2>
              <p className="mt-1.5 text-sm text-gray-500">Most discussed and viewed reference files generating buzz today</p>
            </div>
          </div>
          <button 
            onClick={() => navigate('explore')}
            className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 transition-all group cursor-pointer"
          >
            Explore More 
            <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <Suspense fallback={
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {Array(5).fill(0).map((_, i) => (
              <DocumentCardSkeleton key={i} />
            ))}
          </div>
        }>
          <TrendingDocuments />
        </Suspense>
      </section>

      {/* 4. LATEST UPLOADS SECTION */}
      <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between border-b border-gray-100 pb-5 mb-8">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50">
              <Clock className="h-4.5 w-4.5 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">Latest Uploads</h2>
              <p className="mt-1.5 text-sm text-gray-500">Recently uploaded resources published minutes ago by the community</p>
            </div>
          </div>
          <button 
            onClick={() => navigate('explore')}
            className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 transition-all group cursor-pointer"
          >
            See All Uploads 
            <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <Suspense fallback={
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {Array(5).fill(0).map((_, i) => (
              <DocumentCardSkeleton key={i} />
            ))}
          </div>
        }>
          <LatestUploads />
        </Suspense>
      </section>

      {/* 5. TESTIMONIALS SECTION */}
      <Suspense fallback={
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 gap-8 md:grid-cols-3">
          {Array(3).fill(0).map((_, i) => <TestimonialSkeleton key={i} />)}
        </div>
      }>
        <Testimonials />
      </Suspense>

      {/* 6. FAQS SECTION */}
      <Suspense fallback={
        <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
          <FAQSkeleton />
        </div>
      }>
        <FAQSection />
      </Suspense>

    </div>
  );
};

export default HomeView;
