import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ToolLayout } from '../components/ToolLayout';
import { ImageUploader } from '../components/ImageUploader';
import { Button } from '../components/Button';
import { FilterConfig } from '../types';
import { applyImageFilters, downloadImage, readFileAsDataURL } from '../utils/imageUtils';
import { Sliders, RotateCcw, Download, Save, Crop as CropIcon, Type, Image as ImageIcon } from 'lucide-react';
import { TOOLS } from '../constants';

const DEFAULT_FILTERS: FilterConfig = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  blur: 0,
  grayscale: 0,
  sepia: 0,
  invert: 0,
  pixelate: 0,
  rotate: 0,
  flipH: false,
  flipV: false,
};

export const UniversalEditor = () => {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode') || 'filter';
  
  const [file, setFile] = useState<File | null>(null);
  const [originalPreview, setOriginalPreview] = useState<string | null>(null);
  const [processedPreview, setProcessedPreview] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterConfig>(DEFAULT_FILTERS);
  const [isProcessing, setIsProcessing] = useState(false);

  const toolInfo = TOOLS.find(t => t.path.includes(`mode=${mode}`)) || TOOLS.find(t => t.id === 'editor')!;

  const handleFileSelect = async (selectedFile: File) => {
    setFile(selectedFile);
    const url = await readFileAsDataURL(selectedFile);
    setOriginalPreview(url);
    setProcessedPreview(url);
    setFilters({
        ...DEFAULT_FILTERS,
        // Preset for specific modes
        invert: mode === 'invert' ? 100 : 0,
        pixelate: mode === 'pixelate' ? 10 : 0,
        grayscale: mode === 'grayscale' ? 100 : 0,
        sepia: mode === 'sepia' ? 100 : 0,
    });
  };

  useEffect(() => {
    if (originalPreview) {
      const timeout = setTimeout(() => {
        processImage();
      }, 50); // Debounce for slider performance
      return () => clearTimeout(timeout);
    }
  }, [filters, originalPreview]);

  const processImage = async () => {
    if (!originalPreview) return;
    setIsProcessing(true);
    try {
      const result = await applyImageFilters(originalPreview, filters);
      setProcessedPreview(result);
    } catch (err) {
      console.error("Processing failed", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const updateFilter = (key: keyof FilterConfig, value: number | boolean) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleDownload = () => {
    if (processedPreview) {
      downloadImage(processedPreview, `edited-${file?.name || 'image.png'}`);
    }
  };

  const reset = () => {
    setFile(null);
    setOriginalPreview(null);
    setProcessedPreview(null);
    setFilters(DEFAULT_FILTERS);
  };

  const getDescription = () => {
      switch(mode) {
          case 'invert': return "Invert colors of your images to create a negative effect. Useful for analyzing film negatives or creating artistic effects.";
          case 'pixelate': return "Pixelate your images to hide sensitive information like faces or text, or to create retro pixel art style graphics.";
          case 'blur': return "Blur your images to create a depth of field effect or soften the background.";
          case 'grayscale': return "Convert color images to high-quality black and white photos instantly.";
          case 'sepia': return "Apply a warm vintage tone to your photos to make them look old-fashioned.";
          default: return "Enhance your photos in seconds with our free online photo editor. Apply filters, adjust brightness, contrast, and more.";
      }
  };

  const content = (
    <div className="p-8 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/30">
      <div className="max-w-3xl mx-auto prose dark:prose-invert">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">{toolInfo.name} Online</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          {getDescription()}
        </p>
        
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">Features</h3>
        <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-400 mb-6">
          <li><strong>Real-time Editing:</strong> See changes instantly as you adjust sliders.</li>
          <li><strong>Privacy First:</strong> All processing happens in your browser. No uploads.</li>
          <li><strong>High Quality:</strong> Export images without losing resolution (unless pixelating!).</li>
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
    <ToolLayout 
      title={toolInfo.name} 
      description={toolInfo.description} 
      icon={toolInfo.icon}
      onReset={reset}
      toolId={toolInfo.id}
    >
      <div className="flex flex-col lg:flex-row h-[calc(100vh-200px)] min-h-[600px]">
        {/* Preview Area */}
        <div className="flex-1 bg-slate-100 dark:bg-slate-900 relative flex items-center justify-center p-8 overflow-hidden">
          {processedPreview && (
            <img 
              src={processedPreview} 
              alt="Preview" 
              className="max-w-full max-h-full object-contain shadow-2xl rounded-lg"
            />
          )}
          {isProcessing && (
            <div className="absolute top-4 right-4 bg-black/70 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm">
              Processing...
            </div>
          )}
        </div>

        {/* Controls Sidebar */}
        <div className="w-full lg:w-80 bg-white dark:bg-slate-800 border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-700 flex flex-col z-10 shadow-xl">
          <div className="p-5 border-b border-slate-200 dark:border-slate-700">
            <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Sliders className="w-4 h-4" /> Adjustments
            </h3>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">
            {/* Rotation Controls */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Transform</label>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" onClick={() => updateFilter('rotate', filters.rotate - 90)}>
                  Rotate Left
                </Button>
                <Button variant="outline" size="sm" onClick={() => updateFilter('rotate', filters.rotate + 90)}>
                  Rotate Right
                </Button>
                <Button variant="outline" size="sm" onClick={() => updateFilter('flipH', !filters.flipH)}>
                  Flip X
                </Button>
                <Button variant="outline" size="sm" onClick={() => updateFilter('flipV', !filters.flipV)}>
                  Flip Y
                </Button>
              </div>
            </div>

            {/* Sliders */}
            <div className="space-y-4">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Filters</label>
              
              <RangeControl 
                label="Brightness" 
                value={filters.brightness} 
                min={0} max={200} 
                onChange={(v) => updateFilter('brightness', v)} 
              />
              <RangeControl 
                label="Contrast" 
                value={filters.contrast} 
                min={0} max={200} 
                onChange={(v) => updateFilter('contrast', v)} 
              />
              <RangeControl 
                label="Saturation" 
                value={filters.saturation} 
                min={0} max={200} 
                onChange={(v) => updateFilter('saturation', v)} 
              />
              <RangeControl 
                label="Invert" 
                value={filters.invert} 
                min={0} max={100} 
                onChange={(v) => updateFilter('invert', v)} 
              />
              <RangeControl 
                label="Pixelate" 
                value={filters.pixelate} 
                min={0} max={50} 
                onChange={(v) => updateFilter('pixelate', v)} 
              />
               <RangeControl 
                label="Blur" 
                value={filters.blur} 
                min={0} max={10} 
                step={0.5}
                onChange={(v) => updateFilter('blur', v)} 
              />
              <RangeControl 
                label="Grayscale" 
                value={filters.grayscale} 
                min={0} max={100} 
                onChange={(v) => updateFilter('grayscale', v)} 
              />
              <RangeControl 
                label="Sepia" 
                value={filters.sepia} 
                min={0} max={100} 
                onChange={(v) => updateFilter('sepia', v)} 
              />
            </div>
          </div>

          <div className="p-5 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
            <Button className="w-full mb-2" size="lg" onClick={handleDownload}>
              <Download className="w-4 h-4 mr-2" /> Download Image
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
      <span className="text-sm text-slate-700 dark:text-slate-300">{label}</span>
      <span className="text-sm text-slate-500">{value}</span>
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