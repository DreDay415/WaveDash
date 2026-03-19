import { NextResponse } from 'next/server';

// SSE is disabled - use polling via /api/metrics instead
export async function GET() {
  return NextResponse.json(
    { error: 'SSE endpoint disabled - use /api/metrics for polling' },
    { status: 410 }
  );
}
