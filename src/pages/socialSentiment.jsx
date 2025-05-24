import React, { useState } from 'react';
import LinkInput from '@/components/LinkInput';
import WelcomeMessage from '@/components/WelcomeMessage';
import SentimentDashboard from '@/components/SentimentDashboard';
import { Skeleton } from '@/components/ui/skeleton';

function SocialSentiment() {
  const [embedData, setEmbedData] = useState(null); // { html, error, platform, link }
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Called by LinkInput when a valid embed is fetched or cleared
  const handleEmbedChange = (embed) => {
    setEmbedData(embed);
    setAnalysis(null);
    setError(null);
  };

  // Called on Analyze click
  const handleAnalyze = async () => {
    if (!embedData || !embedData.platform || !embedData.link) return;
    setLoading(true);
    setAnalysis(null);
    setError(null);
    // Show skeletons for 2s
    setTimeout(async () => {
      try {
        let apiUrl = '';
        if (embedData.platform === 'YouTube') {
          const videoId = embedData.link.match(/([\w-]{11})(?:[&?]|$)/)?.[1];
          apiUrl = `/api/v1/analyze/youtube?video_id=${videoId}`;
        } else if (embedData.platform === 'Twitter') {
          const tweetId = embedData.link.match(/status\/(\d+)/)?.[1];
          apiUrl = `/api/v1/analyze/twitter?tweet_id=${tweetId}`;
        } else if (embedData.platform === 'Reddit') {
          const postId = embedData.link.match(/comments\/([\w]+)/)?.[1];
          apiUrl = `/api/v1/analyze/reddit?post_id=${postId}`;
        }
        if (!apiUrl) throw new Error('Invalid link');
        const res = await fetch(apiUrl);
        let data = null;
        try {
          data = await res.json();
        } catch (jsonErr) {
          // If not JSON, fallback to text
          data = { error: await res.text() };
        }
        if (!res.ok) {
          // Try to extract error message from backend
          const backendError = data?.detail || data?.error || 'Failed to analyze.';
          setError(backendError);
        } else if (data.error) {
          setError(data.error);
        } else {
          setAnalysis(data);
        }
      } catch (err) {
        setError(err.message || 'Failed to analyze.');
      } finally {
        setLoading(false);
      }
    }, 2000);
  };

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Link Input Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4 dark:text-gray-200">What's the vibe? Enter a link to analyze…</h3>
          <LinkInput onEmbedChange={handleEmbedChange} onAnalyze={handleAnalyze} />
        </div>

        {/* Content Area */}
        {!embedData || embedData.error ? (
          <WelcomeMessage />
        ) : loading ? (
          <Skeleton className="h-[400px] w-full rounded-xl" />
        ) : error ? (
          <div className="text-red-500 text-lg font-semibold p-6">{error}</div>
        ) : analysis ? (
          <SentimentDashboard analysis={analysis} platform={embedData.platform} />
        ) : null}
      </div>
    </div>
  );
}

export default SocialSentiment;
