'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { tmdbService } from '@/lib/tmdb';
import type { TMDBMovie, TMDBTVShow } from '@/types';

interface MovieCardProps {
  item: TMDBMovie | TMDBTVShow;
  mediaType: 'movie' | 'tv';
}

export function MovieCard({ item, mediaType }: MovieCardProps) {
  const title = 'title' in item ? item.title : item.name;
  const posterUrl = tmdbService.getPosterUrl(item.poster_path);
  const id = item.id;

  return (
    <Link href={`/${mediaType}/${id}`}>
      <motion.div
        whileHover={{ scale: 1.05, zIndex: 10 }}
        transition={{ duration: 0.2 }}
        className="relative flex-shrink-0 w-40 md:w-48 lg:w-56 cursor-pointer group"
      >
        <div className="relative aspect-[2/3] rounded-md overflow-hidden">
          <Image
            src={posterUrl}
            alt={title}
            fill
            sizes="(max-width: 768px) 160px, (max-width: 1024px) 192px, 224px"
            className="object-cover transition-transform duration-300 group-hover:scale-110"
          />
          
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
            <div className="p-4 w-full">
              <h3 className="text-white font-semibold text-sm line-clamp-2 mb-2">
                {title}
              </h3>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-xs text-gray-300">
                    {item.vote_average.toFixed(1)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
