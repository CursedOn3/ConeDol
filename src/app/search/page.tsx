'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { SearchBar } from '@/components/SearchBar';
import { MovieCard } from '@/components/MovieCard';
import { tmdbService } from '@/lib/tmdb';
import { useTranslations } from '@/i18n';
import type { TMDBMovie, TMDBTVShow } from '@/types';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const { t } = useTranslations();
  
  const [results, setResults] = useState<Array<TMDBMovie | TMDBTVShow>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState(initialQuery);

  useEffect(() => {
    if (initialQuery) {
      handleSearch(initialQuery);
    }
  }, [initialQuery]);

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    setQuery(searchQuery);

    try {
      const response = await tmdbService.search(searchQuery);
      const filteredResults = response.results.filter(
        (item: any) => item.media_type === 'movie' || item.media_type === 'tv'
      );
      setResults(filteredResults);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-netflix-black">
      <Navbar />

      <div className="pt-24 px-4 md:px-8 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <SearchBar onSearch={handleSearch} autoFocus />
          </div>

          {isLoading && (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-netflix-red mx-auto mb-4" />
              <p>{t('search.searching')}</p>
            </div>
          )}

          {!isLoading && query && results.length === 0 && (
            <div className="text-center py-16">
              <p className="text-xl text-gray-400">
                {t('search.noResults')} &quot;{query}&quot;
              </p>
            </div>
          )}

          {!isLoading && results.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">
                {t('search.results')} ({results.length})
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {results.map((item: any) => (
                  <MovieCard
                    key={item.id}
                    item={item}
                    mediaType={item.media_type || ('title' in item ? 'movie' : 'tv')}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
