import React, { createContext, useContext, useState, useEffect } from 'react'

const AnalysisContext = createContext()

export const useAnalysis = () => {
  const context = useContext(AnalysisContext)
  if (!context) {
    throw new Error('useAnalysis must be used within an AnalysisProvider')
  }
  return context
}

export const AnalysisProvider = ({ children }) => {
  const [analysis, setAnalysis] = useState(null)
  const [enhancedText, setEnhancedText] = useState('')
  const [text, setText] = useState('')

  // Load saved data from localStorage on mount
  useEffect(() => {
    const savedAnalysis = localStorage.getItem('analysis')
    const savedEnhancedText = localStorage.getItem('enhancedText')

    if (savedAnalysis) {
      try {
        setAnalysis(JSON.parse(savedAnalysis))
      } catch (error) {
        console.error('Error parsing saved analysis:', error)
        localStorage.removeItem('analysis')
      }
    }

    if (savedEnhancedText) {
      setEnhancedText(savedEnhancedText)
    }
  }, [])

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (analysis) {
      localStorage.setItem('analysis', JSON.stringify(analysis))
    }
  }, [analysis])

  useEffect(() => {
    if (enhancedText) {
      localStorage.setItem('enhancedText', enhancedText)
    }
  }, [enhancedText])

  // Clear all data on page refresh
  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.removeItem('analysis')
      localStorage.removeItem('enhancedText')
      localStorage.removeItem('text')
      setText('')
      setAnalysis(null)
      setEnhancedText('')
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [])

  // Clear all saved data
  const clearAllData = () => {
    setAnalysis(null)
    setEnhancedText('')
    setText('')
    localStorage.removeItem('analysis')
    localStorage.removeItem('enhancedText')
    localStorage.removeItem('text')
  }

  const value = {
    analysis,
    setAnalysis,
    enhancedText,
    setEnhancedText,
    text,
    setText,
    clearAllData
  }

  return (
    <AnalysisContext.Provider value={value}>
      {children}
    </AnalysisContext.Provider>
  )
} 