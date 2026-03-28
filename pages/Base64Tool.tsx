import React, { useState } from 'react';
import { ToolLayout } from '../components/ToolLayout';
import { ImageUploader } from '../components/ImageUploader';
import { Button } from '../components/Button';
import { TOOLS } from '../constants';
import { readFileAsDataURL } from '../utils/imageUtils';
import { Copy, Check, ArrowRight, Image as ImageIcon, FileText } from 'lucide-react';

export const Base64Tool = () => {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [file, setFile] = useState<File | null>(null);
  const [base64, setBase64] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const toolInfo = TOOLS.find(t => t.id === 'base64')!;

  const handleFileSelect = async (selectedFile: File) => {
    setFile(selectedFile);
    const data = await readFileAsDataURL(selectedFile);
    setBase64(data);
  };

  const handleBase64Input = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBase64(e.target.value);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(base64);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const reset = () => {
    setFile(null);
    setBase64('');
  };

  const content = (
    <div className="p-8 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/30">
      <div className="max-w-3xl mx-auto prose dark:prose-invert">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Image to Base64 Converter</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          Convert images to Base64 strings or decode Base64 strings back to images. 
          This tool is essential for developers who need to embed images directly into HTML or CSS files 
          using Data URIs.
        </p>
        
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">What is Base64?</h3>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          Base64 is a binary-to-text encoding scheme that represents binary data (like images) in an ASCII string format. 
          It allows you to embed images directly into your code, reducing the number of HTTP requests a webpage needs to make.
        </p>

        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">How to use</h3>
        <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-400">
          <li><strong>Encode:</strong> Upload an image file, and copy the generated string.</li>
          <li><strong>Decode:</strong> Paste a Base64 string into the text box to view the image.</li>
          <li><strong>CSS/HTML:</strong> Use the result in <code>&lt;img src="..."&gt;</code> or <code>background-image: url(...)</code>.</li>
        </ul>
      </div>
    </div>
  );

  return (
    <ToolLayout title={toolInfo.name} description={toolInfo.description} icon={toolInfo.icon} onReset={reset} toolId={toolInfo.id}>
      <div className="p-6">
        {/* Toggle Mode */}
        <div className="flex justify-center mb-8">
           <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-lg flex">
              <button 
                onClick={() => { setMode('encode'); reset(); }}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${mode === 'encode' ? 'bg-white dark:bg-slate-700 shadow text-primary-600 dark:text-primary-400' : 'text-slate-500'}`}
              >
                Image to Base64
              </button>
              <button 
                onClick={() => { setMode('decode'); reset(); }}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${mode === 'decode' ? 'bg-white dark:bg-slate-700 shadow text-primary-600 dark:text-primary-400' : 'text-slate-500'}`}
              >
                Base64 to Image
              </button>
           </div>
        </div>

        {mode === 'encode' ? (
           <div className="grid lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                 <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2"><ImageIcon className="w-4 h-4"/> Input Image</h3>
                 {!file ? (
                    <ImageUploader onImageSelect={handleFileSelect} className="min-h-[300px]" />
                 ) : (
                    <div className="bg-slate-100 dark:bg-black/30 p-4 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center h-[300px]">
                        <img src={base64} className="max-h-full max-w-full object-contain" alt="Preview" />
                    </div>
                 )}
              </div>
              <div className="space-y-4">
                 <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2"><FileText className="w-4 h-4"/> Base64 Output</h3>
                 <div className="relative h-[300px]">
                    <textarea 
                        className="w-full h-full p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono text-slate-600 dark:text-slate-400 resize-none focus:ring-2 focus:ring-primary-500 outline-none custom-scrollbar"
                        readOnly
                        value={base64}
                        placeholder="Upload an image to see Base64 string..."
                    />
                    {base64 && (
                        <div className="absolute top-4 right-4">
                             <Button size="sm" onClick={copyToClipboard}>
                                {copied ? <Check className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
                                {copied ? 'Copied' : 'Copy'}
                             </Button>
                        </div>
                    )}
                </div>
              </div>
           </div>
        ) : (
           <div className="grid lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                 <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2"><FileText className="w-4 h-4"/> Base64 Input</h3>
                 <textarea 
                    className="w-full h-[300px] p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono text-slate-600 dark:text-slate-400 resize-none focus:ring-2 focus:ring-primary-500 outline-none custom-scrollbar"
                    value={base64}
                    onChange={handleBase64Input}
                    placeholder="Paste Base64 string here (e.g. data:image/png;base64,...)"
                 />
              </div>
              <div className="space-y-4">
                 <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2"><ImageIcon className="w-4 h-4"/> Image Preview</h3>
                 <div className="bg-slate-100 dark:bg-black/30 p-4 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center h-[300px]">
                    {base64 ? (
                        <img src={base64} className="max-h-full max-w-full object-contain" alt="Preview" onError={(e) => (e.currentTarget.src = '')} />
                    ) : (
                        <span className="text-slate-400 text-sm">Image will appear here</span>
                    )}
                 </div>
              </div>
           </div>
        )}
      </div>
      {content}
    </ToolLayout>
  );
};