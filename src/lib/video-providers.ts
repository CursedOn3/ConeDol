import type { VideoProvider, VideoProviderConfig } from '@/types';

// Video provider configurations
export const videoProviders: Record<VideoProvider, VideoProviderConfig> = {
  vidsrc_to: {
    name: 'VidSrc.to',
    baseUrl: 'https://vidsrc.to',
    buildUrl: (tmdbId, mediaType, season, episode) => {
      if (mediaType === 'tv' && season && episode) {
        return `https://vidsrc.to/embed/tv/${tmdbId}/${season}/${episode}`;
      }
      return `https://vidsrc.to/embed/movie/${tmdbId}`;
    },
  },
  vidsrc_xyz: {
    name: 'VidSrc.xyz',
    baseUrl: 'https://vidsrc.xyz',
    buildUrl: (tmdbId, mediaType, season, episode) => {
      if (mediaType === 'tv' && season && episode) {
        return `https://vidsrc.xyz/embed/tv/${tmdbId}/${season}/${episode}`;
      }
      return `https://vidsrc.xyz/embed/movie/${tmdbId}`;
    },
  },
  superembed: {
    name: 'SuperEmbed',
    baseUrl: 'https://multiembed.mov',
    buildUrl: (tmdbId, mediaType, season, episode) => {
      if (mediaType === 'tv' && season && episode) {
        return `https://multiembed.mov/?video_id=${tmdbId}&tmdb=1&s=${season}&e=${episode}`;
      }
      return `https://multiembed.mov/?video_id=${tmdbId}&tmdb=1`;
    },
  },
  moviesapi: {
    name: 'MoviesAPI',
    baseUrl: 'https://moviesapi.club',
    buildUrl: (tmdbId, mediaType, season, episode) => {
      if (mediaType === 'tv' && season && episode) {
        return `https://moviesapi.club/tv/${tmdbId}/${season}/${episode}`;
      }
      return `https://moviesapi.club/movie/${tmdbId}`;
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
  return getVideoUrl('vidsrc_to', tmdbId, mediaType, season, episode);
}
