import { NextResponse } from 'next/server';
import { generateMockCallVolume } from '@/lib/mock-data';

export async function GET() {
  try {
    const callVolume = generateMockCallVolume();
    return NextResponse.json(callVolume);
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch call volume data' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
