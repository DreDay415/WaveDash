# Five9 Sync System Data Model

## Primary Entities

### SyncMetrics
```typescript
interface SyncMetrics {
  lastRun: {
    timestamp: string;           // ISO 8601
    status: 'success' | 'running' | 'failed' | 'idle';
    duration: number;             // seconds
    filesTransferred: number;
    bytesTransferred: number;     // bytes
    errorMessage?: string;
  };
  
  nextScheduledRun: {
    timestamp: string;            // ISO 8601
    countdown: string;            // "1h 23m"
  };
  
  systemHealth: {
    score: number;                // 0-100
    status: 'healthy' | 'warning' | 'critical';
    uptime: number;               // days
  };
  
  diskUsage: {
    total: number;                // bytes
    used: number;                 // bytes
    available: number;            // bytes
    percentage: number;           // 0-100
    projectedFull: string;        // "14 days"
  };
  
  performance: {
    averageSyncTime: number;      // seconds
    averageTransferRate: number;  // MB/s
    successRate: number;          // 0-100
    totalRuns: number;
    successfulRuns: number;
    failedRuns: number;
  };
  
  recentActivity: SyncActivity[];
}

interface SyncActivity {
  timestamp: string;
  status: 'success' | 'failed';
  filesCount: number;
  dataTransferred: number;        // MB
  duration: number;               // seconds
}

interface CallVolumeMetrics {
  topCallers: Array<{
    email: string;
    callCount: number;
    percentage: number;
  }>;
  
  hourlyDistribution: Array<{
    hour: number;                 // 0-23
    callCount: number;
  }>;
  
  dailyTrend: Array<{
    date: string;
    callCount: number;
    dataVolume: number;           // MB
  }>;
}
```

### API Endpoints (Mock for now)
- `GET /api/metrics` → Returns SyncMetrics
- `GET /api/call-volume` → Returns CallVolumeMetrics
- `WS /api/live` → WebSocket for real-time updates
