import React, { useState, useEffect, useRef } from 'react';
import { ToolLayout } from '../components/ToolLayout';
import { ImageUploader } from '../components/ImageUploader';
import { Button } from '../components/Button';
import { TOOLS } from '../constants';
import { readFileAsDataURL, loadImage, downloadImage } from '../utils/imageUtils';
import { Download, Type, Image as ImageIcon } from 'lucide-react';

export const Watermark = () => {
  const [file, setFile] = useState<File | null>(null);
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  
  // Watermark State
  const [type, setType] = useState<'text' | 'image'>('text');
  const [wmText, setWmText] = useState('Copyright');
  const [wmImage, setWmImage] = useState<string | null>(null);
  const [opacity, setOpacity] = useState(0.5);
  const [size, setSize] = useState(50);
  const [x, setX] = useState(50);
  const [y, setY] = useState(50);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const toolInfo = TOOLS.find(t => t.id === 'watermark')!;

  const handleFileSelect = async (selectedFile: File) => {
    setFile(selectedFile);
    const url = await readFileAsDataURL(selectedFile);
    setImgSrc(url);
  };

  const handleWmImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
        const url = await readFileAsDataURL(e.target.files[0]);
        setWmImage(url);
        setType('image');
    }
  };

  useEffect(() => {
    if (imgSrc && canvasRef.current) {
      draw();
    }
  }, [imgSrc, type, wmText, wmImage, opacity, size, x, y]);

  const draw = async () => {
    const canvas = canvasRef.current;
    if (!canvas || !imgSrc) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = await loadImage(imgSrc);
    
    // Set logical size
    canvas.width = img.width;
    canvas.height = img.height;
    
    // Draw Base Image
    ctx.drawImage(img, 0, 0);

    // Draw Watermark
    ctx.globalAlpha = opacity;

    const posX = (x / 100) * canvas.width;
    const posY = (y / 100) * canvas.height;

    if (type === 'text') {
        const fontSize = (size / 100) * (canvas.width / 10);
        ctx.font = `bold ${fontSize}px Arial`;
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = fontSize / 20;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        ctx.strokeText(wmText, posX, posY);
        ctx.fillText(wmText, posX, posY);
    } else if (type === 'image' && wmImage) {
        const wImg = await loadImage(wmImage);
        const scale = (size / 100) * 2; // arbitrary scaling factor relative to original size
        const w = wImg.width * scale;
        const h = wImg.height * scale;
        
        ctx.drawImage(wImg, posX - w/2, posY - h/2, w, h);
    }

    ctx.globalAlpha = 1.0;
  };

  const handleDownload = () => {
    if (canvasRef.current) {
        downloadImage(canvasRef.current.toDataURL(), `watermarked-${file?.name}`);
    }
  };

  const reset = () => {
    setFile(null);
    setImgSrc(null);
    setWmText('Copyright');
    setWmImage(null);
  };

  const content = (
    <div className="p-8 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/30">
      <div className="max-w-3xl mx-auto prose dark:prose-invert">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Watermark Photos Online</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          Protect your copyright and build your brand by adding custom watermarks to your photos.
          Overlay text or upload your logo sticker instantly.
        </p>
        
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">Features</h3>
        <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-400 mb-6">
          <li><strong>Text Watermark:</strong> Add copyright text, your name, or website URL.</li>
          <li><strong>Logo Watermark:</strong> Upload a transparent PNG logo to overlay on your images.</li>
          <li><strong>Customizable:</strong> Adjust transparency (opacity), size, and position with simple sliders.</li>
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
       <div className="flex flex-col lg:flex-row h-[calc(100vh-200px)]">
         <div className="flex-1 bg-slate-100 dark:bg-slate-900 flex items-center justify-center p-4 overflow-hidden">
            <canvas ref={canvasRef} className="max-w-full max-h-full object-contain shadow-xl" />
         </div>

         <div className="w-full lg:w-80 bg-white dark:bg-slate-800 border-t lg:border-l border-slate-200 dark:border-slate-700 p-6 overflow-y-auto">
            <h3 className="font-semibold mb-4 text-slate-900 dark:text-white">Watermark Settings</h3>
            
            <div className="flex bg-slate-100 dark:bg-slate-700 rounded-lg p-1 mb-6">
                <button 
                    onClick={() => setType('text')} 
                    className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${type === 'text' ? 'bg-white dark:bg-slate-600 shadow-sm' : 'text-slate-500'}`}
                >
                    Text
                </button>
                <button 
                    onClick={() => setType('image')}
                    className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${type === 'image' ? 'bg-white dark:bg-slate-600 shadow-sm' : 'text-slate-500'}`}
                >
                    Image / Sticker
                </button>
            </div>

            <div className="space-y-6">
                {type === 'text' ? (
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase">Content</label>
                        <input 
                            type="text" 
                            value={wmText}
                            onChange={(e) => setWmText(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded"
                        />
                    </div>
                ) : (
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase">Upload Sticker</label>
                        <div className="border border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-4 text-center">
                             <input type="file" id="sticker-upload" className="hidden" accept="image/*" onChange={handleWmImageSelect} />
                             <label htmlFor="sticker-upload" className="cursor-pointer text-primary-600 text-sm font-medium hover:underline">
                                Choose Image
                             </label>
                        </div>
                    </div>
                )}

                <RangeControl label="Opacity" value={opacity} min={0} max={1} step={0.05} onChange={setOpacity} />
                <RangeControl label="Size" value={size} min={5} max={200} onChange={setSize} />
                <RangeControl label="Position X" value={x} min={0} max={100} onChange={setX} />
                <RangeControl label="Position Y" value={y} min={0} max={100} onChange={setY} />
            </div>
            
            <div className="mt-8">
                <Button size="lg" className="w-full" onClick={handleDownload}>
                    <Download className="w-4 h-4 mr-2" /> Download
                </Button>
            </div>
         </div>
       </div>
       {content}
    </ToolLayout>
  );
};

const RangeControl = ({ label, value, min, max, step = 1, onChange }: { label: string, value: number, min: number, max: number, step?: number, onChange: (val: number) => void }) => (
  <div className="space-y-1">
    <div className="flex justify-between">
      <span className="text-xs font-medium text-slate-700 dark:text-slate-300 uppercase">{label}</span>
    </div>
    <input 
      type="range" 
      min={min} 
      max={max} 
      step={step}
      value={value} 
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary-600"
    />
  </div>
);