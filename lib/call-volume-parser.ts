import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';
import { CallVolumeMetrics } from '@/types/metrics';

const execAsync = promisify(exec);

const INCOMING_PATH = process.env.FIVE9_INCOMING_PATH || '/srv/five9/incoming';

function getHourFromFilename(filename: string): number | null {
  const match = filename.match(/@ (\d{1,2})_\d{2}_\d{2} (AM|PM)/);
  if (!match) return null;
  let hour = Number.parseInt(match[1], 10);
  const meridian = match[2];
  if (meridian === 'PM' && hour !== 12) hour += 12;
  if (meridian === 'AM' && hour === 12) hour = 0;
  return hour;
}

function getEmailFromFilename(filename: string): string | null {
  const match = filename.match(/by ([^@ ]+@[^ ]+) @/);
  return match?.[1] ?? null;
}

async function listWaveFiles(): Promise<string[]> {
  try {
    const { stdout } = await execAsync(
      `find "${INCOMING_PATH}" -type f -name "*.wav" 2>/dev/null`
    );
    if (!stdout.trim()) return [];
    return stdout.trim().split('\n');
  } catch {
    return [];
  }
}

async function getDailyTrend(): Promise<CallVolumeMetrics['dailyTrend']> {
  try {
    const entries = await fs.readdir(INCOMING_PATH, { withFileTypes: true });
    const dirs = await Promise.all(
      entries
        .filter((entry) => entry.isDirectory())
        .map(async (entry) => {
          const fullPath = path.join(INCOMING_PATH, entry.name);
          const stats = await fs.stat(fullPath);
          return { name: entry.name, fullPath, mtime: stats.mtimeMs };
        })
    );

    const lastSevenDirs = dirs
      .sort((a, b) => a.mtime - b.mtime)
      .slice(-7);

    const dailyTrend: CallVolumeMetrics['dailyTrend'] = [];
    for (const dir of lastSevenDirs) {
      const { stdout: countOutput } = await execAsync(
        `find "${dir.fullPath}" -type f -name "*.wav" 2>/dev/null | wc -l`
      );
      const { stdout: sizeOutput } = await execAsync(
        `du -sm "${dir.fullPath}" 2>/dev/null | cut -f1`
      );

      const callCount = Number.parseInt(countOutput.trim(), 10) || 0;
      const dataVolume = Number.parseInt(sizeOutput.trim(), 10) || 0;

      dailyTrend.push({
        date: dir.name.replace(/_/g, '-'),
        callCount,
        dataVolume,
      });
    }

    return dailyTrend;
  } catch {
    return [];
  }
}

export async function parseCallVolume(): Promise<CallVolumeMetrics> {
  const files = await listWaveFiles();

  const callerCounts: Record<string, number> = {};
  const hourlyCounts = Array.from({ length: 24 }, () => 0);

  for (const filePath of files) {
    const filename = path.basename(filePath);

    const email = getEmailFromFilename(filename);
    if (email) {
      callerCounts[email] = (callerCounts[email] || 0) + 1;
    }

    const hour = getHourFromFilename(filename);
    if (hour !== null) {
      hourlyCounts[hour] += 1;
    }
  }

  const totalCalls = files.length || 1;
  const topCallers = Object.entries(callerCounts)
    .map(([email, count]) => ({
      email,
      callCount: count,
      percentage: Math.round((count / totalCalls) * 100),
    }))
    .sort((a, b) => b.callCount - a.callCount)
    .slice(0, 10);

  const hourlyDistribution = hourlyCounts.map((count, hour) => ({
    hour,
    callCount: count,
  }));

  const dailyTrend = await getDailyTrend();

  return {
    topCallers,
    hourlyDistribution,
    dailyTrend,
  };
}
