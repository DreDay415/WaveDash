'use client';

import { useQuery } from '@tanstack/react-query';
import { SyncMetrics, CallVolumeMetrics } from '@/types/metrics';
import { POLLING_INTERVAL } from '@/lib/constants';

async function fetchMetrics(): Promise<SyncMetrics> {
  const response = await fetch('/api/metrics');
  if (!response.ok) {
    throw new Error('Failed to fetch metrics');
  }
  return response.json();
}

async function fetchCallVolume(): Promise<CallVolumeMetrics> {
  const response = await fetch('/api/call-volume');
  if (!response.ok) {
    throw new Error('Failed to fetch call volume');
  }
  return response.json();
}

export function useMetrics() {
  return useQuery({
    queryKey: ['metrics'],
    queryFn: fetchMetrics,
    refetchInterval: POLLING_INTERVAL,
    staleTime: 10000,
  });
}

export function useCallVolume() {
  return useQuery({
    queryKey: ['callVolume'],
    queryFn: fetchCallVolume,
    refetchInterval: POLLING_INTERVAL,
    staleTime: 10000,
  });
}
