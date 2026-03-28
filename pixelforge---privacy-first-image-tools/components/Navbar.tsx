import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Palette, Github, Sun, Moon, Menu, X, ChevronDown, Sparkles, ChevronRight } from 'lucide-react';
import { Button } from './Button';
import { APP_NAME, TOOLS } from '../constants';
import { ToolCategory } from '../types';

export const Navbar = () => {
  const [isDark, setIsDark] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [mobileOpenCategory, setMobileOpenCategory] = useState<string | null>(null);
  const location = useLocation();

  // Initialize theme state
  useEffect(() => {
    if (document.documentElement.classList.contains('dark')) {
      setIsDark(true);
    }
  }, []);

  const toggleTheme = () => {
    if (document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
  };

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setMobileOpenCategory(null);
  }, [location]);

  const toggleMobileCategory = (category: string) => {
    setMobileOpenCategory(prev => prev === category ? null : category);
  };

  const categories = Object.values(ToolCategory);
  const getToolsByCategory = (cat: ToolCategory) => TOOLS.filter(t => t.category === cat);

  return (
    <nav 
      className={`sticky top-0 z-50 w-full transition-all duration-500 border-b ${
        isScrolled || isMobileMenuOpen
          ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-slate-200 dark:border-slate-800 shadow-sm' 
          : 'bg-transparent border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group relative z-50">
            <div className="relative">
              <div className="absolute inset-0 bg-primary-500 blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-500 rounded-full"></div>
              <div className="relative p-2 bg-gradient-to-br from-white to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm group-hover:shadow-md transition-all duration-300 group-hover:scale-105 group-hover:rotate-3">
                <Palette className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-primary-800 to-slate-900 dark:from-white dark:via-primary-200 dark:to-white">
                {APP_NAME}
              </span>
              <span className="text-[10px] uppercase tracking-widest font-bold text-primary-600 dark:text-primary-400 opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-y-2 group-hover:translate-y-0">
                Premium Tools
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Tools Dropdown Group */}
            <div className="relative group px-3 py-2">
              <button className="flex items-center text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                Tools
                <ChevronDown className="w-4 h-4 ml-1 group-hover:rotate-180 transition-transform duration-300" />
              </button>
              
              {/* Mega Menu Dropdown */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-[800px] pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top scale-95 group-hover:scale-100">
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-6 overflow-hidden backdrop-blur-3xl ring-1 ring-black/5">
                  <div className="grid grid-cols-4 gap-8">
                    {categories.map((category) => (
                      <div key={category} className="space-y-4">
                        <div className="flex items-center space-x-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                            {category}
                          </span>
                        </div>
                        <ul className="space-y-2">
                          {getToolsByCategory(category as ToolCategory).slice(0, 5).map((tool) => (
                            <li key={tool.id}>
                              <Link 
                                to={tool.path}
                                className="group/item flex items-start space-x-3 p-2 -mx-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                              >
                                <div className="mt-0.5 text-slate-400 group-hover/item:text-primary-500 transition-colors">
                                  {React.cloneElement(tool.icon as React.ReactElement, { size: 16 })}
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-slate-700 dark:text-slate-200 group-hover/item:text-primary-600 dark:group-hover/item:text-primary-400">
                                    {tool.name}
                                  </div>
                                </div>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                     <div className="text-xs text-slate-500">
                       <Sparkles className="w-3 h-3 inline mr-1 text-amber-500" />
                       All processing happens in your browser
                     </div>
                     <Link to="/tools" className="text-xs font-medium text-primary-600 hover:text-primary-700 flex items-center">
                       View all tools <ChevronRight className="w-3 h-3 ml-1" />
                     </Link>
                  </div>
                </div>
              </div>
            </div>

            <Link to="/about" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              About
            </Link>
            <Link to="/contact" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              Contact
            </Link>
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700"></div>
            <button 
              onClick={toggleTheme}
              className="p-2.5 text-slate-500 hover:text-primary-600 hover:bg-primary-50 dark:text-slate-400 dark:hover:text-primary-400 dark:hover:bg-slate-800 rounded-xl transition-all duration-200"
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noreferrer"
            >
              <Button variant="secondary" size="sm" className="rounded-lg shadow-none border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700">
                <Github className="w-4 h-4 mr-2" />
                Star on GitHub
              </Button>
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center md:hidden space-x-4">
             <button 
              onClick={toggleTheme}
              className="p-2 text-slate-500 dark:text-slate-400"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div 
        className={`md:hidden fixed inset-0 z-40 bg-white dark:bg-slate-900 transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'
        }`}
        style={{ top: '80px', height: 'calc(100vh - 80px)' }}
      >
        <div className="flex flex-col h-full overflow-y-auto pb-20">
          <div className="p-4 space-y-2">
             {categories.map((category) => (
                <div key={category} className="border-b border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => toggleMobileCategory(category)}
                    className="w-full flex items-center justify-between py-4 px-2 text-left"
                  >
                    <span className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                      {category}
                    </span>
                    <ChevronDown 
                      className={`w-5 h-5 text-slate-500 transition-transform duration-200 ${
                        mobileOpenCategory === category ? 'rotate-180' : ''
                      }`} 
                    />
                  </button>
                  
                  <div 
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      mobileOpenCategory === category ? 'max-h-[1000px] opacity-100 mb-4' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="grid grid-cols-1 gap-2 px-2">
                      {getToolsByCategory(category as ToolCategory).map((tool) => (
                        <Link
                          key={tool.id}
                          to={tool.path}
                          className="flex items-center space-x-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-800 transition-colors"
                        >
                          <div className="text-primary-500">
                             {React.cloneElement(tool.icon as React.ReactElement, { size: 20 })}
                          </div>
                          <span className="font-medium text-slate-700 dark:text-slate-200">
                            {tool.name}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
             ))}

             <div className="pt-6 space-y-4 px-2">
                <Link to="/tools" className="block text-lg font-medium text-slate-900 dark:text-white py-2">All Tools</Link>
                <Link to="/about" className="block text-lg font-medium text-slate-900 dark:text-white py-2">About Us</Link>
                <Link to="/contact" className="block text-lg font-medium text-slate-900 dark:text-white py-2">Contact</Link>
             </div>
          </div>
        </div>
      </div>
    </nav>
  );
};