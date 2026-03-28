import React, { useState } from 'react';
import { ToolLayout } from '../components/ToolLayout';
import { ImageUploader } from '../components/ImageUploader';
import { Button } from '../components/Button';
import { TOOLS } from '../constants';
import { readFileAsDataURL, loadImage, downloadImage } from '../utils/imageUtils';
import { Download, ShieldCheck } from 'lucide-react';

export const ExifRemover = () => {
  const [file, setFile] = useState<File | null>(null);
  const [cleanedUrl, setCleanedUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const toolInfo = TOOLS.find(t => t.id === 'scrubber')!;

  const handleFileSelect = async (selectedFile: File) => {
    setFile(selectedFile);
    setIsProcessing(true);
    try {
        // To strip EXIF, we simply draw to canvas and export.
        const url = await readFileAsDataURL(selectedFile);
        const img = await loadImage(url);
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0);
        
        const newUrl = canvas.toDataURL(selectedFile.type);
        setCleanedUrl(newUrl);
    } catch (e) {
        console.error(e);
    } finally {
        setIsProcessing(false);
    }
  };

  const handleDownload = () => {
      if (cleanedUrl) downloadImage(cleanedUrl, `clean-${file?.name}`);
  };

  const content = (
    <div className="p-8 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/30">
      <div className="max-w-3xl mx-auto prose dark:prose-invert">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Remove EXIF Data Online</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          Photos taken with cameras and smartphones contain hidden data called EXIF (metadata). 
          This can include the date, time, camera settings, and even your precise GPS location.
        </p>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          Use this tool to strip all metadata from your images before sharing them online to protect your privacy.
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
    <ToolLayout title={toolInfo.name} description={toolInfo.description} icon={toolInfo.icon} onReset={() => {setFile(null); setCleanedUrl(null);}} toolId={toolInfo.id}>
       <div className="p-8 text-center">
          <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-2xl inline-block mb-6">
              <ShieldCheck className="w-16 h-16 text-green-600 dark:text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Metadata Removed!</h3>
              <p className="text-slate-600 dark:text-slate-400 mt-2">Your image is now clean and safe to share.</p>
          </div>
          
          <div>
             <Button size="lg" onClick={handleDownload} disabled={isProcessing}>
                 <Download className="w-4 h-4 mr-2" /> Download Clean Image
             </Button>
          </div>
       </div>
       {content}
    </ToolLayout>
  );
};