import React from 'react';
import { Link } from 'react-router-dom';
import { TOOLS } from '../constants';
import { ToolCategory } from '../types';

export const AllTools = () => {
  const categories = Object.values(ToolCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">All Tools</h1>
        <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          Explore our complete collection of free, privacy-focused image utilities. 
          Everything runs in your browser—no uploads, no waiting.
        </p>
      </div>

      {categories.map((category) => {
        const categoryTools = TOOLS.filter(t => t.category === category);
        if (categoryTools.length === 0) return null;

        return (
            <div key={category} className="mb-16">
            <div className="flex items-center mb-8">
                <div className="w-1.5 h-8 bg-primary-500 rounded-full mr-4"></div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{category}</h2>
                <span className="ml-3 px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-medium">
                    {categoryTools.length}
                </span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {categoryTools.map((tool) => (
                <Link 
                    key={tool.id}
                    to={tool.path}
                    className="group bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 hover:border-primary-500 dark:hover:border-primary-500 hover:shadow-lg hover:shadow-primary-500/10 transition-all duration-300 flex flex-col h-full"
                >
                    <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-lg group-hover:scale-110 transition-transform duration-300">
                        {tool.icon}
                    </div>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {tool.name}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                    {tool.description}
                    </p>
                </Link>
                ))}
            </div>
            </div>
        );
      })}
    </div>
  );
};