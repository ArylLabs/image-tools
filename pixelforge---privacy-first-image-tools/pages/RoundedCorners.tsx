import React, { useState, useEffect, useRef } from 'react';
import { ToolLayout } from '../components/ToolLayout';
import { ImageUploader } from '../components/ImageUploader';
import { Button } from '../components/Button';
import { TOOLS } from '../constants';
import { readFileAsDataURL, loadImage, downloadImage } from '../utils/imageUtils';
import { Download, Square, MousePointer } from 'lucide-react';

export const RoundedCorners = () => {
  const [file, setFile] = useState<File | null>(null);
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [radius, setRadius] = useState(10); // Percent
  const [bgTransparent, setBgTransparent] = useState(true);
  const [bgColor, setBgColor] = useState('#ffffff');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const toolInfo = TOOLS.find(t => t.id === 'corners')!;

  const handleFileSelect = async (selectedFile: File) => {
    setFile(selectedFile);
    const url = await readFileAsDataURL(selectedFile);
    setImgSrc(url);
  };

  useEffect(() => {
    if (imgSrc && canvasRef.current) {
      draw();
    }
  }, [imgSrc, radius, bgTransparent, bgColor]);

  const draw = async () => {
    if (!imgSrc || !canvasRef.current) return;
    const img = await loadImage(imgSrc);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = img.width;
    canvas.height = img.height;

    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (!bgTransparent) {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    const r = (Math.min(img.width, img.height) * radius) / 100;

    ctx.beginPath();
    ctx.moveTo(r, 0);
    ctx.lineTo(img.width - r, 0);
    ctx.quadraticCurveTo(img.width, 0, img.width, r);
    ctx.lineTo(img.width, img.height - r);
    ctx.quadraticCurveTo(img.width, img.height, img.width - r, img.height);
    ctx.lineTo(r, img.height);
    ctx.quadraticCurveTo(0, img.height, 0, img.height - r);
    ctx.lineTo(0, r);
    ctx.quadraticCurveTo(0, 0, r, 0);
    ctx.closePath();
    
    ctx.clip();
    ctx.drawImage(img, 0, 0);
  };

  const handleDownload = () => {
    if (canvasRef.current) {
        const format = bgTransparent ? 'image/png' : 'image/jpeg';
        downloadImage(canvasRef.current.toDataURL(format), `rounded-${file?.name}`);
    }
  };

  const reset = () => {
    setFile(null);
    setImgSrc(null);
    setRadius(10);
  };

  const content = (
    <div className="p-8 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/30">
      <div className="max-w-3xl mx-auto prose dark:prose-invert">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Add Rounded Corners to Images</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          Easily round the corners of your photos. Perfect for creating profile pictures, app icons, or softer-looking images for social media.
          Output as transparent PNG or add a solid background color.
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
       <div className="flex flex-col lg:flex-row gap-8 p-6">
          <div className="flex-1 bg-slate-100 dark:bg-slate-900 rounded-xl flex items-center justify-center p-4 overflow-hidden checkered-bg">
             <canvas ref={canvasRef} className="max-w-full max-h-[500px] shadow-xl" />
          </div>

          <div className="w-full lg:w-80 space-y-6 bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
             <h3 className="font-semibold text-slate-900 dark:text-white">Corner Settings</h3>
             
             <div className="space-y-2">
                <div className="flex justify-between">
                   <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Radius</label>
                   <span className="text-sm text-slate-500">{radius}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" max="50" 
                  value={radius} 
                  onChange={(e) => setRadius(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary-600"
                />
             </div>

             <div className="space-y-2">
                 <label className="flex items-center gap-2 cursor-pointer">
                     <input 
                        type="checkbox" 
                        checked={bgTransparent} 
                        onChange={(e) => setBgTransparent(e.target.checked)}
                        className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                     />
                     <span className="text-sm text-slate-700 dark:text-slate-300">Transparent Background</span>
                 </label>
             </div>
             
             {!bgTransparent && (
                 <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Background Color</label>
                    <div className="flex gap-2">
                        <input 
                            type="color" 
                            value={bgColor} 
                            onChange={(e) => setBgColor(e.target.value)}
                            className="h-10 w-20 rounded border border-slate-200 dark:border-slate-700 p-1 cursor-pointer"
                        />
                        <input 
                            type="text" 
                            value={bgColor} 
                            onChange={(e) => setBgColor(e.target.value)}
                            className="flex-1 px-3 py-2 border border-slate-200 dark:border-slate-700 rounded bg-slate-50 dark:bg-slate-900 text-sm"
                        />
                    </div>
                 </div>
             )}

             <Button size="lg" className="w-full mt-4" onClick={handleDownload}>
                <Download className="w-4 h-4 mr-2" /> Download Image
             </Button>
          </div>
       </div>
       {content}
    </ToolLayout>
  );
};