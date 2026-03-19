import { NextResponse } from 'next/server';
import { generateMockCallVolume } from '@/lib/mock-data';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    // Still using mock data for call volume (we'll add real data later)
    const callVolume = generateMockCallVolume();
    
    return NextResponse.json(callVolume, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch call volume data' },
      { status: 500 }
    );
  }
}
