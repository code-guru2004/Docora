/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../context/AppContext';
import { MOCK_CATEGORIES } from '../data/mockData';
import { CategoryCardSkeleton } from './Skeleton';
import { 
  GraduationCap, 
  Laptop, 
  Code, 
  Cpu, 
  Atom, 
  Calculator, 
  HeartPulse, 
  TrendingUp, 
  Coins, 
  Scale, 
  BookOpen, 
  Library, 
  Brain, 
  Languages, 
  FileText, 
  Award, 
  Building, 
  Compass, 
  User, 
  Sparkles, 
  FileDigit, 
  Presentation, 
  Wrench, 
  BarChart2, 
  Smile, 
  ChevronRight 
} from 'lucide-react';

const getCategoryIcon = (iconName: string) => {
  switch (iconName) {
    case 'GraduationCap': return <GraduationCap className="h-6 w-6 text-indigo-600" />;
    case 'Laptop': return <Laptop className="h-6 w-6 text-sky-600" />;
    case 'Code': return <Code className="h-6 w-6 text-blue-600" />;
    case 'Cpu': return <Cpu className="h-6 w-6 text-amber-600" />;
    case 'Atom': return <Atom className="h-6 w-6 text-purple-600" />;
    case 'Calculator': return <Calculator className="h-6 w-6 text-teal-600" />;
    case 'HeartPulse': return <HeartPulse className="h-6 w-6 text-rose-600" />;
    case 'TrendingUp': return <TrendingUp className="h-6 w-6 text-emerald-600" />;
    case 'Coins': return <Coins className="h-6 w-6 text-yellow-600" />;
    case 'Scale': return <Scale className="h-6 w-6 text-indigo-700" />;
    case 'BookOpen': return <BookOpen className="h-6 w-6 text-amber-800" />;
    case 'Library': return <Library className="h-6 w-6 text-stone-600" />;
    case 'Brain': return <Brain className="h-6 w-6 text-fuchsia-600" />;
    case 'Languages': return <Languages className="h-6 w-6 text-emerald-500" />;
    case 'FileText': return <FileText className="h-6 w-6 text-blue-500" />;
    case 'Award': return <Award className="h-6 w-6 text-amber-500" />;
    case 'Building': return <Building className="h-6 w-6 text-slate-700" />;
    case 'Compass': return <Compass className="h-6 w-6 text-cyan-600" />;
    case 'User': return <User className="h-6 w-6 text-violet-600" />;
    case 'Sparkles': return <Sparkles className="h-6 w-6 text-yellow-500" />;
    case 'FileDigit': return <FileDigit className="h-6 w-6 text-teal-700" />;
    case 'Presentation': return <Presentation className="h-6 w-6 text-orange-600" />;
    case 'Wrench': return <Wrench className="h-6 w-6 text-gray-600" />;
    case 'BarChart2': return <BarChart2 className="h-6 w-6 text-indigo-500" />;
    case 'Smile': return <Smile className="h-6 w-6 text-pink-500" />;
    default: return <BookOpen className="h-6 w-6 text-blue-600" />;
  }
};

export const CategoriesList: React.FC = () => {
  const { documents, isLoading, navigate } = useApp();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
        {Array(16).fill(0).map((_, i) => (
          <CategoryCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  // Count active documents per category in our database
  const getDynamicCount = (categorySlug: string, baselineCount: number) => {
    const dbCount = documents.filter(doc => doc.category.toLowerCase() === categorySlug.toLowerCase()).length;
    return baselineCount + dbCount;
  };

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
      {MOCK_CATEGORIES.map((cat) => {
        const totalCount = getDynamicCount(cat.slug, cat.count);
        return (
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
            <h3 className="mt-4 font-sans text-xs font-bold text-gray-900 group-hover:text-blue-600 transition-colors truncate w-full px-1">
              {cat.name}
            </h3>
            <p className="mt-1 text-[10px] font-medium text-gray-400">
              {totalCount.toLocaleString()} items
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default CategoriesList;
