/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export const CategoryCardSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white p-5 text-center shadow-sm animate-pulse">
      <div className="h-12 w-12 rounded-xl bg-gray-200" />
      <div className="mt-4 h-4 w-16 rounded bg-gray-200" />
      <div className="mt-2 h-3 w-20 rounded bg-gray-100" />
    </div>
  );
};

export const DocumentCardSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm animate-pulse">
      {/* Top cover image area */}
      <div className="h-40 w-full bg-gray-200" />
      
      {/* Body content */}
      <div className="flex flex-1 flex-col p-4">
        {/* Title and Badge rows */}
        <div className="flex items-center gap-1.5">
          <div className="h-5 w-10 rounded bg-gray-200" />
          <div className="h-4 w-24 rounded bg-gray-200" />
        </div>
        
        {/* Title */}
        <div className="mt-3 space-y-2">
          <div className="h-4 w-full rounded bg-gray-200" />
          <div className="h-4 w-5/6 rounded bg-gray-200" />
        </div>
        
        {/* Author information */}
        <div className="mt-5 flex items-center gap-2 border-t border-gray-50 pt-3">
          <div className="h-6 w-6 rounded-full bg-gray-200" />
          <div className="h-3 w-20 rounded bg-gray-200" />
        </div>
        
        {/* Stats footer */}
        <div className="mt-4 flex items-center justify-between border-t border-gray-50 pt-3">
          <div className="h-3 w-12 rounded bg-gray-200" />
          <div className="h-3 w-12 rounded bg-gray-200" />
          <div className="h-3 w-12 rounded bg-gray-200" />
        </div>
      </div>
    </div>
  );
};

export const FAQSkeleton: React.FC = () => {
  return (
    <div className="space-y-4 animate-pulse">
      {[1, 2, 3].map((n) => (
        <div key={n} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="h-4 w-2/3 rounded bg-gray-200" />
            <div className="h-4 w-4 rounded-full bg-gray-200" />
          </div>
          <div className="mt-3 space-y-1.5">
            <div className="h-3 w-full rounded bg-gray-100" />
            <div className="h-3 w-5/6 rounded bg-gray-100" />
          </div>
        </div>
      ))}
    </div>
  );
};

export const TestimonialSkeleton: React.FC = () => {
  return (
    <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm animate-pulse">
      {/* Stars */}
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <div key={n} className="h-4 w-4 rounded bg-gray-200" />
        ))}
      </div>
      {/* Content lines */}
      <div className="mt-4 space-y-2">
        <div className="h-4 w-full rounded bg-gray-200" />
        <div className="h-4 w-full rounded bg-gray-200" />
        <div className="h-4 w-3/4 rounded bg-gray-200" />
      </div>
      {/* Author details */}
      <div className="mt-6 flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-gray-200" />
        <div className="space-y-1.5">
          <div className="h-4 w-20 rounded bg-gray-200" />
          <div className="h-3 w-28 rounded bg-gray-100" />
        </div>
      </div>
    </div>
  );
};
