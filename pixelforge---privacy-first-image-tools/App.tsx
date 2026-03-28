import React from 'react';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { AllTools } from './pages/AllTools';
import { UniversalEditor } from './pages/UniversalEditor';
import { Compressor } from './pages/Compressor';
import { Converter } from './pages/Converter';
import { Base64Tool } from './pages/Base64Tool';
import { CropResize } from './pages/CropResize';
import { ColorPicker } from './pages/ColorPicker';
import { ExifViewer } from './pages/ExifViewer';
import { MemeGenerator } from './pages/MemeGenerator';
import { PdfConverter } from './pages/PdfConverter';
import { CollageMaker } from './pages/CollageMaker';
import { Watermark } from './pages/Watermark';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { TermsOfService } from './pages/TermsOfService';
import { AboutUs } from './pages/AboutUs';
import { ContactUs } from './pages/ContactUs';
import { PaletteGenerator } from './pages/PaletteGenerator';
import { QrCodeGenerator } from './pages/QrCodeGenerator';
import { ImageCompare } from './pages/ImageCompare';
import { ExifRemover } from './pages/ExifRemover';
import { RoundedCorners } from './pages/RoundedCorners';
import { ImageSplitter } from './pages/ImageSplitter';
import { AspectRatioCalculator } from './pages/AspectRatioCalculator';
import { ProfileMaker } from './pages/ProfileMaker';

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-dark-900">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tools" element={<AllTools />} />
            
            {/* Tool Routes */}
            <Route path="/tool/compressor" element={<Compressor />} />
            <Route path="/tool/converter" element={<Converter />} />
            <Route path="/tool/editor" element={<UniversalEditor />} />
            <Route path="/tool/base64" element={<Base64Tool />} />
            <Route path="/tool/crop" element={<CropResize />} />
            <Route path="/tool/resize" element={<CropResize />} />
            <Route path="/tool/picker" element={<ColorPicker />} />
            <Route path="/tool/exif" element={<ExifViewer />} />
            <Route path="/tool/meme" element={<MemeGenerator />} />
            <Route path="/tool/pdf" element={<PdfConverter />} />
            <Route path="/tool/collage" element={<CollageMaker />} />
            <Route path="/tool/watermark" element={<Watermark />} />
            
            {/* New Utility Tools */}
            <Route path="/tool/palette" element={<PaletteGenerator />} />
            <Route path="/tool/qrcode" element={<QrCodeGenerator />} />
            <Route path="/tool/compare" element={<ImageCompare />} />
            <Route path="/tool/scrubber" element={<ExifRemover />} />

            {/* New Tools (8 per category update) */}
            <Route path="/tool/corners" element={<RoundedCorners />} />
            <Route path="/tool/splitter" element={<ImageSplitter />} />
            <Route path="/tool/aspect" element={<AspectRatioCalculator />} />
            <Route path="/tool/profile" element={<ProfileMaker />} />

            {/* Legal & Info Routes */}
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<ContactUs />} />

            {/* Fallback */}
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
        
        <footer className="py-12 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-dark-900">
          <div className="max-w-7xl mx-auto px-4 text-center">
             <div className="grid md:grid-cols-4 gap-8 mb-8 text-left">
                <div>
                    <h3 className="font-bold text-slate-900 dark:text-white mb-4">PixelForge</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Professional image tools running entirely in your browser. 
                        Secure, fast, and free forever.
                    </p>
                </div>
                <div>
                    <h3 className="font-bold text-slate-900 dark:text-white mb-4">Tools</h3>
                    <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
                        <li><Link to="/tool/compressor" className="hover:text-primary-500">Compressor</Link></li>
                        <li><Link to="/tool/converter" className="hover:text-primary-500">Converter</Link></li>
                        <li><Link to="/tool/crop" className="hover:text-primary-500">Cropper</Link></li>
                        <li><Link to="/tool/editor" className="hover:text-primary-500">Editor</Link></li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-bold text-slate-900 dark:text-white mb-4">Legal</h3>
                    <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
                        <li><Link to="/privacy" className="hover:text-primary-500">Privacy Policy</Link></li>
                        <li><Link to="/terms" className="hover:text-primary-500">Terms of Service</Link></li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-bold text-slate-900 dark:text-white mb-4">Company</h3>
                    <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
                        <li><Link to="/about" className="hover:text-primary-500">About Us</Link></li>
                        <li><Link to="/contact" className="hover:text-primary-500">Contact Us</Link></li>
                    </ul>
                </div>
             </div>
             
             <div className="pt-8 border-t border-slate-100 dark:border-slate-800 text-slate-400 text-sm">
                <p>&copy; {new Date().getFullYear()} PixelForge. All rights reserved.</p>
             </div>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;