// src/pages/TextSentiment.jsx
"use client"

import React, { useState, useRef, useEffect } from "react"
import { Textarea } from "../components/ui/textarea"
import FileUploadToggle from "../components/FileUploadToggle"
import AnalyzeButton from "../components/AnalyzeButton"
import { GaugeMeter } from "../components/GaugeMeter"
import { PieChart } from "../components/PieChart"
import { RadarChart } from "../components/RadarChart"
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card"
import { ModelConfidence } from "../components/ModelConfidence"

// Simple Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to an error reporting service
    console.error("Caught an error:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <Card className="bg-white dark:bg-[#161616] text-red-500">
          <CardHeader><CardTitle>Error</CardTitle></CardHeader>
          <CardContent>Something went wrong. Please try again.</CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}

export default function TextSentiment() {
  const [text, setText]             = useState("")
  const [clearFile, setClearFile]   = useState(false)
  const [warningMessage, setWarning] = useState("")
  const [loading, setLoading]       = useState(false)
  const [result, setResult]         = useState(null)
  const [chartsReady, setChartsReady] = useState(false)
  const textareaRef = useRef(null)
  const [chartType, setChartType] = useState('pie'); // 'pie' or 'radar'

  const handleAnalyze = () => {
    const trimmed = text.trim()
    if (!trimmed || trimmed.split(/\s+/).length < 3) {
      setWarning("Please enter at least 3 words to analyze")
      return setTimeout(() => setWarning(""), 3000)
    }

    setLoading(true)
    setChartsReady(false)
    setResult(null)
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
      setTimeout(() => {
        setChartsReady(true)
      }, 100)
    }, 1000)
  }

  const handleClear = () => {
    setText("")
    setResult(null)
    setChartsReady(false)
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
      <section className="w-4/5 mx-auto py-8">
        {/* Main two-column layout */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 items-start">
          {/* Left Column: Sentiment Score and Confidence Level */}
          <div className="grid grid-cols-1 gap-6">
            {/* Top Left: Gauge Meter */}
            <ErrorBoundary>
              <GaugeMeter
                id="text-gauge"
                score={result?.score}
                loading={!result}
                className="bg-white dark:bg-[#161616]"
              />
            </ErrorBoundary>

            {/* Bottom Left: Confidence Level */}
            <ErrorBoundary>
              <Card className="bg-white dark:bg-transparent">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">Confidence Level :</CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-2">
                  <div className="w-full mx-auto">
                    {!result ? (
                      <div className="w-full h-3 rounded-full overflow-hidden bg-gray-300 dark:bg-[#444]">
                        <div className="h-full bg-gray-200 dark:bg-[#666] animate-pulse" />
                      </div>
                    ) : (
                      <>
                        <div className="w-full h-3 rounded-full overflow-hidden bg-gray-300 dark:bg-[#444]">
                          <div className="h-full bg-blue-500" style={{ width: `${Math.round(result.confidence * 100)}%` }} />
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">{Math.round(result.confidence * 100)}%</div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </ErrorBoundary>
          </div>

          {/* Right Column: Emotions Breakdown Chart */}
          <div className="space-y-6">
            <Card className="bg-white dark:bg-transparent">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-xl font-semibold">
                  Emotions Breakdown
                </CardTitle>
                <div className="relative">
                  <select value={chartType} onChange={(e) => setChartType(e.target.value)} className="appearance-none bg-white dark:bg-[#161616] border border-gray-300 dark:border-zinc-700 rounded-md py-1 pl-2 pr-8 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 cursor-pointer">
                    <option value="pie">Pie Chart</option>
                    <option value="radar">Radar Chart</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 pt-2">
                <ErrorBoundary>
                  {chartType === 'pie' ? (
                    <PieChart
                      id="text-pie"
                      title=""
                      description="Positive / Neutral / Negative"
                      data={result?.distribution && Object.entries(result.distribution).map(
                        ([name, value]) => ({ name, value })
                      )}
                      config={{
                        Positive: { label: "Positive", color: "hsl(142 71% 45%)" }, // Green
                        Neutral:  { label: "Neutral",  color: "hsl(48 96% 45%)" },  // Yellow
                        Negative: { label: "Negative", color: "hsl(0 84% 60%)" }, // Red
                      }}
                      loading={!result}
                      className="bg-white dark:bg-[#161616]"
                    />
                  ) : (
                    <RadarChart
                      id="text-radar"
                      title=""
                      description="Positive / Neutral / Negative"
                      data={result?.radar}
                      angleKey="sentiment"
                      dataKey="count"
                      config={{
                        Positive: { label: "Positive", color: "hsl(220 70% 50%)" }, // Blue
                        Neutral:  { label: "Neutral",  color: "hsl(48 96% 45%)" }, // Yellow
                        Negative: { label: "Negative", color: "hsl(0 84% 60%)" }, // Red
                      }}
                      loading={!result}
                      className="bg-white dark:bg-[#161616] pb-0"
                    />
                  )}
                </ErrorBoundary>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
