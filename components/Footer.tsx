import Link from 'next/link';
import Script from 'next/script';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-[var(--border)] py-8 text-center text-sm text-[var(--text-muted)] bg-[var(--bg)]/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center gap-6">
        <div className="space-y-3">
          <div className="flex items-center justify-center gap-2 flex-wrap w-full">
            <span className="text-[var(--text-muted)]">Photography & Editing by</span>
            <span className="font-semibold text-[var(--text)] tracking-wide">Varun Tripathi</span>
          </div>
          <div className="w-full max-w-3xl mx-auto">
            <div className="sk-instagram-feed" data-embed-id="25712431"></div>
            <Script src="https://widgets.sociablekit.com/instagram-feed/widget.js" strategy="lazyOnload" />
          </div>
        </div>
        <Link href="/upload" className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-500 hover:text-brand-400 transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add your wallpaper
        </Link>
      </div>
    </footer>
  );
}
