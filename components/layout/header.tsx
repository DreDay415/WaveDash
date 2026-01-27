'use client';

import { RefreshCw, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface HeaderProps {
  onRefresh?: () => void;
  isRefreshing?: boolean;
  className?: string;
}

export function Header({ onRefresh, isRefreshing, className }: HeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-10 backdrop-blur-md bg-background/80 border-b border-border",
        className
      )}
    >
      <div className="max-w-[1400px] mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and title */}
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <Activity className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-text-primary">
                Five9 Sync Monitor
              </h1>
              <p className="text-xs text-text-secondary">
                Real-time System Dashboard
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={onRefresh}
              disabled={isRefreshing}
              aria-label="Refresh metrics"
              className="focus-ring"
            >
              <RefreshCw
                className={cn(
                  "w-4 h-4",
                  isRefreshing && "animate-spin"
                )}
              />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
