'use client';

import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CountUp } from "@/components/shared/count-up";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";

interface KPICardProps {
  label: string;
  value: string | number;
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
  icon: LucideIcon;
  iconColor: string;
  sparklineData?: number[];
  className?: string;
}

export function KPICard({
  label,
  value,
  trend,
  icon: Icon,
  iconColor,
  sparklineData,
  className,
}: KPICardProps) {
  const isNumeric = typeof value === 'number';
  
  return (
    <Card className={cn("relative overflow-hidden group", className)}>
      {/* Background icon */}
      <div className="absolute top-4 right-4 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
        <Icon className="w-24 h-24" style={{ color: iconColor }} />
      </div>
      
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-text-secondary">
          {label}
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="flex items-baseline justify-between">
          <p className="text-3xl font-bold text-text-primary font-mono">
            {isNumeric ? (
              <CountUp end={value} />
            ) : (
              value
            )}
          </p>
          
          {trend && (
            <Badge variant={trend.direction === 'up' ? 'success' : 'error'}>
              {trend.direction === 'up' ? '↑' : '↓'} {trend.value}%
            </Badge>
          )}
        </div>
        
        {sparklineData && sparklineData.length > 0 && (
          <div className="mt-4 h-12 -mb-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sparklineData.map((v) => ({ value: v }))}>
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={iconColor}
                  strokeWidth={2}
                  dot={false}
                  animationDuration={1000}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
