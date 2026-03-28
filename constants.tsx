import React from 'react';
import { 
  Crop, 
  Maximize2, 
  Minimize2, 
  RefreshCcw, 
  Type, 
  Image as ImageIcon, 
  FileImage, 
  Wand2, 
  Palette, 
  Grid, 
  FileText, 
  Scissors, 
  Download, 
  Layers, 
  Sun, 
  Eye,
  Binary,
  Sticker,
  Smile,
  Info,
  Droplet,
  QrCode,
  Diff,
  Eraser,
  LayoutTemplate,
  Monitor,
  Zap,
  UserCircle,
  Contrast,
  FileCode,
  Box,
  Coffee,
  Square,
  Columns,
  Calculator
} from 'lucide-react';
import { ToolCategory, ToolDefinition } from './types';

export const APP_NAME = "PixelForge";

export const TOOLS: ToolDefinition[] = [
  // Essentials (8)
  {
    id: 'compress',
    name: 'Image Compressor',
    description: 'Reduce file size while maintaining quality.',
    icon: <Minimize2 className="w-6 h-6" />,
    path: '/tool/compressor',
    category: ToolCategory.ESSENTIAL
  },
  {
    id: 'resize',
    name: 'Image Resizer',
    description: 'Resize images to specific dimensions or percentage.',
    icon: <Maximize2 className="w-6 h-6" />,
    path: '/tool/resize',
    category: ToolCategory.ESSENTIAL
  },
  {
    id: 'crop',
    name: 'Image Cropper',
    description: 'Crop photos to exact aspect ratios.',
    icon: <Crop className="w-6 h-6" />,
    path: '/tool/crop',
    category: ToolCategory.ESSENTIAL
  },
  {
    id: 'rotate',
    name: 'Rotate & Flip',
    description: 'Rotate images 90° or flip them horizontally/vertically.',
    icon: <RefreshCcw className="w-6 h-6" />,
    path: '/tool/editor?mode=rotate',
    category: ToolCategory.ESSENTIAL
  },
  {
    id: 'editor',
    name: 'Mini Photo Editor',
    description: 'All-in-one tool: Resize, Crop, Filter, and Edit.',
    icon: <Layers className="w-6 h-6" />,
    path: '/tool/editor?mode=all',
    category: ToolCategory.ESSENTIAL
  },
  {
    id: 'invert',
    name: 'Negative Image',
    description: 'Invert colors to create a negative effect.',
    icon: <Zap className="w-6 h-6" />,
    path: '/tool/editor?mode=invert',
    category: ToolCategory.ESSENTIAL
  },
  {
    id: 'grayscale',
    name: 'Grayscale',
    description: 'Convert colorful images to black and white.',
    icon: <Contrast className="w-6 h-6" />,
    path: '/tool/editor?mode=grayscale',
    category: ToolCategory.ESSENTIAL
  },
  {
    id: 'profile',
    name: 'Profile Picture',
    description: 'Create perfect circular profile pictures.',
    icon: <UserCircle className="w-6 h-6" />,
    path: '/tool/profile',
    category: ToolCategory.ESSENTIAL
  },

  // Conversion (8)
  {
    id: 'jpg-png',
    name: 'JPG to PNG',
    description: 'Convert JPG images to transparent PNG format.',
    icon: <ImageIcon className="w-6 h-6" />,
    path: '/tool/converter?to=png',
    category: ToolCategory.CONVERSION
  },
  {
    id: 'png-jpg',
    name: 'PNG to JPG',
    description: 'Convert PNG to lightweight JPG images.',
    icon: <FileImage className="w-6 h-6" />,
    path: '/tool/converter?to=jpg',
    category: ToolCategory.CONVERSION
  },
  {
    id: 'to-webp',
    name: 'To WebP',
    description: 'Convert images to modern WebP format.',
    icon: <GlobeIcon />,
    path: '/tool/converter?to=webp',
    category: ToolCategory.CONVERSION
  },
  {
    id: 'pdf',
    name: 'Image to PDF',
    description: 'Combine multiple images into a single PDF document.',
    icon: <FileText className="w-6 h-6" />,
    path: '/tool/pdf',
    category: ToolCategory.CONVERSION
  },
  {
    id: 'base64',
    name: 'Base64 Converter',
    description: 'Convert Image to Base64 or Base64 to Image.',
    icon: <Binary className="w-6 h-6" />,
    path: '/tool/base64',
    category: ToolCategory.CONVERSION
  },
  {
    id: 'thumbnail',
    name: 'Thumbnail Maker',
    description: 'Create optimized thumbnails for YouTube/Web.',
    icon: <LayoutTemplate className="w-6 h-6" />,
    path: '/tool/resize?preset=thumbnail',
    category: ToolCategory.CONVERSION
  },
  {
    id: 'svg-png',
    name: 'SVG to PNG',
    description: 'Rasterize SVG vectors into PNG images.',
    icon: <FileCode className="w-6 h-6" />,
    path: '/tool/converter?to=png',
    category: ToolCategory.CONVERSION
  },
  {
    id: 'to-bmp',
    name: 'To BMP',
    description: 'Convert images to BMP bitmap format.',
    icon: <Box className="w-6 h-6" />,
    path: '/tool/converter?to=bmp',
    category: ToolCategory.CONVERSION
  },

  // Creative (8)
  {
    id: 'filters',
    name: 'Photo Filters',
    description: 'Apply instagram-like filters, brightness, and contrast.',
    icon: <Wand2 className="w-6 h-6" />,
    path: '/tool/editor?mode=filter',
    category: ToolCategory.CREATIVE
  },
  {
    id: 'watermark',
    name: 'Watermark',
    description: 'Add text or image watermarks to protect your work.',
    icon: <Type className="w-6 h-6" />,
    path: '/tool/watermark',
    category: ToolCategory.CREATIVE
  },
  {
    id: 'meme',
    name: 'Meme Generator',
    description: 'Add top and bottom text to create memes.',
    icon: <Smile className="w-6 h-6" />,
    path: '/tool/meme',
    category: ToolCategory.CREATIVE
  },
  {
    id: 'collage',
    name: 'Collage Maker',
    description: 'Create beautiful photo grids and collages.',
    icon: <Grid className="w-6 h-6" />,
    path: '/tool/collage',
    category: ToolCategory.CREATIVE
  },
  {
    id: 'blur',
    name: 'Blur Tool',
    description: 'Apply focus or background blur effects.',
    icon: <Droplet className="w-6 h-6" />,
    path: '/tool/editor?mode=blur',
    category: ToolCategory.CREATIVE
  },
  {
    id: 'pixelate',
    name: 'Pixelate Image',
    description: 'Censor parts of an image or create pixel art.',
    icon: <Monitor className="w-6 h-6" />,
    path: '/tool/editor?mode=pixelate',
    category: ToolCategory.CREATIVE
  },
  {
    id: 'sepia',
    name: 'Sepia Effect',
    description: 'Give your photos a vintage, old-fashioned look.',
    icon: <Coffee className="w-6 h-6" />,
    path: '/tool/editor?mode=sepia',
    category: ToolCategory.CREATIVE
  },
  {
    id: 'corners',
    name: 'Rounded Corners',
    description: 'Add rounded corners to square or rectangular images.',
    icon: <Square className="w-6 h-6 rounded-md" />,
    path: '/tool/corners',
    category: ToolCategory.CREATIVE
  },
  
  // Utility (8)
  {
    id: 'picker',
    name: 'Color Picker',
    description: 'Extract colors and hex codes from any image.',
    icon: <Palette className="w-6 h-6" />,
    path: '/tool/picker',
    category: ToolCategory.UTILITY
  },
  {
    id: 'exif',
    name: 'EXIF Viewer',
    description: 'View hidden metadata inside your photos.',
    icon: <Info className="w-6 h-6" />,
    path: '/tool/exif',
    category: ToolCategory.UTILITY
  },
  {
    id: 'palette',
    name: 'Palette Generator',
    description: 'Extract dominant color palette from images.',
    icon: <Layers className="w-6 h-6" />,
    path: '/tool/palette',
    category: ToolCategory.UTILITY
  },
  {
    id: 'compare',
    name: 'Image Compare',
    description: 'Compare two images side-by-side with a slider.',
    icon: <Diff className="w-6 h-6" />,
    path: '/tool/compare',
    category: ToolCategory.UTILITY
  },
  {
    id: 'qrcode',
    name: 'QR Code Generator',
    description: 'Generate QR codes from text or URLs.',
    icon: <QrCode className="w-6 h-6" />,
    path: '/tool/qrcode',
    category: ToolCategory.UTILITY
  },
  {
    id: 'scrubber',
    name: 'EXIF Remover',
    description: 'Remove metadata from photos for privacy.',
    icon: <Eraser className="w-6 h-6" />,
    path: '/tool/scrubber',
    category: ToolCategory.UTILITY
  },
  {
    id: 'splitter',
    name: 'Image Splitter',
    description: 'Split one image into multiple grid pieces.',
    icon: <Columns className="w-6 h-6" />,
    path: '/tool/splitter',
    category: ToolCategory.UTILITY
  },
  {
    id: 'aspect',
    name: 'Aspect Ratio Calc',
    description: 'Calculate dimensions and aspect ratios easily.',
    icon: <Calculator className="w-6 h-6" />,
    path: '/tool/aspect',
    category: ToolCategory.UTILITY
  }
];

function GlobeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-6 h-6"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="2" x2="22" y1="12" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}