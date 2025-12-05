'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useProfileStore } from '@/store/profileStore';
import { useTranslations } from '@/i18n';
import { tmdbService } from '@/lib/tmdb';
import type { ContinueWatchingItem } from '@/types';
import { FaPlay } from 'react-icons/fa';

export default function ContinueWatchingPage() {
  const { t } = useTranslations();
  const { currentProfile } = useProfileStore();
  const [items, setItems] = useState<ContinueWatchingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (currentProfile) {
      fetchContinueWatching();
    }
  }, [currentProfile]);

  const fetchContinueWatching = async () => {
    if (!currentProfile) return;

    try {
      const response = await fetch(`/api/continue-watching?profileId=${currentProfile.id}`);
      if (response.ok) {
        const data = await response.json();
        setItems(data);
      }
    } catch (error) {
      console.error('Failed to fetch continue watching:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getWatchUrl = (item: ContinueWatchingItem) => {
    if (item.mediaType === 'tv' && item.seasonNumber && item.episodeNumber) {
      return `/watch/tv/${item.tmdbId}/${item.seasonNumber}/${item.episodeNumber}`;
    }
    return `/watch/movie/${item.tmdbId}`;
  };

  return (
    <div className="min-h-screen bg-netflix-black">
      <Navbar />

      <div className="pt-24 px-4 md:px-8 pb-16">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-8">
            {t('continueWatching.title')}
          </h1>

          {isLoading && (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-netflix-red mx-auto mb-4" />
              <p>{t('common.loading')}</p>
            </div>
          )}

          {!isLoading && items.length === 0 && (
            <div className="text-center py-16">
              <p className="text-xl text-gray-400 mb-2">{t('continueWatching.empty')}</p>
              <p className="text-gray-500">{t('continueWatching.emptyDescription')}</p>
            </div>
          )}

          {!isLoading && items.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item) => (
                <Link key={item.id} href={getWatchUrl(item)}>
                  <div className="relative group cursor-pointer">
                    <div className="relative aspect-video rounded-lg overflow-hidden">
                      <Image
                        src={tmdbService.getBackdropUrl(item.backdropPath, 'w780')}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      
                      {/* Progress Bar */}
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
                        <div
                          className="h-full bg-netflix-red"
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>

                      {/* Play Overlay */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <FaPlay className="text-5xl" />
                      </div>
                    </div>

                    <div className="mt-2">
                      <h3 className="font-bold text-lg">{item.title}</h3>
                      {item.mediaType === 'tv' && item.seasonNumber && item.episodeNumber && (
                        <p className="text-sm text-gray-400">
                          S{item.seasonNumber} E{item.episodeNumber}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        {Math.round(item.progress)}% watched
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
