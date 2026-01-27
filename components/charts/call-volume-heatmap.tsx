'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface CallVolumeHeatmapProps {
  hourlyDistribution: Array<{
    hour: number;
    callCount: number;
  }>;
  className?: string;
}

export function CallVolumeHeatmap({
  hourlyDistribution,
  className,
}: CallVolumeHeatmapProps) {
  const maxCalls = Math.max(...hourlyDistribution.map(h => h.callCount));
  
  const getIntensity = (count: number) => {
    const ratio = count / maxCalls;
    if (ratio > 0.75) return 'bg-primary';
    if (ratio > 0.5) return 'bg-primary/70';
    if (ratio > 0.25) return 'bg-primary/40';
    return 'bg-primary/20';
  };

  return (
    <Card
      className={cn(
        "group relative overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-primary/20 hover:border-primary/40",
        className
      )}
    >
      <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 skew-y-6 bg-gradient-to-br from-primary/30 via-primary/10 to-transparent opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100" />
      <CardHeader>
        <CardTitle className="text-lg">Call Volume Heatmap (24H)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-12 gap-2">
          {hourlyDistribution.map((item) => {
            const hour = item.hour;
            const label = hour === 0 ? '12am' : hour === 12 ? '12pm' : hour < 12 ? `${hour}a` : `${hour-12}p`;
            
            return (
              <div key={hour} className="flex flex-col items-center gap-1">
                <div
                  className={cn(
                    "w-full aspect-square rounded transition-all hover:scale-110",
                    getIntensity(item.callCount)
                  )}
                  title={`${label}: ${item.callCount} calls`}
                />
                <span className="text-xs text-text-muted">
                  {label}
                </span>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-center gap-4 mt-6 pt-4 border-t border-border">
          <span className="text-xs text-text-secondary">Less</span>
          <div className="flex gap-1">
            <div className="w-4 h-4 rounded bg-primary/20" />
            <div className="w-4 h-4 rounded bg-primary/40" />
            <div className="w-4 h-4 rounded bg-primary/70" />
            <div className="w-4 h-4 rounded bg-primary" />
          </div>
          <span className="text-xs text-text-secondary">More</span>
        </div>
      </CardContent>
    </Card>
  );
}
