"use client"

import React from "react"
import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart as RechartsRadarChart,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./ui/card"
import { TrendingUp } from "lucide-react"
import { Skeleton } from "./ui/skeleton"

export function RadarChart({
  id,
  title = "",
  description = "",
  data = {},
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

  // Convert object to array format for Recharts
  const chartData = Object.entries(data).map(([name, value]) => ({
    subject: name,
    value: value * 100 // Convert to percentage
  }))

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

  if (!chartData.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Emotion Radar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center text-gray-500">
            No data available
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="items-center pb-4">
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="pb-0">
        <div className="mx-auto aspect-square max-h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsRadarChart data={chartData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis angle={30} domain={[0, 100]} hide />
              <Radar
                name="Emotions"
                dataKey="value"
                stroke="hsl(var(--chart-1))"
                fill="hsl(var(--chart-1))"
                fillOpacity={0.6}
              />
              <Tooltip
                formatter={(value) => `${value.toFixed(1)}%`}
                contentStyle={{
                  backgroundColor: isDark ? '#1f1f1f' : '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
              />
            </RechartsRadarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Emotion Distribution <TrendingUp className="h-4 w-4" />
        </div>
        <div className="flex items-center gap-2 leading-none text-muted-foreground">
          Based on sentiment analysis
        </div>
      </CardFooter>
    </Card>
  )
}
