import React, { useState, useEffect, useRef } from 'react';
import Cropper from 'cropperjs';
import { ToolLayout } from '../components/ToolLayout';
import { ImageUploader } from '../components/ImageUploader';
import { Button } from '../components/Button';
import { TOOLS } from '../constants';
import { readFileAsDataURL, downloadImage } from '../utils/imageUtils';
import { Download, UserCircle, ZoomIn, ZoomOut } from 'lucide-react';

export const ProfileMaker = () => {
  const [file, setFile] = useState<File | null>(null);
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const cropperRef = useRef<Cropper | null>(null);
  
  const toolInfo = TOOLS.find(t => t.id === 'profile')!;

  const handleFileSelect = async (selectedFile: File) => {
    setFile(selectedFile);
    const url = await readFileAsDataURL(selectedFile);
    setImgSrc(url);
  };

  useEffect(() => {
    if (imgSrc && imgRef.current) {
      if (cropperRef.current) cropperRef.current.destroy();
      
      cropperRef.current = new Cropper(imgRef.current, {
        aspectRatio: 1,
        viewMode: 1,
        dragMode: 'move',
        autoCropArea: 0.8,
        ready() {
            // Add custom styling for circular view if desired via CSS, but standard box is fine as we crop circle later
        }
      });
    }
    return () => { cropperRef.current?.destroy(); };
  }, [imgSrc]);

  const handleDownload = () => {
    if (!cropperRef.current) return;
    
    // Get cropped canvas
    const canvas = cropperRef.current.getCroppedCanvas({
        width: 800,
        height: 800,
    });

    if (!canvas) return;

    // Create a new canvas for the circular mask
    const circleCanvas = document.createElement('canvas');
    circleCanvas.width = canvas.width;
    circleCanvas.height = canvas.height;
    const ctx = circleCanvas.getContext('2d');
    
    if (!ctx) return;
    
    // Draw circle mask
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.clip();
    
    // Draw original image
    ctx.drawImage(canvas, 0, 0);
    
    downloadImage(circleCanvas.toDataURL('image/png'), `profile-${file?.name.replace(/\.[^/.]+$/, "")}.png`);
  };

  const reset = () => {
    setFile(null);
    setImgSrc(null);
  };

  const content = (
    <div className="p-8 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/30">
      <div className="max-w-3xl mx-auto prose dark:prose-invert">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Profile Picture Maker</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          Create perfect circular profile pictures for social media (Instagram, LinkedIn, Twitter, etc.).
          Crop your image to a circle and download it as a transparent PNG.
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
       <div className="flex flex-col lg:flex-row h-[calc(100vh-200px)] min-h-[500px]">
           
           <div className="flex-1 bg-slate-900 p-4 flex items-center justify-center overflow-hidden">
             {imgSrc && (
                <div className="max-w-full max-h-full">
                    <img ref={imgRef} src={imgSrc} alt="Edit" className="max-w-full" />
                </div>
             )}
           </div>

           <div className="w-full lg:w-72 bg-white dark:bg-slate-800 p-6 border-t lg:border-l border-slate-200 dark:border-slate-700 z-10">
               <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Profile Settings</h3>
               <p className="text-sm text-slate-500 mb-6">
                   Drag the image to position your face in the center of the square. It will be cropped into a circle automatically upon download.
               </p>
               
               <div className="flex gap-2 mb-6">
                   <Button variant="outline" className="flex-1" onClick={() => cropperRef.current?.zoom(0.1)}>
                       <ZoomIn className="w-4 h-4" />
                   </Button>
                    <Button variant="outline" className="flex-1" onClick={() => cropperRef.current?.zoom(-0.1)}>
                       <ZoomOut className="w-4 h-4" />
                   </Button>
               </div>

               <Button size="lg" className="w-full" onClick={handleDownload}>
                   <Download className="w-4 h-4 mr-2" /> Download Circle PNG
               </Button>
           </div>
       </div>
       {content}
    </ToolLayout>
  );
};