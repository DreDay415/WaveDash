import { AlertCircle, AlertTriangle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface AlertBannerProps {
  variant?: 'info' | 'warning' | 'error';
  title: string;
  message?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
}

const variantStyles = {
  info: {
    container: "bg-primary-light border-primary/20",
    icon: "text-primary",
    Icon: Info,
  },
  warning: {
    container: "bg-warning-light border-warning/20",
    icon: "text-warning",
    Icon: AlertTriangle,
  },
  error: {
    container: "bg-error-light border-error/20",
    icon: "text-error",
    Icon: AlertCircle,
  },
};

export function AlertBanner({
  variant = 'info',
  title,
  message,
  dismissible = false,
  onDismiss,
  className,
}: AlertBannerProps) {
  const style = variantStyles[variant];
  const Icon = style.Icon;

  return (
    <div
      className={cn(
        "rounded-lg border p-4",
        style.container,
        className
      )}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <Icon className={cn("w-5 h-5 flex-shrink-0 mt-0.5", style.icon)} />
        <div className="flex-1 min-w-0">
          <h4 className={cn("text-sm font-semibold mb-1", style.icon)}>
            {title}
          </h4>
          {message && (
            <p className="text-sm text-text-secondary">
              {message}
            </p>
          )}
        </div>
        {dismissible && onDismiss && (
          <Button
            variant="ghost"
            size="icon"
            className="flex-shrink-0 h-6 w-6"
            onClick={onDismiss}
            aria-label="Dismiss alert"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
