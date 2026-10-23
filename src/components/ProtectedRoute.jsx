import { Navigate } from 'react-router-dom'
import { useAuth } from '../firebase/AuthContext.jsx'

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, initializing } = useAuth()

  if (initializing) {
    return (
      <div style={{ display: 'grid', placeItems: 'center', minHeight: '100vh' }}>
        <div className="spinner" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}
