import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { RadarChart } from "./RadarChart";
import { PieChart } from "./PieChart";

export function EmotionsDistribution({ emotionScores }) {
  const [chartType, setChartType] = useState('radar');

  const chartOptions = [
    { value: 'radar', label: 'Radar Chart' },
    { value: 'pie', label: 'Pie Chart' }
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Emotions Distribution</CardTitle>
        <Select
          value={chartType}
          onValueChange={setChartType}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select chart type" />
          </SelectTrigger>
          <SelectContent>
            {chartOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        {chartType === 'radar' ? (
          <RadarChart data={emotionScores} />
        ) : (
          <PieChart data={emotionScores} showLabels={true} />
        )}
      </CardContent>
    </Card>
  );
} 