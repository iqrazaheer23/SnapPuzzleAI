import React, { useState, useEffect } from 'react'
import { Trophy, Filter, Medal, Crown } from 'lucide-react'
import { formatTime } from '../utils/scoreCalculator.js'
import { gameService } from '../services/gameService.js'

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([])
  const [difficulty, setDifficulty] = useState('all')
  const [sortBy, setSortBy] = useState('score')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  useEffect(() => {
    loadLeaderboard()
  }, [difficulty, sortBy])
  
  const loadLeaderboard = async () => {
    setLoading(true)
    try {
      const res = await gameService.getLeaderboard(difficulty, sortBy)
      setLeaderboard(res.leaderboard || [])
    } catch (err) {
      setError('Failed to load leaderboard')
    } finally {
      setLoading(false)
    }
  }
  
  const difficultyOptions = [
    { value: 'all', label: 'All Difficulties' },
    { value: 'easy', label: 'Easy' },
    { value: 'medium', label: 'Medium' },
    { value: 'hard', label: 'Hard' },
  ]
  
  const rankIcons = [Crown, Medal, Medal]
  const rankColors = ['text-yellow-500', 'text-gray-400', 'text-amber-600']
  
  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Trophy className="w-8 h-8 text-yellow-500" />
            Leaderboard
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Top performers across all difficulties.</p>
        </div>
        
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex items-center gap-2 bg-white dark:bg-dark-card rounded-xl p-1 border border-gray-200 dark:border-gray-700 shadow-sm">
            <Filter className="w-4 h-4 ml-3 text-gray-400" />
            {difficultyOptions.map(opt => (
              <button
                key={opt.value}
                onClick={() => setDifficulty(opt.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  difficulty === opt.value
                    ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-2 bg-white dark:bg-dark-card rounded-xl p-1 border border-gray-200 dark:border-gray-700 shadow-sm">
            <button
              onClick={() => setSortBy('score')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                sortBy === 'score'
                  ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              By Score
            </button>
            <button
              onClick={() => setSortBy('time')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                sortBy === 'time'
                  ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              By Time
            </button>
          </div>
        </div>
        
        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full" />
          </div>
        )}
        
        {/* Error */}
        {error && !loading && (
          <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 text-sm text-center">
            {error}
          </div>
        )}
        
        {/* Leaderboard List */}
        {!loading && !error && (
          <div className="space-y-3">
            {leaderboard.length === 0 ? (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                No scores yet. Be the first to play!
              </div>
            ) : (
              leaderboard.map((entry, i) => {
                const RankIcon = i < 3 ? rankIcons[i] : () => <span className="w-6 text-center font-bold text-gray-400">{i + 1}</span>
                const rankColor = i < 3 ? rankColors[i] : 'text-gray-400'
                
                return (
                  <div
                    key={i}
                    className={`flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-dark-card border transition-all ${
                      i === 0 
                        ? 'border-yellow-300 dark:border-yellow-700 shadow-lg shadow-yellow-500/10' 
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className={`w-10 h-10 flex items-center justify-center ${i < 3 ? '' : ''}`}>
                      {i < 3 ? <RankIcon className={`w-6 h-6 ${rankColor}`} /> : <span className="font-bold text-gray-400">{i + 1}</span>}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="font-bold truncate">{entry.username}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{entry.difficulty}</p>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-bold text-lg">{entry.score}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">{formatTime(entry.time)}</p>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        )}
      </div>
    </div>
  )
}
