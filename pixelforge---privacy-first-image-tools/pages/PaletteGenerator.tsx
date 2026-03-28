import React, { useState, useEffect } from 'react';
import ColorThief from 'colorthief';
import { ToolLayout } from '../components/ToolLayout';
import { ImageUploader } from '../components/ImageUploader';
import { TOOLS } from '../constants';
import { readFileAsDataURL, loadImage } from '../utils/imageUtils';
import { Copy, Check } from 'lucide-react';

export const PaletteGenerator = () => {
  const [file, setFile] = useState<File | null>(null);
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [palette, setPalette] = useState<string[]>([]);
  const [dominant, setDominant] = useState<string>('');
  const [copied, setCopied] = useState<string | null>(null);

  const toolInfo = TOOLS.find(t => t.id === 'palette')!;

  const handleFileSelect = async (selectedFile: File) => {
    setFile(selectedFile);
    const url = await readFileAsDataURL(selectedFile);
    setImgSrc(url);
  };

  useEffect(() => {
    if (imgSrc) {
      extractColors();
    }
  }, [imgSrc]);

  const extractColors = async () => {
    if (!imgSrc) return;
    
    const img = await loadImage(imgSrc);
    const colorThief = new ColorThief();
    
    // ColorThief needs the image to be in DOM? No, but needs to be loaded.
    // If using ES module, we might need to instantiate.
    
    try {
        const domColor = colorThief.getColor(img);
        const pal = colorThief.getPalette(img, 6);
        
        setDominant(rgbToHex(domColor));
        setPalette(pal.map(rgbToHex));
    } catch (e) {
        console.error("Error extracting colors", e);
    }
  };

  const rgbToHex = (rgb: number[]) => '#' + rgb.map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
  }).join('');

  const copyColor = (color: string) => {
    navigator.clipboard.writeText(color);
    setCopied(color);
    setTimeout(() => setCopied(null), 2000);
  };

  const reset = () => {
    setFile(null);
    setImgSrc(null);
    setPalette([]);
  };

  const content = (
    <div className="p-8 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/30">
      <div className="max-w-3xl mx-auto prose dark:prose-invert">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Color Palette Generator</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
            Automatically extract the dominant colors from any image. Perfect for designers looking for inspiration 
            or developers needing to match a website's theme to a hero image.
        </p>
        <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-400">
            <li>Identify the primary dominant color.</li>
            <li>Generate a harmonious color palette of up to 6 colors.</li>
            <li>Copy HEX codes instantly with a single click.</li>
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
       <div className="grid lg:grid-cols-2 gap-8 p-6">
          <div className="bg-slate-100 dark:bg-slate-900 p-4 rounded-xl flex items-center justify-center">
             {imgSrc && <img src={imgSrc} alt="Source" className="max-w-full max-h-[500px] rounded-lg shadow-md" />}
          </div>

          <div className="space-y-8">
             <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Dominant Color</h3>
                {dominant && (
                    <button 
                        onClick={() => copyColor(dominant)}
                        className="flex items-center gap-4 p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all w-full text-left"
                    >
                        <div className="w-16 h-16 rounded-lg shadow-inner" style={{ backgroundColor: dominant }}></div>
                        <div>
                            <p className="text-xl font-mono font-bold text-slate-900 dark:text-white">{dominant}</p>
                            <span className="text-xs text-slate-500">Click to copy</span>
                        </div>
                        <div className="ml-auto">
                            {copied === dominant ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5 text-slate-400" />}
                        </div>
                    </button>
                )}
             </div>

             <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Color Palette</h3>
                <div className="space-y-3">
                    {palette.map((color, i) => (
                        <button 
                            key={i}
                            onClick={() => copyColor(color)}
                            className="flex items-center gap-4 p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:translate-x-1 transition-all w-full text-left"
                        >
                            <div className="w-10 h-10 rounded shadow-inner" style={{ backgroundColor: color }}></div>
                            <p className="text-lg font-mono font-medium text-slate-900 dark:text-white">{color}</p>
                             <div className="ml-auto">
                                {copied === color ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-slate-400" />}
                            </div>
                        </button>
                    ))}
                </div>
             </div>
          </div>
       </div>
       {content}
    </ToolLayout>
  );
};