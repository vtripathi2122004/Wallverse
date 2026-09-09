'use client';

import Image from 'next/image';
import { Wallpaper } from '@/types/wallpaper';

import { useState } from 'react';

interface ImageCardProps {
  wallpaper: Wallpaper;
  onClick: (wallpaper: Wallpaper) => void;
}

function getImageUrl(publicId: string): string {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!cloudName) return '';
  return `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto/${encodeURI(publicId)}`;
}

export default function ImageCard({ wallpaper, onClick }: ImageCardProps) {
  const [downloading, setDownloading] = useState(false);
  const url = getImageUrl(wallpaper.r2_key);
  const isPortrait = wallpaper.category === 'mobile';

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setDownloading(true);
    try {
      const encodedKey = btoa(wallpaper.r2_key).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
      const downloadUrl = `/api/download/${encodedKey}`;
      const response = await fetch(downloadUrl);
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = objectUrl;
      a.download = `${wallpaper.name || wallpaper.category}-wallpaper.jpg`;
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

  return (
    <div
      onClick={() => onClick(wallpaper)}
      className="group relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] hover:border-brand-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-brand-900/30 hover:-translate-y-1 focus-within:ring-2 focus-within:ring-brand-500 focus-within:ring-offset-2 focus-within:ring-offset-[var(--bg)] w-full text-left cursor-pointer flex flex-col"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick(wallpaper)}
      aria-label={`View ${wallpaper.name || wallpaper.category} wallpaper`}
    >
      {/* Image container with aspect ratio */}
      <div className={`relative w-full overflow-hidden ${isPortrait ? 'aspect-[9/16]' : 'aspect-video'}`}>
        {url ? (
          <Image
            src={url}
            alt={wallpaper.name || `${wallpaper.category} wallpaper`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-[var(--surface-2)] flex items-center justify-center">
            <svg className="w-8 h-8 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 21l6.75-6.75 6.75 6.75M16.5 3.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
            </svg>
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-4">
          <span className="text-white text-sm font-medium truncate">
            {wallpaper.name || 'Untitled'}
          </span>
          <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/20">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Card footer */}
      <div className="p-3 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-[var(--text)] truncate max-w-[160px]">
            {wallpaper.name || 'Untitled'}
          </p>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            {new Date(wallpaper.created_at).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>
        </div>
        <div className="flex items-center gap-2 mt-2 sm:mt-0">
          <span className={`text-[10px] sm:text-xs px-2 py-1 rounded-lg font-medium whitespace-nowrap ${
            wallpaper.category === 'mobile'
              ? 'bg-purple-500/15 text-purple-600 dark:text-purple-300 border border-purple-500/20'
              : 'bg-brand-500/15 text-brand-600 dark:text-brand-300 border border-brand-500/20'
          }`}>
            {wallpaper.category === 'mobile' ? '📱 Mobile' : '🖥️ Desktop'}
          </span>
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex-shrink-0 w-8 h-8 rounded-lg bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] hover:text-brand-500 hover:border-brand-500/50 transition-colors disabled:opacity-50"
            aria-label="Download directly"
          >
            {downloading ? (
              <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
