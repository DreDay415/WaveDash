import { generateMockMetrics, generateMockCallVolume } from '@/lib/mock-data';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const UPDATE_INTERVAL_MS = 30000;

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
        const metrics = generateMockMetrics();
        const callVolume = generateMockCallVolume();
        send('metrics', metrics);
        send('callVolume', callVolume);
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
