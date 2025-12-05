'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { tmdbService } from '@/lib/tmdb';
import type { Cast } from '@/types';

interface CastListProps {
  cast: Cast[];
  limit?: number;
}

export function CastList({ cast, limit = 10 }: CastListProps) {
  const displayCast = cast.slice(0, limit);

  if (!displayCast.length) return null;

  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Cast</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {displayCast.map((person) => (
          <motion.div
            key={person.id}
            whileHover={{ scale: 1.05 }}
            className="flex flex-col items-center text-center"
          >
            <div className="relative w-24 h-24 rounded-full overflow-hidden mb-2 bg-netflix-gray">
              {person.profile_path ? (
                <Image
                  src={tmdbService.getProfileUrl(person.profile_path)}
                  alt={person.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl text-gray-600">
                  {person.name[0]}
                </div>
              )}
            </div>
            <p className="font-semibold text-sm">{person.name}</p>
            <p className="text-xs text-gray-400">{person.character}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
