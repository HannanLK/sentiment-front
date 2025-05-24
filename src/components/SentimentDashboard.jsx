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
  // Detect if this is a new SocialAnalysisResult (Reddit/Twitter)
  const isSocial = analysis && analysis.post && analysis.comments && analysis.overall;
  const [chartTypeOverall, setChartTypeOverall] = useState('radar');
  const [chartTypePost, setChartTypePost] = useState('radar');
  const [chartTypeComments, setChartTypeComments] = useState('radar');
  const isDark = typeof window !== 'undefined' && document.documentElement.classList.contains('dark');

  // Helper to render a sentiment card (for post/comments)
  const renderSentimentCard = (data, title, chartType, setChartType, showComment = false) => (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 flex-1">
        {/* Progress bars and key insights */}
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium">Overall Sentiment</span>
            <Badge className={sentimentColor(data.overall_sentiment, isDark)}>
              {data.overall_sentiment.charAt(0).toUpperCase() + data.overall_sentiment.slice(1)}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-3 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
              <div className={sentimentColor(data.overall_sentiment, isDark) + ' h-3 rounded-full transition-all duration-500'} style={{ width: `${Math.abs(data.overall_score) * 100}%` }} />
            </div>
            <span className={sentimentColor(data.overall_sentiment, isDark) + ' ml-2 px-2 py-0.5 rounded text-sm font-bold'}>
              {data.overall_score > 0 ? '+' : ''}{data.overall_score.toFixed(2)}
            </span>
          </div>
          {/* Emotion Analysis Bars */}
          <div className="mt-4">
            <div className="mb-2 font-medium">Emotion Analysis</div>
            <div className="flex items-center mb-1">
              <span className="w-20">Positive</span>
              <div className="flex-1 h-2 rounded-full bg-green-100 dark:bg-green-900 overflow-hidden mx-2">
                <div className="bg-green-400 h-2 rounded-full" style={{ width: `${data.emotion_distribution.positive * 100}%` }} />
              </div>
              <span className="w-12 text-right">{(data.emotion_distribution.positive * 100).toFixed(1)}%</span>
            </div>
            <div className="flex items-center mb-1">
              <span className="w-20">Neutral</span>
              <div className="flex-1 h-2 rounded-full bg-yellow-100 dark:bg-yellow-900 overflow-hidden mx-2">
                <div className="bg-yellow-300 h-2 rounded-full" style={{ width: `${data.emotion_distribution.neutral * 100}%` }} />
              </div>
              <span className="w-12 text-right">{(data.emotion_distribution.neutral * 100).toFixed(1)}%</span>
            </div>
            <div className="flex items-center">
              <span className="w-20">Negative</span>
              <div className="flex-1 h-2 rounded-full bg-red-100 dark:bg-red-900 overflow-hidden mx-2">
                <div className="bg-red-400 h-2 rounded-full" style={{ width: `${data.emotion_distribution.negative * 100}%` }} />
              </div>
              <span className="w-12 text-right">{(data.emotion_distribution.negative * 100).toFixed(1)}%</span>
            </div>
          </div>
          {/* Key Insights Section */}
          <div className="mt-6 space-y-2">
            <div>
              <span className="font-medium">Dominant Emotion:</span>{' '}
              <Badge className={sentimentColor(data.dominant_emotion, isDark)}>
                {data.dominant_emotion.charAt(0).toUpperCase() + data.dominant_emotion.slice(1)}
              </Badge>
            </div>
            <div>
              <span className="font-medium">Emotional Intensity:</span>{' '}
              {Math.max(data.sentiment_intensity.positive, data.sentiment_intensity.neutral, data.sentiment_intensity.negative).toFixed(2)}
            </div>
            {/* Only show top comment if showComment is true */}
            {showComment && (
              <div>
                <span className="font-medium">Top Comment:</span>{' '}
                <span className="italic block max-h-24 overflow-y-auto p-2 bg-gray-50 dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700 whitespace-pre-line">
                  {data.unique_comment}
                </span>
              </div>
            )}
          </div>
        </div>
        {/* Chart Distribution (always at the bottom for post/comments) */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium">Emotion Chart Distribution</span>
            <select value={chartType} onChange={e => setChartType(e.target.value)} className="ml-auto rounded border px-2 py-1 text-sm">
              <option value="radar">Radar</option>
              <option value="pie">Pie</option>
            </select>
          </div>
          {chartType === 'radar' ? (
            <RadarChart data={data.emotion_distribution} color="#2563eb" />
          ) : (
            <PieChart data={data.emotion_distribution} />
          )}
        </div>
      </CardContent>
    </Card>
  );

  // Social (Reddit/Twitter) layout
  if (isSocial && (platform === 'Reddit' || platform === 'Twitter')) {
    return (
      <div className="space-y-6">
        {/* Row 1: Overall (POST + COMMENTS) - 60%/40% split */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Overall Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-6">
              {/* Left: Progress bars and key insights (60%) */}
              <div className="md:w-3/5 w-full space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Overall Sentiment</span>
                  <Badge className={sentimentColor(analysis.overall.overall_sentiment, isDark)}>
                    {analysis.overall.overall_sentiment.charAt(0).toUpperCase() + analysis.overall.overall_sentiment.slice(1)}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-3 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                    <div className={sentimentColor(analysis.overall.overall_sentiment, isDark) + ' h-3 rounded-full transition-all duration-500'} style={{ width: `${Math.abs(analysis.overall.overall_score) * 100}%` }} />
                  </div>
                  <span className={sentimentColor(analysis.overall.overall_sentiment, isDark) + ' ml-2 px-2 py-0.5 rounded text-sm font-bold'}>
                    {analysis.overall.overall_score > 0 ? '+' : ''}{analysis.overall.overall_score.toFixed(2)}
                  </span>
                </div>
                {/* Emotion Analysis Bars */}
                <div className="mt-4">
                  <div className="mb-2 font-medium">Emotional Analysis</div>
                  <div className="flex items-center mb-1">
                    <span className="w-20">Positive</span>
                    <div className="flex-1 h-2 rounded-full bg-green-100 dark:bg-green-900 overflow-hidden mx-2">
                      <div className="bg-green-400 h-2 rounded-full" style={{ width: `${analysis.overall.emotion_distribution.positive * 100}%` }} />
                    </div>
                    <span className="w-12 text-right">{(analysis.overall.emotion_distribution.positive * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex items-center mb-1">
                    <span className="w-20">Neutral</span>
                    <div className="flex-1 h-2 rounded-full bg-yellow-100 dark:bg-yellow-900 overflow-hidden mx-2">
                      <div className="bg-yellow-300 h-2 rounded-full" style={{ width: `${analysis.overall.emotion_distribution.neutral * 100}%` }} />
                    </div>
                    <span className="w-12 text-right">{(analysis.overall.emotion_distribution.neutral * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-20">Negative</span>
                    <div className="flex-1 h-2 rounded-full bg-red-100 dark:bg-red-900 overflow-hidden mx-2">
                      <div className="bg-red-400 h-2 rounded-full" style={{ width: `${analysis.overall.emotion_distribution.negative * 100}%` }} />
                    </div>
                    <span className="w-12 text-right">{(analysis.overall.emotion_distribution.negative * 100).toFixed(1)}%</span>
                  </div>
                </div>
                {/* Key Insights Section */}
                <div className="mt-6 space-y-2">
                  <div>
                    <span className="font-medium">Dominant Emotion:</span>{' '}
                    <Badge className={sentimentColor(analysis.overall.dominant_emotion, isDark)}>
                      {analysis.overall.dominant_emotion.charAt(0).toUpperCase() + analysis.overall.dominant_emotion.slice(1)}
                    </Badge>
                  </div>
                  <div>
                    <span className="font-medium">Emotional Intensity:</span>{' '}
                    {Math.max(analysis.overall.sentiment_intensity.positive, analysis.overall.sentiment_intensity.neutral, analysis.overall.sentiment_intensity.negative).toFixed(2)}
                  </div>
                  <div>
                    <span className="font-medium">Top Comment:</span>
                    <div className="mt-2">
                      <span className="italic block max-h-56 min-h-[96px] overflow-y-auto p-2 bg-gray-50 dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700 whitespace-pre-line">
                        {analysis.overall.unique_comment}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              {/* Right: Chart (40%) */}
              <div className="md:w-2/5 w-full flex flex-col items-center justify-center">
                <div className="w-full">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Emotion Distribution</span>
                    <select value={chartTypeOverall} onChange={e => setChartTypeOverall(e.target.value)} className="ml-auto rounded border px-2 py-1 text-sm">
                      <option value="radar">Radar</option>
                      <option value="pie">Pie</option>
                    </select>
                  </div>
                  {chartTypeOverall === 'radar' ? (
                    <RadarChart data={analysis.overall.emotion_distribution} color="#2563eb" />
                  ) : (
                    <PieChart data={analysis.overall.emotion_distribution} />
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Row 2: Post and Comments side by side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderSentimentCard(analysis.post, 'Post Analysis', chartTypePost, setChartTypePost, false)}
          {renderSentimentCard(analysis.comments, 'Comment Analysis', chartTypeComments, setChartTypeComments, false)}
        </div>
        {/* Row 3: Model Confidence (from overall) */}
        <div className="grid grid-cols-1">
          <Card>
            <CardHeader>
              <CardTitle>Model Confidence</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Progress value={analysis.overall.model_confidence.value * 100} className="flex-1 h-3 bg-blue-100 dark:bg-blue-900" style={{ backgroundImage: 'linear-gradient(to right, #3B82F6, #60A5FA)' }} />
                <Badge className={confidenceColor(analysis.overall.model_confidence.label, isDark)}>
                  {analysis.overall.model_confidence.label.charAt(0).toUpperCase() + analysis.overall.model_confidence.label.slice(1)}
                </Badge>
                <span className="ml-2 text-sm">{(analysis.overall.model_confidence.value * 100).toFixed(1)}%</span>
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Word Cloud (if available) */}
        {analysis.overall.wordcloud && <div className="mt-6"><SentimentWordCloud frequencies={analysis.overall.wordcloud} /></div>}
      </div>
    );
  }

  // Default (YouTube/legacy) layout
  if (!analysis.emotion_distribution) {
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
              <Badge className={sentimentColor(analysis.overall_sentiment, isDark)}>
                {analysis.overall_sentiment.charAt(0).toUpperCase() + analysis.overall_sentiment.slice(1)}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-3 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                <div className={sentimentColor(analysis.overall_sentiment, isDark) + ' h-3 rounded-full transition-all duration-500'} style={{ width: `${Math.abs(analysis.overall_score) * 100}%` }} />
              </div>
              <span className={sentimentColor(analysis.overall_sentiment, isDark) + ' ml-2 px-2 py-0.5 rounded text-sm font-bold'}>
                {analysis.overall_score > 0 ? '+' : ''}{analysis.overall_score.toFixed(2)}
              </span>
            </div>
            {/* Emotion Analysis Bars */}
            <div className="mt-4">
              <div className="mb-2 font-medium">Emotion Analysis</div>
              <div className="flex items-center mb-1">
                <span className="w-20">Positive</span>
                <div className="flex-1 h-2 rounded-full bg-green-100 dark:bg-green-900 overflow-hidden mx-2">
                  <div className="bg-green-400 h-2 rounded-full" style={{ width: `${analysis.emotion_distribution.positive * 100}%` }} />
                </div>
                <span className="w-12 text-right">{(analysis.emotion_distribution.positive * 100).toFixed(1)}%</span>
              </div>
              <div className="flex items-center mb-1">
                <span className="w-20">Neutral</span>
                <div className="flex-1 h-2 rounded-full bg-yellow-100 dark:bg-yellow-900 overflow-hidden mx-2">
                  <div className="bg-yellow-300 h-2 rounded-full" style={{ width: `${analysis.emotion_distribution.neutral * 100}%` }} />
                </div>
                <span className="w-12 text-right">{(analysis.emotion_distribution.neutral * 100).toFixed(1)}%</span>
              </div>
              <div className="flex items-center">
                <span className="w-20">Negative</span>
                <div className="flex-1 h-2 rounded-full bg-red-100 dark:bg-red-900 overflow-hidden mx-2">
                  <div className="bg-red-400 h-2 rounded-full" style={{ width: `${analysis.emotion_distribution.negative * 100}%` }} />
                </div>
                <span className="w-12 text-right">{(analysis.emotion_distribution.negative * 100).toFixed(1)}%</span>
              </div>
            </div>
            {/* Key Insights Section */}
            <div className="mt-6 space-y-2">
              <div>
                <span className="font-medium">Dominant Emotion:</span>{' '}
                <Badge className={sentimentColor(analysis.dominant_emotion, isDark)}>
                  {analysis.dominant_emotion.charAt(0).toUpperCase() + analysis.dominant_emotion.slice(1)}
                </Badge>
              </div>
              <div>
                <span className="font-medium">Emotional Intensity:</span>{' '}
                {Math.max(analysis.sentiment_intensity.positive, analysis.sentiment_intensity.neutral, analysis.sentiment_intensity.negative).toFixed(2)}
              </div>
              <div>
                <span className="font-medium">Fetched Comments:</span>{' '}
                {typeof analysis.total_comment_count === 'number' && analysis.total_comments
                  ? `${analysis.total_comments}/${analysis.total_comment_count}`
                  : analysis.total_comments}
              </div>
              <div>
                <span className="font-medium">Top Comment:</span>{' '}
                <span className="italic">{analysis.unique_comment}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Chart Card */}
        <Card>
          <CardHeader>
            <CardTitle>Emotion Distribution</CardTitle>
            <select value={chartTypeOverall} onChange={e => setChartTypeOverall(e.target.value)} className="ml-auto rounded border px-2 py-1 text-sm">
              <option value="radar">Radar</option>
              <option value="pie">Pie</option>
            </select>
          </CardHeader>
          <CardContent>
            {chartTypeOverall === 'radar' ? (
              <RadarChart data={analysis.emotion_distribution} color="#2563eb" />
            ) : (
              <PieChart data={analysis.emotion_distribution} />
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
              <Progress value={analysis.model_confidence.value * 100} className="flex-1 h-3 bg-blue-100 dark:bg-blue-900" style={{ backgroundImage: 'linear-gradient(to right, #3B82F6, #60A5FA)' }} />
              <Badge className={confidenceColor(analysis.model_confidence.label, isDark)}>
                {analysis.model_confidence.label.charAt(0).toUpperCase() + analysis.model_confidence.label.slice(1)}
              </Badge>
              <span className="ml-2 text-sm">{(analysis.model_confidence.value * 100).toFixed(1)}%</span>
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Word Cloud */}
      {analysis.wordcloud && <div className="mt-6"><SentimentWordCloud frequencies={analysis.wordcloud} /></div>}
    </div>
  );
} 