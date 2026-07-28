import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Camera, Play, RotateCcw, Trophy } from 'lucide-react'
import WebcamCapture from '../components/WebcamCapture.jsx'
import DifficultySelector from '../components/DifficultySelector.jsx'
import PuzzleBoard from '../components/PuzzleBoard.jsx'
import Timer from '../components/Timer.jsx'
import WinModal from '../components/WinModal.jsx'
import Confetti from '../components/Confetti.jsx'
import { useTimer } from '../hooks/useTimer.js'
import { usePuzzle } from '../hooks/usePuzzle.js'
import { sliceImage } from '../utils/imageSlicer.js'
import { calculateScore } from '../utils/scoreCalculator.js'
import { useAuth } from '../context/AuthContext'
import { gameService } from '../services/gameService.js'

const GRID_SIZES = { easy: 3, medium: 4, hard: 6 }

export default function Game() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [capturedImage, setCapturedImage] = useState(null)
  const [difficulty, setDifficulty] = useState('medium')
  const [gameState, setGameState] = useState('capture') // capture, select, playing, won
  const [originalPieces, setOriginalPieces] = useState([])
  const [newAchievements, setNewAchievements] = useState([])
  const [score, setScore] = useState(0)
  const [error, setError] = useState('')
  const { time, isRunning, start, stop, reset, restart } = useTimer()
  const { pieces, isSolved, selectedPiece, moves, initializePuzzle, handlePieceClick } = usePuzzle()
  const successSound = useRef(null)
  
  // Initialize audio
  useEffect(() => {
    successSound.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3')
  }, [])
  
  // Watch for solved state
  useEffect(() => {
    if (isSolved && gameState === 'playing') {
      handleWin()
    }
  }, [isSolved])
  
  const handleCapture = (image) => {
    setCapturedImage(image)
    if (image) {
      setGameState('select')
    } else {
      setGameState('capture')
    }
  }
  
  const startGame = async () => {
    if (!capturedImage) return
    
    try {
      const gridSize = GRID_SIZES[difficulty]
      const sliced = await sliceImage(capturedImage, gridSize)
      setOriginalPieces(sliced)
      initializePuzzle(sliced)
      setGameState('playing')
      setScore(0)
      setNewAchievements([])
      setError('')
      restart()
    } catch (err) {
      setError('Failed to generate puzzle. Please try again.')
      console.error(err)
    }
  }
  
  const handleWin = async () => {
    stop()
    const finalScore = calculateScore(difficulty, time)
    setScore(finalScore)
    setGameState('won')
    
    if (successSound.current) {
      successSound.current.play().catch(() => {})
    }
    
    if (isAuthenticated) {
      try {
        const data = await gameService.saveScore(difficulty, time, finalScore)
        if (data.newAchievements?.length > 0) {
          setNewAchievements(data.newAchievements)
        }
      } catch (err) {
        console.error('Failed to save score:', err)
      }
    }
  }
  
  const handlePlayAgain = () => {
    setGameState('capture')
    setCapturedImage(null)
    setOriginalPieces([])
    reset()
  }
  
  const progress = originalPieces.length > 0 
    ? pieces.filter(p => p.correctPosition === p.currentPosition).length / pieces.length * 100
    : 0
  
  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Game Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Camera className="w-8 h-8 text-primary-600" />
              SnapPuzzle
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Capture, scramble, solve.
            </p>
          </div>
          
          {gameState === 'playing' && (
            <div className="flex items-center gap-3">
              <Timer time={time} isRunning={isRunning} />
              <button
                onClick={handlePlayAgain}
                className="p-3 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                title="Restart"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
        
        {/* Error */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 text-sm">
            {error}
          </div>
        )}
        
        {/* Capture Phase */}
        {gameState === 'capture' && (
          <div className="animate-fade-in">
            <div className="bg-white dark:bg-dark-card rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8 mb-6">
              <h2 className="text-xl font-bold mb-2 text-center">Take a Photo</h2>
              <p className="text-gray-500 dark:text-gray-400 text-center mb-6">
                Allow camera access and snap a photo to turn it into a puzzle.
              </p>
              <WebcamCapture onCapture={handleCapture} capturedImage={capturedImage} />
            </div>
          </div>
        )}
        
        {/* Select Difficulty Phase */}
        {gameState === 'select' && (
          <div className="animate-fade-in">
            <div className="bg-white dark:bg-dark-card rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8 mb-6">
              <h2 className="text-xl font-bold mb-2 text-center">Select Difficulty</h2>
              <p className="text-gray-500 dark:text-gray-400 text-center mb-6">
                Choose how many pieces you want to solve.
              </p>
              <DifficultySelector selected={difficulty} onSelect={setDifficulty} />
              
              <div className="flex justify-center mt-8">
                <button onClick={startGame} className="btn-primary text-lg px-8 flex items-center gap-2">
                  <Play className="w-5 h-5" />
                  Start Puzzle
                </button>
              </div>
            </div>
            
            <div className="flex justify-center">
              <button
                onClick={() => handleCapture(null)}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Retake Photo
              </button>
            </div>
          </div>
        )}
        
        {/* Playing Phase */}
        {gameState === 'playing' && (
          <div className="animate-fade-in">
            {/* Progress */}
            <div className="mb-6 bg-white dark:bg-dark-card rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Progress</span>
                <span className="text-sm font-bold text-primary-600">{Math.round(progress)}%</span>
              </div>
              <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary-500 to-purple-500 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                Click a piece to select it, then click another to swap.
              </p>
            </div>
            
            {/* Puzzle Board */}
            <div className="flex justify-center">
              <PuzzleBoard
                pieces={pieces}
                gridSize={GRID_SIZES[difficulty]}
                isSolved={isSolved}
                onPieceClick={handlePieceClick}
                selectedPiece={selectedPiece}
                isPlaying={gameState === 'playing'}
              />
            </div>
          </div>
        )}
        
        {/* Win Phase */}
        {gameState === 'won' && (
          <>
            <Confetti />
            <WinModal
              time={time}
              score={score}
              difficulty={difficulty}
              newAchievements={newAchievements}
              onPlayAgain={handlePlayAgain}
              onGoHome={() => navigate('/dashboard')}
            />
            
            <div className="flex justify-center opacity-50">
              <PuzzleBoard
                pieces={pieces}
                gridSize={GRID_SIZES[difficulty]}
                isSolved={true}
                onPieceClick={() => {}}
                selectedPiece={null}
                isPlaying={false}
              />
            </div>
          </>
        )}
        
        {!isAuthenticated && gameState === 'playing' && (
          <div className="mt-6 p-4 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 text-center">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              <Trophy className="w-4 h-4 inline mr-2" />
              Scores are not saved for guest players.{' '}
              <button onClick={() => navigate('/login')} className="font-bold underline hover:text-yellow-900">
                Log in to compete on leaderboards.
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
