import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { RadarChart } from '@/components/RadarChart';
import { PieChart } from '@/components/PieChart';
import { SentimentWordCloud } from '@/components/WordCloud';
import { Badge } from '@/components/ui/badge';

// Utility for dark/light badge colors
const sentimentColor = (sentiment, isDark) => {
  if (sentiment === 'positive') return isDark ? 'bg-green-500 text-white' : 'bg-green-100 text-green-800';
  if (sentiment === 'neutral') return isDark ? 'bg-yellow-400 text-black' : 'bg-yellow-100 text-yellow-800';
  if (sentiment === 'negative') return isDark ? 'bg-red-500 text-white' : 'bg-red-100 text-red-800';
  return isDark ? 'bg-gray-600 text-white' : 'bg-gray-200 text-gray-800';
};
const confidenceColor = (label, isDark) => {
  if (label === 'high') return isDark ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-800';
  if (label === 'moderate') return isDark ? 'bg-blue-300 text-black' : 'bg-blue-100 text-blue-800';
  return isDark ? 'bg-gray-400 text-white' : 'bg-gray-200 text-gray-800';
};

export default function SentimentDashboard({ analysis, platform }) {
  const [chartType, setChartType] = useState('radar');
  const { overall_sentiment, overall_score, emotion_distribution, sentiment_intensity, dominant_emotion, total_comments, unique_comment, model_confidence, wordcloud } = analysis;
  const isDark = typeof window !== 'undefined' && document.documentElement.classList.contains('dark');

  if (!emotion_distribution) {
    return <div>No sentiment data available.</div>;
  }

  return (
    <div className="space-y-6">
      {/* First row: Sentiment+Insights | Chart */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Sentiment Analysis + Key Insights */}
        <Card>
          <CardHeader>
            <CardTitle>Sentiment Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Overall Sentiment</span>
              <Badge className={sentimentColor(overall_sentiment, isDark)}>
                {overall_sentiment.charAt(0).toUpperCase() + overall_sentiment.slice(1)}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-3 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                <div className={sentimentColor(overall_sentiment, isDark) + ' h-3 rounded-full transition-all duration-500'} style={{ width: `${Math.abs(overall_score) * 100}%` }} />
              </div>
              <span className={sentimentColor(overall_sentiment, isDark) + ' ml-2 px-2 py-0.5 rounded text-sm font-bold'}>
                {overall_score > 0 ? '+' : ''}{overall_score.toFixed(2)}
              </span>
            </div>
            {/* Emotion Analysis Bars */}
            <div className="mt-4">
              <div className="mb-2 font-medium">Emotion Analysis</div>
              <div className="flex items-center mb-1">
                <span className="w-20">Positive</span>
                <div className="flex-1 h-2 rounded-full bg-green-100 dark:bg-green-900 overflow-hidden mx-2">
                  <div className="bg-green-400 h-2 rounded-full" style={{ width: `${emotion_distribution.positive * 100}%` }} />
                </div>
                <span className="w-12 text-right">{(emotion_distribution.positive * 100).toFixed(1)}%</span>
              </div>
              <div className="flex items-center mb-1">
                <span className="w-20">Neutral</span>
                <div className="flex-1 h-2 rounded-full bg-yellow-100 dark:bg-yellow-900 overflow-hidden mx-2">
                  <div className="bg-yellow-300 h-2 rounded-full" style={{ width: `${emotion_distribution.neutral * 100}%` }} />
                </div>
                <span className="w-12 text-right">{(emotion_distribution.neutral * 100).toFixed(1)}%</span>
              </div>
              <div className="flex items-center">
                <span className="w-20">Negative</span>
                <div className="flex-1 h-2 rounded-full bg-red-100 dark:bg-red-900 overflow-hidden mx-2">
                  <div className="bg-red-400 h-2 rounded-full" style={{ width: `${emotion_distribution.negative * 100}%` }} />
                </div>
                <span className="w-12 text-right">{(emotion_distribution.negative * 100).toFixed(1)}%</span>
              </div>
            </div>
            {/* Key Insights Section */}
            <div className="mt-6 space-y-2">
              <div>
                <span className="font-medium">Dominant Emotion:</span>{' '}
                <Badge className={sentimentColor(dominant_emotion, isDark)}>
                  {dominant_emotion.charAt(0).toUpperCase() + dominant_emotion.slice(1)}
                </Badge>
              </div>
              <div>
                <span className="font-medium">Emotional Intensity:</span>{' '}
                {Math.max(sentiment_intensity.positive, sentiment_intensity.neutral, sentiment_intensity.negative).toFixed(2)}
              </div>
              <div>
                <span className="font-medium">Fetched Comments:</span>{' '}
                {typeof analysis.total_comment_count === 'number' && total_comments
                  ? `${total_comments}/${analysis.total_comment_count}`
                  : total_comments}
              </div>
              <div>
                <span className="font-medium">Top Comment:</span>{' '}
                <span className="italic">{unique_comment}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Chart Card */}
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
      </div>
      {/* Second row: Model Confidence only */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Model Confidence</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Progress value={model_confidence.value * 100} className="flex-1 h-3 bg-blue-100 dark:bg-blue-900" style={{ backgroundImage: 'linear-gradient(to right, #3B82F6, #60A5FA)' }} />
              <Badge className={confidenceColor(model_confidence.label, isDark)}>
                {model_confidence.label.charAt(0).toUpperCase() + model_confidence.label.slice(1)}
              </Badge>
              <span className="ml-2 text-sm">{(model_confidence.value * 100).toFixed(1)}%</span>
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Word Cloud */}
      {wordcloud && <div className="mt-6"><SentimentWordCloud frequencies={wordcloud} /></div>}
    </div>
  );
} 