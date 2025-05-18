"use client"

import * as React from "react"
import { Progress } from "./ui/progress"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "./ui/card"
import { Skeleton } from "./ui/skeleton"

export function ModelConfidence({ confidence = 0, loading = false }) {
  const [value, setValue] = React.useState(0)

  React.useEffect(() => {
    if (!loading) {
      setValue(Math.round(confidence * 100))
    }
  }, [confidence, loading])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="w-32 h-6" />
        </CardHeader>
        <CardContent>
          <Skeleton className="w-full h-4" />
          <Skeleton className="w-16 h-4 mt-2" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white dark:bg-[#161616]">
      <CardHeader>
        <CardTitle>Confidence Level</CardTitle>
      </CardHeader>
      <CardContent>
        <Progress value={value} className="w-full" />
        <p className="mt-2 text-sm text-muted-foreground">
          {value}%
        </p>
      </CardContent>
    </Card>
  )
}
