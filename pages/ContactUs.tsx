import React from 'react';
import { Mail } from 'lucide-react';

export const ContactUs = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white dark:bg-dark-800 rounded-2xl p-8 md:p-12 shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-3 mb-6">
            <Mail className="w-8 h-8 text-primary-600" />
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Contact Us</h1>
        </div>
        <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300">
          <p className="text-lg">
            We'd love to hear from you! Whether you have a suggestion for a new tool, found a bug, or just want to say hello, feel free to reach out.
          </p>

          <div className="my-8 p-6 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Get in Touch</h3>
            <p className="mb-4">For general inquiries, feedback, and support:</p>
            <a href="mailto:contact@pixelforge.app" className="text-primary-600 dark:text-primary-400 font-bold text-xl hover:underline">
              contact@pixelforge.app
            </a>
          </div>

          <h3>Feedback & Suggestions</h3>
          <p>
            PixelForge is constantly evolving. If there is a specific image tool you need that we don't currently offer, let us know. 
            We prioritize new features based on user feedback.
          </p>
        </div>
      </div>
    </div>
  );
};