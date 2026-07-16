/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
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
  Search, 
  Check, 
  ChevronDown,
  Book
} from 'lucide-react';
import { Category } from '../types';

interface CategoryComboboxProps {
  selectedSlug: string;
  onChange: (slug: string) => void;
  categories: Category[];
  id?: string;
  placeholder?: string;
  className?: string;
  showAllOption?: boolean;
}

// Map slug/icon string to actual lucide element
export const getCategoryIconElement = (iconName: string, className = "h-4 w-4") => {
  switch (iconName) {
    case 'GraduationCap': return <GraduationCap className={className} />;
    case 'Laptop': return <Laptop className={className} />;
    case 'Code': return <Code className={className} />;
    case 'Cpu': return <Cpu className={className} />;
    case 'Atom': return <Atom className={className} />;
    case 'Calculator': return <Calculator className={className} />;
    case 'HeartPulse': return <HeartPulse className={className} />;
    case 'TrendingUp': return <TrendingUp className={className} />;
    case 'Coins': return <Coins className={className} />;
    case 'Scale': return <Scale className={className} />;
    case 'BookOpen': return <BookOpen className={className} />;
    case 'Library': return <Library className={className} />;
    case 'Brain': return <Brain className={className} />;
    case 'Languages': return <Languages className={className} />;
    case 'FileText': return <FileText className={className} />;
    case 'Award': return <Award className={className} />;
    case 'Building': return <Building className={className} />;
    case 'Compass': return <Compass className={className} />;
    case 'User': return <User className={className} />;
    case 'Sparkles': return <Sparkles className={className} />;
    case 'FileDigit': return <FileDigit className={className} />;
    case 'Presentation': return <Presentation className={className} />;
    case 'Wrench': return <Wrench className={className} />;
    case 'BarChart2': return <BarChart2 className={className} />;
    case 'Smile': return <Smile className={className} />;
    default: return <Book className={className} />;
  }
};

export const CategoryCombobox: React.FC<CategoryComboboxProps> = ({
  selectedSlug,
  onChange,
  categories,
  id = 'category-combobox',
  placeholder = 'Select a category...',
  className = '',
  showAllOption = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  // Close combobox when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Filter categories by search term
  const filtered = categories.filter(cat => 
    cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cat.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Find currently selected category
  const selectedCategory = categories.find(cat => cat.slug.toLowerCase() === selectedSlug.toLowerCase());

  const handleSelect = (slug: string) => {
    onChange(slug);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className={`relative ${className}`} ref={containerRef} id={id}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-gray-900 transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500 hover:border-gray-300 outline-none"
      >
        <span className="flex items-center gap-2 truncate">
          {selectedSlug === 'all' && showAllOption ? (
            <>
              <Book className="h-4 w-4 text-blue-500 shrink-0" />
              <span>All Categories</span>
            </>
          ) : selectedCategory ? (
            <>
              <span className="text-blue-500 shrink-0">
                {getCategoryIconElement(selectedCategory.icon, "h-4 w-4")}
              </span>
              <span>{selectedCategory.name}</span>
            </>
          ) : (
            <span className="text-gray-400">{placeholder}</span>
          )}
        </span>
        <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 z-50 mt-1.5 w-full min-w-[240px] rounded-2xl border border-gray-100 bg-white p-2 shadow-xl animate-fade-in max-h-[320px] flex flex-col">
          {/* Search Bar inside Dropdown */}
          <div className="relative mb-1.5 shrink-0">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              className="w-full rounded-xl border border-gray-100 bg-gray-50/50 py-2 pr-3 pl-9 text-xs font-semibold text-gray-900 outline-none focus:border-blue-500 focus:bg-white transition-all"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              autoFocus
            />
          </div>

          {/* Categories List */}
          <div className="overflow-y-auto flex-1 space-y-0.5 pr-1">
            {showAllOption && (
              <button
                type="button"
                onClick={() => handleSelect('all')}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs font-semibold transition-all ${
                  selectedSlug === 'all'
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Book className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                  <span>All Categories</span>
                </span>
                {selectedSlug === 'all' && <Check className="h-3.5 w-3.5 shrink-0" />}
              </button>
            )}

            {filtered.length > 0 ? (
              filtered.map(cat => {
                const isSelected = cat.slug.toLowerCase() === selectedSlug.toLowerCase();
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleSelect(cat.slug)}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span className="flex items-center gap-2 truncate">
                      <span className="text-blue-500 shrink-0">
                        {getCategoryIconElement(cat.icon, "h-3.5 w-3.5")}
                      </span>
                      <span className="truncate">{cat.name}</span>
                    </span>
                    {isSelected && <Check className="h-3.5 w-3.5 shrink-0" />}
                  </button>
                );
              })
            ) : (
              <div className="py-6 text-center text-xs text-gray-400">
                No categories found for "{searchTerm}"
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
