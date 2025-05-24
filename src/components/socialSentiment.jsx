import React, { useState } from 'react';

const SocialSentiment = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const fetchSentimentData = async () => {
    try {
      const response = await fetch('/api/sentiment');
      if (!response.ok) {
        throw new Error('Failed to fetch sentiment data');
      }
      const data = await response.json();
      setData(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      setData(null);
    }
  };

  return (
    <div>
      {error && <div style={{color: 'red'}}>Error: {error}</div>}
    </div>
  );
};

export default SocialSentiment; 