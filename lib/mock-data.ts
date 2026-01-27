import { SyncMetrics, SyncActivity, CallVolumeMetrics } from '@/types/metrics';

function generateRecentActivity(): SyncActivity[] {
  const activities: SyncActivity[] = [];
  const now = Date.now();
  
  // Generate 24 hours of activity (hourly syncs)
  for (let i = 0; i < 24; i++) {
    const timestamp = new Date(now - i * 60 * 60 * 1000);
    const status = Math.random() > 0.05 ? 'success' : 'failed'; // 95% success rate
    
    activities.push({
      timestamp: timestamp.toISOString(),
      status,
      filesCount: Math.floor(Math.random() * 200) + 50,
      dataTransferred: Math.floor(Math.random() * 300) + 100, // MB
      duration: Math.random() * 2 + 0.5, // 0.5-2.5 seconds
    });
  }
  
  return activities.reverse();
}

export function generateMockMetrics(): SyncMetrics {
  const now = Date.now();
  
  return {
    lastRun: {
      timestamp: new Date(now - 1000 * 60 * 47).toISOString(), // 47 minutes ago
      status: 'success',
      duration: 1.2,
      filesTransferred: 156,
      bytesTransferred: 234 * 1024 * 1024, // 234 MB
    },
    nextScheduledRun: {
      timestamp: new Date(now + 1000 * 60 * 13).toISOString(), // in 13 minutes
      countdown: '13m',
    },
    systemHealth: {
      score: 98,
      status: 'healthy',
      uptime: 30,
    },
    diskUsage: {
      total: 24 * 1024 * 1024 * 1024, // 24 GB
      used: 18 * 1024 * 1024 * 1024,  // 18 GB
      available: 6 * 1024 * 1024 * 1024, // 6 GB
      percentage: 75,
      projectedFull: '14 days',
    },
    performance: {
      averageSyncTime: 1.4,
      averageTransferRate: 195, // MB/s
      successRate: 100,
      totalRuns: 248,
      successfulRuns: 248,
      failedRuns: 0,
    },
    recentActivity: generateRecentActivity(),
  };
}

export function generateMockCallVolume(): CallVolumeMetrics {
  const topCallers = [
    { email: 'john.smith@company.com', callCount: 1245, percentage: 18.5 },
    { email: 'sarah.johnson@company.com', callCount: 987, percentage: 14.7 },
    { email: 'mike.wilson@company.com', callCount: 823, percentage: 12.2 },
    { email: 'emily.brown@company.com', callCount: 756, percentage: 11.2 },
    { email: 'david.lee@company.com', callCount: 634, percentage: 9.4 },
  ];
  
  const hourlyDistribution = Array.from({ length: 24 }, (_, hour) => {
    // Simulate business hours peak (9am-5pm)
    const isPeakHours = hour >= 9 && hour <= 17;
    const baseCount = isPeakHours ? 80 : 20;
    const variance = Math.random() * 30;
    
    return {
      hour,
      callCount: Math.floor(baseCount + variance),
    };
  });
  
  const dailyTrend = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    
    return {
      date: date.toISOString().split('T')[0],
      callCount: Math.floor(Math.random() * 500) + 800,
      dataVolume: Math.floor(Math.random() * 200) + 150, // MB
    };
  });
  
  return {
    topCallers,
    hourlyDistribution,
    dailyTrend,
  };
}

export function simulateMetricsUpdate(previous: SyncMetrics): SyncMetrics {
  // Simulate small changes for real-time updates
  const updated = { ...previous };
  
  // Update countdown
  const nextRun = new Date(updated.nextScheduledRun.timestamp);
  const now = new Date();
  const diffMs = nextRun.getTime() - now.getTime();
  const diffMin = Math.floor(diffMs / 1000 / 60);
  
  if (diffMin <= 0) {
    // Start new sync
    updated.lastRun.status = 'running';
  } else {
    updated.nextScheduledRun.countdown = diffMin < 60 
      ? `${diffMin}m` 
      : `${Math.floor(diffMin / 60)}h ${diffMin % 60}m`;
  }
  
  // Randomly adjust health score slightly
  const scoreChange = (Math.random() - 0.5) * 2;
  updated.systemHealth.score = Math.min(100, Math.max(0, updated.systemHealth.score + scoreChange));
  
  return updated;
}
