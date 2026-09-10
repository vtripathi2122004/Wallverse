import { supabase } from '@/lib/supabase';
import { Wallpaper } from '@/types/wallpaper';
import Navbar from '@/components/Navbar';
import Gallery from '@/components/Gallery';
import Link from 'next/link';
import Script from 'next/script';

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
        <div className="mb-12 mt-10 sm:mb-20 sm:mt-16 flex flex-col items-center justify-center text-center gap-6 sm:gap-8 max-w-3xl mx-auto">
          <div className="px-2 sm:px-0">
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-extrabold tracking-tighter leading-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
              WallVerse
            </h1>
            <p className="text-base sm:text-xl md:text-2xl font-medium text-[var(--text-muted)] mt-4 sm:mt-6 tracking-tight leading-relaxed max-w-2xl mx-auto">
              Discover an exclusive collection of stunning wallpapers, masterfully captured and meticulously edited by Varun Tripathi.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 mt-2 sm:mt-4">
            <Link
              href="#gallery-section"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-base bg-[var(--text)] text-[var(--bg)] hover:scale-105 transition-all active:scale-95 shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 21l6.75-6.75 6.75 6.75M16.5 3.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
              </svg>
              Browse Wallpapers
            </Link>
          </div>
        </div>

        {/* Gallery Section */}
        <div id="gallery-section" className="pt-4 scroll-mt-24">
          <Gallery wallpapers={wallpapers} />
        </div>

        {/* Instagram Feed Section */}
        <div className="mt-20 sm:mt-32 mb-10 w-full overflow-hidden">
          <div className="text-center mb-6 sm:mb-10 px-2">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--text)]">Follow on Instagram</h2>
            <p className="text-sm sm:text-base text-[var(--text-muted)] mt-2 sm:mt-3">Catch the latest updates and behind-the-scenes moments</p>
          </div>
          <div className="max-w-5xl mx-auto w-full flex justify-center">
            <div className="elfsight-app-6392a8c7-31bd-40fa-adaa-988b774bd625 w-full" data-elfsight-app-lazy></div>
            <Script src="https://static.elfsight.com/platform/platform.js" strategy="lazyOnload" />
          </div>
        </div>
      </main>
    </div>
  );
}
