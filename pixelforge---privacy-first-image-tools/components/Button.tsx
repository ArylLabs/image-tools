import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  className, 
  variant = 'primary', 
  size = 'md', 
  ...props 
}) => {
  const variants = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 shadow-md shadow-primary-500/20 border border-transparent',
    secondary: 'bg-slate-800 text-white hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 shadow-md border border-transparent',
    outline: 'bg-transparent border-2 border-slate-200 text-slate-700 hover:border-primary-500 hover:text-primary-600 dark:border-slate-700 dark:text-slate-300 dark:hover:border-primary-500',
    ghost: 'bg-transparent text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800',
    danger: 'bg-red-500 text-white hover:bg-red-600 shadow-md shadow-red-500/20',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-sm font-medium',
    lg: 'px-6 py-3 text-base font-medium',
  };

  return (
    <button 
      className={cn(
        'inline-flex items-center justify-center rounded-xl transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none active:scale-95',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
