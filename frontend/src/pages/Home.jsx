import React from 'react'
import { Link } from 'react-router-dom'
import { Camera, Puzzle, Trophy, Zap, ArrowRight, Github, Linkedin, Twitter } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Home() {
  const { isAuthenticated } = useAuth()
  
  const features = [
    { icon: Camera, title: 'Webcam Capture', desc: 'Use your camera to capture any photo and instantly convert it into a puzzle.' },
    { icon: Puzzle, title: 'Smart Puzzle Engine', desc: 'Dynamic piece generation with responsive drag-and-drop gameplay across all devices.' },
    { icon: Trophy, title: 'Leaderboards', desc: 'Compete globally, track your best times, and climb the rankings in every difficulty.' },
    { icon: Zap, title: 'Achievements', desc: 'Unlock achievements as you master easy, medium, and hard puzzle modes.' },
  ]
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50/50 to-purple-50/50 dark:from-primary-950/20 dark:to-purple-950/20" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary-400/20 rounded-full blur-3xl dark:bg-primary-600/10" />
        
        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-medium mb-8">
            <span className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
            AI-Powered Puzzle Game
          </div>
          
          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight mb-6">
            <span className="bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Turn Photos into
            </span>
            <br />
            <span className="bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
              Playable Puzzles
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            Snap a photo with your webcam, choose your difficulty, and solve the puzzle.
            Track your time, compete on leaderboards, and unlock achievements.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {isAuthenticated ? (
              <Link to="/game" className="btn-primary text-lg px-8 py-4 flex items-center gap-2">
                Start Playing
                <ArrowRight className="w-5 h-5" />
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn-primary text-lg px-8 py-4 flex items-center gap-2">
                  Get Started Free
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link to="/login" className="px-8 py-4 text-lg font-medium text-gray-600 dark:text-gray-300 hover:text-primary-600 transition-colors">
                  Sign In
                </Link>
              </>
            )}
          </div>
          
          {/* Preview image mockup */}
          <div className="mt-16 relative max-w-3xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-t from-gray-50 dark:from-dark-bg to-transparent z-10 h-full" />
            <div className="bg-gray-900 rounded-2xl p-4 shadow-2xl border border-gray-800">
              <div className="bg-gray-800 rounded-xl overflow-hidden aspect-video flex items-center justify-center">
                <div className="grid grid-cols-4 gap-1 p-2 w-48">
                  {[...Array(16)].map((_, i) => (
                    <div key={i} className={`aspect-square rounded-md ${
                      i % 3 === 0 ? 'bg-primary-500' : i % 3 === 1 ? 'bg-purple-500' : 'bg-emerald-500'
                    } opacity-80`} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 px-4 bg-white dark:bg-dark-card border-y border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Everything You Need</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
              A complete puzzle experience built for players who love a challenge.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <div key={i} className="group p-6 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 hover:border-primary-200 dark:hover:border-primary-800 transition-all hover:shadow-lg hover:-translate-y-1">
                <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <f.icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-12 px-4 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Camera className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg">SnapPuzzle AI</span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Built with React, Flask & MongoDB. Portfolio-ready project.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
              <Github className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
              <Linkedin className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
