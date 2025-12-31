'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllVideoUrls } from '@/lib/video-providers';
import type { VideoProvider } from '@/types';
import { useTranslations } from '@/i18n';
import { usePlaybackStore } from '@/store/playbackStore';
import { Button } from './ui/Button';

interface VideoPlayerProps {
  tmdbId: number;
  mediaType: 'movie' | 'tv';
  season?: number;
  episode?: number;
  onTimeUpdate?: (currentTime: number) => void;
}

export function VideoPlayer({
  tmdbId,
  mediaType,
  season,
  episode,
  onTimeUpdate,
}: VideoPlayerProps) {
  const { t } = useTranslations();
  const { currentProvider, setCurrentProvider } = usePlaybackStore();
  const [providers, setProviders] = useState<Array<{ provider: VideoProvider; url: string; name: string }>>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showProviderMenu, setShowProviderMenu] = useState(false);
  const [showNotice, setShowNotice] = useState(true);

  useEffect(() => {
    const allProviders = getAllVideoUrls(tmdbId, mediaType, season, episode);
    setProviders(allProviders);

    // Find current provider index or default to 0
    const index = allProviders.findIndex((p) => p.provider === currentProvider);
    setCurrentIndex(index >= 0 ? index : 0);
  }, [tmdbId, mediaType, season, episode, currentProvider]);

  const handleIframeLoad = useCallback(() => {
    setIsLoading(false);
    setError(null);
  }, []);

  const handleIframeError = useCallback(() => {
    setError(t('video.providerError'));

    // Try next provider after 2 seconds
    setTimeout(() => {
      if (currentIndex < providers.length - 1) {
        setCurrentIndex((prev) => prev + 1);
        setIsLoading(true);
        setError(null);
      } else {
        setError(t('video.allProvidersFailed'));
      }
    }, 2000);
  }, [currentIndex, providers.length, t]);

  const switchProvider = (index: number) => {
    setCurrentIndex(index);
    setCurrentProvider(providers[index].provider);
    setIsLoading(true);
    setError(null);
    setShowProviderMenu(false);
  };

  if (!providers.length) {
    return (
      <div className="flex items-center justify-center h-full bg-netflix-darkGray">
        <p>{t('common.loading')}</p>
      </div>
    );
  }

  const currentVideoUrl = providers[currentIndex]?.url;

  return (
    <div className="relative w-full bg-black mx-auto">
      {/* Video Container */}
      <div className="video-container mx-auto">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-netflix-darkGray">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-netflix-red mx-auto mb-4" />
              <p>{t('video.loading')}</p>
            </div>
          </div>
        )}

        {/* Initial Notice - Show before playing */}
        <AnimatePresence>
          {showNotice && !isLoading && !error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-black/90 backdrop-blur-sm z-40"
            >
              <div className="text-center max-w-md px-6 py-8 bg-netflix-darkGray/80 rounded-lg border border-netflix-gray">
                <div className="mb-4">
                  <svg className="w-12 h-12 mx-auto text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-white">Important Notice</h3>
                <p className="text-sm text-gray-300 mb-6">
                  Please change server when you are getting any error
                </p>
                <Button
                  onClick={() => setShowNotice(false)}
                  variant="primary"
                  size="md"
                  className="w-full"
                >
                  Got it, Continue
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>


        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-netflix-darkGray z-30">
            <div className="text-center max-w-md px-4">
              <div className="mb-4">
                <svg className="w-16 h-16 mx-auto text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-red-500 mb-2 font-semibold">{error}</p>
              <p className="text-sm text-gray-400 mb-4">
                {currentIndex < providers.length - 1
                  ? `Trying next provider: ${providers[currentIndex + 1]?.name}...`
                  : 'All providers have been tried.'}
              </p>
              {currentIndex < providers.length - 1 && (
                <Button onClick={() => switchProvider(currentIndex + 1)} variant="primary" size="sm">
                  Try Next Provider
                </Button>
              )}
              {currentIndex >= providers.length - 1 && (
                <div className="space-y-2">
                  <p className="text-xs text-gray-500">
                    This content may not be available on any provider at the moment.
                  </p>
                  <Button onClick={() => switchProvider(0)} variant="secondary" size="sm">
                    Retry from First Provider
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        <iframe
          src={currentVideoUrl}
          className="absolute top-0 left-0 w-full h-full"
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          onLoad={handleIframeLoad}
          onError={handleIframeError}
        />
      </div>

      {/* Provider Indicator - Always show current provider */}
      <div className="absolute top-4 right-4 z-20">
        <div className="bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs text-white/80 border border-white/10">
          <span className="font-medium">{providers[currentIndex]?.name}</span>
        </div>
      </div>

      {/* Provider Selector - Show only if multiple providers */}
      {providers.length > 1 && (
        <div className="absolute top-14 right-4 z-20">
          <div className="relative">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowProviderMenu(!showProviderMenu)}
            >
              {providers[currentIndex]?.name}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </Button>

            <AnimatePresence>
              {showProviderMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-48 bg-netflix-darkGray border border-netflix-gray rounded shadow-lg py-2"
                >
                  {providers.map((provider, index) => (
                    <button
                      key={provider.provider}
                      onClick={() => switchProvider(index)}
                      className={`w-full text-left px-4 py-2 hover:bg-netflix-gray transition-colors ${index === currentIndex ? 'bg-netflix-gray' : ''
                        }`}
                    >
                      {provider.name}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}
