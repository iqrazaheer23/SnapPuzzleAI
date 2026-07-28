import React from 'react'
import { Trophy, Clock, Star, RotateCcw, Home, Share2 } from 'lucide-react'
import { formatTime } from '../utils/scoreCalculator.js'

export default function WinModal({ time, score, difficulty, newAchievements, onPlayAgain, onGoHome }) {
  const difficultyColors = {
    easy: 'from-green-400 to-emerald-600',
    medium: 'from-yellow-400 to-orange-500',
    hard: 'from-red-400 to-rose-600'
  }
  
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-dark-card rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-slide-up">
        {/* Header */}
        <div className={`bg-gradient-to-r ${difficultyColors[difficulty]} p-8 text-center text-white relative`}>
          <div className="absolute top-0 left-0 right-0 bottom-0 opacity-20">
            <div className="absolute top-4 left-4 w-16 h-16 bg-white rounded-full blur-2xl" />
            <div className="absolute bottom-4 right-4 w-20 h-20 bg-white rounded-full blur-2xl" />
          </div>
          <div className="relative z-10">
            <div className="w-20 h-20 mx-auto bg-white/20 rounded-full flex items-center justify-center mb-4 backdrop-blur-xl border border-white/30">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-1">Puzzle Solved!</h2>
            <p className="text-white/80 text-sm capitalize">{difficulty} Mode Complete</p>
          </div>
        </div>
        
        {/* Stats */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 text-center">
              <Clock className="w-5 h-5 mx-auto mb-2 text-gray-400" />
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatTime(time)}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Time</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 text-center">
              <Star className="w-5 h-5 mx-auto mb-2 text-yellow-500" />
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{score}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Score</p>
            </div>
          </div>
          
          {/* New Achievements */}
          {newAchievements && newAchievements.length > 0 && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4 border border-yellow-200 dark:border-yellow-800">
              <p className="text-sm font-bold text-yellow-700 dark:text-yellow-300 mb-2">New Achievements Unlocked!</p>
              <div className="space-y-2">
                {newAchievements.map((ach, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-yellow-800 dark:text-yellow-200">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full" />
                    {ach}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Actions */}
          <div className="flex flex-col gap-3 pt-2">
            <button
              onClick={onPlayAgain}
              className="btn-primary flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Play Again
            </button>
            <div className="flex gap-3">
              <button
                onClick={onGoHome}
                className="flex-1 btn-secondary flex items-center justify-center gap-2"
              >
                <Home className="w-4 h-4" />
                Home
              </button>
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: 'SnapPuzzle AI',
                      text: `I just scored ${score} points in ${difficulty} mode on SnapPuzzle AI!`,
                      url: window.location.origin
                    })
                  }
                }}
                className="flex-1 btn-secondary flex items-center justify-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
