import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Mail, Trophy, Award, Calendar, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { authService } from '../services/authService.js'
import { gameService } from '../services/gameService.js'
import AchievementBadge from '../components/AchievementBadge.jsx'
import { formatTime } from '../utils/scoreCalculator.js'

export default function Profile() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [achievements, setAchievements] = useState([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    loadProfile()
  }, [user])
  
  const loadProfile = async () => {
    try {
      const [profileRes, achRes] = await Promise.all([
        authService.getProfile(),
        gameService.getAchievements()
      ])
      setProfile(profileRes)
      setAchievements(achRes.achievements || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }
  
  const handleLogout = () => {
    logout()
    navigate('/')
  }
  
  if (!user) return null
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full" />
      </div>
    )
  }
  
  const stats = profile?.stats || {}
  
  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Profile Card */}
        <div className="bg-white dark:bg-dark-card rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8 mb-6">
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
              {user.username?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">{user.username}</h1>
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mt-1">
                <Mail className="w-4 h-4" />
                <span className="text-sm">{user.email}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mt-1">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">
                  Joined {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recently'}
                </span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-sm font-medium"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-dark-card rounded-2xl p-5 shadow-lg border border-gray-200 dark:border-gray-700">
            <Trophy className="w-5 h-5 text-yellow-500 mb-2" />
            <p className="text-2xl font-bold">{stats.highestScore || 0}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Best Score</p>
          </div>
          <div className="bg-white dark:bg-dark-card rounded-2xl p-5 shadow-lg border border-gray-200 dark:border-gray-700">
            <User className="w-5 h-5 text-primary-500 mb-2" />
            <p className="text-2xl font-bold">{stats.totalGames || 0}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Games Played</p>
          </div>
          <div className="bg-white dark:bg-dark-card rounded-2xl p-5 shadow-lg border border-gray-200 dark:border-gray-700">
            <Trophy className="w-5 h-5 text-green-500 mb-2" />
            <p className="text-2xl font-bold font-mono">{stats.bestTime ? formatTime(stats.bestTime) : '--:--'}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Best Time</p>
          </div>
          <div className="bg-white dark:bg-dark-card rounded-2xl p-5 shadow-lg border border-gray-200 dark:border-gray-700">
            <Award className="w-5 h-5 text-purple-500 mb-2" />
            <p className="text-2xl font-bold">{achievements.filter(a => a.unlocked).length}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Achievements</p>
          </div>
        </div>
        
        {/* All Achievements */}
        <div className="bg-white dark:bg-dark-card rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-500" />
            All Achievements
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {achievements.map((ach, i) => (
              <AchievementBadge
                key={ach.id}
                name={ach.name}
                description={ach.description}
                unlocked={ach.unlocked}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
