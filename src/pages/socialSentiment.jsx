import React, { useState, useRef, useEffect } from 'react';
import LinkInput from '@/components/LinkInput';
import WelcomeMessage from '@/components/WelcomeMessage';
import SentimentDashboard from '@/components/SentimentDashboard';
import AnimatedLoader from '@/components/ui/AnimatedLoader';
import { useToast } from '@/components/ui/use-toast';

function SocialSentiment() {
  const [embedData, setEmbedData] = useState(null); // { html, error, platform, link }
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dashboardRef = useRef(null);
  const { toast } = useToast();

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
          data = { error: await res.text() };
        }
        if (!res.ok) {
          const backendError = data?.detail || data?.error || 'Failed to analyze.';
          setError(backendError);
        } else if (data.error) {
          if (data.error.toLowerCase().includes('random sample')) {
            toast({ title: 'Info', description: data.error, variant: 'info' });
            setAnalysis(data);
          } else {
            setError(data.error);
          }
        } else {
          setAnalysis(data);
        }
      } catch (err) {
        setError(err.message || 'Failed to analyze.');
      } finally {
        setLoading(false);
      }
    }, 1000);
  };

  // Scroll to loader or dashboard when loading or analysis is set
  useEffect(() => {
    if ((loading || analysis) && dashboardRef.current) {
      dashboardRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [loading, analysis]);

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Link Input Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4 dark:text-gray-200">What's the vibe? Enter a link to analyze…</h3>
          <LinkInput onEmbedChange={handleEmbedChange} onAnalyze={handleAnalyze} />
        </div>

        {/* Content Area */}
        <div ref={dashboardRef}>
          {!embedData || embedData.error ? (
            <WelcomeMessage />
          ) : loading ? (
            <AnimatedLoader />
          ) : error ? (
            <div className="text-red-500 text-lg font-semibold p-6">{error}</div>
          ) : analysis ? (
            <SentimentDashboard analysis={analysis} platform={embedData.platform} />
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default SocialSentiment;
