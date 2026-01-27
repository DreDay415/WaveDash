export const POLLING_INTERVAL = 30000; // 30 seconds

export const STATUS_COLORS = {
  success: '#10b981',
  running: '#8b5cf6',
  failed: '#ef4444',
  idle: '#64748b',
  healthy: '#10b981',
  warning: '#f59e0b',
  critical: '#ef4444',
} as const;

export const CHART_COLORS = {
  primary: '#8b5cf6',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  muted: '#64748b',
} as const;

export const DISK_WARNING_THRESHOLD = 80; // percentage
export const DISK_CRITICAL_THRESHOLD = 90; // percentage
