import { Sprout, Timer, Cpu } from 'lucide-react'

function severityClass(severity) {
  return `severity-pill--${(severity || 'low').toLowerCase()}`
}

export default function AnalysisResult({ imageUrl, result }) {
  return (
    <div className="result">
      {imageUrl && <img src={imageUrl} alt="Analyzed leaf" className="result__thumb" />}

      <div className="result__label">Detected Condition</div>
      <div className="result__disease">{result.disease}</div>

      <div className="result__meter-row">
        <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--stone-600)' }}>Confidence</span>
        <span className="result__meter-value">{result.confidence.toFixed(1)}%</span>
      </div>
      <div className="meter">
        <div className="meter__fill" style={{ width: `${result.confidence}%` }} />
      </div>

      <div className="severity-row">
        <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--stone-600)' }}>Severity</span>
        <span className={`severity-pill ${severityClass(result.severity)}`}>{result.severity}</span>
      </div>

      <div className="result__advice">
        <div className="result__advice-title">Recommended Action</div>
        <p className="result__advice-body">{result.advice}</p>
      </div>

      <div className="result__meta">
        <div className="result__meta-item">
          <Cpu size={14} />
          <strong>{result.model}</strong>
        </div>
        <div className="result__meta-item">
          <Timer size={14} />
          <strong>{'< 500 ms'} target</strong>
        </div>
        <div className="result__meta-item">
          <Sprout size={14} />
          <strong>{result.inferenceMs} ms actual</strong>
        </div>
      </div>
    </div>
  )
}
