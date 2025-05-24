import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { RadarChart } from '@/components/RadarChart';
import { PieChart } from '@/components/PieChart';
import { SentimentWordCloud } from '@/components/WordCloud';
import { Badge } from '@/components/ui/badge';

const sentimentColor = (sentiment) => {
  if (sentiment === 'positive') return 'bg-green-500 text-white';
  if (sentiment === 'neutral') return 'bg-yellow-400 text-black';
  if (sentiment === 'negative') return 'bg-red-500 text-white';
  return 'bg-gray-300 text-black';
};

const progressColor = (sentiment) => {
  if (sentiment === 'positive') return 'bg-green-400';
  if (sentiment === 'neutral') return 'bg-yellow-300';
  if (sentiment === 'negative') return 'bg-red-400';
  return 'bg-gray-300';
};

const confidenceLabel = (label) => {
  if (label === 'high') return <Badge className="bg-blue-500 text-white">High</Badge>;
  if (label === 'moderate') return <Badge className="bg-blue-300 text-black">Moderate</Badge>;
  return <Badge className="bg-gray-300 text-black">Low</Badge>;
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
            <CardTitle>Sentiment Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Overall Sentiment</span>
              <Badge className={sentimentColor(overall_sentiment)}>{overall_sentiment.charAt(0).toUpperCase() + overall_sentiment.slice(1)}</Badge>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-3 rounded-full bg-gray-200 overflow-hidden">
                <div className={progressColor(overall_sentiment) + ' h-3 rounded-full transition-all duration-500'} style={{ width: `${Math.abs(overall_score) * 100}%` }} />
              </div>
              <span className={sentimentColor(overall_sentiment) + ' ml-2 px-2 py-0.5 rounded text-sm font-bold'}>{overall_score > 0 ? '+' : ''}{overall_score.toFixed(2)}</span>
            </div>
            <div className="mt-4">
              <div className="mb-2 font-medium">Emotion Analysis</div>
              <div className="flex items-center mb-1">
                <span className="w-20">Positive</span>
                <div className="flex-1 h-2 rounded-full bg-green-100 overflow-hidden mx-2">
                  <div className="bg-green-400 h-2 rounded-full" style={{ width: `${emotion_distribution.positive * 100}%` }} />
                </div>
                <span className="w-12 text-right">{(emotion_distribution.positive * 100).toFixed(1)}%</span>
              </div>
              <div className="flex items-center mb-1">
                <span className="w-20">Neutral</span>
                <div className="flex-1 h-2 rounded-full bg-yellow-100 overflow-hidden mx-2">
                  <div className="bg-yellow-300 h-2 rounded-full" style={{ width: `${emotion_distribution.neutral * 100}%` }} />
                </div>
                <span className="w-12 text-right">{(emotion_distribution.neutral * 100).toFixed(1)}%</span>
              </div>
              <div className="flex items-center">
                <span className="w-20">Negative</span>
                <div className="flex-1 h-2 rounded-full bg-red-100 overflow-hidden mx-2">
                  <div className="bg-red-400 h-2 rounded-full" style={{ width: `${emotion_distribution.negative * 100}%` }} />
                </div>
                <span className="w-12 text-right">{(emotion_distribution.negative * 100).toFixed(1)}%</span>
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
            <div><span className="font-medium">Dominant Emotion:</span> <Badge className={sentimentColor(dominant_emotion)}>{dominant_emotion.charAt(0).toUpperCase() + dominant_emotion.slice(1)}</Badge></div>
            <div><span className="font-medium">Emotional Intensity:</span> {Math.max(sentiment_intensity.positive, sentiment_intensity.neutral, sentiment_intensity.negative).toFixed(2)}</div>
            <div><span className="font-medium">Total Comments:</span> {total_comments}</div>
            <div><span className="font-medium">Top Comment:</span> <span className="italic">{unique_comment}</span></div>
          </CardContent>
        </Card>
        {/* Card 4: Model Confidence */}
        <Card>
          <CardHeader>
            <CardTitle>Model Confidence</CardTitle>
          </CardHeader>
          <CardContent>
            {confidenceLabel(model_confidence.label)}
            <Progress value={model_confidence.value * 100} className="h-3 mt-2 bg-blue-100" />
            <div className="mt-2 text-sm">{(model_confidence.value * 100).toFixed(1)}%</div>
          </CardContent>
        </Card>
      </div>
      {/* Word Cloud */}
      {wordcloud && <div className="mt-6"><SentimentWordCloud frequencies={wordcloud} /></div>}
    </div>
  );
} 