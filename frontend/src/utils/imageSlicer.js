/**
 * Slices an image into puzzle pieces using HTML5 Canvas API
 * Returns an array of piece objects with id, image (dataURL), correctPosition, and currentPosition
 */
export function sliceImage(imageSrc, gridSize) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      
      // Calculate piece dimensions based on the image
      const pieceWidth = Math.floor(img.width / gridSize)
      const pieceHeight = Math.floor(img.height / gridSize)
      
      const pieces = []
      let id = 0
      
      for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
          canvas.width = pieceWidth
          canvas.height = pieceHeight
          
          // Draw the piece from the source image
          ctx.drawImage(
            img,
            col * pieceWidth,
            row * pieceHeight,
            pieceWidth,
            pieceHeight,
            0,
            0,
            pieceWidth,
            pieceHeight
          )
          
          pieces.push({
            id: id,
            image: canvas.toDataURL('image/jpeg', 0.92),
            correctPosition: id,
            currentPosition: id,
            row,
            col
          })
          id++
        }
      }
      
      resolve(pieces)
    }
    img.onerror = reject
    img.src = imageSrc
  })
}
