import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import PlatformDropdown from "./PlatformDropdown";

const LinkInput = ({ onAnalyze }) => {
  const [link, setLink] = useState('');
  const [platform, setPlatform] = useState(null); // State to hold detected platform

  // Basic platform detection (can be improved)
  const detectPlatform = (url) => {
    if (!url) return null;
    if (url.includes('reddit.com')) return 'Reddit';
    if (url.includes('twitter.com') || url.includes('x.com')) return 'Twitter';
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'YouTube';
    return null;
  };

  const handleLinkChange = (e) => {
    const newLink = e.target.value;
    setLink(newLink);
    setPlatform(detectPlatform(newLink));
  };

  const handleAnalyzeClick = () => {
    if (link && platform) {
      onAnalyze({ link, platform });
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 w-full">
      <div className="flex-grow flex items-center w-full relative">
        {/* Added relative positioning here */}
        <Input
          type="url"
          placeholder="Enter a Reddit, Twitter, or YouTube link..."
          value={link}
          onChange={handleLinkChange}
          className="flex-grow dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 pr-24" // Added padding-right to make space for dropdown
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
           <PlatformDropdown platform={platform} /> {/* Render PlatformDropdown here */}
        </div>
      </div>
      <Button onClick={handleAnalyzeClick} disabled={!link || !platform} className="w-full sm:w-auto dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-white">
        Analyze
      </Button>
    </div>
  );
};

export default LinkInput; 