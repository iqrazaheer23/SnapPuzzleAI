import { useState, useEffect, useRef, useCallback } from 'react'

export function useTimer() {
  const [time, setTime] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const intervalRef = useRef(null)
  const isRunningRef = useRef(false)
  
  const start = useCallback(() => {
    if (!isRunningRef.current) {
      isRunningRef.current = true
      setIsRunning(true)
      intervalRef.current = setInterval(() => {
        setTime(prev => prev + 1)
      }, 1000)
    }
  }, [])
  
  const stop = useCallback(() => {
    isRunningRef.current = false
    setIsRunning(false)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])
  
  const reset = useCallback(() => {
    stop()
    setTime(0)
  }, [stop])
  
  const restart = useCallback(() => {
    reset()
    start()
  }, [reset, start])
  
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])
  
  return { time, isRunning, start, stop, reset, restart }
}
