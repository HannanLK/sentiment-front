import React, { useState } from 'react';
import LinkInput from '@/components/LinkInput';
import WelcomeMessage from '@/components/WelcomeMessage';
import EmbedCard from '@/components/EmbedCard';

function SocialSentiment() {
  const [analysisResult, setAnalysisResult] = useState(null);
  const [linkEntered, setLinkEntered] = useState(false); // State to track if link is entered

  const handleAnalyze = ({ link, platform }) => {
    // In a real application, this would call the backend API
    console.log('Analyzing link:', link, 'for platform:', platform);
    // For now, just simulate a result to show the embed card
    setAnalysisResult({ link, platform });
    setLinkEntered(true); // Set linkEntered to true when analyze is clicked
  };

  const handleLinkInputChange = (link) => {
      // We might not need this if we only hide the welcome message on analyze click
      // setLinkEntered(!!link);
  };

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Link Input Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4 dark:text-gray-200">What's the vibe? Enter a link to analyze…</h3>
          <LinkInput onAnalyze={handleAnalyze} onLinkInputChange={handleLinkInputChange} />
        </div>

        {/* Content Area - Welcome Message or Embed Preview */}
        {!analysisResult ? (
          <WelcomeMessage />
        ) : (
          <EmbedCard result={analysisResult} />
        )}

      </div>
    </div>
  );
}

export default SocialSentiment;
