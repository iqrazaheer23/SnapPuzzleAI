import React from 'react'
import { Puzzle, Layers, Grid3x3 } from 'lucide-react'

const difficulties = [
  { id: 'easy', label: 'Easy', grid: 3, pieces: 9, icon: Puzzle, multiplier: 1, color: 'from-green-400 to-emerald-600' },
  { id: 'medium', label: 'Medium', grid: 4, pieces: 16, icon: Layers, multiplier: 2, color: 'from-yellow-400 to-orange-500' },
  { id: 'hard', label: 'Hard', grid: 6, pieces: 36, icon: Grid3x3, multiplier: 3, color: 'from-red-400 to-rose-600' },
]

export default function DifficultySelector({ selected, onSelect }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-lg mx-auto">
      {difficulties.map(diff => {
        const Icon = diff.icon
        const isActive = selected === diff.id
        return (
          <button
            key={diff.id}
            onClick={() => onSelect(diff.id)}
            className={`relative flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all duration-300 ${
              isActive
                ? 'border-primary-500 shadow-lg shadow-primary-500/20 bg-primary-50 dark:bg-primary-900/20 scale-105'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-dark-card hover:scale-102'
            }`}
          >
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${diff.color} flex items-center justify-center shadow-lg`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div className="text-center">
              <h3 className="font-bold text-lg">{diff.label}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{diff.pieces} pieces</p>
              <p className="text-xs font-medium text-primary-600 dark:text-primary-400 mt-1">
                ×{diff.multiplier} Score
              </p>
            </div>
            {isActive && (
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </button>
        )
      })}
    </div>
  )
}
