'use client';

import { useEffect, useState } from 'react';

interface CountUpProps {
  end: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export function CountUp({
  end,
  duration = 1000,
  decimals = 0,
  prefix = '',
  suffix = '',
  className,
}: CountUpProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp: number;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // Easing function (ease out)
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      
      setCount(Math.floor(easedProgress * end));

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  }, [end, duration]);

  const formattedCount = decimals > 0 
    ? count.toFixed(decimals)
    : count.toString();

  return (
    <span className={className}>
      {prefix}{formattedCount}{suffix}
    </span>
  );
}
