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
        <div className="mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              The Gallery
            </h1>
            <p className="text-[var(--text-muted)] mt-2 max-w-md">
              Discover an exclusive collection of stunning wallpapers, masterfully captured and meticulously edited by Varun Tripathi. Perfectly sized for every screen.
            </p>
          </div>
          <Link
            href="/upload"
            className="btn-primary self-start sm:self-auto shrink-0"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Wallpaper
          </Link>
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

        {/* Gallery */}
        <Gallery wallpapers={wallpapers} />
      </main>
    </div>
  );
}
