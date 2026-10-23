import { useEffect, useState } from 'react'
import ForecastCard from '../components/ForecastCard.jsx'
import { getForecast } from '../services/api.js'

export default function Forecast() {
  const [forecast, setForecast] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    getForecast().then((data) => {
      if (active) {
        setForecast(data)
        setLoading(false)
      }
    })
    return () => {
      active = false
    }
  }, [])

  return (
    <div className="page">
      <div className="page__header">
        <h1 className="page__title">Disease Risk Forecast</h1>
        <p className="page__subtitle">
          Localized risk monitoring based on upcoming weather conditions, helping you plan preventive treatment
          before an outbreak takes hold.
        </p>
      </div>

      {loading ? (
        <div className="analyzing">
          <div className="spinner" />
          Loading forecast…
        </div>
      ) : (
        <div className="forecast-grid">
          {forecast.map((item) => (
            <ForecastCard
              key={item.label}
              label={item.label}
              risk={item.risk}
              indicator={item.indicator}
              explanation={item.explanation}
            />
          ))}
        </div>
      )}
    </div>
  )
}
