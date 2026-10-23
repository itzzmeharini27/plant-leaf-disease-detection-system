import { Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './firebase/AuthContext.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Analysis from './pages/Analysis.jsx'
import Forecast from './pages/Forecast.jsx'
import ExpertChat from './pages/ExpertChat.jsx'
import History from './pages/History.jsx'

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="analysis" replace />} />
          <Route path="analysis" element={<Analysis />} />
          <Route path="forecast" element={<Forecast />} />
          <Route path="chat" element={<ExpertChat />} />
          <Route path="history" element={<History />} />
        </Route>
        <Route path="/" element={<Navigate to="/app/analysis" replace />} />
        <Route path="*" element={<Navigate to="/app/analysis" replace />} />
      </Routes>
    </AuthProvider>
  )
}
