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

  const isDark = typeof window !== 'undefined' && document.documentElement.classList.contains('dark');

  // Define dark theme chart colors
  const darkChartColors = {
    '--chart-1': '220 70% 50%',
    '--chart-2': '160 60% 45%',
    '--chart-3': '30 80% 55%',
    '--chart-4': '280 65% 60%',
    '--chart-5': '340 75% 55%',
  };

  // Apply dark theme colors if in light mode
  const chartStyle = !isDark ? darkChartColors : {};

  return (
    <Card style={chartStyle}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Emotions Distribution</CardTitle>
        <Select
          value={chartType}
          onValueChange={setChartType}
        >
          <SelectTrigger className="w-[180px] dark:bg-gray-800 dark:text-gray-200 bg-white text-gray-900 border border-gray-300">
            <SelectValue placeholder="Select chart type" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-700">
            {chartOptions.map((option) => (
              <SelectItem key={option.value} value={option.value} className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200">
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        {chartType === 'radar' ? (
          <RadarChart data={emotionScores} color="#2563eb" />
        ) : (
          <PieChart data={emotionScores} showLabels={true} />
        )}
      </CardContent>
    </Card>
  );
} 