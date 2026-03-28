import React, { useState, useRef } from 'react';
import { ToolLayout } from '../components/ToolLayout';
import { ImageUploader } from '../components/ImageUploader';
import { Button } from '../components/Button';
import { TOOLS } from '../constants';
import { readFileAsDataURL, loadImage, downloadImage } from '../utils/imageUtils';
import { Download, Grid, CheckCircle } from 'lucide-react';

export const ImageSplitter = () => {
  const [file, setFile] = useState<File | null>(null);
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);
  const [pieces, setPieces] = useState<string[]>([]);
  const [isSplitting, setIsSplitting] = useState(false);

  const toolInfo = TOOLS.find(t => t.id === 'splitter')!;

  const handleFileSelect = async (selectedFile: File) => {
    setFile(selectedFile);
    const url = await readFileAsDataURL(selectedFile);
    setImgSrc(url);
    setPieces([]);
  };

  const splitImage = async () => {
    if (!imgSrc) return;
    setIsSplitting(true);
    
    try {
        const img = await loadImage(imgSrc);
        const pieceWidth = img.width / cols;
        const pieceHeight = img.height / rows;
        
        const newPieces: string[] = [];

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const canvas = document.createElement('canvas');
                canvas.width = pieceWidth;
                canvas.height = pieceHeight;
                const ctx = canvas.getContext('2d');
                
                ctx?.drawImage(
                    img, 
                    c * pieceWidth, r * pieceHeight, pieceWidth, pieceHeight,
                    0, 0, pieceWidth, pieceHeight
                );
                newPieces.push(canvas.toDataURL('image/jpeg', 0.9));
            }
        }
        setPieces(newPieces);
    } catch (e) {
        console.error(e);
    } finally {
        setIsSplitting(false);
    }
  };

  const reset = () => {
    setFile(null);
    setImgSrc(null);
    setPieces([]);
    setRows(3);
    setCols(3);
  };

  const content = (
    <div className="p-8 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/30">
      <div className="max-w-3xl mx-auto prose dark:prose-invert">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Split Images into a Grid</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          Divide your photos into equal grid pieces. This is perfect for creating giant square banners on your Instagram profile page.
          Split into 3x1, 3x2, 3x3, or any custom grid size.
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
       <div className="grid lg:grid-cols-3 gap-8 p-6">
          <div className="lg:col-span-1 space-y-6 bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 h-fit">
             <h3 className="font-semibold text-slate-900 dark:text-white">Grid Settings</h3>
             
             <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Rows (Vertical)</label>
                    <input 
                        type="number" min="1" max="10"
                        value={rows}
                        onChange={(e) => setRows(Math.max(1, Number(e.target.value)))}
                        className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded bg-slate-50 dark:bg-slate-900"
                    />
                 </div>
                 <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Columns (Horizontal)</label>
                    <input 
                        type="number" min="1" max="10"
                        value={cols}
                        onChange={(e) => setCols(Math.max(1, Number(e.target.value)))}
                        className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded bg-slate-50 dark:bg-slate-900"
                    />
                 </div>
             </div>

             <Button size="lg" className="w-full" onClick={splitImage} disabled={isSplitting}>
                <Grid className="w-4 h-4 mr-2" /> Split Image
             </Button>

             {pieces.length > 0 && (
                 <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-100 dark:border-green-800 text-center">
                     <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
                     <p className="text-sm text-green-700 dark:text-green-400">Successfully split into {pieces.length} images!</p>
                     <p className="text-xs text-green-600 dark:text-green-500 mt-1">Download them individually below.</p>
                 </div>
             )}
          </div>

          <div className="lg:col-span-2">
              {pieces.length > 0 ? (
                  <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
                      {pieces.map((src, i) => (
                          <div key={i} className="relative group aspect-square bg-slate-100 dark:bg-slate-900 overflow-hidden">
                              <img src={src} className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <Button size="sm" variant="secondary" onClick={() => downloadImage(src, `split-${i+1}.jpg`)}>
                                      <Download className="w-4 h-4" />
                                  </Button>
                              </div>
                              <div className="absolute top-1 left-1 bg-black/50 text-white text-xs px-1.5 rounded">{i+1}</div>
                          </div>
                      ))}
                  </div>
              ) : (
                  <div className="flex items-center justify-center h-64 bg-slate-100 dark:bg-slate-900 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700">
                      <p className="text-slate-500">Preview will appear here</p>
                  </div>
              )}
          </div>
       </div>
       {content}
    </ToolLayout>
  );
};