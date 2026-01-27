'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { CHART_COLORS } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface SuccessRateGaugeProps {
  successRate: number;
  totalRuns: number;
  successfulRuns: number;
  failedRuns: number;
  className?: string;
}

export function SuccessRateGauge({
  successRate,
  totalRuns,
  successfulRuns,
  failedRuns,
  className,
}: SuccessRateGaugeProps) {
  const data = [
    { name: 'Successful', value: successfulRuns, color: CHART_COLORS.success },
    { name: 'Failed', value: failedRuns, color: CHART_COLORS.error },
  ];

  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <CardTitle className="text-lg">Success Rate</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                startAngle={180}
                endAngle={0}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          <div className="text-center -mt-8">
            <p className="text-4xl font-bold text-success font-mono">
              {successRate.toFixed(1)}%
            </p>
            <p className="text-sm text-text-secondary mt-1">
              {totalRuns} total syncs
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 mt-8 w-full">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <div className="w-3 h-3 rounded-full bg-success" />
                <p className="text-xs text-text-secondary">Successful</p>
              </div>
              <p className="text-2xl font-bold font-mono text-text-primary">
                {successfulRuns}
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <div className="w-3 h-3 rounded-full bg-error" />
                <p className="text-xs text-text-secondary">Failed</p>
              </div>
              <p className="text-2xl font-bold font-mono text-text-primary">
                {failedRuns}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
