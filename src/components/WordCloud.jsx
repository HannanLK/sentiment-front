import React, { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { WordCloud, AnimatedWordRenderer } from "@isoterik/react-word-cloud"
import "./word-cloud.css"

export function SentimentWordCloud({ words = [], sentimentScores = {} }) {
  const [filter, setFilter] = useState("all")
  const [wordCloudData, setWordCloudData] = useState([])

  useEffect(() => {
    if (!Array.isArray(words) || words.length === 0) {
      setWordCloudData([])
      return
    }

    const filteredWords = words
      .filter((word) => {
        if (!word) return false
        if (filter === "all") return true
        const score = sentimentScores[word] || 0
        if (filter === "positive") return score > 0.3
        if (filter === "negative") return score < -0.3
        if (filter === "neutral") return score >= -0.3 && score <= 0.3
        return true
      })
      .map((word) => ({
        text: word,
        value: Math.random() * 50 + 20, // Random value between 20 and 70 for size variation
        color: getSentimentColor(word),
      }))

    setWordCloudData(filteredWords)
  }, [words, filter, sentimentScores])

  const getSentimentColor = (word) => {
    const score = sentimentScores[word] || 0
    if (score > 0.3) return "#22c55e" // green for positive
    if (score < -0.3) return "#ef4444" // red for negative
    return "#3b82f6" // blue for neutral
  }

  const animatedWordRenderer = (data, ref) => (
    <AnimatedWordRenderer 
      ref={ref} 
      data={data} 
      animationDelay={(_word, index) => index * 50}
      style={{ color: data.color }}
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
        <div className="h-[300px] w-full relative">
          {wordCloudData.length > 0 ? (
            <div className="word-cloud-container">
              <WordCloud 
                words={wordCloudData} 
                width={800} 
                height={300} 
                renderWord={animatedWordRenderer}
                padding={2}
                spiral="archimedean"
                rotate={0}
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