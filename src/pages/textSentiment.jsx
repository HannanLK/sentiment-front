// src/pages/TextSentiment.jsx
"use client"

import { useState, useRef } from "react"
import { Textarea } from "../components/ui/textarea"
import FileUploadToggle from "../components/FileUploadToggle"
import AnalyzeButton from "../components/AnalyzeButton"
import { GaugeMeter } from "../components/GaugeMeter"
import { PieChart }   from "../components/PieChart"
import { RadarChart } from "../components/RadarChart"

export default function TextSentiment() {
  const [text, setText]             = useState("")
  const [clearFile, setClearFile]   = useState(false)
  const [warningMessage, setWarning] = useState("")
  const [loading, setLoading]       = useState(false)
  const [result, setResult]         = useState(null)
  const textareaRef = useRef(null)

  const handleAnalyze = () => {
    const trimmed = text.trim()
    if (!trimmed || trimmed.split(/\s+/).length < 3) {
      setWarning("Please enter at least 3 words to analyze")
      return setTimeout(() => setWarning(""), 3000)
    }

    setLoading(true)
    // 💡 replace this with your real API call
    setTimeout(() => {
      setResult({
        score:      76,
        confidence: 0.82,
        distribution: { Positive: 45, Neutral: 30, Negative: 25 },
        radar: [
          { sentiment: "Positive", count: 45 },
          { sentiment: "Neutral",  count: 30 },
          { sentiment: "Negative", count: 25 },
        ],
      })
      setLoading(false)
    }, 1000)
  }

  const handleClear = () => {
    setText("")
    setResult(null)
    setClearFile(true)
    setTimeout(() => setClearFile(false), 100)
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a1124] transition-colors">
      {/* Input Section */}
      <div className="w-4/5 mx-auto py-8">
        <h2 className="text-3xl mb-5 font-light text-gray-800 dark:text-white">
          What's the vibe? Enter text to reveal its sentiment…
        </h2>
        <div className="rounded-lg border border-gray-200 dark:border-zinc-700 shadow-md">
          <Textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste something…"
            className="w-full h-48 bg-transparent text-gray-800 dark:text-white p-4 focus:outline-none dark:bg-[#161616dc]"
          />
          <div className="flex justify-between items-center border-t border-gray-200 dark:border-zinc-700 bg-gray-100 dark:bg-[#232323e2] p-3 rounded-b-lg">
            <FileUploadToggle onFileSelect={(f) => {
              const r = new FileReader()
              r.onload = (e) => setText(e.target.result)
              r.readAsText(f)
            }} clearFileName={clearFile} />

            <div className="flex items-center space-x-2">
              <AnalyzeButton
                onClick={handleAnalyze}
                disabled={loading}
                className="px-4 h-8 border border-black dark:border-blue-500 text-black dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-blue-800"
              >
                {loading ? "Analyzing…" : "Analyze"}
              </AnalyzeButton>

              <button
                onClick={handleClear}
                className="h-8 w-8 flex items-center justify-center text-black dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 rounded"
                title="Clear text"
              >
                {/* your trash icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none" viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M10 7V4h4v3"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
        {warningMessage && (
          <p className="mt-2 text-red-600 dark:text-red-400">{warningMessage}</p>
        )}
      </div>

      {/* Results Section */}
      {result && (
        <section className="w-4/5 mx-auto py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left column: Gauge + Confidence */}
            <GaugeMeter
              id="text-gauge"
              score={result.score}
              confidence={result.confidence}
              loading={loading}
              className="bg-white dark:bg-[#161616]"
            />

            {/* Right column: Pie then Radar */}
            <div className="space-y-6">
              <PieChart
                id="text-pie"
                title="Emotions Breakdown"
                description="Positive / Neutral / Negative"
                data={Object.entries(result.distribution).map(
                  ([name, value]) => ({ name, value })
                )}
                config={{
                  Positive: { label: "Positive", color: "hsl(var(--chart-1))" },
                  Neutral:  { label: "Neutral",  color: "hsl(var(--chart-2))" },
                  Negative: { label: "Negative", color: "hsl(var(--chart-3))" },
                }}
                loading={loading}
                className="bg-white dark:bg-[#161616]"
              />

              <RadarChart
                id="text-radar"
                title="Sentiment Breakdown"
                description="Positive / Neutral / Negative"
                data={result.radar}
                angleKey="sentiment"
                dataKey="count"
                config={{
                  Positive: { label: "Positive", color: "hsl(var(--chart-1))" },
                  Neutral:  { label: "Neutral",  color: "hsl(var(--chart-2))" },
                  Negative: { label: "Negative", color: "hsl(var(--chart-3))" },
                }}
                loading={loading}
                className="bg-white dark:bg-[#161616]"
              />
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
