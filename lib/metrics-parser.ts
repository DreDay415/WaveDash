import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import { SyncMetrics, SyncActivity } from '@/types/metrics';

const execAsync = promisify(exec);

const LOG_PATH = process.env.FIVE9_LOG_PATH || '/srv/five9/logs/ingest.log';
const INCOMING_PATH = process.env.FIVE9_INCOMING_PATH || '/srv/five9/incoming';

type LogRun = {
  timestamp: string;
  status: 'success' | 'failed' | 'running';
  filesCount: number;
  dataTransferredMB: number;
  duration: number;
  endTimestamp?: string;
};

const emptyActivity: SyncActivity = {
  timestamp: new Date().toISOString(),
  status: 'failed',
  filesCount: 0,
  dataTransferred: 0,
  duration: 0,
};

function parseLogTimestamp(line: string): string | null {
  const match = line.match(/^(.*?): (Starting ingest|Ingest complete)/);
  if (!match) return null;
  const parsed = new Date(match[1].trim());
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toISOString();
}

async function readLogFile(): Promise<string> {
  try {
    return await fs.readFile(LOG_PATH, 'utf-8');
  } catch {
    return '';
  }
}

async function getFilesTransferredCount(): Promise<number> {
  try {
    const { stdout } = await execAsync(
      `find "${INCOMING_PATH}" -type f 2>/dev/null | wc -l`
    );
    return Number.parseInt(stdout.trim(), 10) || 0;
  } catch {
    return 0;
  }
}

async function parseIngestLog(): Promise<{
  lastRun: SyncMetrics['lastRun'];
  recentActivity: SyncActivity[];
  performance: SyncMetrics['performance'];
}> {
  const logContent = await readLogFile();
  if (!logContent.trim()) {
    const filesTransferred = await getFilesTransferredCount();
    return {
      lastRun: {
        timestamp: new Date().toISOString(),
        status: 'idle',
        duration: 0,
        filesTransferred,
        bytesTransferred: 0,
      },
      recentActivity: [],
      performance: {
        averageSyncTime: 0,
        averageTransferRate: 0,
        successRate: 0,
        totalRuns: 0,
        successfulRuns: 0,
        failedRuns: 0,
      },
    };
  }

  const lines = logContent.trim().split('\n');
  const runs: LogRun[] = [];
  let currentRun: LogRun | null = null;

  for (const line of lines) {
    if (line.includes('Starting ingest')) {
      const timestamp = parseLogTimestamp(line) || new Date().toISOString();
      currentRun = {
        timestamp,
        status: 'running',
        filesCount: 0,
        dataTransferredMB: 0,
        duration: 0,
      };
      continue;
    }

    if (currentRun && line.includes('sent') && line.includes('bytes')) {
      const match = line.match(/sent ([\d,]+) bytes/i);
      if (match) {
        const bytes = Number.parseInt(match[1].replace(/,/g, ''), 10) || 0;
        currentRun.dataTransferredMB = bytes / (1024 * 1024);
      }
      continue;
    }

    if (currentRun && line.includes('Ingest complete')) {
      const endTimestamp = parseLogTimestamp(line) || new Date().toISOString();
      const startTime = new Date(currentRun.timestamp).getTime();
      const endTime = new Date(endTimestamp).getTime();
      const duration = Math.max(0, (endTime - startTime) / 1000);

      runs.push({
        ...currentRun,
        status: 'success',
        endTimestamp,
        duration,
      });
      currentRun = null;
    }
  }

  const filesTransferred = await getFilesTransferredCount();
  const lastRun = runs[runs.length - 1] || {
    timestamp: new Date().toISOString(),
    status: 'idle' as const,
    filesCount: filesTransferred,
    dataTransferredMB: 0,
    duration: 0,
  };

  const successfulRuns = runs.filter((run) => run.status === 'success');
  const totalRuns = runs.length;
  const averageSyncTime =
    successfulRuns.length > 0
      ? successfulRuns.reduce((sum, run) => sum + run.duration, 0) /
        successfulRuns.length
      : 0;
  const averageTransferRate =
    successfulRuns.length > 0 && averageSyncTime > 0
      ? successfulRuns.reduce((sum, run) => sum + run.dataTransferredMB, 0) /
        averageSyncTime /
        successfulRuns.length
      : 0;

  const recentActivity = runs.slice(-24).map<SyncActivity>((run) => ({
    timestamp: run.timestamp,
    status: run.status === 'success' ? 'success' : 'failed',
    filesCount: run.filesCount,
    dataTransferred: run.dataTransferredMB,
    duration: run.duration,
  }));

  return {
    lastRun: {
      timestamp: lastRun.timestamp,
      status: lastRun.status,
      duration: lastRun.duration,
      filesTransferred,
      bytesTransferred: Math.round(lastRun.dataTransferredMB * 1024 * 1024),
    },
    recentActivity: recentActivity.length > 0 ? recentActivity : [emptyActivity],
    performance: {
      averageSyncTime,
      averageTransferRate,
      successRate: totalRuns > 0 ? (successfulRuns.length / totalRuns) * 100 : 0,
      totalRuns,
      successfulRuns: successfulRuns.length,
      failedRuns: totalRuns - successfulRuns.length,
    },
  };
}

async function getDiskUsage(): Promise<SyncMetrics['diskUsage']> {
  try {
    const { stdout } = await execAsync('df -B1 / | tail -1');
    const parts = stdout.trim().split(/\s+/);
    const total = Number.parseInt(parts[1], 10) || 0;
    const used = Number.parseInt(parts[2], 10) || 0;
    const available = Number.parseInt(parts[3], 10) || 0;
    const percentage = Number.parseInt(parts[4]?.replace('%', ''), 10) || 0;

    const projectedFull =
      percentage >= 90 ? '< 30 days' : percentage >= 80 ? '30-60 days' : '60+ days';

    return {
      total,
      used,
      available,
      percentage,
      projectedFull,
    };
  } catch {
    return {
      total: 0,
      used: 0,
      available: 0,
      percentage: 0,
      projectedFull: 'Unknown',
    };
  }
}

async function getNextScheduledRun(): Promise<SyncMetrics['nextScheduledRun']> {
  try {
    const { stdout } = await execAsync(
      'systemctl list-timers five9-ingest.timer --no-legend --all'
    );
    const line = stdout.trim().split('\n')[0];
    const match = line.match(
      /^(\w{3} \d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2} \w{3,4})/
    );

    if (match) {
      const nextRunDate = new Date(match[1]);
      const countdownMs = nextRunDate.getTime() - Date.now();
      const countdownMinutes = Math.max(0, Math.floor(countdownMs / 60000));
      const hours = Math.floor(countdownMinutes / 60);
      const minutes = countdownMinutes % 60;
      const countdown = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;

      return {
        timestamp: nextRunDate.toISOString(),
        countdown,
      };
    }
  } catch {
    // ignore
  }

  return {
    timestamp: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    countdown: '1h',
  };
}

async function getServiceStatus(): Promise<'running' | 'idle'> {
  try {
    const { stdout } = await execAsync('systemctl is-active five9-ingest.service');
    return stdout.trim() === 'active' ? 'running' : 'idle';
  } catch {
    return 'idle';
  }
}

async function getUptimeDays(): Promise<number> {
  try {
    const { stdout } = await execAsync('uptime -s');
    const bootTime = new Date(stdout.trim()).getTime();
    const uptimeMs = Date.now() - bootTime;
    return Math.max(0, Math.floor(uptimeMs / (1000 * 60 * 60 * 24)));
  } catch {
    return 0;
  }
}

function calculateHealthScore(metrics: {
  diskUsage: SyncMetrics['diskUsage'];
  performance: SyncMetrics['performance'];
  lastRun: SyncMetrics['lastRun'];
}): number {
  let score = 100;

  if (metrics.diskUsage.percentage > 90) score -= 30;
  else if (metrics.diskUsage.percentage > 80) score -= 20;
  else if (metrics.diskUsage.percentage > 70) score -= 10;

  const failureRate = 100 - metrics.performance.successRate;
  score -= failureRate * 0.5;

  if (metrics.lastRun.status === 'failed') score -= 20;

  return Math.max(0, Math.min(100, Math.round(score)));
}

export async function collectMetrics(): Promise<SyncMetrics> {
  const [logData, diskUsage, nextScheduledRun, serviceStatus, uptime] =
    await Promise.all([
      parseIngestLog(),
      getDiskUsage(),
      getNextScheduledRun(),
      getServiceStatus(),
      getUptimeDays(),
    ]);

  const lastRunStatus =
    serviceStatus === 'running' ? 'running' : logData.lastRun.status;

  const baseMetrics: SyncMetrics = {
    lastRun: {
      ...logData.lastRun,
      status: lastRunStatus,
    },
    nextScheduledRun,
    systemHealth: {
      score: 0,
      status: 'healthy',
      uptime,
    },
    diskUsage,
    performance: logData.performance,
    recentActivity: logData.recentActivity,
  };

  const healthScore = calculateHealthScore(baseMetrics);
  baseMetrics.systemHealth.score = healthScore;
  baseMetrics.systemHealth.status =
    healthScore >= 80 ? 'healthy' : healthScore >= 60 ? 'warning' : 'critical';

  return baseMetrics;
}
