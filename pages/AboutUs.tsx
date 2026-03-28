import React from 'react';
import { Info } from 'lucide-react';

export const AboutUs = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white dark:bg-dark-800 rounded-2xl p-8 md:p-12 shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-3 mb-6">
            <Info className="w-8 h-8 text-primary-600" />
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">About Us</h1>
        </div>
        <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300">
          <p className="text-lg leading-relaxed">
            PixelForge was born from a simple idea: <strong>Image tools should be fast, free, and private.</strong>
          </p>
          
          <p>
            In a world where every click is tracked and every file uploaded to a mysterious cloud server, we wanted to build something different. 
            We engineered PixelForge to run entirely in your web browser. This means when you use our Image Compressor, Cropper, or Converter, 
            your photos strictly stay on your device. They are never sent to our servers, ensuring 100% privacy and security.
          </p>

          <h3>Our Mission</h3>
          <p>
            Our mission is to provide high-quality, professional-grade image manipulation tools to everyone, for free. 
            Whether you are a web developer optimizing assets, a photographer watermarking your work, or just someone making a meme, 
            PixelForge is designed for you.
          </p>

          <h3>Why Choose PixelForge?</h3>
          <ul>
            <li><strong>Privacy First:</strong> No server uploads. Zero data collection.</li>
            <li><strong>Speed:</strong> Instant processing using WebAssembly and HTML5 Canvas.</li>
            <li><strong>Accessibility:</strong> Works on any device, entirely for free.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};