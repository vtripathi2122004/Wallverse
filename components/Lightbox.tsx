'use client';

import { useEffect, useCallback, useState } from 'react';
import Image from 'next/image';
import { Wallpaper } from '@/types/wallpaper';

interface LightboxProps {
  wallpaper: Wallpaper | null;
  onClose: () => void;
}

function getImageUrl(publicId: string): string {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!cloudName) return '';
  return `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto/${encodeURI(publicId)}`;
}

export default function Lightbox({ wallpaper, onClose }: LightboxProps) {
  const [downloading, setDownloading] = useState(false);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (wallpaper) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [wallpaper, handleKeyDown]);

  if (!wallpaper) return null;

  const url = getImageUrl(wallpaper.r2_key);
  const encodedKey = btoa(wallpaper.r2_key).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  const downloadUrl = `/api/download/${encodedKey}`;
  const filename = `${wallpaper.name || wallpaper.category}-wallpaper.jpg`;

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const response = await fetch(downloadUrl);
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = objectUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(objectUrl);
    } catch (err) {
      console.error('Download failed:', err);
    } finally {
      setDownloading(false);
    }
  };

  const isPortrait = wallpaper.category === 'mobile';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Preview: ${wallpaper.name || 'wallpaper'}`}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative z-10 flex flex-col max-h-[90vh] max-w-5xl w-full gap-4 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header bar */}
        <div className="flex items-center justify-between px-2">
          <div>
            <h2 className="text-lg font-semibold text-white">
              {wallpaper.name || 'Untitled Wallpaper'}
            </h2>
            <p className="text-sm text-[var(--text-muted)]">
              {wallpaper.category === 'mobile' ? '1080 × 1920' : '1920 × 1080'} · {wallpaper.category}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl flex items-center justify-center bg-white/10 hover:bg-white/20 border border-white/10 transition-colors"
            aria-label="Close preview"
          >
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Image */}
        <div
          className={`relative mx-auto overflow-hidden rounded-2xl border border-white/10 shadow-2xl
            ${isPortrait ? 'h-[65vh] max-w-[calc(65vh*9/16)]' : 'w-full max-h-[60vh]'}`}
        >
          {url && (
            <Image
              src={url}
              alt={wallpaper.name || 'wallpaper'}
              fill
              sizes="(max-width: 768px) 100vw, 80vw"
              className="object-contain"
              priority
            />
          )}
        </div>

        {/* Action bar */}
        <div className="flex items-center justify-center gap-3 pb-2">
          <button
            onClick={handleDownload}
            disabled={downloading}
            id="download-wallpaper-btn"
            className="btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {downloading ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Downloading…
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                Download Wallpaper
              </>
            )}
          </button>
          <button onClick={onClose} className="btn-secondary">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
