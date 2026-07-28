import { useState, useCallback, useEffect } from 'react'
import { shufflePieces } from '../utils/shuffle.js'
import { checkWin } from '../utils/winChecker.js'

export function usePuzzle() {
  const [pieces, setPieces] = useState([])
  const [isSolved, setIsSolved] = useState(false)
  const [selectedPiece, setSelectedPiece] = useState(null)
  const [moves, setMoves] = useState(0)
  
  const initializePuzzle = useCallback((originalPieces) => {
    const shuffled = shufflePieces(originalPieces)
    setPieces(shuffled)
    setIsSolved(false)
    setSelectedPiece(null)
    setMoves(0)
  }, [])
  
  const handlePieceClick = useCallback((gridPosition) => {
    if (isSolved) return
    
    if (selectedPiece === null) {
      // Select the piece at this grid position
      setSelectedPiece(gridPosition)
    } else if (selectedPiece === gridPosition) {
      // Deselect
      setSelectedPiece(null)
    } else {
      // Swap the pieces at the two selected grid positions
      setPieces(prev => {
        const newPieces = prev.map(p => ({ ...p }))
        // Find the array indices of pieces currently at these grid positions
        const idx1 = newPieces.findIndex(p => p.currentPosition === selectedPiece)
        const idx2 = newPieces.findIndex(p => p.currentPosition === gridPosition)
        
        if (idx1 !== -1 && idx2 !== -1) {
          const temp = newPieces[idx1].currentPosition
          newPieces[idx1].currentPosition = newPieces[idx2].currentPosition
          newPieces[idx2].currentPosition = temp
        }
        
        return newPieces
      })
      setSelectedPiece(null)
      setMoves(prev => prev + 1)
    }
  }, [selectedPiece, isSolved])
  
  // Check for win whenever pieces change
  useEffect(() => {
    if (pieces.length > 0 && !isSolved) {
      const solved = checkWin(pieces)
      if (solved) {
        setIsSolved(true)
      }
    }
  }, [pieces, isSolved])
  
  return {
    pieces,
    isSolved,
    selectedPiece,
    moves,
    initializePuzzle,
    handlePieceClick
  }
}
