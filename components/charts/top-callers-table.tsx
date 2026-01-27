'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TopCallersTableProps {
  topCallers: Array<{
    email: string;
    callCount: number;
    percentage: number;
  }>;
  className?: string;
}

export function TopCallersTable({ topCallers, className }: TopCallersTableProps) {
  const getInitials = (email: string) => {
    const name = email.split('@')[0];
    const parts = name.split('.');
    return parts.map(p => p[0].toUpperCase()).join('');
  };

  const getAvatarColor = (index: number) => {
    const colors = [
      'bg-primary',
      'bg-success',
      'bg-warning',
      'bg-error',
      'bg-text-muted',
    ];
    return colors[index % colors.length];
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
        <CardTitle className="text-lg">Top Callers</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topCallers.map((caller, index) => (
            <div
              key={caller.email}
              className="flex items-center gap-4 p-3 rounded-lg hover:bg-surface-elevated transition-colors"
            >
              {/* Rank badge */}
              <div className="flex-shrink-0 w-8 text-center">
                {index < 3 ? (
                  <span className="text-2xl">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                  </span>
                ) : (
                  <span className="text-text-muted font-semibold">
                    #{index + 1}
                  </span>
                )}
              </div>

              {/* Avatar */}
              <div className={cn(
                "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm",
                getAvatarColor(index)
              )}>
                {getInitials(caller.email)}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary truncate">
                  {caller.email}
                </p>
                <p className="text-xs text-text-secondary">
                  {caller.percentage}% of total calls
                </p>
              </div>

              {/* Count */}
              <Badge variant="secondary" className="flex-shrink-0">
                {caller.callCount.toLocaleString()}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
