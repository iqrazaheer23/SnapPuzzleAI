/**
 * Check if the puzzle is solved (all pieces in correct position)
 */
export function checkWin(pieces) {
  return pieces.every(piece => piece.correctPosition === piece.currentPosition)
}

/**
 * Get number of pieces in correct position
 */
export function getCorrectCount(pieces) {
  return pieces.filter(piece => piece.correctPosition === piece.currentPosition).length
}
