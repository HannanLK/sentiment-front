"use client"

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";

export function ModelConfidence({ confidenceScore }) {
  const getConfidenceLevel = (score) => {
    if (score >= 0.8) return { label: "High", variant: "default" };
    if (score >= 0.5) return { label: "Medium", variant: "secondary" };
    return { label: "Low", variant: "destructive" };
  };

  const confidenceLevel = getConfidenceLevel(confidenceScore);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Model Confidence</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Progress value={confidenceScore * 100} className="flex-1 mr-4" />
            <Badge variant={confidenceLevel.variant}>
              {confidenceLevel.label}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Confidence Score: {(confidenceScore * 100).toFixed(1)}%
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
