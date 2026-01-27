'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { CHART_COLORS } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface DailyTrendChartProps {
  dailyTrend: Array<{
    date: string;
    callCount: number;
    dataVolume: number;
  }>;
  className?: string;
}

export function DailyTrendChart({ dailyTrend, className }: DailyTrendChartProps) {
  const chartData = dailyTrend.map((day) => ({
    date: new Date(day.date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
    calls: day.callCount,
    dataMB: day.dataVolume,
  }));

  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <CardTitle className="text-lg">Daily Trend (7 Days)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
            <XAxis
              dataKey="date"
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
            <Bar
              dataKey="calls"
              fill={CHART_COLORS.primary}
              radius={[8, 8, 0, 0]}
              animationDuration={1000}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
