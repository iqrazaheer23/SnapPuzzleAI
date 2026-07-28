import React from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Camera, Trophy, BarChart3, User, LogOut, Menu, X, Moon, Sun } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useState, useEffect } from 'react'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark' || 
      (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
  })
  
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [darkMode])
  
  const handleLogout = () => {
    logout()
    navigate('/')
  }
  
  const isActive = (path) => location.pathname === path
  
  const navLinks = [
    { path: '/game', label: 'Play', icon: Camera },
    { path: '/leaderboard', label: 'Leaderboard', icon: Trophy },
    { path: '/dashboard', label: 'Dashboard', icon: BarChart3 },
    { path: '/profile', label: 'Profile', icon: User },
  ]
  
  return (
    <nav className="sticky top-0 z-50 glass-card border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Camera className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                SnapPuzzle
              </span>
            </Link>
          </div>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {user && navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  isActive(link.path)
                    ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </Link>
            ))}
            
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ml-2"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            
            {user ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors ml-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            ) : (
              <div className="flex items-center gap-2 ml-2">
                <Link to="/login" className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary-600 transition-colors">
                  Login
                </Link>
                <Link to="/register" className="btn-primary text-sm">
                  Get Started
                </Link>
              </div>
            )}
          </div>
          
          {/* Mobile toggle */}
          <div className="flex items-center md:hidden gap-2">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-xl text-gray-600 dark:text-gray-300"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-xl text-gray-600 dark:text-gray-300"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-dark-card/95 backdrop-blur-xl">
          <div className="px-4 py-3 space-y-1">
            {user && navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium ${
                  isActive(link.path)
                    ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                    : 'text-gray-600 dark:text-gray-300'
                }`}
              >
                <link.icon className="w-5 h-5" />
                {link.label}
              </Link>
            ))}
            
            {user ? (
              <button
                onClick={() => { handleLogout(); setMobileOpen(false); }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 w-full"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            ) : (
              <div className="space-y-2 pt-2">
                <Link to="/login" onClick={() => setMobileOpen(false)} className="block px-4 py-3 text-sm font-medium text-gray-600 dark:text-gray-300">
                  Login
                </Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} className="block btn-primary text-center text-sm">
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
