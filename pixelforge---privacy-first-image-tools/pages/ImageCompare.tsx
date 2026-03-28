import React, { useState, useRef, useEffect } from 'react';
import { ToolLayout } from '../components/ToolLayout';
import { Button } from '../components/Button';
import { TOOLS } from '../constants';
import { readFileAsDataURL } from '../utils/imageUtils';
import { Upload, SplitSquareHorizontal } from 'lucide-react';

export const ImageCompare = () => {
  const [img1, setImg1] = useState<string | null>(null);
  const [img2, setImg2] = useState<string | null>(null);
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const toolInfo = TOOLS.find(t => t.id === 'compare')!;

  const handleUpload = async (file: File, setImg: (s: string) => void) => {
    const url = await readFileAsDataURL(file);
    setImg(url);
  };

  const content = (
    <div className="p-8 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/30">
      <div className="max-w-3xl mx-auto prose dark:prose-invert">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Image Comparison Tool</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          Visually compare two images with an interactive slider. Perfect for checking before/after edits, 
          compression quality differences, or design variations.
        </p>
      </div>
    </div>
  );

  return (
    <ToolLayout title={toolInfo.name} description={toolInfo.description} icon={toolInfo.icon} onReset={() => {setImg1(null); setImg2(null);}} toolId={toolInfo.id}>
       <div className="p-6 min-h-[600px] flex flex-col">
          
          <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 text-center">
                  <input type="file" id="img1" className="hidden" onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0], setImg1)} />
                  <label htmlFor="img1" className="cursor-pointer block">
                      <div className="mb-2 font-bold text-slate-700 dark:text-slate-300">Left Image</div>
                      {img1 ? <img src={img1} className="h-20 mx-auto object-contain" /> : <Upload className="h-8 w-8 mx-auto text-slate-400" />}
                  </label>
              </div>
              <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 text-center">
                  <input type="file" id="img2" className="hidden" onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0], setImg2)} />
                  <label htmlFor="img2" className="cursor-pointer block">
                      <div className="mb-2 font-bold text-slate-700 dark:text-slate-300">Right Image</div>
                      {img2 ? <img src={img2} className="h-20 mx-auto object-contain" /> : <Upload className="h-8 w-8 mx-auto text-slate-400" />}
                  </label>
              </div>
          </div>

          <div className="flex-1 bg-slate-900 rounded-xl relative overflow-hidden select-none flex items-center justify-center" ref={containerRef}>
              {!img1 || !img2 ? (
                  <div className="text-slate-500">Upload two images to compare</div>
              ) : (
                  <div className="relative w-full max-w-4xl h-[500px]">
                      {/* Background Image (Right) */}
                      <img src={img2} className="absolute inset-0 w-full h-full object-contain" draggable={false} />
                      
                      {/* Foreground Image (Left) - Clipped */}
                      <div 
                        className="absolute inset-0 w-full h-full overflow-hidden"
                        style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
                      >
                         <img src={img1} className="absolute inset-0 w-full h-full object-contain" draggable={false} />
                      </div>

                      {/* Slider Handle */}
                      <div 
                        className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize shadow-[0_0_10px_rgba(0,0,0,0.5)] z-10"
                        style={{ left: `${sliderPos}%` }}
                      >
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
                              <SplitSquareHorizontal className="w-4 h-4 text-slate-900" />
                          </div>
                      </div>

                      {/* Invisible Input for Dragging */}
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={sliderPos} 
                        onChange={(e) => setSliderPos(Number(e.target.value))}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20 m-0 p-0" 
                      />
                  </div>
              )}
          </div>

       </div>
       {content}
    </ToolLayout>
  );
};