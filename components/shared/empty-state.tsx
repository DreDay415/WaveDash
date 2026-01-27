import { FileQuestion } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
  className?: string;
}

export function EmptyState({
  title = "No data available",
  description = "There is no data to display at this time.",
  icon: Icon = FileQuestion,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 px-4 text-center",
        className
      )}
    >
      <div className="rounded-full bg-surface-elevated p-6 mb-4">
        <Icon className="w-12 h-12 text-text-muted" />
      </div>
      <h3 className="text-lg font-semibold text-text-primary mb-2">
        {title}
      </h3>
      <p className="text-sm text-text-secondary max-w-md">
        {description}
      </p>
    </div>
  );
}
