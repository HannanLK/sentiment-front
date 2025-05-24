import React, { useEffect, useState } from 'react';

export default function AnimatedLoader({ ready, onDone, minWait = 5000, speed = 1 }) {
  const [progress, setProgress] = useState(0);
  const [startTime] = useState(Date.now());
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (done) return;
    if (progress < 99 && !ready) {
      // Simulate a slower, more natural progress curve
      const increment = progress < 70 ? 1 * speed : progress < 90 ? 0.5 * speed : 0.2 * speed;
      const timeout = setTimeout(() => setProgress(p => Math.min(p + increment, 99)), 50);
      return () => clearTimeout(timeout);
    } else if (ready && progress < 100) {
      // Wait for minWait
      const elapsed = Date.now() - startTime;
      const wait = Math.max(minWait - elapsed, 0);
      setTimeout(() => setProgress(100), wait);
    } else if (progress === 100 && ready && !done) {
      setDone(true);
      setTimeout(() => onDone && onDone(), 400); // small delay for smoothness
    }
  }, [progress, ready, onDone, minWait, startTime, done, speed]);

  return (
    <div className="flex flex-col items-center justify-center h-[400px] w-full rounded-xl bg-accent/40 dark:bg-accent/10 relative overflow-hidden">
      {/* Skeleton shimmer */}
      <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 opacity-60 z-0" />
      <div className="relative z-10 flex flex-col items-center w-full">
        <div className="text-2xl font-semibold mb-4 mt-12 text-gray-700 dark:text-gray-200">
          {progress < 80 ? 'Analyzing' : progress < 100 ? 'Almost done...' : 'Done!'}
          <span className="dot-animate">...</span>
        </div>
        {/* Animated progress bar */}
        <div className="w-2/3 h-4 bg-gray-300 dark:bg-gray-700 rounded-full overflow-hidden mt-8">
          <div className="h-full bg-blue-400 transition-all duration-200" style={{ width: `${progress}%` }} />
        </div>
        <div className="mt-2 text-sm text-gray-500 dark:text-gray-300">{Math.round(progress)}%</div>
      </div>
      <style>{`
        .dot-animate::after {
          content: '';
          display: inline-block;
          width: 1.5em;
          text-align: left;
          animation: dots 1.2s steps(3, end) infinite;
        }
        @keyframes dots {
          0%, 20% { content: ''; }
          40% { content: '.'; }
          60% { content: '..'; }
          80%, 100% { content: '...'; }
        }
      `}</style>
    </div>
  );
} 