/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Document } from '../types';
import { PDFPreviewer } from './PDFPreviewer';
import { 
  ZoomIn, 
  ZoomOut, 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  Minimize2, 
  Sun, 
  Moon, 
  Search, 
  Grid3X3, 
  Sparkles,
  Sheet
} from 'lucide-react';

interface OnlineViewerProps {
  document: Document;
}

export const OnlineViewer: React.FC<OnlineViewerProps> = ({ document }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTotalPages, setActiveTotalPages] = useState(document.totalPages || document.pages.length);
  const [zoom, setZoom] = useState(100); // percentage (50% to 150%)
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isViewerDarkMode, setIsViewerDarkMode] = useState(false);
  
  // Spreadsheet-specific active sheet tab
  const [activeSheetTab, setActiveSheetTab] = useState(0);

  // Search inside document state
  const [searchWord, setSearchWord] = useState('');
  const [searchResults, setSearchResults] = useState<{ pageNum: number; line: string }[]>([]);
  const [isSearchActive, setIsSearchActive] = useState(false);
  
  const isOfficeFile = ['ppt', 'pptx', 'xls', 'xlsx', 'doc', 'docx'].includes(document.fileType?.toLowerCase() || '');

  useEffect(() => {
    // Reset state on document change
    setCurrentPage(1);
    setActiveTotalPages(document.totalPages || document.pages.length);
    setSearchWord('');
    setSearchResults([]);
    setIsSearchActive(false);
    setActiveSheetTab(0);
  }, [document]);

  // Handle local searching inside page strings
  const handleDocSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchWord.trim()) {
      setSearchResults([]);
      return;
    }

    const matches: { pageNum: number; line: string }[] = [];
    document.pages.forEach((pageContent, pageIdx) => {
      const lines = pageContent.split('\n');
      lines.forEach(line => {
        if (line.toLowerCase().includes(searchWord.toLowerCase())) {
          matches.push({
            pageNum: pageIdx + 1,
            line: line.trim()
          });
        }
      });
    });

    setSearchResults(matches);
    if (matches.length > 0) {
      // Go to first matching page
      setCurrentPage(matches[0].pageNum);
    }
  };

  // Navigation handlers
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < activeTotalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Zoom handlers
  const handleZoomIn = () => {
    if (zoom < 150) setZoom(zoom + 10);
  };

  const handleZoomOut = () => {
    if (zoom > 70) setZoom(zoom - 10);
  };

  // Render Page Content based on File Type
  const renderDocumentContent = () => {
    const pageText = document.pages[currentPage - 1] || 'No content on this page.';
    const lines = pageText.split('\n');

    // XLSX / Spreadsheets Rendering
    if (document.fileType === 'xls' || document.fileType === 'xlsx') {
      // Parse columns
      return (
        <div className="w-full overflow-x-auto p-2 sm:p-4">
          <div className="mb-3 flex items-center gap-2 border-b border-gray-200 pb-2">
            <Sheet className="h-4 w-4 text-emerald-600" />
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Spreadsheet Sheets:</span>
            <div className="flex gap-2">
              {document.pages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveSheetTab(idx);
                    setCurrentPage(idx + 1);
                  }}
                  className={`rounded-md px-3 py-1 text-xs font-medium transition-all ${
                    activeSheetTab === idx
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Sheet {idx + 1}
                </button>
              ))}
            </div>
          </div>

          <div className={`rounded-xl border border-gray-200 overflow-hidden font-mono text-sm ${
            isViewerDarkMode ? 'bg-gray-900 border-gray-800 text-gray-200' : 'bg-white text-gray-800'
          }`}>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={isViewerDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-50 text-gray-600'}>
                  <th className="border-r border-b border-gray-200 p-2 text-center text-xs w-12">Row</th>
                  <th className="border-b border-gray-200 p-2">Column Data (Simulated Row values)</th>
                </tr>
              </thead>
              <tbody>
                {lines.map((line, idx) => {
                  if (!line.trim()) return null;
                  const isHeader = line.includes('---');
                  if (isHeader) {
                    return (
                      <tr key={idx}>
                        <td colSpan={2} className="border-b border-gray-200 bg-gray-100/50 h-1"></td>
                      </tr>
                    );
                  }

                  // Split values if table cell separator | exists
                  if (line.includes('|')) {
                    const cells = line.split('|');
                    return (
                      <tr key={idx} className="hover:bg-blue-50/10">
                        <td className="border-r border-b border-gray-200/50 p-2 text-center text-xs text-gray-400 bg-gray-100/10">{idx + 1}</td>
                        <td className="border-b border-gray-200/50 p-2">
                          <div className="grid grid-cols-3 gap-4">
                            {cells.map((cell, cidx) => (
                              <div key={cidx} className="truncate px-2 py-0.5">
                                {highlightText(cell.trim(), searchWord)}
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    );
                  }

                  return (
                    <tr key={idx} className="hover:bg-blue-50/10">
                      <td className="border-r border-b border-gray-200/50 p-2 text-center text-xs text-gray-400 bg-gray-100/10">{idx + 1}</td>
                      <td className="border-b border-gray-200/50 p-2 px-4 leading-relaxed font-sans text-gray-700 dark:text-gray-300">
                        {highlightText(line, searchWord)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    // PPTX / Presentations Rendering (Slides look)
    if (document.fileType === 'ppt' || document.fileType === 'pptx') {
      return (
        <div className="flex flex-col items-center justify-center p-2 sm:p-4 w-full">
          <div 
            className={`w-full max-w-2xl rounded-2xl border p-4 sm:p-6 shadow-sm transition-all text-center aspect-video flex flex-col justify-between ${
              isViewerDarkMode 
                ? 'bg-slate-900 border-slate-800 text-white shadow-slate-950/40' 
                : 'bg-slate-50 border-slate-200 text-gray-900 shadow-slate-100/60'
            }`}
          >
            <div className="text-right text-[10px] uppercase font-bold tracking-widest text-blue-500">
              Slide {currentPage} of {activeTotalPages}
            </div>

            <div className="my-auto space-y-3">
              {lines.map((line, idx) => {
                if (line.startsWith('[SLIDE')) return null;
                const isHeading = line === line.toUpperCase() && line.length > 3 && !line.startsWith('-');
                
                if (isHeading) {
                  return (
                    <h2 key={idx} className="text-lg md:text-xl font-bold tracking-tight text-blue-600 dark:text-blue-400">
                      {highlightText(line, searchWord)}
                    </h2>
                  );
                }

                if (line.startsWith('-')) {
                  return (
                    <div key={idx} className="flex justify-center gap-2 text-xs md:text-sm text-gray-600 dark:text-gray-300">
                      <span>•</span>
                      <span>{highlightText(line.substring(1).trim(), searchWord)}</span>
                    </div>
                  );
                }

                return (
                  <p key={idx} className="text-[11px] md:text-xs leading-relaxed text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
                    {highlightText(line, searchWord)}
                  </p>
                );
              })}
            </div>

            <div className="mt-2 flex items-center justify-between border-t border-gray-200/30 pt-3 text-[10px] text-gray-400">
              <span>{document.title}</span>
              <span>DocShare Deck Viewer</span>
            </div>
          </div>
        </div>
      );
    }

    // Standard PDF / Word DOCX Styled Page Render
    return (
      <div className="space-y-4 p-4 sm:p-6 leading-relaxed text-sm md:text-base font-sans">
        {lines.map((line, idx) => {
          if (!line.trim()) return <div key={idx} className="h-4"></div>;

          // Detect simple formatting (bullet points, headers)
          const isHeader = (line === line.toUpperCase() && line.length > 5 && !line.startsWith('-')) || line.startsWith('CHAPTER') || line.startsWith('LECTURE') || line.startsWith('ESSAY:');
          const isBullet = line.startsWith('-') || line.startsWith('*');

          if (isHeader) {
            return (
              <h4 key={idx} className="text-base md:text-lg font-extrabold text-gray-900 dark:text-white tracking-tight border-b border-gray-100 dark:border-gray-800 pb-1 mt-6 first:mt-0">
                {highlightText(line, searchWord)}
              </h4>
            );
          }

          if (isBullet) {
            return (
              <div key={idx} className="flex gap-2 pl-4 text-gray-700 dark:text-gray-300">
                <span className="text-blue-500">•</span>
                <span className="flex-1">{highlightText(line.substring(1).trim(), searchWord)}</span>
              </div>
            );
          }

          return (
            <p key={idx} className="text-gray-700 dark:text-gray-300">
              {highlightText(line, searchWord)}
            </p>
          );
        })}
      </div>
    );
  };

  // Text Highlighting Helper
  const highlightText = (text: string, search: string) => {
    if (!search.trim()) return text;
    const regex = new RegExp(`(${escapeRegExp(search)})`, 'gi');
    const parts = text.split(regex);
    return (
      <>
        {parts.map((part, i) => 
          regex.test(part) 
            ? <mark key={i} className="bg-yellow-200 dark:bg-yellow-800 dark:text-white px-0.5 rounded">{part}</mark> 
            : part
        )}
      </>
    );
  };

  const escapeRegExp = (string: string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  };

  return (
    <div 
      className={`flex flex-col border border-gray-200 rounded-2xl overflow-hidden transition-all duration-300 ${
        isFullscreen 
          ? 'fixed inset-0 z-50 bg-white dark:bg-gray-950 p-4 md:p-8' 
          : 'bg-white shadow-sm'
      }`}
      id="document-online-viewer"
    >
      
      {/* 1. Viewer Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 bg-gray-50/50 px-4 py-3 dark:bg-gray-900/50 dark:border-gray-800">
        
        {/* Left Status */}
        <div className="flex items-center gap-2">
          <span className="rounded bg-blue-50 border border-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700 uppercase tracking-wider">
            {document.fileType}
          </span>
          <span className="truncate text-xs font-semibold text-gray-700 dark:text-gray-300 max-w-[200px]">
            {document.title}
          </span>
        </div>

        {/* Center Navigation */}
        {!(isOfficeFile && document.fileUrl) ? (
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="rounded-lg p-1 text-gray-500 hover:bg-gray-100 disabled:opacity-30 dark:hover:bg-gray-800 focus:outline-none"
              title="Previous Page"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            
            <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 dark:text-gray-400">
              <span className="text-gray-900 dark:text-white">{currentPage}</span>
              <span>/</span>
              <span>{activeTotalPages}</span>
            </div>

            <button
              onClick={handleNextPage}
              disabled={currentPage === activeTotalPages}
              className="rounded-lg p-1 text-gray-500 hover:bg-gray-100 disabled:opacity-30 dark:hover:bg-gray-800 focus:outline-none"
              title="Next Page"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        ) : (
          <div className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            Microsoft Office Reader Mode
          </div>
        )}

        {/* Right Tools (Zoom, Mode, Fullscreen) */}
        <div className="flex items-center gap-2">
          
          {/* Zoom */}
          <div className="hidden items-center border-r border-gray-200 dark:border-gray-800 pr-2 sm:flex">
            <button
              onClick={handleZoomOut}
              className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
              title="Zoom Out"
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            <span className="w-11 text-center text-xs font-bold text-gray-500 dark:text-gray-400">
              {zoom}%
            </span>
            <button
              onClick={handleZoomIn}
              className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
              title="Zoom In"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
          </div>

          {/* Viewer Dark Mode Toggle */}
          <button
            onClick={() => setIsViewerDarkMode(!isViewerDarkMode)}
            className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
            title="Toggle Reader Mode"
          >
            {isViewerDarkMode ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
          </button>

          {/* Search trigger */}
          <button
            onClick={() => setIsSearchActive(!isSearchActive)}
            className={`rounded-lg p-1.5 focus:outline-none ${
              isSearchActive ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
            title="Search inside document"
          >
            <Search className="h-4.5 w-4.5" />
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="h-4.5 w-4.5" /> : <Maximize2 className="h-4.5 w-4.5" />}
          </button>

        </div>
      </div>

      {/* 2. Viewer Search Panel */}
      {isSearchActive && (
        <div className="border-b border-gray-100 bg-blue-50/20 px-4 py-2.5 dark:bg-gray-900/20 dark:border-gray-800">
          <form onSubmit={handleDocSearch} className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Type keyword and press Enter to search within document text..."
                value={searchWord}
                onChange={(e) => setSearchWord(e.target.value)}
                className="w-full rounded-full border border-gray-200 bg-white py-1.5 pr-4 pl-9 text-xs outline-none focus:border-blue-500"
                id="doc-viewer-search-input"
              />
            </div>
            {searchResults.length > 0 && (
              <span className="text-xs font-bold text-gray-500">
                {searchResults.length} matches found
              </span>
            )}
          </form>

          {/* Search Result Jumper */}
          {searchResults.length > 0 && (
            <div className="mt-2 flex max-h-24 flex-col gap-1 overflow-y-auto rounded-lg border border-gray-100 bg-white p-1 text-xs">
              {searchResults.slice(0, 5).map((result, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(result.pageNum)}
                  className="flex w-full items-center justify-between rounded px-2 py-1 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="truncate text-gray-600">
                    ... {result.line} ...
                  </span>
                  <span className="shrink-0 font-bold text-blue-600">
                    Page {result.pageNum}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. Document Canvas Area */}
      <div 
        className={`flex-1 overflow-y-auto flex justify-center p-2 sm:p-3 transition-all duration-300 min-h-[300px] md:min-h-[500px] ${
          isViewerDarkMode ? 'bg-gray-950' : 'bg-gray-100'
        }`}
      >
        {document.fileType === 'pdf' && document.fileUrl ? (
          <div className="w-full max-w-4xl">
            <PDFPreviewer 
              fileUrl={document.fileUrl} 
              page={currentPage} 
              onPageChange={setCurrentPage}
              onTotalPagesLoaded={setActiveTotalPages}
            />
          </div>
        ) : isOfficeFile && document.fileUrl ? (
          <div className="w-full max-w-5xl rounded-xl shadow-sm bg-white border border-gray-200 overflow-hidden">
            <iframe
              src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(document.fileUrl)}`}
              width="100%"
              height="800"
              frameBorder="0"
              title="Office Document Preview"
              className="w-full h-[600px] md:h-[800px] border-0"
            />
          </div>
        ) : (
          <div 
            className={`w-full max-w-4xl rounded-xl shadow-sm transition-all border ${
              isViewerDarkMode 
                ? 'bg-gray-900 border-gray-800 text-gray-200' 
                : 'bg-white border-gray-200 text-gray-800'
            }`}
            style={{ 
              fontSize: `${zoom}%`,
              transition: 'font-size 0.2s ease-in-out'
            }}
          >
            {renderDocumentContent()}
          </div>
        )}
      </div>

      {/* 4. Navigation Footer */}
      {!(isOfficeFile && document.fileUrl) && (
        <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50/30 px-4 py-3 dark:bg-gray-950/20 dark:border-gray-800">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 py-1.5 text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-40 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous Page
          </button>

          <span className="text-xs font-semibold text-gray-500">
            Viewing in Full Reader Mode
          </span>

          <button
            onClick={handleNextPage}
            disabled={currentPage === activeTotalPages}
            className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 py-1.5 text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-40 transition-colors"
          >
            Next Page
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}

    </div>
  );
};
