'use client';

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PulseIndicatorProps {
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: 'w-2 h-2',
  md: 'w-3 h-3',
  lg: 'w-4 h-4',
};

export function PulseIndicator({
  color = 'bg-success',
  size = 'md',
  className,
}: PulseIndicatorProps) {
  return (
    <motion.div
      className={cn("rounded-full", color, sizeMap[size], className)}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [1, 0.8, 1],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}
