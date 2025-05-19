"use client"

import React, { useState } from "react"
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, Sector } from "recharts"
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

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))"
]

export function PieChart({
  id,
  title = "",
  description = "",
  data = {},
  config = {},
  innerRadius = 60,
  outerRadius = 80,
  width = 320,
  height = 320,
  loading = false,
  className = "",
}) {
  const [activeIndex, setActiveIndex] = useState(0)
  const isDark = typeof window !== 'undefined'
    && document.documentElement.classList.contains('dark')
  const skeletonBg = isDark ? '#444' : '#eee'

  // Convert object to array format for Recharts
  const chartData = Object.entries(data).map(([name, value]) => ({
    name,
    value: value * 100, // Convert to percentage
    fill: COLORS[Object.keys(data).indexOf(name) % COLORS.length]
  }))

  if (loading) {
    return (
      <Card data-chart={id} className={className}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="grid gap-1">
            <CardTitle>{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
        </CardHeader>
        <CardContent className="flex justify-center p-6">
          <Skeleton
            className="w-[320px] h-[320px] rounded-full"
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
          <CardTitle>Emotion Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center text-gray-500">
            No data available
          </div>
        </CardContent>
      </Card>
    )
  }

  const onPieEnter = (_, index) => {
    setActiveIndex(index)
  }

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <div className="mx-auto aspect-square max-h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsPieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={innerRadius}
                outerRadius={outerRadius}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                activeIndex={activeIndex}
                onMouseEnter={onPieEnter}
                activeShape={({ outerRadius = 0, ...props }) => (
                  <Sector {...props} outerRadius={outerRadius + 10} />
                )}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => `${value.toFixed(1)}%`}
                contentStyle={{
                  backgroundColor: isDark ? '#1f1f1f' : '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
              />
              <Legend
                layout="vertical"
                verticalAlign="middle"
                align="right"
                wrapperStyle={{
                  paddingLeft: '20px'
                }}
              />
            </RechartsPieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Emotion Distribution <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Based on sentiment analysis
        </div>
      </CardFooter>
    </Card>
  )
}
