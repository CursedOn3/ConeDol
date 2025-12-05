'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { tmdbService } from '@/lib/tmdb';
import { FaPlay, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import type { Season, Episode } from '@/types';

interface SeasonListProps {
  tvId: number;
  seasons: Season[];
}

export function SeasonList({ tvId, seasons }: SeasonListProps) {
  const [expandedSeason, setExpandedSeason] = useState<number | null>(null);
  const [episodes, setEpisodes] = useState<Record<number, Episode[]>>({});
  const [loading, setLoading] = useState<Record<number, boolean>>({});

  const toggleSeason = async (seasonNumber: number) => {
    if (expandedSeason === seasonNumber) {
      setExpandedSeason(null);
      return;
    }

    setExpandedSeason(seasonNumber);

    // Fetch episodes if not already loaded
    if (!episodes[seasonNumber]) {
      setLoading({ ...loading, [seasonNumber]: true });
      try {
        const seasonData = await fetch(
          `/api/tv/${tvId}/season/${seasonNumber}`
        ).then((res) => res.json());
        
        setEpisodes({ ...episodes, [seasonNumber]: seasonData.episodes });
      } catch (error) {
        console.error('Failed to fetch episodes:', error);
      } finally {
        setLoading({ ...loading, [seasonNumber]: false });
      }
    }
  };

  return (
    <div>
      <h3 className="text-xl font-bold mb-3">Seasons</h3>
      <div className="space-y-2">
        {seasons
          .filter((s) => s.season_number > 0)
          .map((season) => (
            <div key={season.id} className="bg-netflix-gray rounded-lg overflow-hidden">
              {/* Season Header */}
              <button
                onClick={() => toggleSeason(season.season_number)}
                className="w-full flex items-center gap-4 p-4 hover:bg-white/5 transition-colors"
              >
                {season.poster_path && (
                  <Image
                    src={tmdbService.getPosterUrl(season.poster_path, 'w154')}
                    alt={season.name}
                    width={60}
                    height={90}
                    className="rounded"
                  />
                )}
                <div className="flex-1 text-left">
                  <h4 className="font-bold text-lg">{season.name}</h4>
                  <p className="text-sm text-gray-400">
                    {season.episode_count} Episodes
                  </p>
                  {season.air_date && (
                    <p className="text-sm text-gray-400">
                      {new Date(season.air_date).getFullYear()}
                    </p>
                  )}
                </div>
                <div className="text-gray-400">
                  {expandedSeason === season.season_number ? (
                    <FaChevronUp className="text-xl" />
                  ) : (
                    <FaChevronDown className="text-xl" />
                  )}
                </div>
              </button>

              {/* Episodes List */}
              {expandedSeason === season.season_number && (
                <div className="border-t border-gray-700">
                  {loading[season.season_number] ? (
                    <div className="p-8 text-center text-gray-400">
                      Loading episodes...
                    </div>
                  ) : episodes[season.season_number] ? (
                    <div className="divide-y divide-gray-700">
                      {episodes[season.season_number].map((episode) => (
                        <Link
                          key={episode.id}
                          href={`/watch/tv/${tvId}/${season.season_number}/${episode.episode_number}`}
                          className="flex gap-4 p-4 hover:bg-white/5 transition-colors group"
                        >
                          {episode.still_path && (
                            <div className="relative w-40 h-24 flex-shrink-0">
                              <Image
                                src={tmdbService.getBackdropUrl(
                                  episode.still_path,
                                  'w300'
                                )}
                                alt={episode.name}
                                fill
                                className="object-cover rounded"
                              />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <FaPlay className="text-2xl" />
                              </div>
                            </div>
                          )}
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <h5 className="font-semibold group-hover:text-netflix-red transition-colors">
                                {episode.episode_number}. {episode.name}
                              </h5>
                              {episode.runtime && (
                                <span className="text-sm text-gray-400 ml-2">
                                  {episode.runtime}m
                                </span>
                              )}
                            </div>
                            {episode.overview && (
                              <p className="text-sm text-gray-400 line-clamp-2">
                                {episode.overview}
                              </p>
                            )}
                            {episode.air_date && (
                              <p className="text-xs text-gray-500 mt-1">
                                Aired: {new Date(episode.air_date).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center text-gray-400">
                      No episodes available
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}
