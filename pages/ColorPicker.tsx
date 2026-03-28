import React, { useState, useRef, useEffect } from 'react';
import { ToolLayout } from '../components/ToolLayout';
import { ImageUploader } from '../components/ImageUploader';
import { TOOLS } from '../constants';
import { readFileAsDataURL, loadImage } from '../utils/imageUtils';
import { Copy } from 'lucide-react';

export const ColorPicker = () => {
  const [file, setFile] = useState<File | null>(null);
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [color, setColor] = useState<string>('#ffffff');
  const [rgb, setRgb] = useState<string>('rgb(255, 255, 255)');
  const [hoverPos, setHoverPos] = useState({ x: 0, y: 0 });
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const toolInfo = TOOLS.find(t => t.id === 'picker')!;

  const handleFileSelect = async (selectedFile: File) => {
    setFile(selectedFile);
    const url = await readFileAsDataURL(selectedFile);
    setImgSrc(url);
  };

  useEffect(() => {
    if (imgSrc && canvasRef.current) {
      loadImage(imgSrc).then(img => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        // Scale canvas to fit container but keep aspect ratio
        const container = containerRef.current;
        const maxWidth = container?.clientWidth || 800;
        const scale = Math.min(maxWidth / img.width, 1);
        
        canvas.width = img.width;
        canvas.height = img.height;
        canvas.style.width = `${img.width * scale}px`;
        canvas.style.height = `${img.height * scale}px`;

        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0);
      });
    }
  }, [imgSrc]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const pixel = ctx.getImageData(Math.max(0, x), Math.max(0, y), 1, 1).data;
    const hex = "#" + ((1 << 24) + (pixel[0] << 16) + (pixel[1] << 8) + pixel[2]).toString(16).slice(1);
    const rgbVal = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;

    setColor(hex);
    setRgb(rgbVal);
    setHoverPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Could add toast here
  };

  const reset = () => {
    setFile(null);
    setImgSrc(null);
  };

  const content = (
    <div className="p-8 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/30">
      <div className="max-w-3xl mx-auto prose dark:prose-invert">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Image Color Picker</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          Identify and extract colors from any image. Simply upload your photo and hover over any pixel to get the exact HEX and RGB color codes.
          Useful for designers, developers, and artists.
        </p>
        
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">How it works</h3>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          Our tool loads your image into a canvas element. When you move your mouse, we sample the pixel data at that coordinate 
          to determine the precise Red, Green, and Blue (RGB) values, which are then converted to a Hexadecimal string.
        </p>

        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">Features</h3>
        <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-400">
          <li>Instant color identification.</li>
          <li>Copy HEX codes with one click.</li>
          <li>Supports high-resolution images.</li>
          <li>No upload required - works offline.</li>
        </ul>
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
       <div className="flex flex-col lg:flex-row">
         <div className="flex-1 bg-slate-100 dark:bg-slate-900 p-4 flex items-center justify-center overflow-hidden relative" ref={containerRef}>
            <canvas 
              ref={canvasRef} 
              className="cursor-crosshair shadow-lg max-w-full"
              onMouseMove={handleMouseMove}
              onClick={() => copyToClipboard(color)}
            />
            {/* Magnifier or Indicator could go here */}
         </div>

         <div className="w-full lg:w-72 bg-white dark:bg-slate-800 border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-700 p-6 z-10">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Selected Color</h3>
            
            <div className="w-full h-24 rounded-xl shadow-inner border border-slate-200 dark:border-slate-600 mb-6 transition-colors duration-75" style={{ backgroundColor: color }}></div>

            <div className="space-y-4">
               <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase">HEX</label>
                  <div className="flex gap-2">
                    <input type="text" readOnly value={color} className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-3 py-2 rounded font-mono text-sm" />
                    <button onClick={() => copyToClipboard(color)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded border border-slate-200 dark:border-slate-700">
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
               </div>

               <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase">RGB</label>
                  <div className="flex gap-2">
                    <input type="text" readOnly value={rgb} className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-3 py-2 rounded font-mono text-sm" />
                    <button onClick={() => copyToClipboard(rgb)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded border border-slate-200 dark:border-slate-700">
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
               </div>
            </div>
            
            <p className="mt-6 text-sm text-slate-500">
              Move your mouse over the image to pick a color. Click to copy the HEX code.
            </p>
         </div>
       </div>
       {content}
    </ToolLayout>
  );
};