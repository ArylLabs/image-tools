import { ReactNode } from 'react';

export enum ToolCategory {
  ESSENTIAL = 'Essentials',
  CONVERSION = 'Conversion',
  CREATIVE = 'Creative',
  UTILITY = 'Utility',
}

export interface ToolDefinition {
  id: string;
  name: string;
  description: string;
  icon: ReactNode;
  path: string;
  category: ToolCategory;
  badge?: string;
}

export interface ImageState {
  file: File | null;
  previewUrl: string | null;
  originalWidth: number;
  originalHeight: number;
  processedUrl: string | null;
  isProcessing: boolean;
}

export interface FilterConfig {
  brightness: number; // 0-200, default 100
  contrast: number; // 0-200, default 100
  saturation: number; // 0-200, default 100
  blur: number; // 0-20, default 0
  grayscale: number; // 0-100, default 0
  sepia: number; // 0-100, default 0
  invert: number; // 0-100, default 0
  pixelate: number; // 0-50, default 0
  rotate: number; // degrees
  flipH: boolean;
  flipV: boolean;
}