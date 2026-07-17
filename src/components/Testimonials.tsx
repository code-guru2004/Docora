/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Star, Quote } from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  institution: string;
  avatar: string;
  quote: string;
  rating: number;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Dr. Evelyn Martinez',
    role: 'Professor of Neuroscience',
    institution: 'Stanford University',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    quote: 'DocShare has fundamentally changed how I distribute study materials to my graduate seminar. The dynamic format filtering and quick upload tool saved me hours of administrative prep time this semester.',
    rating: 5,
  },
  {
    id: '2',
    name: 'Liam Harrington',
    role: 'Senior Software Engineer',
    institution: 'Google Cloud Platform',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    quote: 'Finding trustworthy engineering blueprints and architectural templates used to be a scavenger hunt. Here, I found fully cited, high-quality documentation in seconds. Excellent search and UI.',
    rating: 5,
  },
  {
    id: '3',
    name: 'Chloe Zhao',
    role: 'Graduate Researcher',
    institution: 'MIT Media Lab',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    quote: 'The ability to read notes, download templates, and get instant feedback from other researchers has fostered amazing collaborations. I love the clean typography and seamless reading view.',
    rating: 5,
  },
];

export const Testimonials: React.FC = () => {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          What our community is saying
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-base text-gray-500">
          Over 500,000 educators, students, and professionals trust our shared archive to expand their knowledge base.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
        {TESTIMONIALS.map((t) => (
          <div
            key={t.id}
            className="group relative flex flex-col justify-between rounded-3xl border border-gray-100 bg-white p-8 shadow-sm hover:border-blue-100 hover:shadow-md transition-all duration-300"
          >
            {/* Quote Icon Background Decorator */}
            <Quote className="absolute right-6 top-6 h-10 w-10 text-blue-50/70" />

            <div>
              {/* Rating Star Row */}
              <div className="flex gap-1">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Text Body */}
              <p className="mt-5 text-sm font-medium leading-relaxed text-gray-600">
                "{t.quote}"
              </p>
            </div>

            {/* Author Profile Footer */}
            <div className="mt-8 flex items-center gap-3.5 border-t border-gray-50 pt-5">
              <img
                src={t.avatar}
                alt={t.name}
                className="h-10 w-10 rounded-full object-cover ring-2 ring-gray-100 group-hover:ring-blue-100 transition-all"
              />
              <div className="min-w-0">
                <h4 className="font-sans text-xs font-extrabold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {t.name}
                </h4>
                <p className="mt-0.5 text-[10px] font-semibold text-gray-400 truncate">
                  {t.role} • <span className="text-gray-500">{t.institution}</span>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
