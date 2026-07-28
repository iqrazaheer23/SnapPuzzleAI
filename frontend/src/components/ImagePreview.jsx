import React from 'react'

export default function ImagePreview({ image, className = '' }) {
  if (!image) return null
  
  return (
    <div className={`rounded-2xl overflow-hidden shadow-xl border-2 border-gray-200 dark:border-gray-700 ${className}`}>
      <img src={image} alt="Preview" className="w-full h-full object-cover" />
    </div>
  )
}
