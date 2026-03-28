import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Cropper from 'cropperjs';
import { ToolLayout } from '../components/ToolLayout';
import { ImageUploader } from '../components/ImageUploader';
import { Button } from '../components/Button';
import { TOOLS } from '../constants';
import { downloadImage, readFileAsDataURL } from '../utils/imageUtils';
import { Crop, Move, ZoomIn, ZoomOut, RotateCcw, RotateCw, Maximize2, Youtube, Monitor, Image } from 'lucide-react';

export const CropResize = () => {
  const [searchParams] = useSearchParams();
  // Check if we are in resize mode explicitly, otherwise default to crop interface which allows both
  const isResizeMode = window.location.pathname.includes('resize');
  const preset = searchParams.get('preset');
  
  const [file, setFile] = useState<File | null>(null);
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const cropperRef = useRef<Cropper | null>(null);
  
  // Resize specific states
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [maintainAspect, setMaintainAspect] = useState(true);

  const toolInfo = TOOLS.find(t => {
      if (preset === 'thumbnail') return t.id === 'thumbnail';
      return t.id === (isResizeMode ? 'resize' : 'crop');
  }) || TOOLS[0];

  useEffect(() => {
    if (imgSrc && imgRef.current) {
      // Destroy previous instance
      if (cropperRef.current) {
        cropperRef.current.destroy();
      }

      // Initialize Cropper
      cropperRef.current = new Cropper(imgRef.current, {
        viewMode: 1,
        dragMode: 'move',
        autoCrop: !isResizeMode, // If resizing only, don't auto crop unless in crop mode
        autoCropArea: 1,
        ready() {
          if (this.cropper) {
            const data = this.cropper.getData();
            setWidth(Math.round(data.width));
            setHeight(Math.round(data.height));

            // Apply preset if provided
            if (preset === 'thumbnail') {
                applyPreset(1280, 720);
            }
          }
        },
        crop(event) {
          setWidth(Math.round(event.detail.width));
          setHeight(Math.round(event.detail.height));
        },
      });
    }
    return () => {
      cropperRef.current?.destroy();
    };
  }, [imgSrc, isResizeMode]);

  const handleFileSelect = async (selectedFile: File) => {
    setFile(selectedFile);
    const url = await readFileAsDataURL(selectedFile);
    setImgSrc(url);
  };

  const handleDownload = () => {
    if (!cropperRef.current) return;
    
    const canvas = cropperRef.current.getCroppedCanvas({
        width: width, // This applies the resize if user changed inputs
        height: height,
        fillColor: '#fff', // For transparent JPEGs
    });

    if (canvas) {
      downloadImage(canvas.toDataURL(file?.type || 'image/png'), `edited-${file?.name}`);
    }
  };

  const handleDimensionChange = (type: 'w' | 'h', val: number) => {
    if (!cropperRef.current) return;
    
    const data = cropperRef.current.getData();
    const ratio = data.width / data.height;
    
    if (type === 'w') {
      setWidth(val);
      if (maintainAspect) setHeight(Math.round(val / ratio));
    } else {
      setHeight(val);
      if (maintainAspect) setWidth(Math.round(val * ratio));
    }
  };

  const applyPreset = (w: number, h: number) => {
      setMaintainAspect(false);
      // Small timeout to let aspect state update
      setTimeout(() => {
          setWidth(w);
          setHeight(h);
      }, 0);
  };

  const setAspectRatio = (ratio: number) => {
    cropperRef.current?.setAspectRatio(ratio);
  };

  const reset = () => {
    setFile(null);
    setImgSrc(null);
    cropperRef.current?.destroy();
    cropperRef.current = null;
  };

  const getContent = () => {
      if (preset === 'thumbnail') {
          return (
            <>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">YouTube Thumbnail Maker</h2>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                  Create perfectly sized thumbnails for YouTube (1280x720) or other social media platforms.
                  Resize your images instantly to fit requirements without installing complex software.
              </p>
            </>
          );
      }
      return (
        <>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
            {isResizeMode ? 'Free Image Resizer Online' : 'Free Image Cropper Online'}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            {isResizeMode 
                ? 'Resize your images to exact pixel dimensions or change their aspect ratio. Perfect for preparing images for social media, websites, or print. ' 
                : 'Crop your photos to remove unwanted areas or focus on the subject. Use preset aspect ratios like 1:1 (Square), 16:9 (Widescreen), or 4:3 to frame your shot perfectly.'
            }
             Our tools work instantly in your browser with no quality loss.
        </p>
        </>
      );
  };

  const content = (
    <div className="p-8 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/30">
      <div className="max-w-3xl mx-auto prose dark:prose-invert">
        {getContent()}
        
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">Features</h3>
        <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-400 mb-6">
          <li><strong>Precision Control:</strong> Input exact width and height values.</li>
          <li><strong>Lock Aspect Ratio:</strong> Ensure your images don't get stretched or distorted.</li>
          <li><strong>Presets:</strong> Quickly select common sizes for Instagram, Facebook, and Twitter.</li>
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
       <div className="flex flex-col lg:flex-row h-[calc(100vh-200px)] min-h-[600px]">
         
         {/* Main Editor */}
         <div className="flex-1 bg-slate-900 p-4 flex items-center justify-center overflow-hidden">
            {imgSrc && (
              <div className="max-w-full max-h-full">
                 <img ref={imgRef} src={imgSrc} alt="Edit" className="max-w-full" />
              </div>
            )}
         </div>

         {/* Sidebar */}
         <div className="w-full lg:w-80 bg-white dark:bg-slate-800 border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-700 flex flex-col z-10 shadow-xl">
            <div className="p-5 border-b border-slate-200 dark:border-slate-700">
              <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                {isResizeMode ? <Maximize2 className="w-4 h-4" /> : <Crop className="w-4 h-4" />}
                Controls
              </h3>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">
              
              {/* Dimensions Section */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Dimensions (px)</label>
                <div className="grid grid-cols-2 gap-2">
                   <div className="space-y-1">
                     <label className="text-xs text-slate-400">Width</label>
                     <input 
                        type="number" 
                        value={width} 
                        onChange={(e) => handleDimensionChange('w', Number(e.target.value))}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-sm"
                     />
                   </div>
                   <div className="space-y-1">
                     <label className="text-xs text-slate-400">Height</label>
                     <input 
                        type="number" 
                        value={height} 
                        onChange={(e) => handleDimensionChange('h', Number(e.target.value))}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-sm"
                     />
                   </div>
                </div>
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="aspect" 
                    checked={maintainAspect} 
                    onChange={(e) => setMaintainAspect(e.target.checked)}
                    className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                  />
                  <label htmlFor="aspect" className="ml-2 text-sm text-slate-600 dark:text-slate-300">Maintain Aspect Ratio</label>
                </div>
              </div>

              {isResizeMode && (
                <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Presets</label>
                    <div className="grid grid-cols-2 gap-2">
                        <Button variant="outline" size="sm" onClick={() => applyPreset(1280, 720)} className="justify-start">
                            <Youtube className="w-3 h-3 mr-2" /> YouTube (720p)
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => applyPreset(1920, 1080)} className="justify-start">
                            <Monitor className="w-3 h-3 mr-2" /> HD (1080p)
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => applyPreset(1080, 1080)} className="justify-start">
                            <Image className="w-3 h-3 mr-2" /> Insta Square
                        </Button>
                         <Button variant="outline" size="sm" onClick={() => applyPreset(1080, 1350)} className="justify-start">
                            <Image className="w-3 h-3 mr-2" /> Insta Portrait
                        </Button>
                    </div>
                </div>
              )}

              {!isResizeMode && (
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Aspect Ratio</label>
                  <div className="grid grid-cols-3 gap-2">
                    <Button variant="outline" size="sm" onClick={() => setAspectRatio(NaN)}>Free</Button>
                    <Button variant="outline" size="sm" onClick={() => setAspectRatio(1)}>1:1</Button>
                    <Button variant="outline" size="sm" onClick={() => setAspectRatio(16/9)}>16:9</Button>
                    <Button variant="outline" size="sm" onClick={() => setAspectRatio(4/3)}>4:3</Button>
                    <Button variant="outline" size="sm" onClick={() => setAspectRatio(2/3)}>2:3</Button>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tools</label>
                <div className="flex flex-wrap gap-2">
                   <Button variant="ghost" size="sm" onClick={() => cropperRef.current?.rotate(-90)} title="Rotate Left">
                      <RotateCcw className="w-4 h-4" />
                   </Button>
                   <Button variant="ghost" size="sm" onClick={() => cropperRef.current?.rotate(90)} title="Rotate Right">
                      <RotateCw className="w-4 h-4" />
                   </Button>
                   <Button variant="ghost" size="sm" onClick={() => cropperRef.current?.zoom(0.1)} title="Zoom In">
                      <ZoomIn className="w-4 h-4" />
                   </Button>
                   <Button variant="ghost" size="sm" onClick={() => cropperRef.current?.zoom(-0.1)} title="Zoom Out">
                      <ZoomOut className="w-4 h-4" />
                   </Button>
                   <Button variant="ghost" size="sm" onClick={() => cropperRef.current?.setDragMode('move')} title="Move">
                      <Move className="w-4 h-4" />
                   </Button>
                   <Button variant="ghost" size="sm" onClick={() => cropperRef.current?.setDragMode('crop')} title="Crop">
                      <Crop className="w-4 h-4" />
                   </Button>
                </div>
              </div>

            </div>

            <div className="p-5 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
              <Button className="w-full" size="lg" onClick={handleDownload}>
                Download Result
              </Button>
            </div>
         </div>
       </div>
       {content}
    </ToolLayout>
  );
};