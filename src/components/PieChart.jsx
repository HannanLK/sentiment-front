"use client"

import * as React from "react"
import { PieChart as RePieChart, Pie, Cell } from "recharts"
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

export function PieChart({
  id,
  title = "",
  description = "",
  data = [],
  config = {},
  innerRadius = 80,
  outerRadius = 120,
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
        <CardContent className="flex justify-center p-6">
          <Skeleton
            className="w-[320px] h-[320px] rounded-full"
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
          className={`w-full max-w-[${width}px] aspect-square`}
        >
          <RePieChart width={width} height={height}>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent />}
            />
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              paddingAngle={2}
            >
              {data.map((entry, i) => (
                <Cell
                  key={i}
                  fill={config[entry.name].color}
                />
              ))}
            </Pie>
          </RePieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
