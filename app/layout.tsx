import type { Metadata } from 'next';
import './globals.css';
import Footer from '@/components/Footer';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Analytics } from '@vercel/analytics/next';

export const metadata: Metadata = {
  title: 'WallVerse — Stunning Wallpapers by Varun Tripathi',
  description:
    'An exclusive collection of stunning wallpapers, masterfully captured and meticulously edited by Varun Tripathi. Perfectly sized for desktop and mobile.',
  keywords: ['wallpapers', 'gallery', 'photos', 'desktop', 'mobile', 'download', 'Varun Tripathi', 'photography'],
  openGraph: {
    title: 'WallVerse',
    description: 'An exclusive collection of stunning wallpapers by Varun Tripathi.',
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
        <Analytics />
      </body>
    </html>
  );
}
