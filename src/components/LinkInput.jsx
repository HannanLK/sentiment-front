import React, { useState, useEffect, useRef } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import PlatformDropdown from "./PlatformDropdown";
import { Card, CardContent } from '@/components/ui/card';
import { BsFillLightningChargeFill } from "react-icons/bs";

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
  const [platform, setPlatform] = useState(''); // '' means auto-detect
  const [embedHtml, setEmbedHtml] = useState(null);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const debounceRef = useRef();
  const [loading, setLoading] = useState(false);
  const [userSelectedPlatform, setUserSelectedPlatform] = useState(false);

  // Handle link input change
  const handleLinkChange = (e) => {
    const newLink = e.target.value;
    setLink(newLink);
    setError(null);
    setEmbedHtml(null);
    setExpanded(false);
    setUserSelectedPlatform(false); // Reset to auto-detect on new input
  };

  // Handle platform dropdown change
  const handlePlatformChange = (val) => {
    setPlatform(val);
    setUserSelectedPlatform(true);
    setError(null);
    setEmbedHtml(null);
    setExpanded(false);
  };

  // Auto-detect platform from link if user hasn't manually selected
  useEffect(() => {
    if (!userSelectedPlatform) {
      const detected = getPlatform(link) || '';
      setPlatform(detected);
    }
  }, [link, userSelectedPlatform]);

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
      setLoading(true);
      let detected = platform || getPlatform(link);
      if (platform === '') detected = getPlatform(link); // auto-detect
      if (!detected) {
        setError('Unsupported or invalid link');
        setEmbedHtml(null);
        setExpanded(false);
        setLoading(false);
        onEmbedChange && onEmbedChange({ error: 'Unsupported or invalid link', link });
        return;
      }
      setError(null);
      if (detected === 'YouTube') {
        const videoId = getYouTubeId(link);
        if (videoId) {
          setEmbedHtml(`<div style="max-width:700px;width:100%;aspect-ratio:16/9;display:flex;justify-content:center;"><iframe src=\"https://www.youtube.com/embed/${videoId}\" frameborder=\"0\" allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;border-radius:12px;\"></iframe></div>`);
          setExpanded(true);
          setLoading(false);
          onEmbedChange && onEmbedChange({ html: 'YouTube', platform: 'YouTube', link });
        } else {
          setError('Invalid YouTube link');
          setEmbedHtml(null);
          setExpanded(false);
          setLoading(false);
          onEmbedChange && onEmbedChange({ error: 'Invalid YouTube link', link });
        }
        return;
      }
      // Twitter/Reddit: fetch oEmbed from backend
      const apiUrl = `/api/v1/embed/${detected.toLowerCase()}?url=${encodeURIComponent(link)}`;
      try {
        const res = await fetch(apiUrl);
        if (!res.ok) throw new Error('Failed to fetch embed');
        const data = await res.json();
        if (data && data.html) {
          setEmbedHtml(data.html);
          setExpanded(true);
          setLoading(false);
          onEmbedChange && onEmbedChange({ html: data.html, platform: detected, link });
        } else {
          setError('No embed HTML returned');
          setEmbedHtml(null);
          setExpanded(false);
          setLoading(false);
          onEmbedChange && onEmbedChange({ error: 'No embed HTML returned', link });
        }
      } catch (err) {
        setError('Failed to fetch embed');
        setEmbedHtml(null);
        setExpanded(false);
        setLoading(false);
        onEmbedChange && onEmbedChange({ error: 'Failed to fetch embed', link });
      }
    }, 500);
    return () => clearTimeout(debounceRef.current);
    // eslint-disable-next-line
  }, [link, platform]);

  // Twitter widgets script loader (for blockquote)
  useEffect(() => {
    if ((platform === 'Twitter' || getPlatform(link) === 'Twitter') && embedHtml) {
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
  }, [platform, embedHtml, link]);

  // Reddit widgets script loader (for blockquote)
  useEffect(() => {
    if ((platform === 'Reddit' || getPlatform(link) === 'Reddit') && embedHtml) {
      if (!document.getElementById('reddit-embed-script')) {
        const script = document.createElement('script');
        script.src = 'https://embed.reddit.com/widgets.js';
        script.async = true;
        script.id = 'reddit-embed-script';
        script.charset = 'UTF-8';
        document.body.appendChild(script);
      } else if (window.reddit && window.reddit.init) {
        window.reddit.init();
      }
    }
  }, [platform, embedHtml, link]);

  // Expand/collapse card on valid/invalid
  useEffect(() => {
    if (!link || error) setExpanded(false);
  }, [link, error]);

  return (
    <div className="flex flex-col w-full">
      {/* Responsive input+dropdown+button group */}
      <div className="flex flex-col sm:flex-row w-full gap-2 sm:gap-3 items-stretch">
        <div className="flex flex-row w-full relative">
          <Input
            type="url"
            placeholder="Enter a Reddit, Twitter, or YouTube link..."
            value={link}
            onChange={handleLinkChange}
            className="flex-grow dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 pr-28"
            autoFocus
            aria-label="Social link input"
          />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10">
            <PlatformDropdown value={platform} onChange={handlePlatformChange} />
          </div>
        </div>
        {/* Analyze button: inline on desktop, full-width below on mobile */}
        <Button
          type="button"
          className="sm:ml-2 mt-2 sm:mt-0 w-full sm:w-auto h-10 px-4 font-semibold text-lg tracking-wider flex items-center justify-center"
          onClick={() => {
            // Optionally trigger analysis here
            // You may want to lift state up for actual analysis
          }}
          disabled={!link || !!error || loading}
        >
          <BsFillLightningChargeFill className="text-blue-500 size-5 mr-2" />
          Analyze
        </Button>
      </div>
      {/* Error message */}
      {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
      {/* Embed Card (expandable) */}
      {expanded && embedHtml && !error && (
        <Card className="mt-4 dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="pt-6 flex justify-center items-center">
            {/* Render HTML for Twitter/Reddit, or styled iframe for YouTube */}
            <span
              style={platform === 'YouTube' ? { maxWidth: 700, width: '100%', aspectRatio: '16/9', display: 'flex', justifyContent: 'center' } : { width: '100%', display: 'flex', justifyContent: 'center' }}
              dangerouslySetInnerHTML={{ __html: embedHtml }}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LinkInput; 