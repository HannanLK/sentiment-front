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
        if (filter === "positive") return score > 0.1  // Lower threshold for positive
        if (filter === "negative") return score < -0.1  // Lower threshold for negative
        if (filter === "neutral") return score >= -0.1 && score <= 0.1  // Narrower neutral range
        return true
      })
      .map((word) => ({
        text: word,
        value: Math.random() * 2000 + 1000, // Random value between 1000 and 3000 for larger size variation
        color: getSentimentColor(word),
      }))

    setWordCloudData(filteredWords)
  }, [words, filter, sentimentScores])

  const getSentimentColor = (word) => {
    const score = sentimentScores[word] || 0
    if (score > 0.2) return "#22c55e" // green for positive
    if (score < -0.2) return "#ef4444" // red for negative
    return "#3b82f6" // blue for neutral
  }

  const getFontSize = (word) => {
    // Calculate font size based on word value, with a minimum of 20px and maximum of 80px
    return Math.min(Math.max(Math.sqrt(word.value) * 2, 20), 80)
  }

  const getFontWeight = (word) => {
    // Make larger words bolder
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
          {wordCloudData.length > 0 ? (
            <div className="word-cloud-container">
              <WordCloud 
                words={wordCloudData} 
                width={1000} 
                height={350} 
                renderWord={animatedWordRenderer}
                padding={2}
                spiral="archimedean"
                rotate={() => 0}
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