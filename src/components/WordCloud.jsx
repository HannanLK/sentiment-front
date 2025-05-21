import React, { useState, useMemo } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { WordCloud, AnimatedWordRenderer } from "@isoterik/react-word-cloud"
import "./word-cloud.css"

// Move getSentimentColor to the top
function getSentimentColor(score) {
  if (score > 0.2) return "#22c55e" // green for positive
  if (score < -0.2) return "#ef4444" // red for negative
  return "#3b82f6" // blue for neutral
}

export function SentimentWordCloud({
  words = [],
  frequencies = {},
  sentimentScores = {}
}) {
  const [filter, setFilter] = useState('all')
  console.log('WordCloud received props:', {
    wordsCount: words?.length || 0,
    frequenciesCount: Object.keys(frequencies || {}).length,
    sentimentScoresCount: Object.keys(sentimentScores || {}).length,
    filter
  })

  const cloudData = useMemo(() => {
    // Combine words from both sources and ensure uniqueness
    const combined = Array.from(new Set([
      ...(words || []),
      ...Object.keys(frequencies || {})
    ]))
    console.log('Combined unique words:', combined.length)

    if (!combined.length) {
      console.log('No words to display')
      return []
    }

    // Filter words based on sentiment
    const filtered = combined.filter(w => {
      if (filter === 'all') return true
      const score = sentimentScores[w] ?? 0
      return filter === 'positive' ? score > 0
           : filter === 'negative' ? score < 0
           : true
    })
    console.log('Filtered words:', filtered.length)

    // Map to cloud data format
    const data = filtered.map(w => ({
      text: w,
      value: frequencies[w] ?? 1,
      color: getSentimentColor(sentimentScores[w] ?? 0)
    }))
    console.log('Cloud data points:', data.length)
    return data
  }, [words, frequencies, sentimentScores, filter])

  console.log('cloudData:', cloudData)

  const getFontSize = (word) => {
    if (!cloudData.length) return 15
    const vals = cloudData.map(w => w.value)
    const min = Math.min(...vals)
    const max = Math.max(...vals)
    const norm = max === min ? 0.5 : (word.value - min) / (max - min)
    return 15 + norm * 55
  }

  const getFontWeight = (word) => {
    const size = getFontSize(word)
    if (size > 60) return "700"
    if (size > 40) return "600"
    return "500"
  }

  const animatedWordRenderer = (data, ref) => (
    <AnimatedWordRenderer 
      ref={ref} 
      data={data} 
      animationDelay={(_word, index) => index * 50}
      style={{ 
        color: data.color,
        fontFamily: "Roboto, sans-serif",
        fontSize: `${getFontSize(data)}px`,
        fontWeight: getFontWeight(data)
      }}
    />
  )

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Word Cloud</CardTitle>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by sentiment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Words</SelectItem>
              <SelectItem value="positive">Positive</SelectItem>
              <SelectItem value="neutral">Neutral</SelectItem>
              <SelectItem value="negative">Negative</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full relative">
          {cloudData.length > 0 ? (
            <div className="word-cloud-container">
              <WordCloud 
                words={cloudData} 
                width={1000} 
                height={350} 
                renderWord={animatedWordRenderer}
                padding={1}
                spiral="rectangular"
                rotate={() => (Math.random() > 0.5 ? 0 : 90)}
                font="Roboto, sans-serif"
                fontSize={getFontSize}
                fontWeight={getFontWeight}
              />
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              No words to display
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 