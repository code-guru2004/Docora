/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Mail, Lock, User as UserIcon, BookOpen, Sparkles } from 'lucide-react';

export const RegisterView: React.FC = () => {
  const { register, navigate } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) {
      setErrors('Please fill in all registration fields.');
      return;
    }
    if (password !== confirmPassword) {
      setErrors('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setErrors('Password must be at least 6 characters long.');
      return;
    }

    const success = register(name.trim(), email.trim());
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
            Create an Account
          </h2>
          <p className="mt-1.5 text-xs text-gray-500">
            Join our global community of textbook creators and researchers
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
            <label className="text-xs font-bold text-gray-500">Full Name</label>
            <div className="relative">
              <UserIcon className="absolute top-1/2 left-3.5 h-4.5 w-4.5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="e.g. Jean Dupont"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pr-4 pl-10 text-sm font-medium text-gray-950 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50"
                id="register-name-input"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500">Email Address</label>
            <div className="relative">
              <Mail className="absolute top-1/2 left-3.5 h-4.5 w-4.5 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                placeholder="e.g. jean.d@cloud.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pr-4 pl-10 text-sm font-medium text-gray-950 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50"
                id="register-email-input"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500">Password</label>
            <div className="relative">
              <Lock className="absolute top-1/2 left-3.5 h-4.5 w-4.5 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                placeholder="Create password (min 6 chars)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pr-4 pl-10 text-sm font-medium text-gray-950 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50"
                id="register-password-input"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute top-1/2 left-3.5 h-4.5 w-4.5 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pr-4 pl-10 text-sm font-medium text-gray-950 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50"
                id="register-confirm-password-input"
                required
              />
            </div>
          </div>

          {/* Email ready badge note */}
          <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-3 text-[10px] text-emerald-800 leading-normal">
            ✨ <strong>Ready for Verification:</strong> An automatic sandbox validation token will be allocated. No real inbox click is required in preview.
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-md hover:bg-blue-700 transition-colors"
          >
            Create Free Account
          </button>

        </form>

        {/* Login footer */}
        <p className="mt-8 text-center text-xs text-gray-500">
          Already have an account?{' '}
          <button 
            onClick={() => navigate('login')} 
            className="font-bold text-blue-600 hover:underline"
          >
            Sign in instead
          </button>
        </p>

      </div>
    </div>
  );
};
