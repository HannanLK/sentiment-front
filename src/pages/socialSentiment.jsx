import React, { useState } from 'react';
import LinkInput from '@/components/LinkInput';
import WelcomeMessage from '@/components/WelcomeMessage';

function SocialSentiment() {
  const [embedData, setEmbedData] = useState(null); // { html, error, platform, link }

  // Called by LinkInput when a valid embed is fetched or cleared
  const handleEmbedChange = (embed) => {
    setEmbedData(embed);
  };

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Link Input Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4 dark:text-gray-200">What's the vibe? Enter a link to analyze…</h3>
          <LinkInput onEmbedChange={handleEmbedChange} />
        </div>

        {/* Content Area - Welcome Message or Embed Preview */}
        {!embedData || embedData.error ? (
          <WelcomeMessage />
        ) : (
          // Embed preview is now handled inside LinkInput, so nothing here
          null
        )}
      </div>
    </div>
  );
}

export default SocialSentiment;
