'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface SystemHealthGaugeProps {
  score: number;
  status: 'healthy' | 'warning' | 'critical';
  uptime: number;
  className?: string;
}

const statusConfig = {
  healthy: {
    color: 'text-success',
    bgColor: 'stroke-success',
    label: 'Healthy',
  },
  warning: {
    color: 'text-warning',
    bgColor: 'stroke-warning',
    label: 'Warning',
  },
  critical: {
    color: 'text-error',
    bgColor: 'stroke-error',
    label: 'Critical',
  },
};

export function SystemHealthGauge({
  score,
  status,
  uptime,
  className,
}: SystemHealthGaugeProps) {
  const config = statusConfig[status];
  const circumference = 2 * Math.PI * 70;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <CardTitle className="text-lg">System Health</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        {/* Circular gauge */}
        <div className="relative w-48 h-48">
          <svg className="w-full h-full transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="96"
              cy="96"
              r="70"
              stroke="currentColor"
              strokeWidth="12"
              fill="none"
              className="text-surface-elevated"
            />
            {/* Progress circle */}
            <motion.circle
              cx="96"
              cy="96"
              r="70"
              stroke="currentColor"
              strokeWidth="12"
              fill="none"
              strokeLinecap="round"
              className={config.bgColor}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              style={{
                strokeDasharray: circumference,
              }}
            />
          </svg>
          
          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={cn("text-4xl font-bold font-mono", config.color)}>
              {Math.round(score)}
            </span>
            <span className="text-sm text-text-secondary mt-1">
              {config.label}
            </span>
          </div>
        </div>

        {/* Uptime info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-text-secondary">
            Uptime
          </p>
          <p className="text-2xl font-bold text-text-primary font-mono mt-1">
            {uptime} days
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
