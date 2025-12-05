'use client';

import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'card' | 'text' | 'circular' | 'rectangular';
}

export function Skeleton({ className = '', variant = 'rectangular' }: SkeletonProps) {
  const baseClasses = 'skeleton animate-pulse bg-netflix-gray';
  
  const variantClasses = {
    card: 'w-full aspect-[2/3] rounded-md',
    text: 'h-4 w-full rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-md',
  };

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`} />
  );
}

export function MovieCardSkeleton() {
  return (
    <div className="flex-shrink-0 w-40 md:w-48 lg:w-56">
      <Skeleton variant="card" />
      <Skeleton variant="text" className="mt-2 w-3/4" />
    </div>
  );
}

export function HeroBannerSkeleton() {
  return (
    <div className="relative w-full h-[70vh] md:h-[80vh]">
      <Skeleton className="w-full h-full" />
      <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
        <Skeleton variant="text" className="w-1/3 h-12 mb-4" />
        <Skeleton variant="text" className="w-2/3 h-6 mb-2" />
        <Skeleton variant="text" className="w-1/2 h-6 mb-6" />
        <div className="flex gap-4">
          <Skeleton className="w-32 h-12 rounded" />
          <Skeleton className="w-32 h-12 rounded" />
        </div>
      </div>
    </div>
  );
}

export function RowSliderSkeleton() {
  return (
    <div className="mb-8">
      <Skeleton variant="text" className="w-48 h-8 mb-4" />
      <div className="flex gap-2 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <MovieCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
