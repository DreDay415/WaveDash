export interface SyncMetrics {
  lastRun: {
    timestamp: string;
    status: 'success' | 'running' | 'failed' | 'idle';
    duration: number;
    filesTransferred: number;
    bytesTransferred: number;
    errorMessage?: string;
  };
  
  nextScheduledRun: {
    timestamp: string;
    countdown: string;
  };
  
  systemHealth: {
    score: number;
    status: 'healthy' | 'warning' | 'critical';
    uptime: number;
  };
  
  diskUsage: {
    total: number;
    used: number;
    available: number;
    percentage: number;
    projectedFull: string;
  };
  
  performance: {
    averageSyncTime: number;
    averageTransferRate: number;
    successRate: number;
    totalRuns: number;
    successfulRuns: number;
    failedRuns: number;
  };
  
  recentActivity: SyncActivity[];
}

export interface SyncActivity {
  timestamp: string;
  status: 'success' | 'failed';
  filesCount: number;
  dataTransferred: number;
  duration: number;
}

export interface CallVolumeMetrics {
  topCallers: Array<{
    email: string;
    callCount: number;
    percentage: number;
  }>;
  
  hourlyDistribution: Array<{
    hour: number;
    callCount: number;
  }>;
  
  dailyTrend: Array<{
    date: string;
    callCount: number;
    dataVolume: number;
  }>;
}
