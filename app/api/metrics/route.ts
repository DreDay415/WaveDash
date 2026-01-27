import { NextResponse } from 'next/server';
import { generateMockMetrics } from '@/lib/mock-data';

export async function GET() {
  try {
    const metrics = generateMockMetrics();
    return NextResponse.json(metrics);
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch metrics' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
