/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { DocumentCard } from '../components/DocumentCard';
import { MOCK_CATEGORIES } from '../data/mockData';
import { Filter, Grid, List, Search, SlidersHorizontal, ArrowUpDown, RefreshCw, BookmarkCheck, X } from 'lucide-react';
import { CategoryCombobox } from '../components/CategoryCombobox';
import { motion, AnimatePresence } from 'motion/react';

export const ExploreView: React.FC = () => {
  // Filter States
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedSort, setSelectedSort] = useState('latest');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'row'>('grid');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Server-side paginated states
  const [paginatedDocs, setPaginatedDocs] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // Listen for custom trigger events from Navbar/Hero searches
  useEffect(() => {
    const handleCustomSearch = (e: any) => {
      setSearchQuery(e.detail || '');
      setSelectedCategory('all');
      setSelectedTag('');
      setCurrentPage(1);
    };

    const handleCustomCategory = (e: any) => {
      setSelectedCategory(e.detail || 'all');
      setSearchQuery('');
      setSelectedTag('');
      setCurrentPage(1);
    };

    const handleCustomTag = (e: any) => {
      setSelectedTag(e.detail || '');
      setSelectedCategory('all');
      setSearchQuery('');
      setCurrentPage(1);
    };

    window.addEventListener('custom-search', handleCustomSearch);
    window.addEventListener('custom-category', handleCustomCategory);
    window.addEventListener('custom-tag', handleCustomTag);

    // Initial check for cached transitions
    if ((window as any).__custom_search_query) {
      setSearchQuery((window as any).__custom_search_query);
      delete (window as any).__custom_search_query;
    }
    if ((window as any).__custom_category_filter) {
      setSelectedCategory((window as any).__custom_category_filter);
      delete (window as any).__custom_category_filter;
    }
    if ((window as any).__custom_tag_filter) {
      setSelectedTag((window as any).__custom_tag_filter);
      delete (window as any).__custom_tag_filter;
    }

    return () => {
      window.removeEventListener('custom-search', handleCustomSearch);
      window.removeEventListener('custom-category', handleCustomCategory);
      window.removeEventListener('custom-tag', handleCustomTag);
    };
  }, []);

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedType('all');
    setSelectedSort('latest');
    setSearchQuery('');
    setSelectedTag('');
    setCurrentPage(1);
  };

  // Fetch paginated, filtered, sorted docs from server
  useEffect(() => {
    const fetchDocuments = async () => {
      setIsLoading(true);
      try {
        const queryParams = new URLSearchParams({
          page: currentPage.toString(),
          limit: itemsPerPage.toString(),
          category: selectedCategory,
          type: selectedType,
          sort: selectedSort,
          tag: selectedTag,
          search: searchQuery
        });
        
        const res = await fetch(`/api/documents?${queryParams.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setPaginatedDocs(data.documents || []);
          setTotalCount(data.totalCount || 0);
          setTotalPages(data.totalPages || 1);
        }
      } catch (err) {
        console.error('Error fetching paginated documents:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocuments();
  }, [currentPage, selectedCategory, selectedType, selectedSort, selectedTag, searchQuery]);

  const FilterContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4.5 w-4.5 text-blue-600" />
          <span className="font-sans text-sm font-bold text-gray-900">Refine Search</span>
        </div>
        {isMobile && (
          <button
            onClick={() => setIsMobileFilterOpen(false)}
            className="rounded-full bg-gray-50 p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-800 focus:outline-none transition-all active:scale-95"
            title="Close filters"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Categories Selector */}
      <div className="space-y-2">
        <label className="text-xs font-extrabold uppercase tracking-wider text-gray-400">Categories</label>
        <CategoryCombobox
          selectedSlug={selectedCategory}
          onChange={(slug) => {
            setSelectedCategory(slug);
            setSelectedTag('');
            setCurrentPage(1);
          }}
          categories={MOCK_CATEGORIES}
          id={isMobile ? "explore-category-combobox-mobile" : "explore-category-combobox"}
          placeholder="Select category..."
          showAllOption={true}
        />
      </div>

      {/* File Formats Selector */}
      <div className="space-y-2">
        <label className="text-xs font-extrabold uppercase tracking-wider text-gray-400">Document Type</label>
        <select
          value={selectedType}
          onChange={(e) => {
            setSelectedType(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
          id={isMobile ? "type-filter-select-mobile" : "type-filter-select"}
        >
          <option value="all">All Formats</option>
          <option value="pdf">PDF Files (.pdf)</option>
          <option value="slides">Slides & Presentations (.ppt, .pptx)</option>
          <option value="spreadsheets">Spreadsheets & Data (.xls, .xlsx)</option>
          <option value="documents">Word Documents (.doc, .docx)</option>
        </select>
      </div>

      {/* Sorting controls */}
      <div className="space-y-2">
        <label className="text-xs font-extrabold uppercase tracking-wider text-gray-400">Sort Results</label>
        <div className="flex flex-col gap-1.5">
          {[
            { id: 'latest', name: 'Latest Uploads' },
            { id: 'views', name: 'Most Viewed' },
            { id: 'downloads', name: 'Most Downloaded' },
            { id: 'likes', name: 'Most Liked' }
          ].map(sortOpt => (
            <button
              key={sortOpt.id}
              onClick={() => {
                setSelectedSort(sortOpt.id);
                setCurrentPage(1);
              }}
              className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-xs font-semibold border transition-all cursor-pointer ${
                selectedSort === sortOpt.id
                  ? 'bg-blue-50/50 border-blue-200 text-blue-700'
                  : 'bg-white border-gray-100 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {sortOpt.name}
              <ArrowUpDown className="h-3.5 w-3.5 text-gray-400" />
            </button>
          ))}
        </div>
      </div>

      {/* Tag constraints */}
      {selectedTag && (
        <div className="rounded-xl border border-blue-100 bg-blue-50/30 p-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700">Filtering by Tag:</span>
          <div className="mt-1 flex items-center justify-between">
            <span className="text-xs font-bold text-blue-900">#{selectedTag}</span>
            <button
              onClick={() => setSelectedTag('')}
              className="rounded p-0.5 hover:bg-blue-100 text-blue-600 cursor-pointer"
            >
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 font-sans">
      
      {/* Title block */}
      <div className="border-b border-gray-100 pb-5">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Explore Shared Library</h1>
        <p className="mt-2 text-sm text-gray-500">
          Find public lecture series, presentations, Excel spreadsheets, and academic handbooks instantly
        </p>
      </div>

      {/* Main search input for Page */}
      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Type titles, tags, or authors to search..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full rounded-2xl border border-gray-200 bg-white py-3 pr-4 pl-12 text-sm font-sans outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50"
            id="explore-search-bar"
          />
        </div>

        <div className="flex items-center gap-3">
          {/* Mobile Filter Toggle Button */}
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden inline-flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-5 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 active:scale-95 transition-all cursor-pointer"
            title="Open filters"
            id="mobile-filter-toggle-btn"
          >
            <SlidersHorizontal className="h-4 w-4 text-blue-600" />
            <span>Filters</span>
          </button>

          {/* Clear filters button */}
          {(selectedCategory !== 'all' || selectedType !== 'all' || selectedSort !== 'latest' || searchQuery || selectedTag) && (
            <button
              onClick={resetFilters}
              className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50/50 px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 whitespace-nowrap cursor-pointer"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Filter and Content Grid */}
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-4">
        
        {/* Sidebar Filters Panel (Desktop) */}
        <div className="hidden lg:block lg:col-span-1">
          <FilterContent />
        </div>

        {/* Results Grid Content */}
        <div className="space-y-8 lg:col-span-3">
          
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Found {totalCount} documents
            </span>
            <div className="flex items-center gap-1 bg-gray-50 p-0.5 rounded-xl border border-gray-100">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === 'grid'
                    ? 'bg-white text-blue-600 shadow-sm border border-gray-100/50'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
                title="Grid View"
                id="view-grid-btn"
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
                id="view-row-btn"
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Loading State Case */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-100 py-20 text-center bg-gray-50/30">
              <RefreshCw className="h-8 w-8 text-blue-600 animate-spin" />
              <p className="mt-4 text-xs font-semibold text-gray-500">Querying live repository...</p>
            </div>
          ) : paginatedDocs.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 py-16 px-4 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-50 text-gray-400 mb-4">
                <Grid className="h-6 w-6" />
              </div>
              <h3 className="font-sans text-sm font-bold text-gray-900">No matching documents</h3>
              <p className="mt-1 text-xs text-gray-500 max-w-xs">
                We couldn't find any resources matching your search constraints. Try clearing your search parameters.
              </p>
              <button
                onClick={resetFilters}
                className="mt-4 rounded-full bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <>
              {/* Document Cards list */}
              <div className={viewMode === 'grid' ? "grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5" : "grid grid-cols-1 gap-4"}>
                {paginatedDocs.map(doc => (
                  <DocumentCard key={doc.id} document={doc} viewMode={viewMode} />
                ))}
              </div>

              {/* Professional Pagination elements */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-gray-100 pt-6">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1 text-xs font-bold text-gray-600 disabled:opacity-40 hover:text-blue-600 text-left"
                  >
                    ← Previous
                  </button>
                  
                  <div className="flex items-center gap-1.5 flex-wrap justify-center">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`h-8 w-8 rounded-full text-xs font-extrabold ${
                          currentPage === pageNum
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        {pageNum}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1 text-xs font-bold text-gray-600 disabled:opacity-40 hover:text-blue-600 text-right"
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}

        </div>

      </div>

      {/* Mobile Drawer Filter Sidebar */}
      <AnimatePresence>
        {isMobileFilterOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsMobileFilterOpen(false)}
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs lg:hidden"
            />

            {/* Sidebar content */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-50 w-full max-w-xs bg-white p-6 shadow-2xl overflow-y-auto lg:hidden border-r border-gray-100 flex flex-col"
            >
              <FilterContent isMobile={true} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
};
