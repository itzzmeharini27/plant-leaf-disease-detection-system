import { useEffect, useState } from 'react'
import HistoryItem from '../components/HistoryItem.jsx'
import { getHistory } from '../services/api.js'
import { useAuth } from '../firebase/AuthContext.jsx'

export default function History() {
  const { profile } = useAuth()
  const [items, setItems] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    getHistory(profile?.userId).then((data) => {
      if (active) {
        setItems(data)
        setLoading(false)
      }
    })
    return () => {
      active = false
    }
  }, [profile])

  return (
    <div className="page">
      <div className="page__header">
        <h1 className="page__title">Analysis History</h1>
        <p className="page__subtitle">A record of your previous leaf analyses, ready to sync with Firestore.</p>
      </div>

      {loading ? (
        <div className="analyzing">
          <div className="spinner" />
          Loading history…
        </div>
      ) : items.length === 0 ? (
        <div className="empty-state">No analyses yet. Run your first diagnosis from the Analysis tab.</div>
      ) : (
        <div className="history-list">
          {items.map((item) => (
            <HistoryItem
              key={item.id}
              date={item.date}
              disease={item.disease}
              confidence={item.confidence}
              severity={item.severity}
            />
          ))}
        </div>
      )}
    </div>
  )
}
