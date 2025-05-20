// src/pages/TextSentiment.jsx
"use client"

import React, { useState, useRef, useEffect } from "react"
import { Textarea } from "../components/ui/textarea"
import FileUploadToggle from "../components/FileUploadToggle"
import AnalyzeButton from "../components/AnalyzeButton"
import { PieChart } from "../components/PieChart"
import { RadarChart } from "../components/RadarChart"
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card"
import { ModelConfidence } from "../components/ModelConfidence"
import { FaRegTrashAlt } from "react-icons/fa"
import { Button } from "../components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, AlertCircle, FileText, Trash2, BarChart2, Sparkles } from "lucide-react"
import { api } from "@/lib/api"
import { EmotionsDistribution } from "../components/EmotionsDistribution"
import { SentimentWordCloud } from "../components/WordCloud"
import { TextStyleEnhancement } from "../components/TextStyleEnhancement"

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

// Welcome Message Component
const WelcomeMessage = () => (
  <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-none">
    <CardContent className="pt-6">
      <div className="space-y-4 text-center">
        <h2 className="text-2xl font-semibold tracking-wider bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Welcome to <span className="font-logo font-bold">VibeCheck</span>
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Unlock the power of AI-driven text analysis. Discover sentiment, emotions, and key insights from your text in seconds.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-500 dark:text-gray-400">
          <div className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <span className="font-semibold">SENTIMENT ANALYSIS</span>
            <p>Understand the emotional tone of your text</p>
          </div>
          <div className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <span className="font-semibold">EMOTION DETECTION</span>
            <p>Identify specific emotions in your content</p>
          </div>
          <div className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <span className="font-semibold">KEY INSIGHTS</span>
            <p>Get valuable insights and word cloud visualization</p>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
)

export default function TextSentiment() {
  const [text, setText] = useState(() => {
    // Initialize text from localStorage if available
    const savedText = localStorage.getItem('vibeCheckText')
    return savedText || ""
  })
  const [clearFile, setClearFile] = useState(false)
  const [warningMessage, setWarning] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [chartsReady, setChartsReady] = useState(false)
  const textareaRef = useRef(null)
  const [chartType, setChartType] = useState('pie')
  const [analysis, setAnalysis] = useState(null)
  const [error, setError] = useState(null)
  const { toast } = useToast()

  // Save text to localStorage whenever it changes
  useEffect(() => {
    if (text) {
      localStorage.setItem('vibeCheckText', text)
    }
  }, [text])

  const handleAnalyze = async () => {
    if (!text.trim()) {
      toast({
        title: "Error",
        description: "Please enter some text to analyze",
        variant: "destructive"
      })
      return
    }

    if (text.split(/\s+/).length < 3) {
      toast({
        title: "Warning",
        description: "Please enter at least 3 words for better analysis",
        variant: "destructive"
      })
      return
    }

    setLoading(true)
    setChartsReady(false)
    setResult(null)
    setError(null)
    setAnalysis(null) // Clear previous analysis

    try {
      const response = await api.post("/text/analyze", { text: text })
      console.log("TextSentiment - Full Analysis response:", JSON.stringify(response.data, null, 2))
      
      // Create analysis object with all required fields
      const analysisData = {
        ...response.data,
        confidence_score: response.data.confidence_score ?? 0
      }
      
      // Add artificial delay for skeleton effect
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setAnalysis(analysisData)
      setResult(analysisData)
      toast({
        title: "Success",
        description: "Text analyzed successfully",
      })
    } catch (error) {
      console.error("Error analyzing text:", error)
      const errorMessage = error.response?.data?.detail || "Failed to analyze text. Please try again."
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      })
    } finally {
      setLoading(false)
      setTimeout(() => {
        setChartsReady(true)
      }, 100)
    }
  }

  const handleClear = () => {
    setText("")
    setResult(null)
    setAnalysis(null) // Clear analysis when clearing text
    setChartsReady(false)
    setClearFile(true)
    localStorage.removeItem('vibeCheckText') // Remove from localStorage
    setTimeout(() => setClearFile(false), 100)
    if (textareaRef.current) {
      textareaRef.current.focus()
    }
  }

  const handleFileUpload = (file) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      setText(e.target.result)
      toast({
        title: "Success",
        description: "File uploaded successfully",
      })
    }
    reader.onerror = () => {
      toast({
        title: "Error",
        description: "Failed to read file",
        variant: "destructive"
      })
    }
    reader.readAsText(file)
  }

  const getSentimentColor = (score) => {
    if (score > 0.3) return "text-green-500"
    if (score < -0.3) return "text-red-500"
    return "text-yellow-500"
  }

  const getProgressBarColor = (score) => {
    if (score > 0.3) return "linear-gradient(to right, #10B981, #34D399)"; // green gradient
    if (score < -0.3) return "linear-gradient(to right, #EF4444, #F87171)"; // red gradient
    return "linear-gradient(to right, #F59E0B, #FBBF24)"; // yellow gradient
  }

  const getSentimentLabel = (score) => {
    if (score > 0.3) return "Positive"
    if (score < -0.3) return "Negative"
    return "Neutral"
  }

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Text Sentiment Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Textarea
                ref={textareaRef}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type or paste your text here..."
                className="min-h-[200px] resize-none font-roboto text-base"
              />
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="file"
                    accept=".txt,.md,.doc,.docx"
                    onChange={(e) => e.target.files[0] && handleFileUpload(e.target.files[0])}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Upload File
                  </label>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleAnalyze}
                    disabled={loading || !text.trim()}
                    className="flex-1 sm:flex-none"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <BarChart2 className="mr-2 h-4 w-4" />
                        Analyze
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={handleClear}
                    variant="outline"
                    className="flex-1 sm:flex-none"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!analysis && !loading && <WelcomeMessage />}

        {loading ? (
          <div className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="h-4 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
                </div>
              </CardContent>
            </Card>
          </div>
        ) : analysis && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Sentiment Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-sm font-medium">Overall Sentiment</p>
                        <Badge variant={analysis.sentiment_score > 0.3 ? "default" : analysis.sentiment_score < -0.3 ? "destructive" : "secondary"}>
                          {getSentimentLabel(analysis.sentiment_score)}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4">
                        <Progress
                          value={(analysis.sentiment_score + 1) * 50}
                          className="flex-1"
                          style={{ backgroundImage: getProgressBarColor(analysis.sentiment_score) }}
                        />
                        <span className={`font-bold ${getSentimentColor(analysis.sentiment_score)}`}>
                          {analysis.sentiment_score.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Emotion Analysis</h3>
                      {analysis?.emotion_scores && Object.entries(analysis.emotion_scores).map(([emotion, score]) => (
                        <div key={emotion} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="capitalize">{emotion}</span>
                            <span>{(score * 100).toFixed(1)}%</span>
                          </div>
                          <div className="h-2 bg-secondary rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary transition-all duration-500"
                              style={{ width: `${score * 100}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <EmotionsDistribution emotionScores={analysis.emotion_scores} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Key Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium mb-2">Dominant Emotion</p>
                      <Badge variant="secondary" className="capitalize">
                        {Object.entries(analysis.emotion_scores).reduce((a, b) =>
                          a[1] > b[1] ? a : b
                        )[0]}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-2">Emotional Intensity</p>
                      <Badge variant={Object.values(analysis.emotion_scores).reduce((a, b) => a + b, 0) / 
                        Object.keys(analysis.emotion_scores).length > 0.5 ? "default" : "secondary"}>
                        {Object.values(analysis.emotion_scores).reduce((a, b) => a + b, 0) / 
                         Object.keys(analysis.emotion_scores).length > 0.5
                          ? "High"
                          : "Moderate"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <ModelConfidence confidenceScore={analysis?.confidence_score ?? 0} />
            </div>

            <SentimentWordCloud 
              words={analysis?.key_phrases || []} 
              sentimentScores={analysis?.word_sentiment_scores || {}} 
            />

            <TextStyleEnhancement originalText={text} />
          </div>
        )}
      </div>
    </div>
  )
}
