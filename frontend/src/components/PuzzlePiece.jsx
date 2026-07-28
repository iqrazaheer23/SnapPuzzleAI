import React from 'react'

export default function PuzzlePiece({ piece, index, isSelected, isSolved, isPlaying, onClick }) {
  if (!piece) return <div className="aspect-square rounded-xl bg-gray-200 dark:bg-gray-800" />
  
  const { id, image } = piece
  const isCorrect = piece.correctPosition === piece.currentPosition
  
  return (
    <div
      onClick={() => isPlaying && onClick(index)}
      className={`relative aspect-square rounded-xl overflow-hidden transition-all duration-300 cursor-pointer
        ${isSelected ? 'ring-4 ring-primary-500 scale-105 z-10' : 'hover:scale-[1.02]'}
        ${isSolved ? 'ring-2 ring-green-500' : ''}
        ${!isPlaying ? 'opacity-50 cursor-default' : ''}
        shadow-sm hover:shadow-md`}
    >
      <img 
        src={image} 
        alt={`Piece ${id + 1}`}
        className="w-full h-full object-cover"
        draggable={false}
      />
      {!isSolved && isCorrect && (
        <div className="absolute inset-0 flex items-center justify-center bg-green-500/20">
          <div className="w-3 h-3 bg-green-500 rounded-full shadow-lg" />
        </div>
      )}
    </div>
  )
}
