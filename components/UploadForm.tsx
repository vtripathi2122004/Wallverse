'use client';

import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Category } from '@/types/wallpaper';

type Status = 'idle' | 'uploading' | 'success' | 'error';

const CATEGORY_INFO: Record<Category, { label: string; icon: string; resolution: string; description: string }> = {
  desktop: {
    label: 'Desktop',
    icon: '🖥️',
    resolution: '1920 × 1080',
    description: 'Landscape format for computer screens',
  },
  mobile: {
    label: 'Mobile',
    icon: '📱',
    resolution: '1080 × 1920',
    description: 'Portrait format for phone screens',
  },
};

export default function UploadForm() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [category, setCategory] = useState<Category>('desktop');
  const [name, setName] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback((selected: File | null) => {
    if (!selected) return;
    if (!selected.type.startsWith('image/')) {
      setError('Please select an image file (JPEG, PNG, WebP, etc.)');
      return;
    }
    if (selected.size > 15 * 1024 * 1024) {
      setError('Image must be smaller than 15 MB');
      return;
    }
    setError(null);
    setFile(selected);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(selected);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const dropped = e.dataTransfer.files[0];
      handleFile(dropped);
    },
    [handleFile]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setStatus('uploading');
    setError(null);
    setProgress(0);

    // Simulate progress while uploading
    const interval = setInterval(() => {
      setProgress((p) => (p < 85 ? p + Math.random() * 15 : p));
    }, 300);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', category);
      if (name.trim()) formData.append('name', name.trim());

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      clearInterval(interval);
      setProgress(100);

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || 'Upload failed');
      }

      setStatus('success');
      // Redirect to gallery after short delay
      setTimeout(() => router.push('/'), 1500);
    } catch (err: unknown) {
      clearInterval(interval);
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Something went wrong');
    }
  };

  const resetForm = () => {
    setFile(null);
    setPreview(null);
    setName('');
    setStatus('idle');
    setError(null);
    setProgress(0);
  };

  if (status === 'success') {
    return (
      <div className="glass-card p-10 text-center animate-scale-in">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center">
          <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Uploaded Successfully!</h3>
        <p className="text-[var(--text-muted)] text-sm">Redirecting you to the gallery…</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="glass-card p-6 sm:p-8 space-y-6 animate-slide-up">
      {/* Drop zone */}
      <div>
        <label className="block text-sm font-medium text-[var(--text)] mb-2">
          Photo <span className="text-red-400">*</span>
        </label>
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-200 overflow-hidden
            ${isDragging
              ? 'border-brand-500 bg-brand-500/10 scale-[1.01]'
              : preview
              ? 'border-brand-500/40 bg-transparent'
              : 'border-[var(--border)] hover:border-brand-500/50 hover:bg-[var(--surface-2)]'
            }`}
          id="file-drop-zone"
          role="button"
          aria-label="Click or drag to upload photo"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
        >
          {preview ? (
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview}
                alt="Preview"
                className={`w-full object-cover ${category === 'mobile' ? 'max-h-72' : 'max-h-52'}`}
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <span className="text-white text-sm font-medium bg-black/60 px-3 py-1.5 rounded-lg">
                  Click to change
                </span>
              </div>
            </div>
          ) : (
            <div className="py-12 flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[var(--surface-2)] flex items-center justify-center">
                <svg className="w-6 h-6 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
              </div>
              <div className="text-center">
                <p className="text-[var(--text)] text-sm font-medium">Drop your photo here</p>
                <p className="text-[var(--text-muted)] text-xs mt-1">or click to browse · JPEG, PNG, WebP · max 15 MB</p>
              </div>
            </div>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
          className="sr-only"
          id="file-input"
          aria-label="Photo upload input"
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-[var(--text)] mb-3">
          Category <span className="text-red-400">*</span>
        </label>
        <div className="grid grid-cols-2 gap-3">
          {(Object.keys(CATEGORY_INFO) as Category[]).map((cat) => {
            const info = CATEGORY_INFO[cat];
            return (
              <button
                type="button"
                key={cat}
                onClick={() => setCategory(cat)}
                id={`category-${cat}`}
                className={`relative p-4 rounded-xl border text-left transition-all duration-200
                  ${category === cat
                    ? 'border-brand-500 bg-brand-500/10 ring-1 ring-brand-500/50'
                    : 'border-[var(--border)] bg-[var(--surface-2)] hover:border-brand-500/30'
                  }`}
                aria-pressed={category === cat}
              >
                <div className="text-xl mb-1">{info.icon}</div>
                <div className="text-sm font-semibold text-[var(--text)]">{info.label}</div>
                <div className="text-xs text-[var(--text-muted)] mt-0.5">{info.resolution}</div>
                <div className="text-xs text-[var(--text-muted)]">{info.description}</div>
                {category === cat && (
                  <div className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full bg-brand-500 flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </button>
            );
          })}
        </div>
        <p className="text-xs text-[var(--text-muted)] mt-2">
          Your photo will be automatically resized to fit the selected format.
        </p>
      </div>

      {/* Name / caption */}
      <div>
        <label htmlFor="wallpaper-name" className="block text-sm font-medium text-[var(--text)] mb-2">
          Name / Caption <span className="text-[var(--text-muted)] font-normal">(optional)</span>
        </label>
        <input
          id="wallpaper-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Sunset at Goa, Mountain Peak"
          maxLength={100}
          className="input-field"
        />
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm animate-fade-in">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          {error}
        </div>
      )}

      {/* Progress bar */}
      {status === 'uploading' && (
        <div className="space-y-2 animate-fade-in">
          <div className="flex justify-between text-xs text-[var(--text-muted)]">
            <span>Uploading…</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-1.5 bg-[var(--surface-2)] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-brand-600 to-brand-400 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={!file || status === 'uploading'}
          id="upload-submit-btn"
          className="btn-primary flex-1 justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === 'uploading' ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Uploading…
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
              Upload Wallpaper
            </>
          )}
        </button>
        {file && status === 'idle' && (
          <button type="button" onClick={resetForm} className="btn-secondary">
            Clear
          </button>
        )}
      </div>
    </form>
  );
}
