/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../context/AppContext';
import { DocumentCard } from './DocumentCard';
import { DocumentCardSkeleton } from './Skeleton';

export const TrendingDocuments: React.FC = () => {
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

  // Get trending documents sorted by views descending from our database
  const trendingDocs = [...documents]
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 5);

  if (trendingDocs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 p-12 text-center">
        <p className="text-sm font-semibold text-gray-500">No documents found in the database.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {trendingDocs.map(doc => (
        <DocumentCard key={doc.id} document={doc} />
      ))}
    </div>
  );
};

export default TrendingDocuments;
