import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Zap, Lock, WifiOff, Lightbulb, ArrowRight, ChevronDown, Upload, Cpu, Download } from 'lucide-react';
import { TOOLS } from '../constants';
import { Button } from '../components/Button';

export const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const filteredTools = TOOLS.filter(tool => 
    tool.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    tool.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categories = Array.from(new Set(filteredTools.map(t => t.category)));

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="pb-20">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-slate-50 dark:bg-dark-900 pt-20 pb-24">
         {/* Background Blobs */}
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 pointer-events-none overflow-hidden">
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary-200/30 dark:bg-primary-900/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-200/30 dark:bg-blue-900/10 rounded-full blur-3xl"></div>
         </div>

        <div className="text-center max-w-4xl mx-auto px-4 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 text-xs font-bold uppercase tracking-wider mb-6 border border-primary-100 dark:border-primary-800">
                <Zap className="w-3 h-3" />
                <span>v2.0 Now Available</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 dark:text-white mb-8 leading-tight">
            The Ultimate <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-blue-600 dark:from-primary-400 dark:to-blue-400">Browser-Based</span> Toolkit
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Edit, convert, and optimize images instantly. No file uploads, no waiting, and 100% private processing power directly on your device.
            </p>

            {/* Search */}
            <div className="relative max-w-xl mx-auto mb-12">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-slate-400" />
                </div>
                <input
                    type="text"
                    className="block w-full pl-12 pr-4 py-5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 shadow-2xl shadow-slate-200/50 dark:shadow-none transition-all"
                    placeholder="Search for tools (e.g. 'Compress', 'Crop', 'PDF')..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>
      </div>

      {/* Features Grid / Benefits */}
      {!searchTerm && (
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20 mb-20">
            <div className="grid md:grid-cols-3 gap-6">
               <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700 flex flex-col items-center text-center">
                  <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-2xl flex items-center justify-center mb-6">
                      <Lock className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">100% Private</h3>
                  <p className="text-slate-500 dark:text-slate-400 leading-relaxed">Your files never leave your device. All processing happens locally in your browser via WebAssembly.</p>
               </div>
               <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700 flex flex-col items-center text-center">
                  <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-6">
                      <Zap className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Blazing Fast</h3>
                  <p className="text-slate-500 dark:text-slate-400 leading-relaxed">No queuing, no uploading, no downloading. Instant results regardless of your internet speed.</p>
               </div>
               <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700 flex flex-col items-center text-center">
                  <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-2xl flex items-center justify-center mb-6">
                      <WifiOff className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Offline Capable</h3>
                  <p className="text-slate-500 dark:text-slate-400 leading-relaxed">PixelForge works without an internet connection. Install it as a PWA for native-like experience.</p>
               </div>
            </div>
         </div>
      )}

      {/* Tools Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="flex items-end justify-between mb-8">
             <div>
                 <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Our Tools</h2>
                 <p className="text-slate-500 dark:text-slate-400 mt-2">Everything you need to manipulate images.</p>
             </div>
        </div>

        {filteredTools.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
            <p className="text-slate-500 text-lg">No tools found matching "{searchTerm}"</p>
            <button 
              onClick={() => setSearchTerm('')} 
              className="text-primary-600 font-medium hover:underline mt-2"
            >
              Clear search
            </button>
          </div>
        ) : (
          categories.map(category => (
            <div key={category} className="mb-16">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
                <span className="w-2 h-8 bg-primary-500 rounded-full mr-3"></span>
                {category}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredTools.filter(t => t.category === category).map((tool) => (
                  <Link 
                    key={tool.id}
                    to={tool.path}
                    className="group bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 hover:border-primary-500 dark:hover:border-primary-500 hover:shadow-xl hover:shadow-primary-500/10 transition-all duration-300 flex flex-col h-full relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ArrowRight className="w-5 h-5 text-primary-500 -rotate-45 group-hover:rotate-0 transition-transform" />
                    </div>
                    <div className="flex items-start justify-between mb-6">
                      <div className="p-3.5 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 rounded-xl group-hover:bg-primary-500 group-hover:text-white transition-all duration-300">
                        {tool.icon}
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                      {tool.name}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                      {tool.description}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* How it Works Section */}
      <div className="bg-slate-900 text-white py-24 mb-24 overflow-hidden relative">
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
         <div className="max-w-7xl mx-auto px-4 relative z-10">
             <div className="text-center mb-16">
                 <h2 className="text-3xl md:text-4xl font-bold mb-4">How PixelForge Works</h2>
                 <p className="text-slate-400 text-lg max-w-2xl mx-auto">Simple, secure, and efficient image processing in three easy steps.</p>
             </div>

             <div className="grid md:grid-cols-3 gap-12 relative">
                 {/* Connector Line */}
                 <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-slate-800 via-primary-500 to-slate-800 border-t border-dashed border-slate-600"></div>

                 <div className="relative flex flex-col items-center text-center">
                     <div className="w-24 h-24 bg-slate-800 rounded-full border-4 border-slate-700 flex items-center justify-center mb-6 relative z-10">
                         <Upload className="w-10 h-10 text-primary-400" />
                     </div>
                     <h3 className="text-xl font-bold mb-3">1. Select or Drop</h3>
                     <p className="text-slate-400">Choose an image from your device or drag and drop it directly onto the tool.</p>
                 </div>
                 
                 <div className="relative flex flex-col items-center text-center">
                     <div className="w-24 h-24 bg-slate-800 rounded-full border-4 border-slate-700 flex items-center justify-center mb-6 relative z-10">
                         <Cpu className="w-10 h-10 text-blue-400" />
                     </div>
                     <h3 className="text-xl font-bold mb-3">2. Auto Process</h3>
                     <p className="text-slate-400">Our smart algorithms process your image instantly within your browser's engine.</p>
                 </div>

                 <div className="relative flex flex-col items-center text-center">
                     <div className="w-24 h-24 bg-slate-800 rounded-full border-4 border-slate-700 flex items-center justify-center mb-6 relative z-10">
                         <Download className="w-10 h-10 text-green-400" />
                     </div>
                     <h3 className="text-xl font-bold mb-3">3. Save Result</h3>
                     <p className="text-slate-400">Download your optimized, converted, or edited image immediately. No waiting.</p>
                 </div>
             </div>
         </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-3xl mx-auto px-4 mb-24">
         <div className="text-center mb-12">
             <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Frequently Asked Questions</h2>
         </div>
         
         <div className="space-y-4">
             {[
                 { q: "Is PixelForge really free?", a: "Yes! All our tools are 100% free to use without any limits, watermarks, or hidden costs." },
                 { q: "Are my images uploaded to a server?", a: "No. We use advanced browser technologies (WebAssembly) to process images directly on your device. Your photos never leave your computer." },
                 { q: "Does it work on mobile?", a: "Absolutely. PixelForge is fully responsive and works great on iPhones, iPads, and Android devices." },
                 { q: "What file formats do you support?", a: "We support all major image formats including JPG, PNG, WebP, BMP, and SVG for certain tools." },
             ].map((faq, i) => (
                 <div key={i} className="border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 overflow-hidden">
                     <button 
                        onClick={() => toggleFaq(i)}
                        className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
                     >
                         <span className="font-semibold text-slate-900 dark:text-white">{faq.q}</span>
                         <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform ${openFaqIndex === i ? 'rotate-180' : ''}`} />
                     </button>
                     <div className={`px-5 pb-5 text-slate-600 dark:text-slate-300 transition-all ${openFaqIndex === i ? 'block' : 'hidden'}`}>
                         {faq.a}
                     </div>
                 </div>
             ))}
         </div>
      </div>

      {/* Suggest Tool Section */}
      <div className="max-w-5xl mx-auto px-4">
        <div className="bg-gradient-to-r from-primary-600 to-blue-700 rounded-3xl p-10 md:p-16 text-center text-white shadow-2xl relative overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center justify-center p-4 bg-white/10 rounded-2xl mb-8 backdrop-blur-sm border border-white/20">
              <Lightbulb className="w-8 h-8 text-yellow-300" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Have an idea for a tool?</h2>
            <p className="text-primary-100 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
              We are constantly building. If you need a specific image utility that isn't listed here, 
              let us know and we might build it for you!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="mailto:feature-requests@pixelforge.app?subject=New Tool Suggestion" className="inline-block">
                    <Button variant="secondary" size="lg" className="bg-white text-primary-700 hover:bg-slate-50 border-none shadow-lg w-full sm:w-auto">
                        Suggest a Feature
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};