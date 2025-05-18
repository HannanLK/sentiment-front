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
  ChartLegend,
  ChartLegendContent,
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
    <Card data-chart={id} className={`bg-white dark:bg-[#161616] ${className}`}>
      <ChartStyle id={id} config={config} />
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="grid gap-1">
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
      </CardHeader>
      <CardContent className="flex justify-center p-0">
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
            <ChartLegend
              content={<ChartLegendContent />}
            />
          </RePieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
