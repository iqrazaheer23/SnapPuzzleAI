/**
 * Calculate score based on difficulty and time taken
 * Formula: Difficulty Multiplier × Base Score − Time Taken
 */
export function calculateScore(difficulty, timeTaken) {
  const multipliers = {
    easy: 1,
    medium: 2,
    hard: 3
  }
  
  const baseScore = 1000
  const multiplier = multipliers[difficulty] || 1
  
  let score = (multiplier * baseScore) - timeTaken
  
  // Minimum score of 100
  return Math.max(100, Math.round(score))
}

export function formatTime(seconds) {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}
