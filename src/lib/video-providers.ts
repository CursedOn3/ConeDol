import type { VideoProvider, VideoProviderConfig } from '@/types';

// Video provider configurations
export const videoProviders: Record<VideoProvider, VideoProviderConfig> = {
  vidking: {
    name: 'VidKing',
    baseUrl: 'https://www.vidking.net',
    buildUrl: (tmdbId, mediaType, season, episode) => {
      if (mediaType === 'tv' && season && episode) {
        return `https://www.vidking.net/embed/tv/${tmdbId}/${season}/${episode}`;
      }
      return `https://www.vidking.net/embed/movie/${tmdbId}`;
    },
  },
  '111movies': {
    name: '111Movies',
    baseUrl: 'https://111movies.com',
    buildUrl: (tmdbId, mediaType, season, episode) => {
      if (mediaType === 'tv' && season && episode) {
        return `https://111movies.com/embed/tv/${tmdbId}/${season}/${episode}`;
      }
      return `https://111movies.com/embed/movie/${tmdbId}`;
    },
  },
  vidrock: {
    name: 'VidRock',
    baseUrl: 'https://vidrock.net',
    buildUrl: (tmdbId, mediaType, season, episode) => {
      if (mediaType === 'tv' && season && episode) {
        return `https://vidrock.net/embed/tv/${tmdbId}/${season}/${episode}`;
      }
      return `https://vidrock.net/embed/movie/${tmdbId}`;
    },
  },
  vidsrc: {
    name: 'VidSrc',
    baseUrl: 'https://www.vidsrc.wtf',
    buildUrl: (tmdbId, mediaType, season, episode) => {
      if (mediaType === 'tv' && season && episode) {
        return `https://www.vidsrc.wtf/embed/tv/${tmdbId}/${season}/${episode}`;
      }
      return `https://www.vidsrc.wtf/embed/movie/${tmdbId}`;
    },
  },
  moviesapi: {
    name: 'MoviesAPI',
    baseUrl: 'https://w1.moviesapi.to',
    buildUrl: (tmdbId, mediaType, season, episode) => {
      if (mediaType === 'tv' && season && episode) {
        return `https://w1.moviesapi.to/embed/tv/${tmdbId}/${season}-${episode}`;
      }
      return `https://w1.moviesapi.to/embed/movie/${tmdbId}`;
    },
  },
};

// Get all available providers
export function getAvailableProviders(): VideoProvider[] {
  return Object.keys(videoProviders) as VideoProvider[];
}

// Get video URL for a specific provider
export function getVideoUrl(
  provider: VideoProvider,
  tmdbId: number,
  mediaType: 'movie' | 'tv',
  season?: number,
  episode?: number
): string {
  const config = videoProviders[provider];
  return config.buildUrl(tmdbId, mediaType, season, episode);
}

// Get all video URLs for fallback
export function getAllVideoUrls(
  tmdbId: number,
  mediaType: 'movie' | 'tv',
  season?: number,
  episode?: number
): Array<{ provider: VideoProvider; url: string; name: string }> {
  return getAvailableProviders().map((provider) => ({
    provider,
    url: getVideoUrl(provider, tmdbId, mediaType, season, episode),
    name: videoProviders[provider].name,
  }));
}

// Get default provider URL
export function getDefaultVideoUrl(
  tmdbId: number,
  mediaType: 'movie' | 'tv',
  season?: number,
  episode?: number
): string {
  return getVideoUrl('vidsrc', tmdbId, mediaType, season, episode);
}
