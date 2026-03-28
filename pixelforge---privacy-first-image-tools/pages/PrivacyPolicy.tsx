import React from 'react';
import { Shield } from 'lucide-react';

export const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white dark:bg-dark-800 rounded-2xl p-8 md:p-12 shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-3 mb-6">
            <Shield className="w-8 h-8 text-primary-600" />
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Privacy Policy</h1>
        </div>
        <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300">
          <p>Last updated: {new Date().toLocaleDateString()}</p>

          <h3>1. Introduction</h3>
          <p>Welcome to PixelForge ("we," "our," or "us"). We are committed to protecting your privacy. This Privacy Policy explains how your information is handled when you use our website and image tools.</p>

          <h3>2. Data Collection and Image Processing</h3>
          <p><strong>We do not collect, store, or upload your images to any server.</strong></p>
          <p>All image processing operations (compression, cropping, resizing, converting, etc.) are performed locally within your web browser using HTML5 and WebAssembly technologies. Your files never leave your device.</p>

          <h3>3. Personal Information</h3>
          <p>We do not require you to create an account to use our tools. We do not collect personal identification information (Name, Email, Phone Number) unless you voluntarily submit it to us via email for support inquiries.</p>

          <h3>4. Cookies and Local Storage</h3>
          <p>We use local storage to save your preferences (such as Dark Mode toggle). We may use third-party analytics tools (like Google Analytics) to understand website traffic trends. These tools may use cookies to collect anonymous usage data.</p>

          <h3>5. Third-Party Links</h3>
          <p>Our website may contain links to other websites. We are not responsible for the privacy practices of these external sites.</p>

          <h3>6. Advertising</h3>
          <p>We may use third-party advertising companies (such as Google AdSense) to serve ads when you visit our website. These companies may use information (not including your name, address, email address, or telephone number) about your visits to this and other websites in order to provide advertisements about goods and services of interest to you.</p>

          <h3>7. Changes to This Policy</h3>
          <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.</p>

          <h3>8. Contact Us</h3>
          <p>If you have any questions about this Privacy Policy, please contact us at: privacy@pixelforge.app</p>
        </div>
      </div>
    </div>
  );
};