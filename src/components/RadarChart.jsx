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
  width = 320,
  height = 320,
  loading = false,
  className = "",
}) {
  const isDark = typeof window !== 'undefined'
    && document.documentElement.classList.contains('dark')
  const skeletonBg = isDark ? '#23272e' : '#eee'

  if (loading) {
    return (
      <Card data-chart={id} className={className}>
        <CardHeader className="space-y-2">
          <Skeleton className="w-48 h-6" />
          <Skeleton className="w-32 h-4" />
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
    <Card data-chart={id} className={className}>
      <ChartStyle id={id} config={config} />
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="flex justify-center p-6">
        <ChartContainer
          id={id}
          config={config}
          className="w-full max-w-[320px] aspect-square"
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
              fill={config[angleKey]?.color || "var(--chart-1)"}
              fillOpacity={0.6}
              dot={{ r: 4, fillOpacity: 1 }}
            />
          </ReRadarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
