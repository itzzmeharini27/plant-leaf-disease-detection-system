import { useState } from 'react'
import { Camera, Leaf, RotateCcw } from 'lucide-react'
import Logo from '../components/Logo.jsx'
import UploadCard from '../components/UploadCard.jsx'
import CameraCapture from '../components/CameraCapture.jsx'
import AnalysisResult from '../components/AnalysisResult.jsx'
import { analyzeLeaf } from '../services/api.js'

export default function Analysis() {
  const [mode, setMode] = useState('choose') // choose | camera
  const [imageFile, setImageFile] = useState(null)
  const [imageUrl, setImageUrl] = useState(null)
  const [status, setStatus] = useState('idle') // idle | analyzing | done | error
  const [result, setResult] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')

  function handleImagePicked(file) {
    setImageFile(file)
    setImageUrl(URL.createObjectURL(file))
    setMode('choose')
    setResult(null)
    setStatus('idle')
  }

  function handleReset() {
    setImageFile(null)
    setImageUrl(null)
    setResult(null)
    setStatus('idle')
    setErrorMessage('')
    setMode('choose')
  }

  async function handleAnalyze() {
    if (!imageFile) return
    setStatus('analyzing')
    setErrorMessage('')
    try {
      const data = await analyzeLeaf(imageFile)
      setResult(data)
      setStatus('done')
    } catch (err) {
      setErrorMessage(err?.message || 'Analysis failed. Please try again.')
      setStatus('error')
    }
  }

  return (
    <div className="page">
      <div className="page__header">
        <div className="page__title-row">
          <Logo size="lg" title="Plant Leaf Disease Detection System" />
        </div>
        <p className="page__subtitle">
          AI-powered crop health analysis for early disease identification and timely action.
        </p>
        <div style={{ marginTop: 14 }}>
          <span className="tag tag--online">
            <span className="tag__dot" />
            AI SYSTEM ONLINE
          </span>
        </div>
      </div>

      <div className="analysis-grid">
        <section className="panel">
          <div className="panel__head">
            <div>
              <span className="step-label">01 · CAPTURE</span>
              <h2 className="panel__title">Analyze a Leaf</h2>
            </div>
          </div>

          {mode === 'camera' && !imageUrl ? (
            <CameraCapture onCapture={handleImagePicked} onCancel={() => setMode('choose')} />
          ) : imageUrl ? (
            <div className="preview-card">
              <img src={imageUrl} alt="Selected leaf" className="preview-card__image" />
              <div className="preview-card__actions">
                <button type="button" className="btn btn--secondary" onClick={handleReset}>
                  <RotateCcw size={16} />
                  Choose Different Photo
                </button>
                <button
                  type="button"
                  className="btn btn--primary btn--block"
                  onClick={handleAnalyze}
                  disabled={status === 'analyzing'}
                >
                  {status === 'analyzing' ? 'Analyzing…' : 'Analyze Leaf'}
                </button>
              </div>
            </div>
          ) : (
            <div className="capture-options">
              <UploadCard onSelect={handleImagePicked} />
              <button type="button" className="capture-option" onClick={() => setMode('camera')}>
                <span className="capture-option__icon">
                  <Camera size={22} strokeWidth={2} />
                </span>
                <span className="capture-option__title">Use Camera</span>
                <span className="capture-option__desc">Take a clear photo of the affected leaf</span>
              </button>
            </div>
          )}
        </section>

        <section className="panel">
          <div className="panel__head">
            <div>
              <span className="step-label">02 · DIAGNOSIS</span>
              <h2 className="panel__title">Analysis Result</h2>
            </div>
            <span className="model-badge">MobileNet V3</span>
          </div>

          {status === 'analyzing' && (
            <div className="analyzing">
              <div className="spinner" />
              Analyzing leaf image…
            </div>
          )}

          {status === 'idle' && (
            <div className="result-empty">
              <span className="result-empty__icon">
                <Leaf size={28} />
              </span>
              <div className="result-empty__title">Ready to Analyze</div>
              <p className="result-empty__desc">
                Upload or capture a clear leaf photo. The result will appear here with disease class, confidence,
                severity, and action guidance.
              </p>
            </div>
          )}

          {status === 'error' && (
            <div className="banner" role="alert" style={{ marginTop: 20 }}>
              {errorMessage}
            </div>
          )}

          {status === 'done' && result && <AnalysisResult imageUrl={imageUrl} result={result} />}
        </section>
      </div>
    </div>
  )
}
