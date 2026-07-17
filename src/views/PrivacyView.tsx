/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { Shield, Eye, Lock, Globe, FileText, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const PrivacyView: React.FC = () => {
  const { navigate } = useApp();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const sections = [
    {
      icon: <Eye className="h-5 w-5 text-blue-600" />,
      title: 'Information We Collect',
      content: 'We collect information you provide directly to us when creating an account, uploading academic materials, submitting support requests, or communicating with us. This includes name, email address, bio descriptions, social links, and uploaded document metadata.',
    },
    {
      icon: <Lock className="h-5 w-5 text-indigo-600" />,
      title: 'How We Protect Your Data',
      content: 'We implement top-tier technical and organizational security standards to safeguard your personal data against unauthorized access, loss, or alteration. All file transfers are secured using Transport Layer Security (TLS) encryption, and password data is hashed.',
    },
    {
      icon: <Globe className="h-5 w-5 text-purple-600" />,
      title: 'Sharing and Public Visibility',
      content: 'By default, any study guides, spreadsheets, or publications you upload to DocShare are designated as Public and discoverable by our global search engine. You can change visibility to Private in your Dashboard, hiding the document from other users.',
    },
    {
      icon: <FileText className="h-5 w-5 text-emerald-600" />,
      title: 'Cookies and Analytics',
      content: 'We use local state structures, session tokens, and security cookies to authenticate your identity, remember preferences, and analyze platform traffic. This helps prevent spamming, tracks unique document views, and optimizes responsive screen performance.',
    },
  ];

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 lg:px-8 font-sans">
      {/* Header section */}
      <div className="border-b border-gray-100 pb-8 text-center sm:text-left">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 mb-4">
          <Shield className="h-6 w-6" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">Privacy Policy</h1>
        <p className="mt-3 text-sm text-gray-500 leading-relaxed max-w-2xl">
          Last updated: July 17, 2026. Your privacy and trust are paramount. Learn how DocShare protects your academic content and personal details.
        </p>
      </div>

      {/* Grid of highlight sections */}
      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {sections.map((sec, idx) => (
          <div key={idx} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs hover:border-gray-200 transition-all">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gray-50">
                {sec.icon}
              </div>
              <h3 className="text-sm font-bold text-gray-900">{sec.title}</h3>
            </div>
            <p className="mt-3 text-xs font-medium leading-relaxed text-gray-500">
              {sec.content}
            </p>
          </div>
        ))}
      </div>

      {/* Deep Policy Text Content */}
      <div className="mt-12 space-y-8 text-xs font-medium leading-relaxed text-gray-600">
        <section className="space-y-3">
          <h2 className="text-sm font-extrabold text-gray-900">1. Core Data Principles</h2>
          <p>
            At DocShare, we believe in radical transparency regarding the files you share and read. We do not sell, rent, or lease your personal identifiers, contact directories, or reading histories to third-party advertisers or commercial brokers. All usage tracking (such as views, downloads, and unique reader counters) is carried out strictly to generate academic stats for educators and authors.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-sm font-extrabold text-gray-900">2. User Controls and Choice</h2>
          <p>
            You retain absolute ownership over all original educational publications and notes you publish on DocShare. You can update, modify, toggle public visibility, or completely purge any of your uploaded files directly from your dynamic dashboard. Purged files are immediately removed from active database query lines and public search results.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-sm font-extrabold text-gray-900">3. Underage Users and Safety</h2>
          <p>
            DocShare is designed for university students, educators, research scientists, and adult study communities. We do not knowingly collect or target information from children under the age of 13. If we discover that a user under 13 has registered an account, we will take immediate measures to terminate the profile and erase associated personal files.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-sm font-extrabold text-gray-900">4. Contact and Governance</h2>
          <p>
            If you have any questions or formal concerns regarding this Privacy Policy, your cached profile tokens, or compliance standards, please contact our privacy compliance desk through our Support Helpdesk or submit an inquiry to <a href="mailto:privacy@docshare.platform" className="font-semibold text-blue-600 hover:underline">privacy@docshare.platform</a>.
          </p>
        </section>
      </div>

      {/* Trust reassurance footer card */}
      <div className="mt-12 rounded-3xl border border-blue-100 bg-blue-50/20 p-6 flex flex-col sm:flex-row items-center gap-5">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
          <CheckCircle className="h-5 w-5" />
        </div>
        <div>
          <h4 className="text-xs font-extrabold text-blue-900">DocShare GDPR & CCPA Compliance Statement</h4>
          <p className="mt-1 text-[11px] font-semibold text-blue-700/80 leading-relaxed">
            We support complete data portability and the "right to be forgotten." You can export your entire publication list or request account deletion at any time with a single click.
          </p>
        </div>
      </div>

      {/* Bottom action bar */}
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

export default PrivacyView;
