import React, { useRef, useState, useCallback } from 'react'
import Webcam from 'react-webcam'
import { Camera, RefreshCw, SwitchCamera } from 'lucide-react'

const videoConstraints = {
  width: 720,
  height: 720,
  facingMode: 'user'
}

export default function WebcamCapture({ onCapture, capturedImage }) {
  const webcamRef = useRef(null)
  const [facingMode, setFacingMode] = useState('user')
  const [error, setError] = useState(null)
  
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot()
    if (imageSrc) {
      onCapture(imageSrc)
    }
  }, [onCapture])
  
  const toggleCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user')
  }
  
  const handleError = (err) => {
    setError('Camera access denied or not available. Please allow camera permissions.')
    console.error('Webcam error:', err)
  }
  
  const handleRetry = () => {
    setError(null)
  }
  
  if (capturedImage) {
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-primary-500/20 max-w-md w-full aspect-square">
          <img src={capturedImage} alt="Captured" className="w-full h-full object-cover" />
        </div>
        <button
          onClick={() => onCapture(null)}
          className="flex items-center gap-2 btn-secondary"
        >
          <RefreshCw className="w-4 h-4" />
          Retake Photo
        </button>
      </div>
    )
  }
  
  return (
    <div className="flex flex-col items-center gap-4 w-full">
      {error ? (
        <div className="text-center p-8 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 max-w-md">
          <p className="text-red-600 dark:text-red-300 mb-4">{error}</p>
          <button onClick={handleRetry} className="btn-primary">
            Try Again
          </button>
        </div>
      ) : (
        <>
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-primary-500/20 max-w-md w-full aspect-square bg-black">
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              screenshotQuality={0.92}
              videoConstraints={{ ...videoConstraints, facingMode }}
              onUserMediaError={handleError}
              className="w-full h-full object-cover"
              mirrored={facingMode === 'user'}
            />
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={toggleCamera}
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              <SwitchCamera className="w-5 h-5" />
              <span className="hidden sm:inline text-sm font-medium">Switch</span>
            </button>
            <button
              onClick={capture}
              className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 text-white font-bold rounded-xl transition-all transform hover:scale-105 shadow-lg shadow-primary-600/30"
            >
              <Camera className="w-5 h-5" />
              Capture
            </button>
          </div>
        </>
      )}
    </div>
  )
}
