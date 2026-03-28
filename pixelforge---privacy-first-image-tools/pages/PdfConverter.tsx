import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import { ToolLayout } from '../components/ToolLayout';
import { ImageUploader } from '../components/ImageUploader';
import { Button } from '../components/Button';
import { TOOLS } from '../constants';
import { readFileAsDataURL, loadImage } from '../utils/imageUtils';
import { Trash2, MoveUp, MoveDown, FileText, Plus } from 'lucide-react';

export const PdfConverter = () => {
  const [images, setImages] = useState<{file: File, preview: string}[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const toolInfo = TOOLS.find(t => t.id === 'pdf')!;

  const handleFileSelect = async (file: File) => {
    const preview = await readFileAsDataURL(file);
    setImages(prev => [...prev, { file, preview }]);
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const moveImage = (index: number, direction: -1 | 1) => {
    const newImages = [...images];
    const targetIndex = index + direction;
    if (targetIndex >= 0 && targetIndex < newImages.length) {
      [newImages[index], newImages[targetIndex]] = [newImages[targetIndex], newImages[index]];
      setImages(newImages);
    }
  };

  const generatePDF = async () => {
    if (images.length === 0) return;
    setIsGenerating(true);

    try {
      const doc = new jsPDF();
      
      for (let i = 0; i < images.length; i++) {
        const imgData = images[i].preview;
        const img = await loadImage(imgData);
        
        // Calculate dimensions to fit PDF (A4: 210x297mm)
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        
        const imgRatio = img.width / img.height;
        let renderWidth = pageWidth;
        let renderHeight = renderWidth / imgRatio;
        
        if (renderHeight > pageHeight) {
          renderHeight = pageHeight;
          renderWidth = renderHeight * imgRatio;
        }
        
        // Center image
        const x = (pageWidth - renderWidth) / 2;
        const y = (pageHeight - renderHeight) / 2;

        if (i > 0) doc.addPage();
        doc.addImage(imgData, 'JPEG', x, y, renderWidth, renderHeight);
      }

      doc.save('images.pdf');
    } catch (e) {
      console.error(e);
      alert('Error generating PDF');
    } finally {
      setIsGenerating(false);
    }
  };

  const content = (
    <div className="p-8 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/30">
      <div className="max-w-3xl mx-auto prose dark:prose-invert">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">JPG to PDF Converter</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          Combine multiple images into a single PDF document for free. 
          Supports JPG, PNG, and other common image formats. Ideal for creating portfolios, 
          archiving receipts, or sharing photo collections in a single file.
        </p>
        
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">Features</h3>
        <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-400 mb-6">
          <li><strong>Bulk Conversion:</strong> Add as many images as you want.</li>
          <li><strong>Reorder:</strong> Easily drag or move images to change their page order in the PDF.</li>
          <li><strong>Client-Side:</strong> Generation happens in your browser—your sensitive documents are never uploaded.</li>
        </ul>
      </div>
    </div>
  );

  return (
    <ToolLayout title={toolInfo.name} description={toolInfo.description} icon={toolInfo.icon} onReset={() => setImages([])} toolId={toolInfo.id}>
      <div className="p-6 max-w-4xl mx-auto">
        
        {images.length === 0 ? (
             <ImageUploader onImageSelect={handleFileSelect} className="mb-8" />
        ) : (
            <div className="mb-8">
               <div className="flex justify-between items-center mb-4">
                 <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                   {images.length} Image{images.length !== 1 && 's'} Selected
                 </h3>
                 <div className="relative">
                   <input 
                    type="file" 
                    multiple 
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={(e) => {
                      if (e.target.files) {
                        Array.from(e.target.files).forEach(handleFileSelect);
                      }
                    }}
                   />
                   <Button variant="outline" size="sm">
                      <Plus className="w-4 h-4 mr-2" /> Add More
                   </Button>
                 </div>
               </div>
               
               <div className="grid gap-4">
                 {images.map((img, idx) => (
                   <div key={idx} className="flex items-center gap-4 bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                      <div className="w-16 h-16 bg-slate-100 dark:bg-black/20 rounded overflow-hidden flex-shrink-0">
                        <img src={img.preview} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate dark:text-white">{img.file.name}</p>
                        <p className="text-xs text-slate-500">{(img.file.size / 1024).toFixed(1)} KB</p>
                      </div>
                      <div className="flex gap-1">
                         <button onClick={() => moveImage(idx, -1)} disabled={idx === 0} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded disabled:opacity-30">
                           <MoveUp className="w-4 h-4" />
                         </button>
                         <button onClick={() => moveImage(idx, 1)} disabled={idx === images.length - 1} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded disabled:opacity-30">
                           <MoveDown className="w-4 h-4" />
                         </button>
                         <button onClick={() => removeImage(idx)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded ml-2">
                           <Trash2 className="w-4 h-4" />
                         </button>
                      </div>
                   </div>
                 ))}
               </div>
            </div>
        )}

        {images.length > 0 && (
          <div className="flex justify-center">
            <Button size="lg" onClick={generatePDF} disabled={isGenerating} className="w-full md:w-auto md:min-w-[200px]">
              {isGenerating ? 'Generating PDF...' : 'Convert to PDF'}
              {!isGenerating && <FileText className="w-4 h-4 ml-2" />}
            </Button>
          </div>
        )}
      </div>
      {content}
    </ToolLayout>
  );
};