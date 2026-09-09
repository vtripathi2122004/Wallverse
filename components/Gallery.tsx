'use client';

import { useState } from 'react';
import { Wallpaper, Category } from '@/types/wallpaper';
import ImageCard from '@/components/ImageCard';
import Lightbox from '@/components/Lightbox';

type Filter = 'all' | Category;

interface GalleryProps {
  wallpapers: Wallpaper[];
}

const FILTERS: { label: string; value: Filter }[] = [
  { label: 'All', value: 'all' },
  { label: '🖥️ Desktop', value: 'desktop' },
  { label: '📱 Mobile', value: 'mobile' },
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
      <div className="flex items-center gap-2 mb-8 p-1 bg-[var(--surface)] rounded-2xl border border-[var(--border)] w-fit">
        {FILTERS.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            className={`tab-btn ${filter === value ? 'active' : ''}`}
            id={`filter-${value}`}
            aria-pressed={filter === value}
          >
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

      {/* Mixed view (All filter) — both grids together */}
      {filter === 'all' && filtered.length > 0 && (
        <div className="space-y-10">
          {desktopWallpapers.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-4 flex items-center gap-2">
                <span>🖥️</span> Desktop
                <span className="text-xs font-normal normal-case tracking-normal bg-[var(--surface)] border border-[var(--border)] px-2 py-0.5 rounded-full">
                  {desktopWallpapers.length}
                </span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                {desktopWallpapers.map((w) => (
                  <ImageCard key={w.id} wallpaper={w} onClick={setSelected} />
                ))}
              </div>
            </section>
          )}
          {mobileWallpapers.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-4 flex items-center gap-2">
                <span>📱</span> Mobile
                <span className="text-xs font-normal normal-case tracking-normal bg-[var(--surface)] border border-[var(--border)] px-2 py-0.5 rounded-full">
                  {mobileWallpapers.length}
                </span>
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
                {mobileWallpapers.map((w) => (
                  <ImageCard key={w.id} wallpaper={w} onClick={setSelected} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      {/* Single-category filtered view */}
      {filter !== 'all' && filtered.length > 0 && (
        <div className={`grid gap-6 sm:gap-8 transition-all duration-500
          ${filter === 'mobile'
            ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
            : 'grid-cols-1 md:grid-cols-2'
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
