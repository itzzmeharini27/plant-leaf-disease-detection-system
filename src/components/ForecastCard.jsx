export default function ForecastCard({ label, risk, indicator, explanation }) {
  return (
    <div className="forecast-card">
      <div className="forecast-card__label">{label}</div>
      <div className={`forecast-card__risk forecast-card__risk--${risk.toLowerCase()}`}>{risk} Risk</div>
      <div className="forecast-card__indicator">{indicator}</div>
      <p className="forecast-card__explanation">{explanation}</p>
    </div>
  )
}
