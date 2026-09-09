import type { Metadata } from 'next';
import './globals.css';
import Footer from '@/components/Footer';
import { ThemeProvider } from '@/components/ThemeProvider';

export const metadata: Metadata = {
  title: 'WallVerse — Share & Download Stunning Wallpapers',
  description:
    'A private gallery where friends upload and share beautiful self-clicked wallpapers, perfectly formatted for desktop and mobile.',
  keywords: ['wallpapers', 'gallery', 'photos', 'desktop', 'mobile', 'download'],
  openGraph: {
    title: 'WallVerse',
    description: 'Share and download stunning wallpapers with friends on WallVerse.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body className="min-h-screen flex flex-col antialiased bg-[var(--bg)] text-[var(--text)] transition-colors duration-300">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
