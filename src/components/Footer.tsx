/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BookOpen, Github, Twitter, Linkedin, Heart } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Footer: React.FC = () => {
  const { navigate } = useApp();

  return (
    <footer className="border-t border-gray-100 bg-gray-50/50 py-12 text-sm font-sans text-gray-500">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">

          {/* Brand Info */}
          <div className="sm:col-span-2">
            <button
              onClick={() => navigate('home')}
              className="flex items-center gap-2 font-sans text-lg font-bold text-gray-900 focus:outline-none"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-600 text-white">
                <BookOpen className="h-4.5 w-4.5" />
              </div>
              <span>DocShare</span>
            </button>
            <p className="mt-4 max-w-sm text-gray-500 leading-relaxed">
              Discover, read, and share knowledge instantly with our global community. Access millions of PDFs, templates, slide decks, and research papers from anywhere in the world.
            </p>
            <div className="mt-6 flex items-center gap-4">
              <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Categories Columns */}
          <div>
            <h3 className="font-semibold text-gray-900">Explore Content</h3>
            <ul className="mt-4 flex flex-col gap-2">
              <li><button onClick={() => navigate('explore')} className="hover:text-blue-600 transition-colors text-left">Programming & Tech</button></li>
              <li><button onClick={() => navigate('explore')} className="hover:text-blue-600 transition-colors text-left">Business & Economics</button></li>
              <li><button onClick={() => navigate('explore')} className="hover:text-blue-600 transition-colors text-left">Scientific Research</button></li>
              <li><button onClick={() => navigate('explore')} className="hover:text-blue-600 transition-colors text-left">Academic Textbooks</button></li>
            </ul>
          </div>

          {/* Platform Columns */}
          <div>
            <h3 className="font-semibold text-gray-900">Platform</h3>
            <ul className="mt-4 flex flex-col gap-2">
              <li><button onClick={() => navigate('upload')} className="hover:text-blue-600 transition-colors text-left">Upload Document</button></li>
              <li><button onClick={() => navigate('explore')} className="hover:text-blue-600 transition-colors text-left">Trending Guides</button></li>
              <li><button onClick={() => navigate('explore')} className="hover:text-blue-600 transition-colors text-left">Featured Authors</button></li>
              <li><button onClick={() => navigate('dashboard')} className="hover:text-blue-600 transition-colors text-left">User Dashboard</button></li>
              <li>
                <a
                  href="https://weshare-p2p.onrender.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-600 transition-colors text-left"
                >
                  P2P File Sharing
                </a>
              </li>
            </ul>
          </div>

          {/* Legal Columns */}
          <div>
            <h3 className="font-semibold text-gray-900">Legal</h3>
            <ul className="mt-4 flex flex-col gap-2">
              <li><button onClick={() => navigate('privacy')} className="hover:text-blue-600 transition-colors text-left cursor-pointer">Privacy Policy</button></li>
              <li><button onClick={() => navigate('terms')} className="hover:text-blue-600 transition-colors text-left cursor-pointer">Terms of Service</button></li>
              <li><button onClick={() => navigate('dmca')} className="hover:text-blue-600 transition-colors text-left cursor-pointer">Copyright / DMCA</button></li>
              <li><button onClick={() => navigate('support')} className="hover:text-blue-600 transition-colors text-left cursor-pointer">Support Helpdesk</button></li>
            </ul>
          </div>

        </div>

        <hr className="my-8 border-gray-100" />

        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} DocShare Inc. All rights reserved. Built for document lovers.
          </p>
          <p className="flex items-center gap-1 text-xs text-gray-400">
            Made with <Heart className="h-3.5 w-3.5 text-red-500 fill-red-500" /> by developers, for creators.
          </p>
        </div>
      </div>
    </footer>
  );
};
