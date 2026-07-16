/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  Loader2, 
  AlertCircle, 
  ExternalLink,
  FileText
} from 'lucide-react';

// Import react-pdf styles for text-selection and annotations
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';

// Configure pdf.js worker from highly reliable unpkg CDN matching current pdfjs-dist peer dependency version
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PDFPreviewerProps {
  fileUrl: string;
  page?: number;
  onPageChange?: (page: number) => void;
  onTotalPagesLoaded?: (totalPages: number) => void;
}

export const PDFPreviewer: React.FC<PDFPreviewerProps> = ({ 
  fileUrl, 
  page,
  onPageChange,
  onTotalPagesLoaded
}) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Sync external page prop with internal currentPage state
  useEffect(() => {
    if (page && page !== currentPage && numPages && page >= 1 && page <= numPages) {
      setCurrentPage(page);
    }
  }, [page, numPages]);
  
  // Responsive width tracking via ResizeObserver
  const [containerWidth, setContainerWidth] = useState<number>(750);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    const observer = new ResizeObserver((entries) => {
      if (entries[0]) {
        // Adjust padding offset so PDF fits nicely within the border
        const width = entries[0].contentRect.width;
        setContainerWidth(width > 40 ? width - 32 : 300);
      }
    });

    observer.observe(containerRef.current);
    
    return () => {
      observer.disconnect();
    };
  }, []);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setCurrentPage(1);
    setLoading(false);
    setError(null);
    if (onTotalPagesLoaded) {
      onTotalPagesLoaded(numPages);
    }
    if (onPageChange) {
      onPageChange(1);
    }
  };

  const onDocumentLoadError = (err: Error) => {
    console.error('Failed to render PDF directly:', err);
    setLoading(false);
    setError(err.message || 'CORS restriction or network block while retrieving PDF binary.');
  };

  const changePage = (offset: number) => {
    if (!numPages) return;
    const targetPage = currentPage + offset;
    if (targetPage >= 1 && targetPage <= numPages) {
      setCurrentPage(targetPage);
      if (onPageChange) {
        onPageChange(targetPage);
      }
    }
  };

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.15, 2.0));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.15, 0.5));
  };

  const handleResetZoom = () => {
    setScale(1.0);
  };

  return (
    <div className="flex flex-col w-full bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm" id="pdf-viewer-root">
      
      {/* Dynamic Action Controls Bar */}
      {numPages && (
        <div className="flex flex-wrap items-center justify-between gap-3 bg-gray-50 border-b border-gray-100 px-4 py-2.5">
          {/* Zoom controls */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleZoomOut}
              disabled={scale <= 0.5}
              className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-30 transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            <span className="text-xs font-extrabold text-gray-600 min-w-[42px] text-center">
              {Math.round(scale * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              disabled={scale >= 2.0}
              className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-30 transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
            <button
              onClick={handleResetZoom}
              className="px-2 py-1 text-[10px] font-bold text-blue-600 hover:bg-blue-50 rounded"
            >
              Fit
            </button>
          </div>

          {/* Pagination summary */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => changePage(-1)}
              disabled={currentPage <= 1}
              className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-30 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-xs font-bold text-gray-700">
              Page {currentPage} of {numPages}
            </span>
            <button
              onClick={() => changePage(1)}
              disabled={currentPage >= numPages}
              className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-30 transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* External toggle or info */}
          <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
            <FileText className="h-3 w-3" />
            Native Vector PDF
          </div>
        </div>
      )}

      {/* Actual PDF Container Canvas */}
      <div 
        ref={containerRef} 
        className="relative flex justify-center items-start w-full min-h-[350px] p-1 sm:p-2 bg-gray-50/50 overflow-auto"
      >
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 z-10 py-12">
            <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
            <p className="mt-3 text-xs font-bold text-gray-500">Loading publication vector frames...</p>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center p-8 max-w-md text-center bg-white rounded-xl border border-gray-100 shadow-sm my-6">
            <div className="h-10 w-10 flex items-center justify-center rounded-full bg-amber-50 text-amber-500 mb-3">
              <AlertCircle className="h-6 w-6" />
            </div>
            <h4 className="text-sm font-extrabold text-gray-800">Direct PDF Load Blocked</h4>
            <p className="mt-1.5 text-xs text-gray-500 leading-normal">
              {error.includes('CORS') 
                ? 'External server security policies (CORS headers) prevent rendering this file directly in the browser previewer.' 
                : error}
            </p>
            
            <div className="mt-4 flex flex-col w-full gap-2">
              <a 
                href={fileUrl} 
                target="_blank" 
                rel="noreferrer" 
                className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-blue-600 py-2 text-xs font-bold text-white hover:bg-blue-700 transition-colors"
              >
                Open Original File
                <ExternalLink className="h-3 w-3" />
              </a>
              <p className="text-[10px] text-gray-400">
                Fallback option is active below. You can still read the document details!
              </p>
            </div>
          </div>
        )}

        {!error && (
          <Document
            file={fileUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={null}
            className="flex flex-col items-center"
          >
            <Page 
              pageNumber={currentPage} 
              width={containerWidth * scale}
              renderTextLayer={true}
              renderAnnotationLayer={true}
              loading={
                <div className="flex h-32 items-center justify-center">
                  <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />
                </div>
              }
              className="border border-gray-200/60 rounded-lg shadow-sm bg-white overflow-hidden"
            />
          </Document>
        )}
      </div>

      {/* Mini PDF Pagination Footer inside previewer */}
      {numPages && (
        <div className="flex items-center justify-between border-t border-gray-50 bg-gray-50/20 px-4 py-2 text-[11px] text-gray-400">
          <span>Scale: {Math.round(scale * 100)}%</span>
          <span>Click and drag text to highlight/copy</span>
          <span>PDF.js Engine</span>
        </div>
      )}

    </div>
  );
};
