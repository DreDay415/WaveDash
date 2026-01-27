import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function MetricsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <Card key={i} className="animate-pulse">
          <CardHeader className="pb-2">
            <div className="h-4 bg-surface-elevated rounded w-1/2 shimmer" />
          </CardHeader>
          <CardContent>
            <div className="h-8 bg-surface-elevated rounded w-3/4 shimmer" />
            <div className="h-4 bg-surface-elevated rounded w-1/4 mt-4 shimmer" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <Card className="animate-pulse">
      <CardHeader>
        <div className="h-6 bg-surface-elevated rounded w-1/3 shimmer" />
      </CardHeader>
      <CardContent>
        <div className="h-64 bg-surface-elevated rounded shimmer" />
      </CardContent>
    </Card>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <Card className="animate-pulse">
      <CardHeader>
        <div className="h-6 bg-surface-elevated rounded w-1/4 shimmer" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {[...Array(rows)].map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="h-10 w-10 bg-surface-elevated rounded-full shimmer" />
              <div className="flex-1">
                <div className="h-4 bg-surface-elevated rounded w-3/4 shimmer" />
                <div className="h-3 bg-surface-elevated rounded w-1/2 mt-2 shimmer" />
              </div>
              <div className="h-4 bg-surface-elevated rounded w-16 shimmer" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-surface-elevated shimmer", className)}
      {...props}
    />
  );
}
