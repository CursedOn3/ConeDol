import { NextRequest, NextResponse } from 'next/server';
import { tmdbService } from '@/lib/tmdb';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; season: string } }
) {
  try {
    const tvId = parseInt(params.id);
    const seasonNumber = parseInt(params.season);

    const seasonData = await tmdbService.getSeasonDetails(tvId, seasonNumber);

    return NextResponse.json(seasonData);
  } catch (error) {
    console.error('Error fetching season details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch season details' },
      { status: 500 }
    );
  }
}
