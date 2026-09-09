'use client';

import Image from 'next/image';
import { Wallpaper } from '@/types/wallpaper';

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
  const url = getImageUrl(wallpaper.r2_key);
  const isPortrait = wallpaper.category === 'mobile';

  return (
    <button
      onClick={() => onClick(wallpaper)}
      className="group relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] hover:border-brand-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-brand-900/30 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 focus:ring-offset-[var(--bg)] w-full text-left"
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
        <span className={`text-xs px-2 py-1 rounded-lg font-medium ${
          wallpaper.category === 'mobile'
            ? 'bg-purple-500/15 text-purple-300 border border-purple-500/20'
            : 'bg-brand-500/15 text-brand-300 border border-brand-500/20'
        }`}>
          {wallpaper.category === 'mobile' ? '📱 Mobile' : '🖥️ Desktop'}
        </span>
      </div>
    </button>
  );
}
