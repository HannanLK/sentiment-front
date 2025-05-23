import React, { useState, useEffect, useRef } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import PlatformDropdown from "./PlatformDropdown";
import { Card, CardContent } from '@/components/ui/card';

const PLATFORM_REGEX = {
  Twitter: /https?:\/\/(twitter\.com|x\.com)\/[^\/]+\/status\/\d+/i,
  Reddit: /https?:\/\/www\.reddit\.com\/r\/[^\/]+\/comments\/[^\/]+/i,
  YouTube: /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([\w-]+)/i,
};

const getPlatform = (url) => {
  if (!url) return null;
  if (PLATFORM_REGEX.Twitter.test(url)) return 'Twitter';
  if (PLATFORM_REGEX.Reddit.test(url)) return 'Reddit';
  if (PLATFORM_REGEX.YouTube.test(url)) return 'YouTube';
  return null;
};

const getYouTubeId = (url) => {
  const match = url.match(PLATFORM_REGEX.YouTube);
  return match ? match[1] : null;
};

const LinkInput = ({ onEmbedChange }) => {
  const [link, setLink] = useState('');
  const [platform, setPlatform] = useState(null);
  const [embedHtml, setEmbedHtml] = useState(null);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const debounceRef = useRef();

  // Always show dropdown, highlight detected
  const handleLinkChange = (e) => {
    const newLink = e.target.value;
    setLink(newLink);
    setError(null);
    setEmbedHtml(null);
    setPlatform(getPlatform(newLink));
    setExpanded(false);
  };

  // Debounce input and fetch embed
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!link) {
      setEmbedHtml(null);
      setError(null);
      setExpanded(false);
      onEmbedChange && onEmbedChange(null);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      const detected = getPlatform(link);
      setPlatform(detected);
      if (!detected) {
        setError('Unsupported or invalid link');
        setEmbedHtml(null);
        setExpanded(false);
        onEmbedChange && onEmbedChange({ error: 'Unsupported or invalid link', link });
        console.log('[Embed Fetch] Error: Unsupported link');
        return;
      }
      setError(null);
      if (detected === 'YouTube') {
        const videoId = getYouTubeId(link);
        if (videoId) {
          setEmbedHtml(`<iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="width:100%;max-width:700px;"></iframe>`);
          setExpanded(true);
          onEmbedChange && onEmbedChange({ html: 'YouTube', platform: 'YouTube', link });
          console.log('[Embed Fetch] YouTube videoId:', videoId);
        } else {
          setError('Invalid YouTube link');
          setEmbedHtml(null);
          setExpanded(false);
          onEmbedChange && onEmbedChange({ error: 'Invalid YouTube link', link });
          console.log('[Embed Fetch] Error: Invalid YouTube link');
        }
        return;
      }
      // Twitter/Reddit: fetch oEmbed from backend
      const apiUrl = `/api/v1/embed/${detected.toLowerCase()}?url=${encodeURIComponent(link)}`;
      console.log('[Embed Fetch] GET', apiUrl);
      try {
        const res = await fetch(apiUrl);
        console.log('[Embed Fetch] Received', res.status);
        if (!res.ok) throw new Error('Failed to fetch embed');
        const data = await res.json();
        if (data && data.html) {
          setEmbedHtml(data.html);
          setExpanded(true);
          onEmbedChange && onEmbedChange({ html: data.html, platform: detected, link });
          console.log('[Embed Fetch] HTML:', data.html.slice(0, 80) + '...');
        } else {
          setError('No embed HTML returned');
          setEmbedHtml(null);
          setExpanded(false);
          onEmbedChange && onEmbedChange({ error: 'No embed HTML returned', link });
          console.log('[Embed Fetch] Error: No embed HTML returned');
        }
      } catch (err) {
        setError('Failed to fetch embed');
        setEmbedHtml(null);
        setExpanded(false);
        onEmbedChange && onEmbedChange({ error: 'Failed to fetch embed', link });
        console.log('[Embed Fetch] Error:', err);
      }
    }, 500);
    return () => clearTimeout(debounceRef.current);
    // eslint-disable-next-line
  }, [link]);

  // Twitter widgets script loader (for blockquote)
  useEffect(() => {
    if (platform === 'Twitter' && embedHtml) {
      if (!document.getElementById('twitter-widgets-script')) {
        const script = document.createElement('script');
        script.src = 'https://platform.twitter.com/widgets.js';
        script.async = true;
        script.id = 'twitter-widgets-script';
        document.body.appendChild(script);
      } else if (window.twttr && window.twttr.widgets) {
        window.twttr.widgets.load();
      }
    }
  }, [platform, embedHtml]);

  // Expand/collapse card on valid/invalid
  useEffect(() => {
    if (!link || error) setExpanded(false);
  }, [link, error]);

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 w-full">
        <div className="flex-grow flex items-center w-full relative">
          <Input
            type="url"
            placeholder="Enter a Reddit, Twitter, or YouTube link..."
            value={link}
            onChange={handleLinkChange}
            className="flex-grow dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 pr-24"
            autoFocus
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <PlatformDropdown platform={platform} alwaysVisible link={link} />
          </div>
        </div>
      </div>
      {/* Error message */}
      {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
      {/* Embed Card (expandable) */}
      {expanded && embedHtml && !error && (
        <Card className="mt-4 dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="pt-6 flex justify-center">
            {/* Render HTML for Twitter/Reddit, or iframe for YouTube */}
            {platform === 'YouTube' ? (
              <span dangerouslySetInnerHTML={{ __html: embedHtml }} />
            ) : (
              <span dangerouslySetInnerHTML={{ __html: embedHtml }} />
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LinkInput; 