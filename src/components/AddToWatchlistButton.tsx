'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { FaPlus, FaMinus, FaSpinner } from 'react-icons/fa';
import { useProfileStore } from '@/store/profileStore';

interface AddToWatchlistButtonProps {
  tmdbId: number;
  mediaType: 'movie' | 'tv';
  title: string;
  posterPath?: string;
  backdropPath?: string;
  overview?: string;
}

export function AddToWatchlistButton({
  tmdbId,
  mediaType,
  title,
  posterPath,
  backdropPath,
  overview,
}: AddToWatchlistButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const { currentProfile, setCurrentProfile } = useProfileStore();
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [watchlistItemId, setWatchlistItemId] = useState<string | null>(null);

  useEffect(() => {
    if (session && currentProfile) {
      checkWatchlistStatus();
    } else if (session && !currentProfile) {
      // Auto-load first profile if logged in but no profile selected
      loadDefaultProfile();
    }
  }, [session, currentProfile, tmdbId]);

  const loadDefaultProfile = async () => {
    try {
      const response = await fetch('/api/profiles');
      if (response.ok) {
        const profiles = await response.json();
        if (profiles.length > 0) {
          setCurrentProfile(profiles[0]);
        }
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const checkWatchlistStatus = async () => {
    if (!currentProfile) return;
    
    try {
      const response = await fetch(`/api/watchlist?profileId=${currentProfile.id}`);
      if (response.ok) {
        const watchlist = await response.json();
        const item = watchlist.find((w: any) => w.tmdbId === tmdbId && w.mediaType === mediaType);
        if (item) {
          setIsInWatchlist(true);
          setWatchlistItemId(item.id);
        }
      }
    } catch (error) {
      console.error('Error checking watchlist:', error);
    }
  };

  const handleClick = async () => {
    // Redirect to sign-in if not authenticated
    if (!session) {
      router.push('/login');
      return;
    }

    // Wait a moment for profile to load if session exists
    if (!currentProfile) {
      await loadDefaultProfile();
      // If still no profile after loading, redirect to profiles page
      if (!currentProfile) {
        router.push('/profiles');
        return;
      }
    }

    setIsLoading(true);

    try {
      if (isInWatchlist && watchlistItemId) {
        // Remove from watchlist
        const response = await fetch(`/api/watchlist?id=${watchlistItemId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setIsInWatchlist(false);
          setWatchlistItemId(null);
        }
      } else {
        // Add to watchlist
        const response = await fetch('/api/watchlist', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            profileId: currentProfile!.id,
            tmdbId,
            mediaType,
            title,
            posterPath,
            backdropPath,
            overview,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setIsInWatchlist(true);
          setWatchlistItemId(data.id);
        }
      }
    } catch (error) {
      console.error('Error updating watchlist:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="secondary"
      size="lg"
      onClick={handleClick}
      disabled={isLoading}
    >
      {isLoading ? (
        <FaSpinner className="animate-spin" />
      ) : isInWatchlist ? (
        <>
          <FaMinus />
          Remove from List
        </>
      ) : (
        <>
          <FaPlus />
          My List
        </>
      )}
    </Button>
  );
}
