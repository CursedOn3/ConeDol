export { default } from 'next-auth/middleware';

export const config = {
  matcher: [
    '/profiles/:path*',
    '/watchlist/:path*',
    '/continue-watching/:path*',
    '/admin/:path*',
  ],
};
