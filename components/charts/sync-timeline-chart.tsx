'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { SyncActivity } from "@/types/metrics";
import { CHART_COLORS } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface SyncTimelineChartProps {
  data: SyncActivity[];
  className?: string;
}

export function SyncTimelineChart({ data, className }: SyncTimelineChartProps) {
  const chartData = data.map((activity) => ({
    time: new Date(activity.timestamp).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    }),
    files: activity.filesCount,
    dataMB: activity.dataTransferred,
    duration: activity.duration,
  }));

  return (
    <Card
      className={cn(
        "group relative overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-primary/20 hover:border-primary/40",
        className
      )}
    >
      <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 skew-y-6 bg-gradient-to-br from-primary/30 via-primary/10 to-transparent opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100" />
      <CardHeader>
        <CardTitle className="text-lg">Sync Activity (Last 24 Hours)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
            <XAxis
              dataKey="time"
              stroke="rgba(148, 163, 184, 0.5)"
              fontSize={12}
              tickLine={false}
            />
            <YAxis
              stroke="rgba(148, 163, 184, 0.5)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#13131a',
                border: '1px solid rgba(148, 163, 184, 0.2)',
                borderRadius: '8px',
                color: '#f8fafc',
              }}
              labelStyle={{ color: '#94a3b8' }}
            />
            <Line
              type="monotone"
              dataKey="files"
              stroke={CHART_COLORS.primary}
              strokeWidth={2}
              dot={{ fill: CHART_COLORS.primary, r: 4 }}
              activeDot={{ r: 6 }}
              animationDuration={1000}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
