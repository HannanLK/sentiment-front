import { useState, useEffect } from "react"

export function useToast() {
  const [toasts, setToasts] = useState([])

  const toast = ({ title, description, variant = "default" }) => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts((prevToasts) => [...prevToasts, { id, title, description, variant }])
  }

  useEffect(() => {
    if (toasts.length > 0) {
      const timer = setTimeout(() => {
        setToasts((prevToasts) => prevToasts.slice(1))
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [toasts])

  return { toast, toasts }
} 