const FIVE9_API_BASE = process.env.NEXT_PUBLIC_FIVE9_API_BASE || 'http://137.184.114.183:8080';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const UPDATE_INTERVAL_MS = 30000;

async function fetchRealMetrics() {
  try {
    const response = await fetch(`${FIVE9_API_BASE}/health`, { cache: 'no-store' });
    if (!response.ok) throw new Error('Health check failed');
    
    const metricsResponse = await fetch(`${FIVE9_API_BASE}/metrics`, { cache: 'no-store' });
    const metricsText = await metricsResponse.text();
    
    const successMatch = metricsText.match(/files_processed_total\{status="success"[^}]*\}\s+(\d+)/);
    const filesProcessed = successMatch ? parseInt(successMatch[1], 10) : 0;
    
    return {
      lastRun: {
        timestamp: new Date().toISOString(),
        status: 'success',
        duration: 0,
        filesTransferred: filesProcessed,
        bytesTransferred: filesProcessed * 5 * 1024 * 1024,
      },
    };
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      let intervalId: NodeJS.Timeout | null = null;

      const send = (event: string, payload: unknown) => {
        controller.enqueue(encoder.encode(`event: ${event}\n`));
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`));
      };

      const sendAll = async () => {
        const metrics = await fetchRealMetrics();
        if (metrics) {
          send('metrics', metrics);
        }
      };

      try {
        await sendAll();
      } catch {
        send('error', { message: 'Failed to load initial metrics' });
      }

      intervalId = setInterval(async () => {
        try {
          await sendAll();
        } catch {
          send('error', { message: 'Failed to refresh metrics' });
        }
      }, UPDATE_INTERVAL_MS);

      request.signal.addEventListener('abort', () => {
        if (intervalId) {
          clearInterval(intervalId);
        }
        controller.close();
      });
    },
    cancel() {
      // Client disconnected.
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  });
}
