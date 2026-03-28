import React, { useState, useRef } from 'react';
import { ToolLayout } from '../components/ToolLayout';
import { Button } from '../components/Button';
import { TOOLS } from '../constants';
import { readFileAsDataURL, loadImage, downloadImage } from '../utils/imageUtils';
import { Download, LayoutGrid, Upload } from 'lucide-react';

type Layout = '2x-h' | '2x-v' | '4x-grid';

export const CollageMaker = () => {
  const [layout, setLayout] = useState<Layout>('2x-h');
  const [images, setImages] = useState<(string | null)[]>([null, null, null, null]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const toolInfo = TOOLS.find(t => t.id === 'collage')!;

  const handleImageUpload = async (index: number, file: File) => {
    const url = await readFileAsDataURL(file);
    const newImages = [...images];
    newImages[index] = url;
    setImages(newImages);
  };

  const drawCollage = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Reset canvas
    const w = 1200; 
    const h = 1200;
    canvas.width = w;
    canvas.height = h;
    
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, w, h);
    
    const drawImageToCtx = async (url: string | null, x: number, y: number, dw: number, dh: number) => {
        if (!url) {
            ctx.fillStyle = '#f1f5f9';
            ctx.fillRect(x, y, dw, dh);
            ctx.strokeStyle = '#cbd5e1';
            ctx.strokeRect(x, y, dw, dh);
            return;
        }
        const img = await loadImage(url);
        // Object fit cover implementation
        const ratio = img.width / img.height;
        const targetRatio = dw / dh;
        let sx, sy, sw, sh;
        
        if (ratio > targetRatio) {
            sh = img.height;
            sw = sh * targetRatio;
            sx = (img.width - sw) / 2;
            sy = 0;
        } else {
            sw = img.width;
            sh = sw / targetRatio;
            sx = 0;
            sy = (img.height - sh) / 2;
        }
        
        ctx.drawImage(img, sx, sy, sw, sh, x, y, dw, dh);
    };

    const gap = 20;
    
    if (layout === '2x-h') {
        await drawImageToCtx(images[0], 0, 0, w/2 - gap/2, h);
        await drawImageToCtx(images[1], w/2 + gap/2, 0, w/2 - gap/2, h);
    } else if (layout === '2x-v') {
        await drawImageToCtx(images[0], 0, 0, w, h/2 - gap/2);
        await drawImageToCtx(images[1], 0, h/2 + gap/2, w, h/2 - gap/2);
    } else {
        await drawImageToCtx(images[0], 0, 0, w/2 - gap/2, h/2 - gap/2);
        await drawImageToCtx(images[1], w/2 + gap/2, 0, w/2 - gap/2, h/2 - gap/2);
        await drawImageToCtx(images[2], 0, h/2 + gap/2, w/2 - gap/2, h/2 - gap/2);
        await drawImageToCtx(images[3], w/2 + gap/2, h/2 + gap/2, w/2 - gap/2, h/2 - gap/2);
    }
  };

  // Redraw when inputs change
  React.useEffect(() => {
    drawCollage();
  }, [images, layout]);

  const download = () => {
    if (canvasRef.current) {
        downloadImage(canvasRef.current.toDataURL(), 'collage.png');
    }
  };

  const content = (
    <div className="p-8 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/30">
      <div className="max-w-3xl mx-auto prose dark:prose-invert">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Free Photo Collage Maker</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          Create beautiful photo collages in seconds. Choose from simple grid layouts to combine 2, 3, or 4 photos 
          into a single image. Perfect for Instagram stories, side-by-side comparisons, or mood boards.
        </p>
        
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">Collage Styles</h3>
        <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-400 mb-6">
          <li><strong>Side by Side:</strong> Compare two images horizontally.</li>
          <li><strong>Vertical Stack:</strong> Stack two images on top of each other.</li>
          <li><strong>Grid:</strong> A classic 2x2 grid for four images.</li>
        </ul>
      </div>
    </div>
  );

  return (
    <ToolLayout title={toolInfo.name} description={toolInfo.description} icon={toolInfo.icon} onReset={() => setImages([null, null, null, null])} toolId={toolInfo.id}>
      <div className="p-6">
        
        {/* Layout Selector */}
        <div className="flex justify-center gap-4 mb-8">
            <button 
                onClick={() => setLayout('2x-h')}
                className={`p-4 rounded-xl border-2 transition-all ${layout === '2x-h' ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-slate-200 dark:border-slate-700'}`}
            >
                <div className="flex gap-1 w-12 h-12">
                    <div className="w-1/2 h-full bg-slate-400 rounded-sm"></div>
                    <div className="w-1/2 h-full bg-slate-400 rounded-sm"></div>
                </div>
                <span className="block text-xs mt-2 text-center font-medium">Side by Side</span>
            </button>
            <button 
                onClick={() => setLayout('2x-v')}
                className={`p-4 rounded-xl border-2 transition-all ${layout === '2x-v' ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-slate-200 dark:border-slate-700'}`}
            >
                <div className="flex flex-col gap-1 w-12 h-12">
                    <div className="w-full h-1/2 bg-slate-400 rounded-sm"></div>
                    <div className="w-full h-1/2 bg-slate-400 rounded-sm"></div>
                </div>
                 <span className="block text-xs mt-2 text-center font-medium">Vertical</span>
            </button>
             <button 
                onClick={() => setLayout('4x-grid')}
                className={`p-4 rounded-xl border-2 transition-all ${layout === '4x-grid' ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-slate-200 dark:border-slate-700'}`}
            >
                <div className="grid grid-cols-2 gap-1 w-12 h-12">
                    <div className="bg-slate-400 rounded-sm"></div>
                    <div className="bg-slate-400 rounded-sm"></div>
                    <div className="bg-slate-400 rounded-sm"></div>
                    <div className="bg-slate-400 rounded-sm"></div>
                </div>
                 <span className="block text-xs mt-2 text-center font-medium">Grid</span>
            </button>
        </div>

        {/* Input Area */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[0, 1, ...(layout === '4x-grid' ? [2, 3] : [])].map(idx => (
                <div key={idx} className="relative aspect-square bg-slate-100 dark:bg-slate-800 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center overflow-hidden group">
                    {images[idx] ? (
                        <>
                            <img src={images[idx]!} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                <span className="text-white text-sm font-medium">Change</span>
                            </div>
                        </>
                    ) : (
                        <div className="text-center p-2">
                            <Upload className="w-6 h-6 mx-auto text-slate-400 mb-2" />
                            <span className="text-xs text-slate-500">Upload Image {idx + 1}</span>
                        </div>
                    )}
                    <input 
                        type="file" 
                        accept="image/*" 
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={(e) => e.target.files?.[0] && handleImageUpload(idx, e.target.files[0])}
                    />
                </div>
            ))}
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg text-center">
             <h3 className="font-semibold mb-4 text-slate-900 dark:text-white">Preview</h3>
             <div className="max-w-md mx-auto shadow-xl mb-6">
                <canvas ref={canvasRef} className="w-full h-auto" />
             </div>
             <Button size="lg" onClick={download}>
                <Download className="w-4 h-4 mr-2" /> Download Collage
             </Button>
        </div>

      </div>
      {content}
    </ToolLayout>
  );
};