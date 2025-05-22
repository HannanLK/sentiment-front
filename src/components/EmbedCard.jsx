import React, { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';

const EmbedCard = ({ result }) => {
  const { link, platform } = result;

  useEffect(() => {
    // Load Twitter widgets script if the platform is Twitter
    if (platform === 'Twitter') {
      // Check if the script is already loaded to avoid duplicates
      if (!document.getElementById('twitter-widgets-script')) {
        const script = document.createElement('script');
        script.src = 'https://platform.twitter.com/widgets.js';
        script.async = true;
        script.id = 'twitter-widgets-script';
        document.body.appendChild(script);
      } else {
          // If script is already loaded, just re-render existing tweets
          if (window.twttr && window.twttr.widgets) {
              window.twttr.widgets.load();
          }
      }
    }
  }, [platform]); // Re-run effect if platform changes

  const renderEmbed = () => {
    try {
      switch (platform) {
        case 'Reddit':
          // Basic parsing for Reddit embed URL (e.g., https://www.reddit.com/r/reactjs/comments/1ctt6b6/react_labs_what_weve_been_working_on_february_march/)
          const redditMatch = link.match(/reddit\.com\/r\/([^\/]+)\/comments\/([^\/]+)/);
          if (redditMatch && redditMatch[1] && redditMatch[2]) {
            const subreddit = redditMatch[1];
            const postId = redditMatch[2];
            return (
              <iframe
                src={`https://www.reddit.com/r/${subreddit}/comments/${postId}/embed?depth=1`}
                height="500"
                scrolling="no"
                frameBorder="0"
                sandbox="allow-scripts allow-same-origin allow-popups"
                style={{ width: '100%', maxWidth: '700px' }}
              ></iframe>
            );
          }
          return <p className="text-red-500 dark:text-red-400">Invalid Reddit link format.</p>;

        case 'Twitter':
          // Twitter embed requires a blockquote and their script
          // The script loading is handled in useEffect
          // Need to ensure the link is just the tweet URL for the blockquote
          const twitterMatch = link.match(/(https:\/\/(?:twitter\.com|x\.com)\/[^\/]+\/status\/\d+)/);
          if (twitterMatch && twitterMatch[1]) {
            const tweetUrl = twitterMatch[1];
             return (
                <blockquote className="twitter-tweet" data-theme="dark">
                   <a href={tweetUrl}></a>
                </blockquote>
             );
          }
          return <p className="text-red-500 dark:text-red-400">Invalid Twitter link format.</p>;

        case 'YouTube':
          // Basic parsing for YouTube video ID
          const youtubeMatch = link.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([\w-]+)/);
          if (youtubeMatch && youtubeMatch[1]) {
            const videoId = youtubeMatch[1];
            return (
              <iframe
                width="560"
                height="315"
                src={`https://www.youtube.com/embed/${videoId}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ width: '100%', maxWidth: '700px' }}
              ></iframe>
            );
          }
          return <p className="text-red-500 dark:text-red-400">Invalid YouTube link format.</p>;

        default:
          return <p className="text-red-500 dark:text-red-400">Unsupported platform.</p>;
      }
    } catch (error) {
      console.error("Error rendering embed:", error);
      return <p className="text-red-500 dark:text-red-400">Error loading embed.</p>;
    }
  };

  return (
    <Card className="dark:bg-gray-800 dark:border-gray-700">
      <CardContent className="pt-6 flex justify-center">
        {renderEmbed()}
      </CardContent>
    </Card>
  );
};

export default EmbedCard; 