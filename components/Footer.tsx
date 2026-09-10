import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-[var(--border)] bg-[var(--surface-2)]/50 py-12 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
          {/* Brand & Artist */}
          <div className="flex flex-col items-center md:items-start gap-4">
            <Link href="/" className="font-bold text-2xl tracking-tight text-[var(--text)] group flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 21l6.75-6.75 6.75 6.75M16.5 3.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                </svg>
              </div>
              WallVerse
            </Link>
            <p className="text-[var(--text-muted)] text-sm max-w-sm">
              An exclusive collection of stunning wallpapers, masterfully captured and meticulously edited by Varun Tripathi.
            </p>
          </div>

          {/* Services / Connect */}
          <div className="flex flex-col items-center md:items-start gap-4">
            <h3 className="font-semibold text-[var(--text)] text-lg">Services & Booking</h3>
            <ul className="space-y-4 text-sm text-[var(--text-muted)] text-left max-w-xs mx-auto md:mx-0">
              <li>
                <span className="block font-semibold text-[var(--text)] mb-1">Photo Editing</span>
                Bring your photos to life with professional color grading and retouching.
              </li>
              <li>
                <span className="block font-semibold text-[var(--text)] mb-1">Photoshoots</span>
                Book a personalized session for portraits, landscapes, or events.
              </li>
            </ul>
          </div>

          {/* Links & Contact */}
          <div className="flex flex-col items-center md:items-start gap-4">
            <h3 className="font-semibold text-[var(--text)] text-lg">Connect & Explore</h3>
            <div className="space-y-3 flex flex-col items-center md:items-start text-sm">
              <a 
                href="https://oneis2one.framer.website" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[var(--text-muted)] hover:text-indigo-400 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                </svg>
                Portfolio Website
              </a>
              <a 
                href="https://oneis2one.framer.website"
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[var(--text-muted)] hover:text-indigo-400 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
                Contact Artist
              </a>
              <Link href="/upload" className="inline-flex items-center gap-2 text-[var(--text-muted)] hover:text-indigo-400 transition-colors mt-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Upload Wallpaper
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[var(--border)] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[var(--text-muted)]">
            © {new Date().getFullYear()} WallVerse by Varun Tripathi. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
