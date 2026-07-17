/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AlertTriangle, Send, FileText, Mail, ShieldCheck, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const DmcaView: React.FC = () => {
  const { navigate, showToast } = useApp();

  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [infringedUrl, setInfringedUrl] = useState('');
  const [description, setDescription] = useState('');
  const [declaration, setDeclaration] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !infringedUrl || !description || !declaration) {
      showToast('Please fill out all required fields and accept the declaration statement.', 'error');
      return;
    }

    setIsSubmitted(true);
    showToast('Simulated DMCA Takedown notice received. Our legal department has logged this filing.', 'success');
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 lg:px-8 font-sans">
      
      {/* Header section */}
      <div className="border-b border-gray-100 pb-8 text-center sm:text-left">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 mb-4">
          <AlertTriangle className="h-6 w-6 animate-bounce" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">Copyright / DMCA Takedown policy</h1>
        <p className="mt-3 text-sm text-gray-500 leading-relaxed max-w-2xl">
          DocShare respects intellectual property laws and expects its users to do the same. In compliance with the Digital Millennium Copyright Act of 1998 (DMCA), we respond rapidly to claims of infringement.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-5">
        
        {/* Filing Instructions */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <FileText className="h-4.5 w-4.5 text-blue-600" />
              Requirements for a Valid Claim
            </h3>
            <p className="mt-2.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">The DMCA requires that all notices include:</p>
            <ul className="mt-3 space-y-2.5 text-xs font-medium text-gray-500 list-disc list-inside">
              <li>Electronic or physical signature of the copyright holder.</li>
              <li>Identification of the copyrighted work claimed to be infringed.</li>
              <li>URL links to the specific infringing material hosted on our platform.</li>
              <li>A statement of good faith belief.</li>
              <li>A declaration of penalty of perjury confirming truthfulness.</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <Mail className="h-4.5 w-4.5 text-indigo-600" />
              Designated Agent details
            </h3>
            <p className="mt-3 text-xs font-medium text-gray-600 leading-relaxed">
              DocShare Legal Operations<br />
              Attn: Designated Copyright Agent<br />
              100 University Ave, Suite 400<br />
              San Francisco, CA 94103<br />
              Email: <a href="mailto:copyright@docshare.platform" className="font-semibold text-blue-600 hover:underline">copyright@docshare.platform</a>
            </p>
          </div>
        </div>

        {/* DMCA Submission Form */}
        <div className="lg:col-span-3">
          <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-6">File a Digital Copyright Notice</h3>

            {isSubmitted ? (
              <div className="rounded-2xl bg-emerald-50/50 border border-emerald-100 p-6 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-4">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h4 className="text-sm font-extrabold text-emerald-900">Claim Received Successfully</h4>
                <p className="mt-2 text-xs font-semibold text-emerald-700/80 leading-relaxed">
                  Thank you, {fullName}. A simulated take-down receipt has been dispatched to <strong>{email}</strong>. Our designated copyright agent will review the identified URL within 24–48 hours.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="mt-6 rounded-full border border-emerald-200 bg-white px-5 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-50 transition-colors"
                >
                  File another report
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold uppercase tracking-wide text-gray-400">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Jane Doe"
                      className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs font-semibold outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold uppercase tracking-wide text-gray-400">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="jane@company.com"
                      className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs font-semibold outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold uppercase tracking-wide text-gray-400">Owner or Company Represented</label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Educational Publishing Corp."
                    className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs font-semibold outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold uppercase tracking-wide text-gray-400">Infringing URL on DocShare *</label>
                  <input
                    type="url"
                    required
                    value={infringedUrl}
                    onChange={(e) => setInfringedUrl(e.target.value)}
                    placeholder="https://docshare.platform/documents/12345"
                    className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs font-semibold outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold uppercase tracking-wide text-gray-400">Describe Copyrighted Work & Infringement *</label>
                  <textarea
                    required
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the original textbook chapter, handbook, slide, or sheet, and specify where inside the file the infringement occurs..."
                    className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs font-semibold outline-none focus:border-blue-500 resize-none"
                  />
                </div>

                <div className="flex items-start gap-3 rounded-xl bg-gray-50 p-4 border border-gray-100">
                  <input
                    type="checkbox"
                    id="dmca-declaration"
                    required
                    checked={declaration}
                    onChange={(e) => setDeclaration(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <label htmlFor="dmca-declaration" className="text-[10px] font-semibold text-gray-500 leading-relaxed cursor-pointer select-none">
                    Under penalty of perjury, I declare that I am the authorized copyright holder or legal representative, and that the information in this notification is complete and accurate. *
                  </label>
                </div>

                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-xs font-bold text-white hover:bg-blue-700 transition-colors shadow-sm cursor-pointer"
                >
                  <Send className="h-4 w-4" />
                  Submit Takedown Filing
                </button>
              </form>
            )}

          </div>
        </div>

      </div>

      {/* Bottom Action Bar */}
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

export default DmcaView;
