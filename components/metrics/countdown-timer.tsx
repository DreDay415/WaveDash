'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { getCountdown } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface CountdownTimerProps {
  targetTimestamp: string;
  label?: string;
  className?: string;
}

export function CountdownTimer({
  targetTimestamp,
  label = "Next Sync In",
  className,
}: CountdownTimerProps) {
  const [countdown, setCountdown] = useState(getCountdown(targetTimestamp));

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(getCountdown(targetTimestamp));
    }, 1000);

    return () => clearInterval(interval);
  }, [targetTimestamp]);

  return (
    <Card className={cn("bg-primary-light border-primary/20", className)}>
      <CardContent className="pt-6">
        <div className="flex items-center gap-4">
          <div className="rounded-full bg-primary/20 p-3">
            <Clock className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-text-secondary mb-1">{label}</p>
            <p className="text-2xl font-bold text-primary font-mono">
              {countdown}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
