/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Mail, Lock, Sparkles, BookOpen, ChevronRight } from 'lucide-react';

export const LoginView: React.FC = () => {
  const { login, navigate, showToast } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setErrors('Please fill in all credentials fields.');
      return;
    }

    const success = login(email.trim());
    if (success) {
      navigate('dashboard');
    } else {
      setErrors('No user found with this email address. Try "sarah.j@edu.org" or "marcus.chen@tech.com".');
    }
  };

  const handleGoogleLogin = () => {
    // Simulate logging in with first mock user
    const success = login('sarah.j@edu.org');
    if (success) {
      navigate('dashboard');
    }
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-8rem)] w-full max-w-md flex-col justify-center px-4 py-8 font-sans">
      <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-xl">
        
        {/* Brand Header */}
        <div className="text-center">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white shadow-md shadow-blue-100">
            <BookOpen className="h-5.5 w-5.5" />
          </div>
          <h2 className="mt-6 text-2xl font-extrabold tracking-tight text-gray-900">
            Sign in to DocShare
          </h2>
          <p className="mt-1.5 text-xs text-gray-500">
            Access thousands of textbooks, spreadsheets, and lecture slides
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          
          {errors && (
            <div className="rounded-xl bg-rose-50 p-3 text-xs font-semibold text-rose-700">
              {errors}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500">Email Address</label>
            <div className="relative">
              <Mail className="absolute top-1/2 left-3.5 h-4.5 w-4.5 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                placeholder="e.g. sarah.j@edu.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pr-4 pl-10 text-sm font-medium text-gray-950 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50"
                id="login-email-input"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-gray-500">Password</label>
              <a href="#" className="text-[11px] font-bold text-blue-600 hover:underline">Forgot password?</a>
            </div>
            <div className="relative">
              <Lock className="absolute top-1/2 left-3.5 h-4.5 w-4.5 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pr-4 pl-10 text-sm font-medium text-gray-950 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50"
                id="login-password-input"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-md hover:bg-blue-700 transition-colors"
          >
            Sign In with Email
          </button>

        </form>

        {/* Divider */}
        <div className="my-6 flex items-center justify-between gap-4 text-xs text-gray-400">
          <div className="h-px flex-1 bg-gray-100"></div>
          <span>OR CONTINUE WITH</span>
          <div className="h-px flex-1 bg-gray-100"></div>
        </div>

        {/* Google sign-in */}
        <button
          onClick={handleGoogleLogin}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-2.5 text-xs font-bold text-gray-700 shadow-sm hover:bg-gray-50 transition-all active:scale-[0.98]"
        >
          {/* Flat Google logo */}
          <svg className="h-4 w-4" viewBox="0 0 24 24">
            <path fill="#EA4335" d="M12 5.04c1.62 0 3.08.56 4.22 1.64l3.15-3.15C17.45 1.74 14.93 1 12 1 7.37 1 3.42 3.68 1.48 7.58l3.77 2.92C6.18 7.42 8.84 5.04 12 5.04z" />
            <path fill="#4285F4" d="M23.45 12.3c0-.82-.07-1.6-.21-2.3H12v4.35h6.42c-.27 1.44-1.08 2.66-2.3 3.48l3.58 2.78c2.1-1.94 3.3-4.8 3.3-8.31z" />
            <path fill="#FBBC05" d="M5.25 14.5c-.25-.75-.4-1.55-.4-2.5s.15-1.75.4-2.5L1.48 6.58C.54 8.21 0 10.04 0 12s.54 3.79 1.48 5.42l3.77-2.92z" />
            <path fill="#34A853" d="M12 23c3.24 0 5.97-1.08 7.96-2.92l-3.58-2.78c-1 .67-2.28 1.07-3.72 1.07-3.16 0-5.82-2.38-6.75-5.46l-3.77 2.92C3.42 20.32 7.37 23 12 23z" />
          </svg>
          Sign In with Google
        </button>

        {/* Register footer */}
        <p className="mt-8 text-center text-xs text-gray-500">
          Don't have an account?{' '}
          <button 
            onClick={() => navigate('register')} 
            className="font-bold text-blue-600 hover:underline"
          >
            Create an account
          </button>
        </p>

        {/* Demo Credentials Tip box */}
        <div className="mt-6 rounded-xl bg-blue-50/50 p-3.5 text-[11px] text-blue-700 leading-normal">
          <p className="font-bold mb-1">💡 Demo Accounts Ready:</p>
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>sarah.j@edu.org</strong> (Educator profile)</li>
            <li><strong>marcus.chen@tech.com</strong> (Designer profile)</li>
          </ul>
        </div>

      </div>
    </div>
  );
};
