import React, { useState, useEffect } from 'react';
import EXIF from 'exif-js';
import { ToolLayout } from '../components/ToolLayout';
import { ImageUploader } from '../components/ImageUploader';
import { TOOLS } from '../constants';

export const ExifViewer = () => {
  const [file, setFile] = useState<File | null>(null);
  const [metadata, setMetadata] = useState<Record<string, any> | null>(null);
  const [loading, setLoading] = useState(false);
  
  const toolInfo = TOOLS.find(t => t.id === 'exif')!;

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setLoading(true);
    
    // Read EXIF
    // @ts-ignore - EXIF js type definition might be missing in this env
    EXIF.getData(selectedFile, function() {
      // @ts-ignore
      const allTags = EXIF.getAllTags(this);
      setMetadata(allTags);
      setLoading(false);
    });
  };

  const reset = () => {
    setFile(null);
    setMetadata(null);
  };

  const content = (
    <div className="p-8 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/30">
      <div className="max-w-3xl mx-auto prose dark:prose-invert">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">EXIF Data Viewer</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          View the hidden metadata stored inside your photos. EXIF (Exchangeable Image File Format) data contains details like 
          camera model, shutter speed, aperture, ISO, and even GPS location.
        </p>
        
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">Why check EXIF data?</h3>
        <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-400 mb-6">
          <li><strong>Photography Learning:</strong> See what settings were used to take a great shot.</li>
          <li><strong>Privacy Check:</strong> Ensure your photos don't contain sensitive GPS location data before sharing them online.</li>
          <li><strong>Copyright Info:</strong> Check for artist or copyright information embedded in the file.</li>
        </ul>

        <p className="text-slate-600 dark:text-slate-400">
          Note: Many social media platforms automatically strip EXIF data when you upload images. 
          Use this tool on original files for the best results.
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
      <div className="p-6">
         <h2 className="text-xl font-semibold mb-6 text-slate-900 dark:text-white">Image Metadata: {file.name}</h2>
         
         {loading ? (
           <div className="text-center py-10">Reading metadata...</div>
         ) : (
           <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
             <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
               <thead className="bg-slate-50 dark:bg-slate-800">
                 <tr>
                   <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Tag Name</th>
                   <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Value</th>
                 </tr>
               </thead>
               <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-800">
                 {/* Basic File Info Row */}
                 <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-white">File Size</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{(file.size / 1024).toFixed(2)} KB</td>
                 </tr>
                 <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-white">MIME Type</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{file.type}</td>
                 </tr>

                 {metadata && Object.keys(metadata).length > 0 ? (
                   Object.entries(metadata).map(([key, value]) => {
                     // Filter out binary thumbnails or complex objects for clean display
                     if (typeof value === 'object' || key === 'thumbnail') return null;
                     return (
                       <tr key={key}>
                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-white">{key}</td>
                         <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{String(value)}</td>
                       </tr>
                     );
                   })
                 ) : (
                    <tr>
                      <td colSpan={2} className="px-6 py-8 text-center text-slate-500">No EXIF data found in this image.</td>
                    </tr>
                 )}
               </tbody>
             </table>
           </div>
         )}
      </div>
      {content}
    </ToolLayout>
  );
};