'use client';

import { DashboardShell } from '@/components/layout/dashboard-shell';
import { KPICard } from '@/components/metrics/kpi-card';
import { SystemHealthGauge } from '@/components/metrics/system-health-gauge';
import { DiskUsageCard } from '@/components/metrics/disk-usage-card';
import { SyncStatusIndicator } from '@/components/metrics/sync-status-indicator';
import { CountdownTimer } from '@/components/metrics/countdown-timer';
import { SyncTimelineChart } from '@/components/charts/sync-timeline-chart';
import { SuccessRateGauge } from '@/components/charts/success-rate-gauge';
import { CallVolumeHeatmap } from '@/components/charts/call-volume-heatmap';
import { DailyTrendChart } from '@/components/charts/daily-trend-chart';
import { TopCallersTable } from '@/components/charts/top-callers-table';
import { MetricsSkeleton, ChartSkeleton, TableSkeleton } from '@/components/shared/loading-skeleton';
import { AlertBanner } from '@/components/shared/alert-banner';
import { useMetrics, useCallVolume } from '@/hooks/use-metrics';
import { QueryProvider } from '@/lib/query-provider';
import { TooltipProvider } from '@/components/ui/tooltip';
import { FileText, Database, CheckCircle, Zap } from 'lucide-react';
import { formatBytes, formatDuration } from '@/lib/utils';
import { DISK_WARNING_THRESHOLD } from '@/lib/constants';

function DashboardContent() {
  const { data: metrics, isLoading: isLoadingMetrics, refetch: refetchMetrics } = useMetrics();
  const { data: callVolume, isLoading: isLoadingCallVolume, refetch: refetchCallVolume } = useCallVolume();

  const handleRefresh = () => {
    refetchMetrics();
    refetchCallVolume();
  };

  const showDiskWarning = metrics && metrics.diskUsage.percentage >= DISK_WARNING_THRESHOLD;

  return (
    <DashboardShell onRefresh={handleRefresh}>
      {/* Critical Alert Banner */}
      {showDiskWarning && (
        <AlertBanner
          variant={metrics.diskUsage.percentage >= 90 ? 'error' : 'warning'}
          title="Disk Space Alert"
          message={`Storage is at ${metrics.diskUsage.percentage.toFixed(1)}%. Projected full in ${metrics.diskUsage.projectedFull}.`}
          className="mb-6"
        />
      )}

      {/* Hero Section - Status Overview */}
      <section className="mb-8" aria-labelledby="status-heading">
        <h2 id="status-heading" className="sr-only">System Status</h2>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-xl bg-surface/80 backdrop-blur-md border border-border">
          <div className="flex items-center gap-4">
            {metrics ? (
              <>
                <SyncStatusIndicator status={metrics.lastRun.status} />
                <div className="border-l border-border pl-4">
                  <p className="text-sm text-text-secondary">Last Sync</p>
                  <p className="text-lg font-semibold text-text-primary font-mono">
                    {new Date(metrics.lastRun.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </>
            ) : (
              <div className="flex gap-4">
                <div className="w-32 h-8 bg-surface-elevated rounded shimmer" />
                <div className="w-24 h-8 bg-surface-elevated rounded shimmer" />
              </div>
            )}
          </div>
          
          {metrics && (
            <CountdownTimer targetTimestamp={metrics.nextScheduledRun.timestamp} />
          )}
        </div>
      </section>

      {/* KPI Grid */}
      <section className="mb-8" aria-labelledby="kpi-heading">
        <h2 id="kpi-heading" className="text-2xl font-bold mb-6 text-text-primary">
          Key Metrics
        </h2>
        {isLoadingMetrics ? (
          <MetricsSkeleton />
        ) : metrics ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <KPICard
              label="Files Transferred"
              value={metrics.lastRun.filesTransferred}
              icon={FileText}
              iconColor="#8b5cf6"
              trend={{ value: 12, direction: 'up' }}
              sparklineData={metrics.recentActivity.slice(-10).map(a => a.filesCount)}
            />
            <KPICard
              label="Data Volume"
              value={formatBytes(metrics.lastRun.bytesTransferred)}
              icon={Database}
              iconColor="#10b981"
              sparklineData={metrics.recentActivity.slice(-10).map(a => a.dataTransferred)}
            />
            <KPICard
              label="Success Rate"
              value={`${metrics.performance.successRate.toFixed(1)}%`}
              icon={CheckCircle}
              iconColor="#10b981"
              trend={{ value: 0, direction: 'up' }}
            />
            <KPICard
              label="Average Speed"
              value={formatDuration(metrics.performance.averageSyncTime)}
              icon={Zap}
              iconColor="#f59e0b"
              sparklineData={metrics.recentActivity.slice(-10).map(a => a.duration)}
            />
          </div>
        ) : null}
      </section>

      {/* System Health & Disk Usage */}
      <section className="mb-8" aria-labelledby="health-heading">
        <h2 id="health-heading" className="text-2xl font-bold mb-6 text-text-primary">
          System Health
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {isLoadingMetrics ? (
            <>
              <ChartSkeleton />
              <ChartSkeleton />
            </>
          ) : metrics ? (
            <>
              <SystemHealthGauge
                score={metrics.systemHealth.score}
                status={metrics.systemHealth.status}
                uptime={metrics.systemHealth.uptime}
              />
              <DiskUsageCard
                total={metrics.diskUsage.total}
                used={metrics.diskUsage.used}
                available={metrics.diskUsage.available}
                percentage={metrics.diskUsage.percentage}
                projectedFull={metrics.diskUsage.projectedFull}
              />
            </>
          ) : null}
        </div>
      </section>

      {/* Charts Row 1 */}
      <section className="mb-8" aria-labelledby="activity-heading">
        <h2 id="activity-heading" className="text-2xl font-bold mb-6 text-text-primary">
          Sync Activity
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {isLoadingMetrics ? (
            <>
              <ChartSkeleton />
              <ChartSkeleton />
            </>
          ) : metrics ? (
            <>
              <SyncTimelineChart data={metrics.recentActivity} />
              <SuccessRateGauge
                successRate={metrics.performance.successRate}
                totalRuns={metrics.performance.totalRuns}
                successfulRuns={metrics.performance.successfulRuns}
                failedRuns={metrics.performance.failedRuns}
              />
            </>
          ) : null}
        </div>
      </section>

      {/* Charts Row 2 - Call Volume */}
      <section className="mb-8" aria-labelledby="volume-heading">
        <h2 id="volume-heading" className="text-2xl font-bold mb-6 text-text-primary">
          Call Volume Analytics
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {isLoadingCallVolume ? (
            <>
              <TableSkeleton />
              <ChartSkeleton />
            </>
          ) : callVolume ? (
            <>
              <TopCallersTable topCallers={callVolume.topCallers} />
              <CallVolumeHeatmap hourlyDistribution={callVolume.hourlyDistribution} />
            </>
          ) : null}
        </div>
      </section>

      {/* Daily Trend */}
      <section className="mb-8" aria-labelledby="trend-heading">
        <h2 id="trend-heading" className="text-2xl font-bold mb-6 text-text-primary">
          Historical Trends
        </h2>
        {isLoadingCallVolume ? (
          <ChartSkeleton />
        ) : callVolume ? (
          <DailyTrendChart dailyTrend={callVolume.dailyTrend} />
        ) : null}
      </section>
    </DashboardShell>
  );
}

export default function Home() {
  return (
    <QueryProvider>
      <TooltipProvider>
        <DashboardContent />
      </TooltipProvider>
    </QueryProvider>
  );
}
