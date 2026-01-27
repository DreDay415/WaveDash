'use client';

import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
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
  const queryClient = useQueryClient();

  useEffect(() => {
    const eventSource = new EventSource('/api/live');

    eventSource.addEventListener('metrics', (event) => {
      try {
        const data = JSON.parse(event.data) as SyncMetrics;
        queryClient.setQueryData(['metrics'], data);
      } catch {
        // Ignore malformed event payloads.
      }
    });

    eventSource.addEventListener('callVolume', (event) => {
      try {
        const data = JSON.parse(event.data) as CallVolumeMetrics;
        queryClient.setQueryData(['callVolume'], data);
      } catch {
        // Ignore malformed event payloads.
      }
    });

    eventSource.onerror = () => {
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [queryClient]);

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
