import React, { useState, useEffect, useRef } from 'react';
import { ToolLayout } from '../components/ToolLayout';
import { ImageUploader } from '../components/ImageUploader';
import { Button } from '../components/Button';
import { TOOLS } from '../constants';
import { readFileAsDataURL, loadImage, downloadImage } from '../utils/imageUtils';
import { Download } from 'lucide-react';

export const MemeGenerator = () => {
  const [file, setFile] = useState<File | null>(null);
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [topText, setTopText] = useState('TOP TEXT');
  const [bottomText, setBottomText] = useState('BOTTOM TEXT');
  const [fontSize, setFontSize] = useState(40);
  const [textColor, setTextColor] = useState('#ffffff');
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const toolInfo = TOOLS.find(t => t.id === 'meme')!;

  const handleFileSelect = async (selectedFile: File) => {
    setFile(selectedFile);
    const url = await readFileAsDataURL(selectedFile);
    setImgSrc(url);
  };

  useEffect(() => {
    if (imgSrc && canvasRef.current) {
      drawMeme();
    }
  }, [imgSrc, topText, bottomText, fontSize, textColor]);

  const drawMeme = async () => {
    if (!imgSrc || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = await loadImage(imgSrc);
    
    // Limit max width for performance and display
    const maxWidth = 800;
    const scale = img.width > maxWidth ? maxWidth / img.width : 1;
    
    canvas.width = img.width * scale;
    canvas.height = img.height * scale;
    
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    
    // Text Configuration
    ctx.fillStyle = textColor;
    ctx.strokeStyle = 'black';
    ctx.lineWidth = fontSize / 8;
    ctx.font = `900 ${fontSize}px Impact, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    // Draw Top Text
    if (topText) {
      ctx.strokeText(topText.toUpperCase(), canvas.width / 2, 20);
      ctx.fillText(topText.toUpperCase(), canvas.width / 2, 20);
    }

    // Draw Bottom Text
    ctx.textBaseline = 'bottom';
    if (bottomText) {
      ctx.strokeText(bottomText.toUpperCase(), canvas.width / 2, canvas.height - 20);
      ctx.fillText(bottomText.toUpperCase(), canvas.width / 2, canvas.height - 20);
    }
  };

  const handleDownload = () => {
    if (canvasRef.current) {
      downloadImage(canvasRef.current.toDataURL('image/png'), `meme-${file?.name}`);
    }
  };

  const reset = () => {
    setFile(null);
    setImgSrc(null);
    setTopText('TOP TEXT');
    setBottomText('BOTTOM TEXT');
  };

  const content = (
    <div className="p-8 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/30">
      <div className="max-w-3xl mx-auto prose dark:prose-invert">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Online Meme Generator</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          Create your own memes instantly. Upload a funny photo, add classic top and bottom text, 
          and share it with your friends. No watermarks, no account required.
        </p>
        
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">How to make a meme?</h3>
        <ol className="list-decimal list-inside space-y-2 text-slate-600 dark:text-slate-400 mb-6">
          <li>Upload an image (JPG, PNG, GIF).</li>
          <li>Type your joke in the Top and Bottom text fields.</li>
          <li>Adjust the font size and color if needed.</li>
          <li>Download your meme and go viral!</li>
        </ol>
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
        
        {/* Preview */}
        <div className="flex-1 bg-slate-100 dark:bg-slate-900 rounded-xl flex items-center justify-center p-4 overflow-hidden">
           <canvas ref={canvasRef} className="max-w-full h-auto shadow-xl" />
        </div>

        {/* Controls */}
        <div className="w-full lg:w-80 space-y-6">
          <div className="space-y-4 bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
             <div className="space-y-1">
               <label className="text-xs font-bold text-slate-500 uppercase">Top Text</label>
               <input 
                 type="text" 
                 value={topText} 
                 onChange={(e) => setTopText(e.target.value)}
                 className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded"
               />
             </div>
             <div className="space-y-1">
               <label className="text-xs font-bold text-slate-500 uppercase">Bottom Text</label>
               <input 
                 type="text" 
                 value={bottomText} 
                 onChange={(e) => setBottomText(e.target.value)}
                 className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded"
               />
             </div>
             
             <div className="grid grid-cols-2 gap-4">
               <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Font Size</label>
                  <input 
                    type="number" 
                    value={fontSize} 
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded"
                  />
               </div>
               <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Color</label>
                  <input 
                    type="color" 
                    value={textColor} 
                    onChange={(e) => setTextColor(e.target.value)}
                    className="w-full h-10 p-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded cursor-pointer"
                  />
               </div>
             </div>
          </div>

          <Button size="lg" className="w-full" onClick={handleDownload}>
            <Download className="w-4 h-4 mr-2" /> Download Meme
          </Button>
        </div>
      </div>
      {content}
    </ToolLayout>
  );
};