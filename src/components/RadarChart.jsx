"use client"

import * as React from "react"
import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart as ReRadarChart,
} from "recharts"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "./ui/card"
import {
  ChartStyle,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "./ui/chart"
import { Skeleton } from "./ui/skeleton"

export function RadarChart({
  id,
  title = "",
  description = "",
  data = [],
  angleKey = "sentiment",
  dataKey = "count",
  config = {},
  width = 380,
  height = 380,
  loading = false,
  className = "",
}) {
  const isDark = typeof window !== 'undefined'
    && document.documentElement.classList.contains('dark')
  const skeletonBg = isDark ? '#444' : '#eee'

  if (loading) {
    return (
      <Card data-chart={id} className={className}>
        <CardHeader className="space-y-2">
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent className="flex justify-center p-6">
          <Skeleton
            className="w-[320px] h-[320px]"
            style={{ background: skeletonBg }}
          />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card data-chart={id} className={`bg-white dark:bg-[#161616] ${className}`}>
      <ChartStyle id={id} config={config} />
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="flex justify-center p-0">
        <ChartContainer
          id={id}
          config={config}
          className="w-full max-w-[380px] aspect-square"
        >
          <ReRadarChart width={width} height={height} data={data}>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent />}
            />
            <PolarGrid />
            <PolarAngleAxis dataKey={angleKey} />
            <Radar
              dataKey={dataKey}
              fill="hsl(220 70% 50%)"
              fillOpacity={0.6}
              dot={{ r: 4, fillOpacity: 1 }}
            />
          </ReRadarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
