# ConeDol - Netflix-Style Streaming Platform

A complete, production-ready streaming platform built with Next.js 14, TypeScript, and modern web technologies.

## 🚀 Features

### Core Features
- ✅ **Authentication System**: NextAuth with Google OAuth and Email/Password
- ✅ **Multi-Profile Support**: Netflix-style user profiles
- ✅ **TMDB Integration**: Real-time movie and TV show data
- ✅ **Video Streaming**: Multi-provider iframe system with automatic fallback
- ✅ **Watchlist**: Save movies and shows for later
- ✅ **Continue Watching**: Resume playback from where you left off
- ✅ **Search**: Real-time search with debouncing
- ✅ **Admin Panel**: Manage custom content and view statistics
- ✅ **Internationalization**: English and Nepali language support
- ✅ **Responsive Design**: Mobile, tablet, and desktop optimized
- ✅ **SEO Optimized**: Dynamic metadata and ISR caching

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL database
- TMDB API credentials (provided)

## 🛠️ Installation

1. **Install dependencies**
```bash
npm install
```

2. **Set up environment variables**
Create a `.env` file based on `.env.example` with your credentials

3. **Set up the database**
```bash
npx prisma generate
npx prisma db push
```

4. **Run the development server**
```bash
npm run dev
```

Visit `http://localhost:3000`

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
├── components/             # React components
├── lib/                    # Utilities and services
├── store/                  # Zustand stores
├── i18n/                   # Internationalization
└── types/                  # TypeScript types
```

## 🎬 Video Providers

The platform supports multiple video streaming providers with automatic fallback:
- VidSrc (default), VidKing, 111Movies, VidRock, MoviesAPI

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npx prisma studio` - Open Prisma Studio

## 📄 License

MIT License

---

Built with ❤️ using Next.js 14
