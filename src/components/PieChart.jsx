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
  '#2563eb', // blue
  '#10b981', // green
  '#f59e42', // orange
  '#f43f5e', // red
  '#a21caf', // purple
]

export function PieChart({
  id,
  title = "",
  description = "",
  data = {},
  config = {},
  innerRadius = 50,
  outerRadius = 70,
  width = 320,
  height = 320,
  loading = false,
  className = "",
}) {
  const [activeIndex, setActiveIndex] = useState(null)
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

  const onPieLeave = () => {
    setActiveIndex(null)
  }

  const renderActiveShape = (props) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload } = props
    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 10}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 12}
          outerRadius={outerRadius + 16}
          fill={fill}
        />
      </g>
    )
  }

  // Custom Legend component to make items clickable
  const CustomLegend = ({ payload, onLegendClick }) => {
    return (
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 pt-2 md:pt-8" style={{ fontSize: '12px' }}>
        {payload.map((entry, index) => (
          <div
            key={`legend-${index}`}
            className="flex items-center gap-1.5 cursor-pointer hover:opacity-80"
            onClick={() => onLegendClick(index)}
          >
            <div
              className="h-2 w-2 shrink-0 rounded-[2px]"
              style={{
                backgroundColor: entry.color,
              }}
            />
            <span className="text-xs text-muted-foreground">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <div className="mx-auto aspect-square max-h-[240px] md:pt-6">
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
                onMouseLeave={onPieLeave}
                activeShape={renderActiveShape}
                labelLine={false}
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.fill}
                    stroke={entry.fill}
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => `${value.toFixed(1)}%`}
                contentStyle={{
                  backgroundColor: isDark ? '#1f1f1f' : '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  fontSize: '12px'
                }}
              />
              <Legend
                content={<CustomLegend onLegendClick={(index) => setActiveIndex(index)} />}
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
