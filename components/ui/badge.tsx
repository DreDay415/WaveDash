import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-white shadow hover:bg-primary-hover",
        secondary:
          "border-transparent bg-surface-elevated text-text-secondary hover:bg-surface-elevated/80",
        destructive:
          "border-transparent bg-error text-white shadow hover:bg-error/80",
        outline: "text-text-primary border-border",
        success:
          "border-transparent bg-success-light text-success shadow",
        warning:
          "border-transparent bg-warning-light text-warning shadow",
        error:
          "border-transparent bg-error-light text-error shadow",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
