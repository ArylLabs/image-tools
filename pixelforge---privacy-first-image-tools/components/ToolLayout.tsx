import React from 'react';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from './Button';
import { TOOLS } from '../constants';

interface ToolLayoutProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  toolId?: string;
  onReset?: () => void;
  children: React.ReactNode;
}

export const ToolLayout: React.FC<ToolLayoutProps> = ({
  title,
  description,
  icon,
  toolId,
  onReset,
  children
}) => {
  // Calculate related tools
  const getRelatedTools = () => {
    const currentTool = toolId ? TOOLS.find(t => t.id === toolId) : null;
    const category = currentTool?.category;
    
    // Start with tools in same category, excluding current
    let related = TOOLS.filter(t => t.category === category && t.id !== toolId);
    
    // If not enough, fill with other tools (excluding current)
    if (related.length < 4) {
        const others = TOOLS.filter(t => t.category !== category && t.id !== toolId);
        // Shuffle/Randomize 'others' slightly for variety could be good, but simple slice is fine
        related = [...related, ...others];
    }
    
    return related.slice(0, 4);
  };

  const relatedTools = getRelatedTools();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link 
            to="/" 
            className="inline-flex items-center text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 mb-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Tools
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-lg">
              {icon}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{title}</h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm">{description}</p>
            </div>
          </div>
        </div>
        
        {onReset && (
          <Button variant="outline" size="sm" onClick={onReset}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset Tool
          </Button>
        )}
      </div>

      <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden mb-16">
        {children}
      </div>

      {/* Related Tools Section */}
      <div className="border-t border-slate-200 dark:border-slate-800 pt-10">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">You might also like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedTools.map((tool) => (
                <Link 
                    key={tool.id}
                    to={tool.path}
                    className="group bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 hover:border-primary-500 dark:hover:border-primary-500 hover:shadow-lg hover:shadow-primary-500/10 transition-all duration-300 flex flex-col h-full"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-lg group-hover:scale-110 transition-transform">
                        {tool.icon}
                      </div>
                      <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {tool.name}
                      </h3>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-xs line-clamp-2 mt-auto">
                      {tool.description}
                    </p>
                </Link>
            ))}
        </div>
      </div>
    </div>
  );
};