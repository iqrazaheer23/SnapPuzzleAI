import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Trophy, Clock, Target, Gamepad2, Award, Zap, TrendingUp, Calendar } from 'lucide-react'
import { formatTime } from '../utils/scoreCalculator.js'
import AchievementBadge from '../components/AchievementBadge.jsx'
import { gameService } from '../services/gameService.js'
import { useAuth } from '../context/AuthContext'

export default function Dashboard() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    
    loadDashboard()
  }, [isAuthenticated])
  
  const loadDashboard = async () => {
    try {
      const res = await gameService.getDashboard()
      setData(res)
    } catch (err) {
      setError('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }
  
  if (!isAuthenticated) return null
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full" />
      </div>
    )
  }
  
  const stats = data?.stats || {}
  
  const statCards = [
    { label: 'Total Games', value: stats.totalGames || 0, icon: Gamepad2, color: 'bg-blue-500' },
    { label: 'Best Time', value: stats.bestTime ? formatTime(stats.bestTime) : '--:--', icon: Clock, color: 'bg-green-500' },
    { label: 'Avg Time', value: stats.averageTime ? formatTime(Math.round(stats.averageTime)) : '--:--', icon: TrendingUp, color: 'bg-yellow-500' },
    { label: 'High Score', value: stats.highestScore || 0, icon: Trophy, color: 'bg-purple-500' },
  ]
  
  const difficultyStats = [
    { label: 'Easy Wins', value: stats.easyWins || 0, color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-900/20' },
    { label: 'Medium Wins', value: stats.mediumWins || 0, color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-50 dark:bg-yellow-900/20' },
    { label: 'Hard Wins', value: stats.hardWins || 0, color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/20' },
  ]
  
  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Target className="w-8 h-8 text-primary-600" />
            Dashboard
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Track your puzzle performance and achievements.</p>
        </div>
        
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 text-red-600 dark:text-red-300 text-sm">
            {error}
          </div>
        )}
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((card, i) => (
            <div key={i} className="bg-white dark:bg-dark-card rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className={`w-10 h-10 rounded-xl ${card.color} flex items-center justify-center mb-4`}>
                <card.icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-2xl font-bold">{card.value}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{card.label}</p>
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Difficulty Breakdown */}
          <div className="bg-white dark:bg-dark-card rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary-600" />
              Difficulty Breakdown
            </h2>
            <div className="space-y-3">
              {difficultyStats.map((stat, i) => (
                <div key={i} className={`flex items-center justify-between p-3 rounded-xl ${stat.bg}`}>
                  <span className={`font-medium ${stat.color}`}>{stat.label}</span>
                  <span className="font-bold text-lg">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Achievements */}
          <div className="bg-white dark:bg-dark-card rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-500" />
              Achievements ({data?.achievementCount || 0})
            </h2>
            <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
              {data?.achievements?.length > 0 ? (
                data.achievements.map((ach, i) => (
                  <AchievementBadge
                    key={i}
                    name={ach.name}
                    description=""
                    unlocked={true}
                  />
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-8">
                  Complete puzzles to unlock achievements!
                </p>
              )}
            </div>
          </div>
        </div>
        
        {/* Recent Games */}
        <div className="mt-6 bg-white dark:bg-dark-card rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary-600" />
            Recent Games
          </h2>
          {data?.recentGames?.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Difficulty</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Time</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Score</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentGames.map((game, i) => (
                    <tr key={i} className="border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="py-3 px-4 capitalize">
                        <span className={`inline-flex px-2 py-1 rounded-lg text-xs font-medium ${
                          game.difficulty === 'easy' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                          game.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' :
                          'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                        }`}>
                          {game.difficulty}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono">{formatTime(game.completionTime)}</td>
                      <td className="py-3 px-4 font-bold">{game.score}</td>
                      <td className="py-3 px-4 text-gray-500 dark:text-gray-400">
                        {new Date(game.playedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-8">
              No games played yet. Start playing!
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
