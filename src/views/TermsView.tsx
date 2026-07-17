/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { Scale, FileSpreadsheet, ShieldAlert, BookOpen, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const TermsView: React.FC = () => {
  const { navigate } = useApp();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const provisions = [
    {
      icon: <BookOpen className="h-5 w-5 text-blue-600" />,
      title: '1. User Account Responsibility',
      content: 'When registering on DocShare, you must provide authentic credentials. You are entirely responsible for all publications uploaded and actions registered under your session ID. Protect your login details to safeguard account integrity.',
    },
    {
      icon: <FileSpreadsheet className="h-5 w-5 text-indigo-600" />,
      title: '2. Published Content Licensing',
      content: 'By uploading worksheets, spreadsheets, and notes on DocShare, you grant us a worldwide, non-exclusive license to host, parse, cache, and display the files for viewing and download. You warrant that you hold appropriate copyright privileges.',
    },
    {
      icon: <ShieldAlert className="h-5 w-5 text-purple-600" />,
      title: '3. Acceptable Platform Conduct',
      content: 'Users are strictly forbidden from uploading plagiarized work, classified blueprints, academic testing keys, spam resources, adult graphics, malware scripts, or files infringing third-party proprietary trade rights.',
    },
    {
      icon: <AlertCircle className="h-5 w-5 text-rose-600" />,
      title: '4. Limitation of Service Liabilities',
      content: 'DocShare serves as a peer-to-peer file sharing and indexing utility. We provide no guarantee regarding the scientific accuracy, syllabus compliance, or completeness of user-uploaded files. Materials are provided strictly "as is."',
    },
  ];

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 lg:px-8 font-sans">
      {/* Header section */}
      <div className="border-b border-gray-100 pb-8 text-center sm:text-left">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 mb-4">
          <Scale className="h-6 w-6" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">Terms of Service</h1>
        <p className="mt-3 text-sm text-gray-500 leading-relaxed max-w-2xl">
          Last updated: July 17, 2026. Review the legal covenants governing publication uploads, downloads, and account behaviors on DocShare.
        </p>
      </div>

      {/* Grid of highlights */}
      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {provisions.map((prov, idx) => (
          <div key={idx} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs hover:border-gray-200 transition-all">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gray-50">
                {prov.icon}
              </div>
              <h3 className="text-sm font-bold text-gray-900">{prov.title}</h3>
            </div>
            <p className="mt-3 text-xs font-medium leading-relaxed text-gray-500">
              {prov.content}
            </p>
          </div>
        ))}
      </div>

      {/* Deep legal prose */}
      <div className="mt-12 space-y-8 text-xs font-medium leading-relaxed text-gray-600">
        <section className="space-y-3">
          <h2 className="text-sm font-extrabold text-gray-900">5. Service Accessibility & Termination</h2>
          <p>
            We reserve the right to temporarily modify, throttle, or permanently shut down portions of the DocShare file database, study guides list, or cloud services with or without notice. Accounts found consistently publishing academic keys, testing solutions, or materials flagged for copyright violations will be terminated immediately.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-sm font-extrabold text-gray-900">6. Indemnification Clause</h2>
          <p>
            You agree to defend, indemnify, and hold harmless DocShare Inc., its board of advisors, contributors, developers, and licensing partners from any financial litigation, loss, or intellectual damage resulting from your upload list, your usage of shared scientific documents, or any direct breach of these Terms of Service.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-sm font-extrabold text-gray-900">7. Governance Jurisdiction</h2>
          <p>
            These Terms, along with any separate service guidelines or specific feature rules, shall be governed by, construed, and enforced in accordance with the laws of the State of California, United States, without regard to conflicts of law criteria.
          </p>
        </section>
      </div>

      {/* Reassurance footer bar */}
      <div className="mt-12 flex justify-center border-t border-gray-100 pt-8">
        <button
          onClick={() => navigate('home')}
          className="rounded-full bg-blue-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-blue-700 transition-colors shadow-sm cursor-pointer"
        >
          Return to Home View
        </button>
      </div>
    </div>
  );
};

export default TermsView;
