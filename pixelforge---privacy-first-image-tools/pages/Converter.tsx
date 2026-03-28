import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ToolLayout } from '../components/ToolLayout';
import { ImageUploader } from '../components/ImageUploader';
import { Button } from '../components/Button';
import { TOOLS } from '../constants';
import { downloadImage, readFileAsDataURL, loadImage } from '../utils/imageUtils';
import { Download, ArrowRight } from 'lucide-react';

export const Converter = () => {
  const [searchParams] = useSearchParams();
  const targetFormat = searchParams.get('to') || 'png';
  const [file, setFile] = useState<File | null>(null);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Find tool definition or generic fallback
  const toolInfo = TOOLS.find(t => t.path.includes(`to=${targetFormat}`)) || {
    id: 'converter', // Fallback ID
    name: 'Image Converter',
    description: `Convert images to ${targetFormat.toUpperCase()}`,
    icon: TOOLS[4].icon
  };

  const handleFileSelect = async (selectedFile: File) => {
    setFile(selectedFile);
    setIsProcessing(true);
    try {
      const dataUrl = await readFileAsDataURL(selectedFile);
      const img = await loadImage(dataUrl);
      
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      
      // Handle transparency for JPG
      if (targetFormat === 'jpg' || targetFormat === 'jpeg') {
        if (ctx) {
            ctx.fillStyle = '#FFFFFF'; // White background for JPG
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
      }
      
      ctx?.drawImage(img, 0, 0);
      
      const mimeType = `image/${targetFormat === 'jpg' ? 'jpeg' : targetFormat}`;
      const newUrl = canvas.toDataURL(mimeType, 0.9);
      setOutputUrl(newUrl);
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => {
    setFile(null);
    setOutputUrl(null);
  };

  const content = (
    <div className="p-8 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/30">
      <div className="max-w-3xl mx-auto prose dark:prose-invert">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Fast & Secure Image Converter</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          Convert your images between JPG, PNG, and WebP formats instantly. 
          Whether you need a transparent background (PNG), a smaller file size (JPG/WebP), 
          or high compatibility, our tool handles it all directly in your browser.
        </p>
        
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">Supported Conversions</h3>
        <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-400 mb-6">
          <li><strong>JPG to PNG:</strong> Perfect for removing compression artifacts or preparing for editing.</li>
          <li><strong>PNG to JPG:</strong> Ideal for reducing file size when transparency isn't needed.</li>
          <li><strong>To WebP:</strong> Convert any image to the modern, high-efficiency WebP format for faster websites.</li>
        </ul>

        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">Privacy First</h3>
        <p className="text-slate-600 dark:text-slate-400">
          Unlike other converters that require you to upload files to a server, PixelForge processes 
          everything locally on your device. Your photos remain 100% private and secure.
        </p>
      </div>
    </div>
  );

  if (!file) {
    return (
      <ToolLayout title={toolInfo.name} description={toolInfo.description} icon={toolInfo.icon} toolId={toolInfo.id}>
        <div className="p-8">
          <ImageUploader onImageSelect={handleFileSelect} />
        </div>
        {content}
      </ToolLayout>
    );
  }

  return (
    <ToolLayout title={toolInfo.name} description={toolInfo.description} icon={toolInfo.icon} onReset={reset} toolId={toolInfo.id}>
      <div className="p-8 flex flex-col items-center">
        <div className="flex items-center justify-center gap-8 w-full mb-8">
           <div className="text-center">
             <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center mb-2 border border-slate-200 dark:border-slate-700">
                <span className="text-xl font-bold text-slate-400 uppercase">{file.name.split('.').pop()}</span>
             </div>
             <p className="text-sm text-slate-500">Original</p>
           </div>
           
           <ArrowRight className="w-8 h-8 text-primary-500 animate-pulse" />
           
           <div className="text-center">
             <div className="w-24 h-24 bg-primary-50 dark:bg-primary-900/20 rounded-xl flex items-center justify-center mb-2 border border-primary-100 dark:border-primary-800">
                <span className="text-xl font-bold text-primary-600 dark:text-primary-400 uppercase">{targetFormat}</span>
             </div>
             <p className="text-sm text-slate-500">Converted</p>
           </div>
        </div>

        {outputUrl && (
          <Button 
            size="lg" 
            onClick={() => downloadImage(outputUrl!, `converted.${targetFormat}`)}
            className="w-full max-w-md"
          >
            <Download className="w-4 h-4 mr-2" /> Download {targetFormat.toUpperCase()}
          </Button>
        )}
        
        <div className="mt-8 w-full max-w-2xl bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-700 overflow-hidden">
           <p className="text-xs text-slate-500 mb-2 uppercase font-bold">Preview</p>
           {outputUrl && <img src={outputUrl} alt="Preview" className="mx-auto max-h-[300px] object-contain" />}
        </div>
      </div>
      {content}
    </ToolLayout>
  );
};