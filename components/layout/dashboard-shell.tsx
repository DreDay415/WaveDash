'use client';

import { ReactNode } from 'react';
import { Header } from './header';
import { cn } from '@/lib/utils';

interface DashboardShellProps {
  children: ReactNode;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  className?: string;
}

export function DashboardShell({
  children,
  onRefresh,
  isRefreshing,
  className,
}: DashboardShellProps) {
  return (
    <div className={cn("min-h-screen bg-background", className)}>
      <Header onRefresh={onRefresh} isRefreshing={isRefreshing} />
      
      <main className="max-w-[1400px] mx-auto px-6 py-8">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="border-t border-border mt-16">
        <div className="max-w-[1400px] mx-auto px-6 py-6">
          <p className="text-sm text-text-muted text-center">
            Five9 Sync Monitoring Dashboard · Built with Next.js & TypeScript
          </p>
        </div>
      </footer>
    </div>
  );
}
