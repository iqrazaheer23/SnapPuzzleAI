import React from 'react'
import { Award, Lock } from 'lucide-react'

export default function AchievementBadge({ name, description, unlocked }) {
  return (
    <div className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
      unlocked
        ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
        : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 opacity-60'
    }`}>
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
        unlocked
          ? 'bg-yellow-500 text-white'
          : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400'
      }`}>
        {unlocked ? <Award className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`font-semibold text-sm ${unlocked ? 'text-yellow-800 dark:text-yellow-200' : 'text-gray-600 dark:text-gray-400'}`}>
          {name}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-500 truncate">{description}</p>
      </div>
    </div>
  )
}
