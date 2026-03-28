import React, { useState, useEffect } from 'react';
import { ToolLayout } from '../components/ToolLayout';
import { ImageUploader } from '../components/ImageUploader';
import { Button } from '../components/Button';
import { TOOLS } from '../constants';
import { formatBytes, downloadImage, readFileAsDataURL, loadImage } from '../utils/imageUtils';
import { Download, CheckCircle, AlertCircle } from 'lucide-react';

export const Compressor = () => {
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState(0.8);
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const [compressedPreview, setCompressedPreview] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);

  const toolInfo = TOOLS.find(t => t.id === 'compress')!;

  useEffect(() => {
    if (file) {
      compressImage(file, quality);
    }
  }, [quality]);

  const handleFileSelect = async (selectedFile: File) => {
    setFile(selectedFile);
    setOriginalSize(selectedFile.size);
    compressImage(selectedFile, quality);
  };

  const compressImage = async (inputFile: File, qual: number) => {
    setIsCompressing(true);
    try {
      const dataUrl = await readFileAsDataURL(inputFile);
      const img = await loadImage(dataUrl);
      
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0);

      // Compress depending on type, force jpeg/webp for compression if png
      const outputType = inputFile.type === 'image/png' ? 'image/jpeg' : inputFile.type;
      const compressedDataUrl = canvas.toDataURL(outputType, qual);
      
      setCompressedPreview(compressedDataUrl);
      
      // Calculate approximate size from base64
      const strLength = compressedDataUrl.length - 'data:image/jpeg;base64,'.length;
      const sizeInBytes = 4 * Math.ceil((strLength / 3)) * 0.5624896334383812;
      setCompressedSize(Math.floor(sizeInBytes));
      
    } catch (e) {
      console.error(e);
    } finally {
      setIsCompressing(false);
    }
  };

  const getSavings = () => {
    if (!originalSize || !compressedSize) return 0;
    const saving = ((originalSize - compressedSize) / originalSize) * 100;
    return saving.toFixed(1);
  };

  const reset = () => {
    setFile(null);
    setCompressedPreview(null);
    setQuality(0.8);
  };

  const content = (
    <div className="p-8 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/30">
      <div className="max-w-3xl mx-auto prose dark:prose-invert">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Free Online Image Compressor</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          Reduce the file size of your images instantly without compromising on quality. 
          Our tool runs entirely in your browser, meaning your photos are never uploaded to a server. 
          This ensures 100% privacy and lightning-fast compression.
        </p>
        
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">How to Compress Images?</h3>
        <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-400 mb-6">
          <li>Upload your JPG, PNG, or WebP image.</li>
          <li>Adjust the quality slider to balance between file size and visual quality.</li>
          <li>Preview the compressed image side-by-side.</li>
          <li>Click "Download" to save the optimized image to your device.</li>
        </ul>

        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">Why Compress Images?</h3>
        <p className="text-slate-600 dark:text-slate-400">
          Compressed images load faster on websites, take up less storage space on your device, 
          and are easier to share via email or social media. Using our tool, you can reduce image size by up to 80% 
          while maintaining excellent visual quality.
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
      <div className="grid lg:grid-cols-2 gap-8 p-6">
        <div className="space-y-6">
           <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
             <h3 className="font-semibold mb-4 text-slate-900 dark:text-white">Compression Settings</h3>
             <div className="space-y-4">
                <div className="flex justify-between">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Quality Level</label>
                  <span className="text-sm text-slate-500">{Math.round(quality * 100)}%</span>
                </div>
                <input 
                  type="range" 
                  min="0.1" 
                  max="1.0" 
                  step="0.05" 
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary-600"
                />
                <p className="text-xs text-slate-500">Lower quality = smaller file size.</p>
             </div>
           </div>

           <div className="grid grid-cols-2 gap-4">
             <div className="p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-center">
                <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Original</p>
                <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">{formatBytes(originalSize)}</p>
             </div>
             <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-center">
                <p className="text-xs text-green-700 dark:text-green-400 uppercase tracking-wider font-bold">Compressed</p>
                <p className="text-xl font-bold text-green-700 dark:text-green-400 mt-1">{formatBytes(compressedSize)}</p>
             </div>
           </div>

           {Number(getSavings()) > 0 && (
             <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/10 p-3 rounded-lg">
               <CheckCircle className="w-5 h-5" />
               <span className="font-medium">You saved {getSavings()}%!</span>
             </div>
           )}

           <Button 
            size="lg" 
            className="w-full" 
            onClick={() => compressedPreview && downloadImage(compressedPreview, `compressed-${file.name}`)}
            disabled={isCompressing}
           >
             <Download className="w-4 h-4 mr-2" /> Download Compressed Image
           </Button>
        </div>

        <div className="bg-slate-100 dark:bg-black/40 rounded-xl flex items-center justify-center p-4 border border-slate-200 dark:border-slate-800 overflow-hidden h-[400px] lg:h-auto">
           {isCompressing ? (
             <div className="flex flex-col items-center text-slate-500">
               <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-2"></div>
               <span>Compressing...</span>
             </div>
           ) : compressedPreview ? (
             <img 
              src={compressedPreview} 
              alt="Compressed Preview" 
              className="max-w-full max-h-full object-contain shadow-lg rounded" 
             />
           ) : null}
        </div>
      </div>
      {content}
    </ToolLayout>
  );
};