import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Logo from '../components/Logo.jsx'
import GrassField from '../components/GrassField.jsx'
import AuthForm from '../components/AuthForm.jsx'
import { useAuth } from '../firebase/AuthContext.jsx'

export default function Login() {
  const [mode, setMode] = useState('login')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { login, signUp, isFirebaseConfigured } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(values) {
    setError(''); setMessage(''); setSubmitting(true)
    try {
      if (!isFirebaseConfigured) throw new Error('CONFIG')
      if (mode === 'signup') {
        await signUp(values)
        setMode('login')
        setMessage('Account created successfully. You can now sign in.')
      } else {
        await login(values)
        navigate('/app/analysis', { replace: true })
      }
    } catch (err) {
      const code = err?.code || ''
      if (code.includes('email-already-in-use')) setError('An account already exists with this email.')
      else if (code.includes('invalid-email')) setError('Please enter a valid email address.')
      else if (code.includes('weak-password')) setError('Password must be at least 6 characters.')
      else if (code.includes('user-not-found') || code.includes('invalid-credential')) setError('Account not found. Please check your email or create an account.')
      else if (code.includes('wrong-password')) setError('Incorrect password. Please try again.')
      else if (err?.message === 'CONFIG') setError('Sign in is temporarily unavailable. Please try again later.')
      else setError('We could not complete that request. Please check your details and try again.')
    } finally { setSubmitting(false) }
  }

  return (
    <div className="login">
      <GrassField />
      <div className="login__content">
        <div className="login__hero">
          <Logo size="lg" title="Plant Leaf Disease Detection System" />
          <p className="login__tagline">AI-powered plant health detection</p>
          <p className="login__description">Detect plant leaf diseases early using AI-powered image analysis and receive practical treatment guidance.</p>
        </div>
        <div className="login-card">
          <div className="auth-switch" role="tablist" aria-label="Authentication mode">
            <button className={mode === 'login' ? 'active' : ''} onClick={() => { setMode('login'); setError(''); setMessage('') }} type="button">Login</button>
            <button className={mode === 'signup' ? 'active' : ''} onClick={() => { setMode('signup'); setError(''); setMessage('') }} type="button">Sign Up</button>
          </div>
          <h2 className="auth-panel__heading">{mode === 'login' ? 'Welcome back' : 'Create your account'}</h2>
          <p className="auth-panel__subtitle">{mode === 'login' ? 'Sign in to continue to plant analysis.' : 'Register once, then use your email and password to sign in.'}</p>
          {message && <div className="auth-success" role="status">{message}</div>}
          {!isFirebaseConfigured && <div className="auth-error" role="alert">Sign in is temporarily unavailable. Firebase authentication is not connected.</div>}
          <AuthForm mode={mode} onSubmit={handleSubmit} submitting={submitting} error={error} />
          <p className="auth-panel__footnote">{mode === 'login' ? <>Don't have an account? <button type="button" className="auth-link" onClick={() => setMode('signup')}>Create Account</button></> : <>Already have an account? <button type="button" className="auth-link" onClick={() => setMode('login')}>Login</button></>}</p>
        </div>
      </div>
    </div>
  )
}
