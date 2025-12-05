import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ConeDol - Stream Movies & TV Shows',
  description: 'Watch unlimited movies and TV shows online. Stream the latest releases and classics.',
  keywords: ['streaming', 'movies', 'tv shows', 'entertainment', 'watch online'],
  authors: [{ name: 'ConeDol' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://conedol.com',
    siteName: 'ConeDol',
    title: 'ConeDol - Stream Movies & TV Shows',
    description: 'Watch unlimited movies and TV shows online.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ConeDol - Stream Movies & TV Shows',
    description: 'Watch unlimited movies and TV shows online.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
