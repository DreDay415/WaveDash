'use client';

import { Badge } from "@/components/ui/badge";
import { PulseIndicator } from "@/components/shared/pulse-indicator";
import { CheckCircle2, XCircle, Clock, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SyncStatusIndicatorProps {
  status: 'success' | 'running' | 'failed' | 'idle';
  className?: string;
}

const statusConfig = {
  success: {
    label: 'Sync Complete',
    variant: 'success' as const,
    icon: CheckCircle2,
    showPulse: false,
    pulseColor: 'bg-success',
    animate: false,
  },
  running: {
    label: 'Syncing...',
    variant: 'default' as const,
    icon: Loader2,
    showPulse: true,
    pulseColor: 'bg-primary',
    animate: true,
  },
  failed: {
    label: 'Sync Failed',
    variant: 'error' as const,
    icon: XCircle,
    showPulse: false,
    pulseColor: 'bg-error',
    animate: false,
  },
  idle: {
    label: 'Idle',
    variant: 'secondary' as const,
    icon: Clock,
    showPulse: false,
    pulseColor: 'bg-text-muted',
    animate: false,
  },
};

export function SyncStatusIndicator({ status, className }: SyncStatusIndicatorProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {config.showPulse && (
        <PulseIndicator color={config.pulseColor} size="lg" />
      )}
      
      <Badge variant={config.variant} className="text-sm px-3 py-1.5 gap-2">
        <Icon
          className={cn(
            "w-4 h-4",
            config.animate && "animate-spin"
          )}
        />
        {config.label}
      </Badge>
    </div>
  );
}
