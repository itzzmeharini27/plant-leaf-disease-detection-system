import { useEffect, useRef, useState } from 'react'
import { Camera, RotateCcw, Check } from 'lucide-react'

/**
 * Two-stage camera capture: a live getUserMedia() preview, then a still
 * frame drawn to canvas that the user can accept or retake.
 */
export default function CameraCapture({ onCapture, onCancel }) {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)
  const [error, setError] = useState('')
  const [frozenImage, setFrozenImage] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
          audio: false,
        })
        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop())
          return
        }
        streamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
      } catch (err) {
        setError(
          'Camera access was denied or is unavailable. Check your browser permissions, or upload an image instead.'
        )
      }
    }

    startCamera()

    return () => {
      cancelled = true
      streamRef.current?.getTracks().forEach((track) => track.stop())
    }
  }, [])

  function handleCaptureFrame() {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return

    canvas.width = video.videoWidth || 1280
    canvas.height = video.videoHeight || 960
    const ctx = canvas.getContext('2d')
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

    canvas.toBlob(
      (blob) => {
        if (blob) {
          setFrozenImage(URL.createObjectURL(blob))
        }
      },
      'image/jpeg',
      0.92
    )
  }

  function handleRetake() {
    setFrozenImage(null)
  }

  function handleUseFrame() {
    canvasRef.current.toBlob(
      (blob) => {
        if (blob) {
          onCapture(blob)
        }
      },
      'image/jpeg',
      0.92
    )
  }

  if (error) {
    return (
      <div className="camera-error">
        <div className="banner">
          <Camera size={18} style={{ flexShrink: 0, marginTop: 2 }} />
          <div>{error}</div>
        </div>
        <div style={{ marginTop: 12 }}>
          <button type="button" className="btn btn--secondary" onClick={onCancel}>
            Back to capture options
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="camera-frame">
      {frozenImage ? (
        <img src={frozenImage} alt="Captured leaf, ready to analyze" className="preview-card__image" />
      ) : (
        <video ref={videoRef} autoPlay playsInline muted />
      )}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <div className="camera-frame__actions">
        {frozenImage ? (
          <>
            <button type="button" className="btn btn--secondary" onClick={handleRetake}>
              <RotateCcw size={16} />
              Retake
            </button>
            <button type="button" className="btn btn--primary btn--block" onClick={handleUseFrame}>
              <Check size={16} />
              Use This Photo
            </button>
          </>
        ) : (
          <>
            <button type="button" className="btn btn--secondary" onClick={onCancel}>
              Cancel
            </button>
            <button type="button" className="btn btn--primary btn--block" onClick={handleCaptureFrame}>
              <Camera size={16} />
              Capture Leaf
            </button>
          </>
        )}
      </div>
    </div>
  )
}
