'use client';

import { useState } from 'react';
import { Wallpaper, Category } from '@/types/wallpaper';
import ImageCard from '@/components/ImageCard';
import Lightbox from '@/components/Lightbox';

type Filter = 'all' | Category;

interface GalleryProps {
  wallpapers: Wallpaper[];
}

const FILTERS: { label: string; value: Filter; icon: React.ReactNode }[] = [
  { 
    label: 'All', 
    value: 'all',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 21l6.75-6.75 6.75 6.75M16.5 3.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
      </svg>
    )
  },
  { 
    label: 'Desktop', 
    value: 'desktop',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
      </svg>
    )
  },
  { 
    label: 'Mobile', 
    value: 'mobile',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
      </svg>
    )
  },
];

export default function Gallery({ wallpapers }: GalleryProps) {
  const [filter, setFilter] = useState<Filter>('all');
  const [selected, setSelected] = useState<Wallpaper | null>(null);

  const filtered =
    filter === 'all' ? wallpapers : wallpapers.filter((w) => w.category === filter);

  const desktopWallpapers = filtered.filter((w) => w.category === 'desktop');
  const mobileWallpapers = filtered.filter((w) => w.category === 'mobile');

  return (
    <>
      {/* Filter tabs */}
      <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide w-full">
        {FILTERS.map(({ label, value, icon }) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 shrink-0 border ${
              filter === value 
                ? 'bg-[var(--text)] text-[var(--bg)] border-transparent shadow-md' 
                : 'bg-[var(--surface)] text-[var(--text)] border-[var(--border)] hover:border-[var(--text-muted)] hover:bg-[var(--surface-2)]'
            }`}
            id={`filter-${value}`}
            aria-pressed={filter === value}
          >
            {icon}
            {label}
          </button>
        ))}
      </div>

      {/* Count indicator */}
      {filtered.length > 0 && (
        <p className="text-sm text-[var(--text-muted)] mb-6">
          Showing <span className="text-[var(--text)] font-medium">{filtered.length}</span>{' '}
          wallpaper{filtered.length !== 1 ? 's' : ''}
        </p>
      )}

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 21l6.75-6.75 6.75 6.75M16.5 3.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-[var(--text)] mb-2">No wallpapers yet</h3>
          <p className="text-sm text-[var(--text-muted)] max-w-xs">
            Be the first to upload a wallpaper. Click the Upload button above to get started.
          </p>
        </div>
      )}

      {/* Mixed view (All filter) — everything in one masonry-style grid */}
      {filter === 'all' && filtered.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 sm:gap-8 items-start">
          {filtered.map((w) => (
            <ImageCard key={w.id} wallpaper={w} onClick={setSelected} />
          ))}
        </div>
      )}

      {/* Single-category filtered view */}
      {filter !== 'all' && filtered.length > 0 && (
        <div className={`grid gap-6 sm:gap-8 items-start transition-all duration-500
          ${filter === 'mobile'
            ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
            : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
          }`}
        >
          {filtered.map((w) => (
            <ImageCard key={w.id} wallpaper={w} onClick={setSelected} />
          ))}
        </div>
      )}

      {/* Lightbox */}
      <Lightbox wallpaper={selected} onClose={() => setSelected(null)} />
    </>
  );
}
