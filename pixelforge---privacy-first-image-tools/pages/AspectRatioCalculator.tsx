import React, { useState, useEffect } from 'react';
import { ToolLayout } from '../components/ToolLayout';
import { Button } from '../components/Button';
import { TOOLS } from '../constants';
import { Calculator, ArrowRight } from 'lucide-react';

export const AspectRatioCalculator = () => {
  const [width, setWidth] = useState<number>(1920);
  const [height, setHeight] = useState<number>(1080);
  const [ratio, setRatio] = useState<string>("16:9");

  const toolInfo = TOOLS.find(t => t.id === 'aspect')!;

  // Greatest Common Divisor
  const gcd = (a: number, b: number): number => {
    return b === 0 ? a : gcd(b, a % b);
  };

  useEffect(() => {
    if (width > 0 && height > 0) {
        const divisor = gcd(width, height);
        setRatio(`${width / divisor}:${height / divisor}`);
    }
  }, [width, height]);

  const content = (
    <div className="p-8 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/30">
      <div className="max-w-3xl mx-auto prose dark:prose-invert">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Aspect Ratio Calculator</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          Instantly calculate the aspect ratio of any dimensions. Useful for video editors, designers, and developers.
        </p>
      </div>
    </div>
  );

  return (
    <ToolLayout title={toolInfo.name} description={toolInfo.description} icon={toolInfo.icon} toolId={toolInfo.id}>
       <div className="p-12 flex flex-col items-center justify-center">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 w-full max-w-2xl">
              <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="flex-1 w-full">
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Width (px)</label>
                      <input 
                        type="number" 
                        value={width}
                        onChange={(e) => setWidth(Number(e.target.value))}
                        className="w-full text-2xl p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-center font-mono"
                      />
                  </div>
                  
                  <div className="text-slate-400 font-bold text-xl">X</div>
                  
                  <div className="flex-1 w-full">
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Height (px)</label>
                       <input 
                        type="number" 
                        value={height}
                        onChange={(e) => setHeight(Number(e.target.value))}
                        className="w-full text-2xl p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-center font-mono"
                      />
                  </div>
              </div>

              <div className="mt-8 bg-primary-50 dark:bg-primary-900/20 p-6 rounded-xl text-center border border-primary-100 dark:border-primary-800">
                  <h3 className="text-sm font-bold text-primary-800 dark:text-primary-300 uppercase tracking-wider mb-2">Aspect Ratio</h3>
                  <div className="text-4xl md:text-6xl font-bold text-primary-600 dark:text-primary-400">
                      {ratio}
                  </div>
              </div>
              
              <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
                   <Button variant="outline" size="sm" onClick={() => {setWidth(1920); setHeight(1080);}}>16:9 (HD)</Button>
                   <Button variant="outline" size="sm" onClick={() => {setWidth(1080); setHeight(1080);}}>1:1 (Square)</Button>
                   <Button variant="outline" size="sm" onClick={() => {setWidth(1080); setHeight(1350);}}>4:5 (Portrait)</Button>
                   <Button variant="outline" size="sm" onClick={() => {setWidth(2560); setHeight(1440);}}>16:9 (2K)</Button>
              </div>
          </div>
       </div>
       {content}
    </ToolLayout>
  );
};