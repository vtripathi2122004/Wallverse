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
      className="group w-full text-left cursor-pointer flex flex-col gap-3"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick(wallpaper)}
      aria-label={`View ${wallpaper.name || wallpaper.category} wallpaper`}
    >
      {/* Image container */}
      <div className={`relative w-full overflow-hidden rounded-2xl bg-[var(--surface-2)] shadow-sm group-hover:shadow-xl group-hover:shadow-brand-900/10 transition-all duration-300 ring-1 ring-[var(--border)] group-hover:ring-brand-500/50 ${isPortrait ? 'aspect-[9/16]' : 'aspect-video'}`}>
        {url ? (
          <Image
            src={url}
            alt={wallpaper.name || `${wallpaper.category} wallpaper`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-8 h-8 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 21l6.75-6.75 6.75 6.75M16.5 3.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
            </svg>
          </div>
        )}

        {/* 4K Badge top-left */}
        <div className="absolute top-3 left-3 bg-black/40 backdrop-blur-md px-2 py-1 rounded-md border border-white/10">
          <span className="text-[10px] font-bold text-white tracking-widest">4K</span>
        </div>

        {/* Device Icon bottom-left */}
        <div className="absolute bottom-3 left-3 bg-black/40 backdrop-blur-md w-7 h-7 flex items-center justify-center rounded-lg border border-white/10">
          {isPortrait ? (
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
            </svg>
          ) : (
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
            </svg>
          )}
        </div>

        {/* Hover overlay (subtle darken) */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 pointer-events-none" />
      </div>

      {/* Metadata Row */}
      <div className="flex items-start justify-between gap-3 px-1">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-[var(--text)] truncate">
            {wallpaper.name || 'Untitled'}
          </p>
          <p className="text-xs font-medium text-[var(--text-muted)] mt-1 capitalize">
            {wallpaper.category}
          </p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="w-8 h-8 rounded-full bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface)] transition-colors disabled:opacity-50"
            aria-label="Download directly"
            title="Download Wallpaper"
          >
            {downloading ? (
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
