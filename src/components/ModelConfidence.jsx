"use client"

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";

export function ModelConfidence({ confidenceScore = 0 }) {
  console.log("ModelConfidence - Received confidence score:", confidenceScore);

  // Ensure confidenceScore is a valid number between 0 and 1
  const validScore = typeof confidenceScore === 'number' && !isNaN(confidenceScore) 
    ? Math.max(0, Math.min(1, confidenceScore)) 
    : 0;

  console.log("ModelConfidence - Validated score:", validScore);

  const getConfidenceLevel = (score) => {
    if (score >= 0.8) return { label: "High", variant: "default" };
    if (score >= 0.5) return { label: "Medium", variant: "secondary" };
    return { label: "Low", variant: "destructive" };
  };

  const confidenceLevel = getConfidenceLevel(validScore);
  console.log("ModelConfidence - Confidence level:", confidenceLevel);

  // Define a blue gradient
  const blueGradient = "linear-gradient(to right, #3B82F6, #60A5FA)";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Model Confidence</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Progress 
              value={validScore * 100}
              className="flex-1 mr-4"
              style={{ backgroundImage: blueGradient }}
            />
            <Badge variant={confidenceLevel.variant}>
              {confidenceLevel.label}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Confidence Score: {(validScore * 100).toFixed(1)}%
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
