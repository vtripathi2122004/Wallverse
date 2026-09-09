import { supabase } from '@/lib/supabase';
import { Wallpaper } from '@/types/wallpaper';
import Navbar from '@/components/Navbar';
import Gallery from '@/components/Gallery';
import Link from 'next/link';

export const dynamic = 'force-dynamic';
export const revalidate = 0;


async function getWallpapers(): Promise<Wallpaper[]> {
  try {
    const { data, error } = await supabase
      .from('wallpapers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Failed to fetch wallpapers:', error);
      return [];
    }
    return (data as Wallpaper[]) ?? [];
  } catch (err) {
    console.error('Supabase error:', err);
    return [];
  }
}

export default async function HomePage() {
  const wallpapers = await getWallpapers();

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Hero header */}
        <div className="mb-16 mt-8 flex flex-col items-start gap-6 max-w-2xl">
          <div>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tighter text-[var(--text)] leading-tight">
              WallVerse
            </h1>
            <p className="text-xl sm:text-2xl font-medium text-[var(--text-muted)] mt-4 tracking-tight leading-snug">
              Discover an exclusive collection of stunning wallpapers, masterfully captured and meticulously edited by Varun Tripathi.
            </p>
          </div>
          <div className="flex items-center gap-4 mt-2">
            <Link
              href="#gallery-section"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-[var(--text)] text-[var(--bg)] hover:bg-[var(--text-muted)] hover:text-[var(--bg)] transition-colors active:scale-95"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 21l6.75-6.75 6.75 6.75M16.5 3.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
              </svg>
              Browse wallpapers
            </Link>
            <Link
              href="/upload"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-[var(--surface-2)] text-[var(--text)] border border-[var(--border)] hover:border-[var(--text-muted)] transition-colors active:scale-95"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Submit
            </Link>
          </div>
        </div>

        {/* Stats bar */}
        {wallpapers.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mb-10">
            {[
              { label: 'Total', value: wallpapers.length, icon: '🖼️' },
              { label: 'Desktop', value: wallpapers.filter(w => w.category === 'desktop').length, icon: '🖥️' },
              { label: 'Mobile', value: wallpapers.filter(w => w.category === 'mobile').length, icon: '📱' },
            ].map(({ label, value, icon }) => (
              <div key={label} className="glass-card p-4 text-center">
                <div className="text-2xl mb-1">{icon}</div>
                <div className="text-xl font-bold text-white">{value}</div>
                <div className="text-xs text-[var(--text-muted)]">{label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Gallery Section */}
        <div id="gallery-section" className="pt-4 scroll-mt-24">
          <Gallery wallpapers={wallpapers} />
        </div>
      </main>
    </div>
  );
}
