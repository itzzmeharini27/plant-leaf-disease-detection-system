import { Leaf } from 'lucide-react'

export default function HistoryItem({ date, disease, confidence, severity }) {
  return (
    <div className="history-item">
      <span className="history-item__icon">
        <Leaf size={18} />
      </span>
      <div className="history-item__body">
        <div className="history-item__date">{date}</div>
        <div className="history-item__disease">{disease}</div>
      </div>
      <span className={`severity-pill severity-pill--${severity.toLowerCase()}`}>{severity}</span>
      <div className="history-item__confidence">
        <div className="history-item__confidence-value">{confidence.toFixed(1)}%</div>
        <div className="history-item__confidence-label">Confidence</div>
      </div>
    </div>
  )
}
