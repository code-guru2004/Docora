/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toast, hideToast } = useApp();

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        hideToast();
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [toast, hideToast]);

  if (!toast) return null;

  const styles = {
    success: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    error: 'bg-rose-50 text-rose-800 border-rose-200',
    info: 'bg-blue-50 text-blue-800 border-blue-200'
  };

  const icons = {
    success: <CheckCircle className="h-5 w-5 text-emerald-600" />,
    error: <AlertCircle className="h-5 w-5 text-rose-600" />,
    info: <Info className="h-5 w-5 text-blue-600" />
  };

  return (
    <div 
      className="fixed bottom-6 right-6 z-50 flex max-w-sm items-center gap-3 rounded-xl border p-4 shadow-xl backdrop-blur-md transition-all duration-300 animate-slide-in-right"
      style={{
        animation: 'slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards'
      }}
    >
      {/* Dynamic Keyframes injected into style */}
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateY(1rem) scale(0.95);
            opacity: 0;
          }
          to {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }
      `}</style>

      <div className={`flex w-full items-start gap-3 rounded-xl border px-4 py-3 ${styles[toast.type]}`}>
        <div className="shrink-0">{icons[toast.type]}</div>
        <div className="flex-1 text-sm font-medium leading-normal">{toast.message}</div>
        <button 
          onClick={hideToast}
          className="shrink-0 rounded-lg p-0.5 hover:bg-black/5 text-gray-400 hover:text-gray-700 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
