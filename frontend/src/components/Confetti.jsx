import React, { useEffect } from 'react'
import confetti from 'canvas-confetti'

export default function Confetti() {
  useEffect(() => {
    const duration = 3000
    const end = Date.now() + duration
    
    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444']
      })
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444']
      })
      
      if (Date.now() < end) {
        requestAnimationFrame(frame)
      }
    }
    
    frame()
  }, [])
  
  return null
}
