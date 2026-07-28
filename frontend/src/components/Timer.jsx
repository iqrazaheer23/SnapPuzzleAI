import React from 'react'
import { Clock } from 'lucide-react'
import { formatTime } from '../utils/scoreCalculator.js'

export default function Timer({ time, isRunning }) {
  return (
    <div className={`flex items-center gap-2 px-5 py-3 rounded-xl font-mono text-lg font-bold transition-all ${
      isRunning
        ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 ring-2 ring-primary-500/30'
        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
    }`}>
      <Clock className={`w-5 h-5 ${isRunning ? 'animate-pulse' : ''}`} />
      <span>{formatTime(time)}</span>
    </div>
  )
}
