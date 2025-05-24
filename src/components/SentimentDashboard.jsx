import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { RadarChart } from '@/components/RadarChart';
import { PieChart } from '@/components/PieChart';
import { SentimentWordCloud } from '@/components/WordCloud';

const gradient = (sentiment) => {
  if (sentiment === 'positive') return 'bg-gradient-to-r from-green-400 to-green-600';
  if (sentiment === 'neutral') return 'bg-gradient-to-r from-yellow-300 to-yellow-500';
  if (sentiment === 'negative') return 'bg-gradient-to-r from-red-400 to-red-600';
  return 'bg-gray-300';
};

const confidenceGradient = (label) => {
  if (label === 'high') return 'bg-gradient-to-r from-blue-400 to-blue-700';
  if (label === 'moderate') return 'bg-gradient-to-r from-blue-200 to-blue-400';
  return 'bg-gradient-to-r from-gray-300 to-gray-400';
};

export default function SentimentDashboard({ analysis, platform }) {
  const [chartType, setChartType] = useState('radar');
  const { overall_sentiment, overall_score, emotion_distribution, sentiment_intensity, dominant_emotion, total_comments, unique_comment, model_confidence, wordcloud } = analysis;

  if (!emotion_distribution) {
    return <div>No sentiment data available.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: Overall Sentiment */}
        <Card>
          <CardHeader>
            <CardTitle>Overall Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="mb-2 font-medium">Overall Sentiment: <span className="capitalize">{overall_sentiment}</span></div>
              <Progress value={Math.abs(overall_score) * 100} className={gradient(overall_sentiment) + ' h-3'} />
            </div>
            <div>
              <div className="mb-2 font-medium">Emotion Distribution</div>
              <Progress value={emotion_distribution.positive * 100} className="bg-green-200 h-2 mb-1" />
              <Progress value={emotion_distribution.neutral * 100} className="bg-yellow-200 h-2 mb-1" />
              <Progress value={emotion_distribution.negative * 100} className="bg-red-200 h-2" />
              <div className="flex justify-between text-xs mt-1">
                <span>Positive: {(emotion_distribution.positive * 100).toFixed(1)}%</span>
                <span>Neutral: {(emotion_distribution.neutral * 100).toFixed(1)}%</span>
                <span>Negative: {(emotion_distribution.negative * 100).toFixed(1)}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Card 2: Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Emotion Distribution</CardTitle>
            <select value={chartType} onChange={e => setChartType(e.target.value)} className="ml-auto rounded border px-2 py-1 text-sm">
              <option value="radar">Radar</option>
              <option value="pie">Pie</option>
            </select>
          </CardHeader>
          <CardContent>
            {chartType === 'radar' ? (
              <RadarChart data={emotion_distribution} color="#2563eb" />
            ) : (
              <PieChart data={emotion_distribution} />
            )}
          </CardContent>
        </Card>
        {/* Card 3: Key Insights */}
        <Card>
          <CardHeader>
            <CardTitle>Key Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>Dominant Emotion: <span className="capitalize font-semibold">{dominant_emotion}</span></div>
            <div>Emotional Intensity: {Math.max(sentiment_intensity.positive, sentiment_intensity.neutral, sentiment_intensity.negative).toFixed(2)}</div>
            <div>Total Comments: {total_comments}</div>
            <div>Unique Comment: <span className="italic">{unique_comment}</span></div>
          </CardContent>
        </Card>
        {/* Card 4: Model Confidence */}
        <Card>
          <CardHeader>
            <CardTitle>Model Confidence</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={model_confidence.value * 100} className={confidenceGradient(model_confidence.label) + ' h-3'} />
            <div className="mt-2 text-sm">{model_confidence.label.charAt(0).toUpperCase() + model_confidence.label.slice(1)} confidence ({(model_confidence.value * 100).toFixed(1)}%)</div>
          </CardContent>
        </Card>
      </div>
      {/* Word Cloud */}
      {wordcloud && <div className="mt-6"><SentimentWordCloud frequencies={wordcloud} /></div>}
    </div>
  );
} 