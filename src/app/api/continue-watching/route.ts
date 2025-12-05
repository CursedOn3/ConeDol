import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const profileId = searchParams.get('profileId');

    if (!profileId) {
      return NextResponse.json({ message: 'Profile ID required' }, { status: 400 });
    }

    const continueWatching = await prisma.continueWatching.findMany({
      where: {
        userId: session.user.id,
        profileId,
      },
      orderBy: {
        lastWatched: 'desc',
      },
      take: 20,
    });

    return NextResponse.json(continueWatching);
  } catch (error) {
    console.error('Continue watching error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const {
      profileId,
      tmdbId,
      mediaType,
      title,
      posterPath,
      backdropPath,
      currentTime,
      duration,
      seasonNumber,
      episodeNumber,
    } = body;

    if (!profileId || !tmdbId || !mediaType || !title || currentTime === undefined) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const progress = duration ? (currentTime / duration) * 100 : 0;

    const continueWatchingItem = await prisma.continueWatching.upsert({
      where: {
        userId_profileId_tmdbId_mediaType: {
          userId: session.user.id,
          profileId,
          tmdbId,
          mediaType,
        },
      },
      update: {
        currentTime,
        duration,
        progress,
        seasonNumber,
        episodeNumber,
        lastWatched: new Date(),
      },
      create: {
        userId: session.user.id,
        profileId,
        tmdbId,
        mediaType,
        title,
        posterPath,
        backdropPath,
        currentTime,
        duration,
        progress,
        seasonNumber,
        episodeNumber,
      },
    });

    return NextResponse.json(continueWatchingItem);
  } catch (error) {
    console.error('Save continue watching error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
