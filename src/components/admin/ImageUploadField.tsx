import React, { useState, useRef } from 'react';
import { Upload, Link as LinkIcon, Image as ImageIcon, X, Check, RefreshCw, Sparkles } from 'lucide-react';

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (newUrl: string) => void;
  placeholder?: string;
  helperText?: string;
  required?: boolean;
}

// Quick sample image options for easy selection in admin
const SAMPLE_PRESETS = [
  { label: 'Luxury Apartment', url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Modern Villa', url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Commercial Office', url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Penthouse View', url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Architectural Real Estate', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80' }
];

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  label,
  value,
  onChange,
  placeholder = 'https://images.unsplash.com/...',
  helperText,
  required = false
}) => {
  const [uploadMode, setUploadMode] = useState<'upload' | 'url'>('upload');
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [showPresets, setShowPresets] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Compress & convert file to optimized base64 data URL
  const processImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (PNG, JPG, WebP, GIF)');
      return;
    }

    setUploadError(null);
    setIsProcessing(true);

    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onload = () => {
        // Resize down to max 1280px dimension to ensure snappy loading & fit in storage
        const MAX_DIMENSION = 1280;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_DIMENSION) {
            height = Math.round((height * MAX_DIMENSION) / width);
            width = MAX_DIMENSION;
          }
        } else {
          if (height > MAX_DIMENSION) {
            width = Math.round((width * MAX_DIMENSION) / height);
            height = MAX_DIMENSION;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
          onChange(dataUrl);
        } else {
          onChange(readerEvent.target?.result as string);
        }
        setIsProcessing(false);
      };
      img.onerror = () => {
        setUploadError('Failed to process image file');
        setIsProcessing(false);
      };
      img.src = readerEvent.target?.result as string;
    };
    reader.onerror = () => {
      setUploadError('Failed to read file from disk');
      setIsProcessing(false);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleClearImage = () => {
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      {/* Header with Mode Switcher */}
      <div className="flex items-center justify-between">
        <label className="block font-bold text-slate-700 text-sm">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
          <button
            type="button"
            onClick={() => setUploadMode('upload')}
            className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              uploadMode === 'upload'
                ? 'bg-white text-[#002869] shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Upload className="w-3 h-3 text-[#FF6B35]" />
            <span>Upload File</span>
          </button>
          <button
            type="button"
            onClick={() => setUploadMode('url')}
            className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              uploadMode === 'url'
                ? 'bg-white text-[#002869] shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <LinkIcon className="w-3 h-3 text-[#002869]" />
            <span>Image URL</span>
          </button>
        </div>
      </div>

      {/* Preview Section if Image Exists */}
      {value && (
        <div className="relative group rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3 p-2.5">
            <div className="w-20 h-16 rounded-lg overflow-hidden bg-slate-200 flex-shrink-0 border border-slate-300">
              <img
                src={value}
                alt="Selected preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=400&q=80';
                }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold">
                <Check className="w-3.5 h-3.5" />
                <span>Image Attached</span>
              </div>
              <p className="text-[11px] text-slate-500 truncate mt-0.5" title={value}>
                {value.startsWith('data:image') ? 'Uploaded Local Image File (Optimized Base64)' : value}
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  if (uploadMode === 'upload' && fileInputRef.current) {
                    fileInputRef.current.click();
                  }
                }}
                className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors flex items-center gap-1 cursor-pointer"
                title="Replace with another file"
              >
                <RefreshCw className="w-3 h-3 text-slate-500" />
                <span>Change</span>
              </button>
              <button
                type="button"
                onClick={handleClearImage}
                className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition-colors cursor-pointer"
                title="Remove image"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Dropzone Mode */}
      {uploadMode === 'upload' && !value && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-[#FF6B35] bg-orange-50/60'
              : 'border-slate-300 hover:border-[#002869] bg-slate-50/70 hover:bg-slate-50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="flex flex-col items-center justify-center gap-2">
            <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-[#002869]">
              {isProcessing ? (
                <RefreshCw className="w-5 h-5 animate-spin text-[#FF6B35]" />
              ) : (
                <Upload className="w-5 h-5 text-[#FF6B35]" />
              )}
            </div>

            <div>
              <p className="text-xs font-bold text-slate-700">
                {isProcessing ? 'Optimizing and loading image...' : 'Click to browse or drag & drop photo here'}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Supports JPG, PNG, WebP (auto-optimized for web)
              </p>
            </div>
          </div>
        </div>
      )}

      {/* URL Input Mode */}
      {uploadMode === 'url' && !value && (
        <div className="space-y-1.5">
          <div className="relative flex items-center">
            <input
              type="url"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className="w-full p-2.5 pr-20 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-[#002869] focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPresets(!showPresets)}
              className="absolute right-1.5 px-2 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-[#002869] text-[10px] font-bold border border-blue-200 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3 h-3 text-[#FF6B35]" />
              <span>Presets</span>
            </button>
          </div>

          {/* Preset Quick Select Dropdown */}
          {showPresets && (
            <div className="p-2 bg-white rounded-xl border border-slate-200 shadow-lg space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">
                Choose High-Res Sample Photo:
              </div>
              <div className="grid grid-cols-2 gap-1">
                {SAMPLE_PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => {
                      onChange(preset.url);
                      setShowPresets(false);
                    }}
                    className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-50 text-left border border-transparent hover:border-slate-200 transition-colors cursor-pointer"
                  >
                    <img
                      src={preset.url}
                      alt={preset.label}
                      className="w-7 h-7 rounded object-cover flex-shrink-0"
                    />
                    <span className="text-xs font-semibold text-slate-700 truncate">{preset.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Quick Switch to Presets when uploading */}
      {!value && uploadMode === 'upload' && (
        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
          <span>Don't have a local image?</span>
          <button
            type="button"
            onClick={() => {
              setUploadMode('url');
              setShowPresets(true);
            }}
            className="text-[#FF6B35] font-bold hover:underline cursor-pointer flex items-center gap-1"
          >
            <Sparkles className="w-3 h-3" />
            <span>Use curated real estate photo presets</span>
          </button>
        </div>
      )}

      {/* Error Message */}
      {uploadError && (
        <p className="text-xs text-red-600 font-semibold">{uploadError}</p>
      )}

      {/* Helper text */}
      {helperText && !uploadError && (
        <p className="text-[11px] text-slate-500">{helperText}</p>
      )}
    </div>
  );
};
