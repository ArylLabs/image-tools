import { FilterConfig } from "../types";

export const readFileAsDataURL = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = (e) => reject(e);
    reader.readAsDataURL(file);
  });
};

export const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = src;
  });
};

export const applyImageFilters = async (
  src: string,
  config: FilterConfig,
  outputMimeType = 'image/png',
  quality = 0.92
): Promise<string> => {
  const img = await loadImage(src);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) throw new Error('Could not get canvas context');

  // Calculate dimensions based on rotation
  if (config.rotate % 180 !== 0) {
    canvas.width = img.height;
    canvas.height = img.width;
  } else {
    canvas.width = img.width;
    canvas.height = img.height;
  }

  // Apply Transformations
  ctx.save();
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate((config.rotate * Math.PI) / 180);
  ctx.scale(config.flipH ? -1 : 1, config.flipV ? -1 : 1);
  
  // Draw image centered
  if (config.rotate % 180 !== 0) {
    ctx.drawImage(img, -img.width / 2, -img.height / 2);
  } else {
    ctx.drawImage(img, -img.width / 2, -img.height / 2);
  }
  ctx.restore();

  // Handle Pixelation (Needs to happen before CSS filters for better effect, or separate pass)
  // We'll do pixelation on a temp canvas first if needed
  let sourceCanvas: HTMLCanvasElement = canvas;

  if (config.pixelate > 0) {
    const pixelCanvas = document.createElement('canvas');
    pixelCanvas.width = canvas.width;
    pixelCanvas.height = canvas.height;
    const pixelCtx = pixelCanvas.getContext('2d');
    if (!pixelCtx) throw new Error('Context lost');
    
    // Downscale
    const size = Math.max(0.01, 1 - (config.pixelate / 100) * 0.99); // 0 to 50 slider -> 1 to ~0.01 scale
    const w = canvas.width * size;
    const h = canvas.height * size;
    
    // Draw small
    pixelCtx.drawImage(canvas, 0, 0, w, h);
    
    // Upscale with no smoothing
    pixelCtx.imageSmoothingEnabled = false;
    pixelCtx.drawImage(pixelCanvas, 0, 0, w, h, 0, 0, canvas.width, canvas.height);
    
    sourceCanvas = pixelCanvas;
  }

  // Apply Filters using another pass (simpler for canvas `filter` string)
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;
  const tempCtx = tempCanvas.getContext('2d');
  if (!tempCtx) throw new Error('Context lost');

  const filterString = `
    brightness(${config.brightness}%) 
    contrast(${config.contrast}%) 
    saturate(${config.saturation}%) 
    blur(${config.blur}px) 
    grayscale(${config.grayscale}%) 
    sepia(${config.sepia}%)
    invert(${config.invert}%)
  `;
  
  tempCtx.filter = filterString;
  tempCtx.drawImage(sourceCanvas, 0, 0);

  return tempCanvas.toDataURL(outputMimeType, quality);
};

export const formatBytes = (bytes: number, decimals = 2) => {
  if (!+bytes) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

export const downloadImage = (dataUrl: string, filename: string) => {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};