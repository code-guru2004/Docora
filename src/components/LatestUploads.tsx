/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../context/AppContext';
import { DocumentCard } from './DocumentCard';
import { DocumentCardSkeleton } from './Skeleton';

export const LatestUploads: React.FC = () => {
  const { documents, isLoading } = useApp();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {Array(5).fill(0).map((_, i) => (
          <DocumentCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  // Get recently uploaded documents sorted by date descending from our database
  const recentDocs = [...documents]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  if (recentDocs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 p-12 text-center">
        <p className="text-sm font-semibold text-gray-500">No documents uploaded yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {recentDocs.map(doc => (
        <DocumentCard key={doc.id} document={doc} />
      ))}
    </div>
  );
};

export default LatestUploads;
