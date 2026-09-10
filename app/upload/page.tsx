import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import UploadForm from '@/components/UploadForm';
import UploadGuard from '@/components/UploadGuard';

export const metadata: Metadata = {
  title: 'Upload Wallpaper — WallVerse',
  description: 'Upload your self-clicked photos as desktop or mobile wallpapers to share with friends.',
};

export default function UploadPage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
        <UploadGuard>
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-8" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-[var(--text)] transition-colors">
              Gallery
            </Link>
            <svg className="w-4 h-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
            <span className="text-[var(--text)]">Upload</span>
          </nav>

          {/* Page header */}
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">
              Upload a Wallpaper
            </h1>
            <p className="text-[var(--text-muted)]">
              Share a photo you&apos;ve taken. It will be automatically cropped and resized to the perfect resolution for the selected device type.
            </p>
          </div>

          {/* Info cards */}
          <div className="grid grid-cols-2 gap-3 mb-8">
            {[
              {
                title: 'Auto-Resized',
                desc: 'Sharp server-side processing ensures pixel-perfect output.',
                icon: '✨',
              },
              {
                title: 'Private Share',
                desc: 'Accessible only to people you share the link with.',
                icon: '🔗',
              },
            ].map(({ title, desc, icon }) => (
              <div key={title} className="glass-card p-4">
                <div className="text-xl mb-2">{icon}</div>
                <div className="text-sm font-semibold text-[var(--text)]">{title}</div>
                <div className="text-xs text-[var(--text-muted)] mt-1">{desc}</div>
              </div>
            ))}
          </div>

          {/* Upload form */}
          <UploadForm />
        </UploadGuard>
      </main>
    </div>
  );
}
