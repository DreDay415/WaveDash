'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, HardDrive } from "lucide-react";
import { formatBytes } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { DISK_WARNING_THRESHOLD, DISK_CRITICAL_THRESHOLD } from "@/lib/constants";

interface DiskUsageCardProps {
  total: number;
  used: number;
  available: number;
  percentage: number;
  projectedFull: string;
  className?: string;
}

export function DiskUsageCard({
  total,
  used,
  available,
  percentage,
  projectedFull,
  className,
}: DiskUsageCardProps) {
  const isCritical = percentage >= DISK_CRITICAL_THRESHOLD;
  const isWarning = percentage >= DISK_WARNING_THRESHOLD && !isCritical;
  
  const indicatorColor = isCritical
    ? 'bg-error'
    : isWarning
    ? 'bg-warning'
    : 'bg-success';

  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <HardDrive className="w-5 h-5" />
            Disk Usage
          </CardTitle>
          {(isCritical || isWarning) && (
            <AlertCircle className={cn(
              "w-5 h-5",
              isCritical ? "text-error" : "text-warning"
            )} />
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-secondary">Storage</span>
            <span className="font-mono font-semibold text-text-primary">
              {percentage.toFixed(1)}%
            </span>
          </div>
          <Progress
            value={percentage}
            indicatorClassName={indicatorColor}
            className="h-3"
          />
        </div>

        {/* Storage details */}
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div>
            <p className="text-xs text-text-secondary mb-1">Used</p>
            <p className="text-lg font-semibold font-mono text-text-primary">
              {formatBytes(used)}
            </p>
          </div>
          <div>
            <p className="text-xs text-text-secondary mb-1">Available</p>
            <p className="text-lg font-semibold font-mono text-text-primary">
              {formatBytes(available)}
            </p>
          </div>
        </div>

        {/* Projection */}
        <div className="pt-2 border-t border-border">
          <p className="text-xs text-text-secondary mb-1">Total Capacity</p>
          <p className="text-sm font-semibold text-text-primary">
            {formatBytes(total)}
          </p>
          <p className="text-xs text-text-muted mt-2">
            Projected full in <span className="font-semibold">{projectedFull}</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
