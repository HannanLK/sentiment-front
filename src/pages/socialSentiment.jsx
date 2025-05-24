import React, { useState, useRef, useEffect } from 'react';
import LinkInput from '@/components/LinkInput';
import WelcomeMessage from '@/components/WelcomeMessage';
import SentimentDashboard from '@/components/SentimentDashboard';
import AnimatedLoader from '@/components/ui/AnimatedLoader';
import { useToast } from '@/components/ui/use-toast';
import { useAnalysis } from '@/context/AnalysisContext';

function SocialSentiment() {
  const [embedData, setEmbedData] = useState(null); // { html, error, platform, link }
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiReady, setApiReady] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const dashboardRef = useRef(null);
  const { toast } = useToast();
  const { analysis, setAnalysis } = useAnalysis();

  // Load analysis from localStorage on mount and set context
  useEffect(() => {
    const saved = localStorage.getItem('socialSentimentAnalysis');
    if (saved) {
      setAnalysis(JSON.parse(saved));
    }
  }, [setAnalysis]);

  // Save analysis to localStorage whenever it changes
  useEffect(() => {
    if (analysis) {
      localStorage.setItem('socialSentimentAnalysis', JSON.stringify(analysis));
    }
  }, [analysis]);

  // Only clear analysis from localStorage when link is removed or on refresh
  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.removeItem('socialSentimentAnalysis');
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  // Called by LinkInput when a valid embed is fetched or cleared
  const handleEmbedChange = (embed) => {
    setEmbedData(embed);
    setAnalysis(null);
    setError(null);
    setApiReady(false);
    setShowDashboard(false);
    setLoading(false); // Ensure loader is not shown on link entry
    localStorage.removeItem('socialSentimentAnalysis');
  };

  // Called on Analyze click
  const handleAnalyze = async () => {
    if (!embedData || !embedData.platform || !embedData.link) return;
    setLoading(true);
    setAnalysis(null);
    setError(null);
    setApiReady(false);
    setShowDashboard(false);
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
    if (!apiUrl) {
      setError('Invalid link');
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(apiUrl);
      let data = null;
      try {
        data = await res.json();
      } catch (jsonErr) {
        data = { error: await res.text() };
      }
      console.log('API response:', data);
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
      setApiReady(true);
    } catch (err) {
      setError(err.message || 'Failed to analyze.');
      setApiReady(true);
    } finally {
      setLoading(false);
      setTimeout(() => {
        console.log('State after analyze:', {
          analysis,
          loading,
          error,
          showDashboard
        });
      }, 100);
    }
  };

  // Show dashboard only when loader and API are both ready
  const handleLoaderDone = () => {
    setShowDashboard(true);
  };

  // Ensure dashboard shows when both apiReady and analysis are set
  useEffect(() => {
    if (apiReady && analysis) {
      setShowDashboard(true);
    }
  }, [apiReady, analysis]);

  // Scroll to loader or dashboard when loading or dashboard is set
  useEffect(() => {
    if ((loading || showDashboard) && dashboardRef.current) {
      dashboardRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [loading, showDashboard]);

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
          {/* Only show WelcomeMessage or embed preview after link entry, not loader/analysis */}
          {!embedData || embedData.error ? (
            <WelcomeMessage />
          ) : loading || (!showDashboard && !error && !analysis) ? (
            loading ? (
              <AnimatedLoader ready={apiReady} onDone={handleLoaderDone} minWait={5000} />
            ) : null
          ) : error ? (
            <div className="text-red-500 text-lg font-semibold p-6">{error}</div>
          ) : showDashboard && analysis ? (
            <SentimentDashboard analysis={analysis} platform={embedData.platform} />
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default SocialSentiment;
