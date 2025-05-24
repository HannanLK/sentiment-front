import React from 'react';

export default function AnimatedLoader() {
  return (
    <div className="flex flex-col items-center justify-center h-[400px] w-full rounded-xl bg-accent/40 dark:bg-accent/20 relative overflow-hidden">
      {/* Skeleton shimmer */}
      <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 opacity-60 z-0" />
      <div className="relative z-10 flex flex-col items-center w-full">
        <div className="text-2xl font-semibold mb-4 mt-12 text-gray-700 dark:text-gray-200">Analyzing<span className="dot-animate">...</span></div>
        {/* Animated progress bar */}
        <div className="w-2/3 h-4 bg-gray-300 rounded-full overflow-hidden mt-8">
          <div className="h-full bg-blue-400 animate-progressBar" style={{ width: '40%' }} />
        </div>
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
        @keyframes progressBar {
          0% { width: 0%; }
          50% { width: 80%; }
          100% { width: 40%; }
        }
        .animate-progressBar {
          animation: progressBar 1.5s infinite cubic-bezier(0.4,0,0.2,1);
        }
      `}</style>
    </div>
  );
} 