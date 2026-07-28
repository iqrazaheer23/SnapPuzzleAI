/**
 * Fisher-Yates shuffle algorithm for puzzle pieces
 */
export function shuffleArray(array) {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

export function shufflePieces(pieces) {
  const indices = pieces.map(p => p.id)
  const shuffledIndices = shuffleArray(indices)
  
  return pieces.map((piece, index) => ({
    ...piece,
    currentPosition: shuffledIndices[index]
  }))
}
