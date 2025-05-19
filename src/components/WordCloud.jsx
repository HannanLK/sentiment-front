import React, { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import "./word-cloud.css"

export function WordCloud({ words = [], sentimentScores = {} }) {
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
        size: Math.random() * 2 + 1, // Random size between 1 and 3
        color: getSentimentColor(word),
      }))

    setWordCloudData(filteredWords)
  }, [words, filter, sentimentScores])

  const getSentimentColor = (word) => {
    const score = sentimentScores[word] || 0
    if (score > 0.3) return "text-green-500" // positive
    if (score < -0.3) return "text-red-500" // negative
    return "text-blue-500" // neutral
  }

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
              {wordCloudData.map((word, index) => (
                <span
                  key={index}
                  className={`absolute ${word.color} transition-all duration-300 hover:scale-110 cursor-pointer`}
                  style={{
                    fontSize: `${word.size}rem`,
                    left: `${Math.random() * 80}%`,
                    top: `${Math.random() * 80}%`,
                    transform: `rotate(${Math.random() * 360}deg)`,
                  }}
                  title={`Sentiment: ${sentimentScores[word.text]?.toFixed(2) || 0}`}
                >
                  {word.text}
                </span>
              ))}
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