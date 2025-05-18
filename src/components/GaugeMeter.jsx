"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Skeleton } from "./ui/skeleton"

export function GaugeMeter({
  id,
  score,
  max = 100,
  color = "hsl(var(--chart-1))",
  size = 380, // Further increased size to match chart card
  loading = false,
  confidence = null, // for optional confidence bar
}) {
  // For the arc, recharts draws from 180 to 0 (semi-circle)
  // We'll use SVG for custom drawing
  const isDark = typeof window !== 'undefined' && document.documentElement.classList.contains('dark');
  const bgColor = isDark ? '#eee' : '#eee'; // Match dark mode background of confidence bar
  const progressBg = isDark ? '#444' : '#eee';

  if (loading) {
    return (
      <Card data-chart={id} className="bg-white dark:bg-transparent">
        <CardHeader className="items-center">
          <Skeleton className="w-48 h-8" />
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center p-6">
          <Skeleton className="w-[260px] h-[130px] rounded-full" />
          <Skeleton className="w-24 h-6 mt-4" />
          <Skeleton className="w-32 h-4 mt-4" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card data-chart={id} className="bg-white dark:bg-transparent">
      <CardHeader className="items-center">
        <CardTitle className="text-xl font-semibold">Sentiment Score</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center p-6 pt-2">
        <div className="relative w-full flex flex-col items-center">
          <svg width={size} height={size/2} viewBox={`0 0 ${size} ${size/2}`} className="block">
            {/* Arc background */}
            <path d={`M 30 ${size/2-10} A ${(size/2)-30} ${(size/2)-30} 0 0 1 ${size-30} ${size/2-10}`} fill="none" stroke={bgColor} strokeWidth="22" />
            {/* Arc value */}
            <path d={`M 30 ${size/2-10} A ${(size/2)-30} ${(size/2)-30} 0 0 1 ${30 + (size-60) * (score/max)} ${size/2-10}`} fill="none" stroke={color} strokeWidth="22" strokeLinecap="round" />
            {/* 0 and 100 labels */}
            <text x={30} y={size/2} fontSize="18" fill="#888">0</text>
            <text x={size-30} y={size/2} fontSize="18" fill="#888" textAnchor="end">100</text>
            {/* Score in center */}
            <text x={size/2} y={size/2 - 30} fontSize="48" fill="#222" textAnchor="middle" alignmentBaseline="middle" fontWeight="bold">{score}</text>
          </svg>
          {/* Confidence bar below gauge */}
          {confidence !== null && (
            <div className="w-3/4 mx-auto mt-6">
              <div className="text-center text-base mb-1">Confidence Level</div>
              <div className="w-full h-3 rounded-full overflow-hidden" style={{background: progressBg}}>
                <div className="h-full bg-blue-500" style={{ width: `${Math.round(confidence*100)}%` }} />
              </div>
              <div className="text-xs text-gray-500 mt-1 text-center">{Math.round(confidence*100)}%</div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
