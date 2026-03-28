import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { ToolLayout } from '../components/ToolLayout';
import { Button } from '../components/Button';
import { TOOLS } from '../constants';
import { downloadImage } from '../utils/imageUtils';
import { Download, Link, Type, QrCode } from 'lucide-react';

export const QrCodeGenerator = () => {
  const [text, setText] = useState('https://pixelforge.app');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [errorLevel, setErrorLevel] = useState<'L'|'M'|'Q'|'H'>('M');
  
  const toolInfo = TOOLS.find(t => t.id === 'qrcode')!;

  useEffect(() => {
    generateQR();
  }, [text, errorLevel]);

  const generateQR = async () => {
    try {
      const url = await QRCode.toDataURL(text, {
        width: 400,
        margin: 2,
        errorCorrectionLevel: errorLevel,
        color: {
            dark: '#000000',
            light: '#ffffff'
        }
      });
      setQrDataUrl(url);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownload = () => {
    if (qrDataUrl) {
        downloadImage(qrDataUrl, 'qrcode.png');
    }
  };

  const content = (
    <div className="p-8 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/30">
      <div className="max-w-3xl mx-auto prose dark:prose-invert">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Free QR Code Generator</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          Create high-quality QR codes for your website URLs, text messages, or Wi-Fi passwords. 
          Generated instantly in your browser, free of charge and without any tracking.
        </p>
        
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">Uses for QR Codes</h3>
        <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-400 mb-6">
            <li><strong>Website Links:</strong> Direct users to your landing page.</li>
            <li><strong>Contact Info:</strong> Share your vCard details instantly.</li>
            <li><strong>Wi-Fi:</strong> Allow guests to join your network without typing passwords.</li>
        </ul>
      </div>
    </div>
  );

  return (
    <ToolLayout title={toolInfo.name} description={toolInfo.description} icon={toolInfo.icon} toolId={toolInfo.id}>
       <div className="grid lg:grid-cols-2 gap-8 p-6">
          <div className="space-y-6">
             <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Content</label>
                <textarea 
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="w-full h-32 p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter URL or text..."
                />
             </div>

             <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Error Correction</label>
                <div className="flex gap-2">
                    {['L', 'M', 'Q', 'H'].map(level => (
                        <button 
                            key={level}
                            onClick={() => setErrorLevel(level as any)}
                            className={`flex-1 py-2 rounded-md border text-sm font-medium transition-all ${errorLevel === level ? 'bg-primary-600 text-white border-primary-600' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'}`}
                        >
                            {level}
                        </button>
                    ))}
                </div>
                <p className="text-xs text-slate-500">Higher levels allow the QR code to be scanned even if partially damaged.</p>
             </div>
          </div>

          <div className="flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-900 p-8 rounded-xl">
              {qrDataUrl && (
                  <div className="bg-white p-4 rounded-xl shadow-lg mb-6">
                      <img src={qrDataUrl} alt="QR Code" className="w-64 h-64" />
                  </div>
              )}
              <Button size="lg" onClick={handleDownload} className="w-full max-w-xs">
                  <Download className="w-4 h-4 mr-2" /> Download PNG
              </Button>
          </div>
       </div>
       {content}
    </ToolLayout>
  );
};