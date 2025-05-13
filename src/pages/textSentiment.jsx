import { useState } from "react";

export default function TextSentiment() {
  const [text, setText] = useState("");
  const [sentiment, setSentiment] = useState(null);

  const analyzeSentiment = () => {
    // Dummy sentiment analysis logic
    const dummySentiment = Math.random() > 0.5 ? "Positive" : "Negative";
    setSentiment(dummySentiment);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Text Sentiment Analysis</h1>
      <textarea
        className="w-full p-4 border border-gray-300 rounded-lg mb-4"
        rows="6"
        placeholder="Enter text to analyze..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        onClick={analyzeSentiment}
      >
        Analyze Sentiment
      </button>
      {sentiment && (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg">
          <p className="text-lg">Sentiment: <span className="font-bold">{sentiment}</span></p>
        </div>
      )}
    </div>
  );
}
