import React, { useState } from 'react'
import PuzzlePiece from './PuzzlePiece.jsx'

export default function PuzzleBoard({ pieces, gridSize, isSolved, onPieceClick, selectedPiece, isPlaying }) {
  if (!pieces || pieces.length === 0) return null
  
  // Create the grid - pieces are arranged by currentPosition
  const gridPieces = [...Array(gridSize * gridSize)].map((_, index) => {
    const piece = pieces.find(p => p.currentPosition === index)
    return piece || null
  })
  
  return (
    <div 
      className="inline-grid gap-1 p-2 rounded-2xl bg-gray-800/50 dark:bg-gray-900/50 shadow-2xl border border-gray-700/50"
      style={{
        gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
        gridTemplateRows: `repeat(${gridSize}, 1fr)`,
        width: 'fit-content',
        maxWidth: '100%'
      }}
    >
      {gridPieces.map((piece, index) => (
        <PuzzlePiece
          key={index}
          piece={piece}
          index={index}
          isSelected={selectedPiece === index}
          isSolved={isSolved}
          isPlaying={isPlaying}
          onClick={() => onPieceClick(index)}
        />
      ))}
    </div>
  )
}
