---
agent: agent
---
Build a complete Netflix-style streaming platform using the following stack:

- Next.js 14 (App Router)
- TypeScript
- TailwindCSS
- NextAuth (Google + Email/Password)
- Prisma ORM with PostgreSQL or MongoDB
- TMDB API for all movie/series metadata
- External video providers for streaming (iframe-based)
- Zustand or Redux Toolkit for global state
- Framer Motion animations
- Internationalization (English + Nepali)
- SEO-optimized with ISR + Metadata API

------------------------------------
TMDB CREDENTIALS
------------------------------------
API Read Access Token:
"eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyMDMxZTMwN2E2N2RhMDAyODBiY2JiNzY1OTM4M2Y1ZCIsIm5iZiI6MTc2NDkwNDYzOC43ODksInN1YiI6IjY5MzI0ZWJlM2NiYWRjNThjMWZkYzYxYSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.kYcIlN5bADqgkodqrSWP62jNZqTaUGq1rG9qMC1wAGI"

API Key:
"2031e307a67da00280bcbb7659383f5d"

------------------------------------
VIDEO PROVIDERS (iframe playable)
------------------------------------
Use these streaming URLs with auto-fallback:
- https://www.vidking.net/
- https://111movies.com/
- https://vidrock.net
- https://www.vidsrc.wtf
- https://w1.moviesapi.to

Create a system that:
- Generates iframe URLs dynamically from TMDB movie ID or title
- If one provider fails, fallback to the next automatically
- Works across all devices

------------------------------------
CORE FEATURES TO IMPLEMENT
------------------------------------

## 1. Auth System
Use NextAuth with:
- Google OAuth
- Email + Password
- Protected routes (middleware)

Redirect logic:
- Non-logged users → /login
- After login → /profiles (like Netflix)
- After selecting profile → /home

## 2. Database (Prisma)
Create these schemas:
- User
- Profile (multiple profiles per account like Netflix)
- Watchlist
- ContinueWatching
- AdminUser
- CustomContent (admin-added content)

## 3. TMDB Integration
Create a reusable TMDB service with:
- getTrending()
- getPopularMovies()
- getTopRatedMovies()
- getNowPlaying()
- getUpcoming()
- getMovieDetails(id)
- getTVDetails(id)
- search(query)
- getCredits(id)

Include global error handling + caching layer.

## 4. UI Components
Build reusable UI components:
- Navbar
- Profile Selector
- HeroBanner (random trending)
- RowSlider (horizontal scroll with arrows)
- MovieCard
- CastList
- GenreBadges
- VideoPlayer (iframe + provider fallback)
- SearchBar (with debounce)
- Footer
- Skeleton loaders

All pages must be responsive: Desktop, Tablet, Mobile.

Use Framer Motion for animations.

## 5. Pages (App Router)
- /login
- /register
- /profiles
- /home
- /movie/[id]
- /tv/[id]
- /search
- /watch/[id] (video player)
- /watchlist
- /continue-watching
- /admin (protected by admin role)

## 6. Watchlist + Continue Watching
- Watchlist stored in database
- ContinueWatching updated when user pauses video
- Load saved position in player

## 7. Admin Panel
Admin features:
- Login as admin
- Add custom movies/series manually
- Upload posters, backdrops, and trailers
- Mark featured content
- Edit or delete items
- View user statistics

## 8. Global State (Zustand or Redux)
Store:
- Current profile
- Playback state
- UI theme (dark mode default)
- Language (Eng/Nep)

## 9. Internationalization
Implement language switch (English & Nepali) using:
- next-intl OR next-i18n-router

Translate:
- UI text
- Buttons
- Menus
- Error messages

## 10. SEO + Performance
- Use Next.js Metadata API
- Add dynamic metadata for movie pages
- Set up ISR caching for TMDB responses
- Use Image Optimization (next/image)
- Lazy-loading for rows + player

## 11. Styling
- TailwindCSS with Netflix-style theme
- Glassmorphism overlays
- Hover zoom on cards
- Smooth carousels (snap-x scrolling)
- Shimmer skeletons

------------------------------------
GOAL FOR COPILOT
------------------------------------
Generate:
- A complete project folder structure
- All Next.js pages + components
- All API fetchers and server actions
- Prisma schema + migrations
- NextAuth configuration
- VideoPlayer iframe logic with fallback
- TMDB integration with caching
- Admin panel pages + components
- Multilanguage setup
- Watchlist + ContinueWatching functionality
- UI, animations, and styling

Write clean, modular, production-ready TypeScript code following best practices.
