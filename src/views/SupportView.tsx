/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { HelpCircle, FileText, Download, ShieldAlert, LifeBuoy, Send, BookOpen, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SupportView: React.FC = () => {
  const { navigate, showToast, currentUser } = useApp();

  // Form State
  const [ticketName, setTicketName] = useState('');
  const [ticketEmail, setTicketEmail] = useState('');
  const [topic, setTopic] = useState('Upload Issue');
  const [severity, setSeverity] = useState('Medium');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Sync user info if logged in
  useEffect(() => {
    if (currentUser) {
      setTicketName(currentUser.name);
      setTicketEmail(currentUser.email);
    }
  }, [currentUser]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketName || !ticketEmail || !message) {
      showToast('Please fill out all required fields.', 'error');
      return;
    }

    setIsSubmitted(true);
    showToast('Your Support Ticket has been submitted successfully!', 'success');
  };

  const helpCards = [
    {
      icon: <FileText className="h-5 w-5 text-blue-600" />,
      title: 'Formatting & Uploading',
      desc: 'Learn about maximum file capacities (25MB), compatible format rules (PDF, DOCX, PPTX), and automatic tag generation procedures.',
    },
    {
      icon: <Download className="h-5 w-5 text-indigo-600" />,
      title: 'Downloads & Viewer',
      desc: 'Troubleshoot offline rendering errors, slow download triggers, mobile layout viewport constraints, and password protection issues.',
    },
    {
      icon: <ShieldAlert className="h-5 w-5 text-purple-600" />,
      title: 'Trust & Copyright',
      desc: 'Report plagiarized publications, claim author credits, file copyright takedowns, or request private document toggling restrictions.',
    },
  ];

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 lg:px-8 font-sans">
      
      {/* Header section */}
      <div className="border-b border-gray-100 pb-8 text-center sm:text-left">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-600 mb-4">
          <LifeBuoy className="h-6 w-6 animate-spin" style={{ animationDuration: '4s' }} />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">Support Helpdesk</h1>
        <p className="mt-3 text-sm text-gray-500 leading-relaxed max-w-2xl">
          Need assistance? Submit a question to our community helpdesk or search our troubleshooting archive for fast solutions.
        </p>
      </div>

      {/* Grid of helper resources */}
      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
        {helpCards.map((card, idx) => (
          <div key={idx} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs hover:border-gray-200 transition-all flex flex-col justify-between">
            <div>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-50 mb-4">
                {card.icon}
              </div>
              <h3 className="text-sm font-bold text-gray-900">{card.title}</h3>
              <p className="mt-2 text-xs font-medium leading-relaxed text-gray-500">
                {card.desc}
              </p>
            </div>
            <button
              onClick={() => showToast('Knowledge base details will be fully written shortly.', 'info')}
              className="mt-4 text-[11px] font-bold text-blue-600 hover:text-blue-700 text-left transition-colors cursor-pointer"
            >
              Browse Articles →
            </button>
          </div>
        ))}
      </div>

      {/* Ticket & Contact Section */}
      <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-5">
        
        {/* Ticket Submission form */}
        <div className="lg:col-span-3">
          <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Create a Support Ticket</h3>

            {isSubmitted ? (
              <div className="rounded-2xl bg-sky-50/50 border border-sky-100 p-6 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-sky-100 text-sky-600 mb-4">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <h4 className="text-sm font-extrabold text-sky-900">Ticket Dispatched Successfully</h4>
                <p className="mt-2 text-xs font-semibold text-sky-700/80 leading-relaxed">
                  Thank you, {ticketName}. A support ticket tracker has been logged under <strong>#{Math.floor(100000 + Math.random() * 900000)}</strong> and routed to our support squad.
                </p>
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setMessage('');
                  }}
                  className="mt-6 rounded-full border border-sky-200 bg-white px-5 py-2 text-xs font-bold text-sky-700 hover:bg-sky-50 transition-colors cursor-pointer"
                >
                  Create another ticket
                </button>
              </div>
            ) : (
              <form onSubmit={handleTicketSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold uppercase tracking-wide text-gray-400">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={ticketName}
                      onChange={(e) => setTicketName(e.target.value)}
                      placeholder="Jane Doe"
                      className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs font-semibold outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold uppercase tracking-wide text-gray-400">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={ticketEmail}
                      onChange={(e) => setTicketEmail(e.target.value)}
                      placeholder="jane@example.com"
                      className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs font-semibold outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold uppercase tracking-wide text-gray-400">Inquiry Topic</label>
                    <select
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs font-semibold outline-none focus:border-blue-500 bg-white cursor-pointer"
                    >
                      <option value="Upload Issue">Upload Issue & Formatting</option>
                      <option value="Viewer Crash">Viewer & Reader Glitches</option>
                      <option value="Account Access">Account & Security</option>
                      <option value="Copyright/Flag">Report Infringement</option>
                      <option value="Other">General Question</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold uppercase tracking-wide text-gray-400">Urgency Severity</label>
                    <select
                      value={severity}
                      onChange={(e) => setSeverity(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs font-semibold outline-none focus:border-blue-500 bg-white cursor-pointer"
                    >
                      <option value="Low">Low - General Feedback</option>
                      <option value="Medium">Medium - Standard Inquiry</option>
                      <option value="High">High - Critical System Bug</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold uppercase tracking-wide text-gray-400">Detailed Message *</label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us exactly what went wrong or ask a question. Please include specific browser details or file sizes if applicable..."
                    className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs font-semibold outline-none focus:border-blue-500 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-xs font-bold text-white hover:bg-blue-700 transition-colors shadow-sm cursor-pointer animate-pulse-subtle"
                >
                  <Send className="h-4 w-4" />
                  Dispatch Helpdesk Ticket
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Live Support Indicators & Sidebars */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs">
            <h4 className="text-xs font-extrabold uppercase tracking-wide text-gray-400">Live Support metrics</h4>
            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-emerald-500" /> Average Response Time
                </span>
                <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">~12 minutes</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                  <BookOpen className="h-4 w-4 text-indigo-500" /> Resolved Tickets Today
                </span>
                <span className="text-xs font-extrabold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">341 cases</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                  <AlertCircle className="h-4 w-4 text-blue-500" /> Current System Load
                </span>
                <span className="text-xs font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">Normal</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-blue-100 bg-blue-50/15 p-6 border-dashed">
            <h4 className="text-xs font-extrabold text-blue-900">Educator Hotline Access</h4>
            <p className="mt-2 text-[11px] font-semibold text-blue-700/80 leading-relaxed">
              Verified professors and administrative staff can request premium phone hotline help. Verify your credentials in your profile setting menu to unlock fast track hotlines.
            </p>
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

export default SupportView;
