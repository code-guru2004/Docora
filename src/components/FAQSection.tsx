/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    question: 'How do I upload and share a new document?',
    answer: 'Simply log in to your account and click on the "Upload" tab in the navigation bar. You can drag and drop your files or browse your local directory. We accept PDF files, Word documents, PowerPoint presentations, and Excel spreadsheets up to 25 MB in size.',
  },
  {
    question: 'Can I keep some of my uploaded files private?',
    answer: 'Yes! By default, all uploaded documents are set to public so that the academic community can discover them. However, you can toggle any of your documents to "Private" in your Dashboard view at any time. Private files are only visible to you.',
  },
  {
    question: 'How is document conversion and viewing tracked?',
    answer: 'We track views, downloads, and likes securely. To prevent spamming and maintain real statistics, we filter out repeated hits from the same user session and track unique views based on authenticated user IDs or secure anonymous guest sessions.',
  },
  {
    question: 'Can I import files from third-party cloud drives?',
    answer: 'Absolutely! Our platform integrates with standard file uploaders and supports various device folders. If your Google Account is connected via Google Workspace oauth, you can also select research notes directly from your linked Google Drive.',
  },
  {
    question: 'Are there any fees or premium paywalls for downloading materials?',
    answer: 'No. All uploaded publications and study templates on our platform are open-access resources provided by volunteer researchers and professors. There are no dynamic paywalls or subscription charges for basic browsing and reading.',
  },
];

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl flex items-center justify-center gap-2">
          <HelpCircle className="h-7 w-7 text-blue-600 shrink-0" />
          Frequently Asked Questions
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-gray-500">
          Have questions about file formats, authorship rights, or account setups? Find fast answers here.
        </p>
      </div>

      <div className="mt-10 space-y-4">
        {FAQS.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="group rounded-2xl border border-gray-100 bg-white shadow-sm hover:border-gray-200 transition-all duration-300 overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(idx)}
                className="flex w-full items-center justify-between px-6 py-5 text-left font-sans text-sm font-bold text-gray-800 transition-colors hover:text-blue-600 focus:outline-none cursor-pointer"
                id={`faq-toggle-${idx}`}
              >
                <span className="pr-4 leading-relaxed">{faq.question}</span>
                <ChevronDown
                  className={`h-4.5 w-4.5 shrink-0 text-gray-400 group-hover:text-blue-500 transition-transform duration-300 ${
                    isOpen ? 'rotate-180 text-blue-600' : ''
                  }`}
                />
              </button>

              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  isOpen ? 'max-h-[300px] border-t border-gray-50 px-6 py-5 bg-gray-50/20' : 'max-h-0'
                }`}
              >
                <p className="text-xs font-medium leading-relaxed text-gray-500">
                  {faq.answer}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default FAQSection;
