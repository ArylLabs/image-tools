import React from 'react';
import { FileText } from 'lucide-react';

export const TermsOfService = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white dark:bg-dark-800 rounded-2xl p-8 md:p-12 shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-3 mb-6">
            <FileText className="w-8 h-8 text-primary-600" />
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Terms of Service</h1>
        </div>
        <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300">
           <p>Last updated: {new Date().toLocaleDateString()}</p>

          <h3>1. Acceptance of Terms</h3>
          <p>By accessing and using PixelForge, you accept and agree to be bound by the terms and provision of this agreement.</p>

          <h3>2. Use License</h3>
          <p>Permission is granted to temporarily use the materials (image tools) on PixelForge's website for personal, non-commercial transitory viewing and processing.</p>

          <h3>3. Disclaimer</h3>
          <p>The materials on PixelForge's website are provided "as is". PixelForge makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties, including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>

          <h3>4. Limitations</h3>
          <p>In no event shall PixelForge or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on PixelForge's Internet site.</p>

          <h3>5. User Conduct</h3>
          <p>You agree not to use the website for any unlawful purpose or any purpose prohibited under this clause. You agree not to use the website in any way that could damage the website, the services, or the general business of PixelForge.</p>

          <h3>6. Governing Law</h3>
          <p>Any claim relating to PixelForge's website shall be governed by the laws of the site owner's jurisdiction without regard to its conflict of law provisions.</p>
        </div>
      </div>
    </div>
  );
};