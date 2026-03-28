import React, { useRef, useState } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { Button } from './Button';

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
  accept?: string;
  className?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  onImageSelect, 
  accept = "image/*",
  className 
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        onImageSelect(file);
      }
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageSelect(e.target.files[0]);
    }
  };

  return (
    <div 
      className={`w-full min-h-[400px] flex flex-col items-center justify-center border-2 border-dashed rounded-xl transition-all duration-200 cursor-pointer ${
        isDragging 
          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
          : 'border-slate-300 dark:border-slate-700 hover:border-primary-400 dark:hover:border-primary-500 bg-slate-50 dark:bg-dark-900'
      } ${className}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <input 
        type="file" 
        ref={fileInputRef}
        className="hidden" 
        accept={accept}
        onChange={handleFileInput}
      />
      
      <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-full shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
        <Upload className="w-8 h-8 text-primary-600 dark:text-primary-400" />
      </div>
      
      <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
        Upload an Image
      </h3>
      <p className="text-slate-500 dark:text-slate-400 text-center max-w-sm mb-6">
        Drag and drop your image here, or click to browse.
        <br />
        <span className="text-xs opacity-75">Processed locally in your browser. 100% Private.</span>
      </p>
      
      <Button>Select Image</Button>
    </div>
  );
};
