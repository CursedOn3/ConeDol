'use client';

import React from 'react';
import Link from 'next/link';
import type { Genre } from '@/types';

interface GenreBadgesProps {
  genres: Genre[];
  mediaType: 'movie' | 'tv';
}

export function GenreBadges({ genres, mediaType }: GenreBadgesProps) {
  if (!genres || genres.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {genres.map((genre) => (
        <Link
          key={genre.id}
          href={`/genre/${mediaType}/${genre.id}`}
          className="px-3 py-1 bg-netflix-gray hover:bg-netflix-lightGray rounded-full text-sm transition-colors"
        >
          {genre.name}
        </Link>
      ))}
    </div>
  );
}
