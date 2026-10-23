import { useState } from 'react'
import { Eye, EyeOff, KeyRound, Mail, UserRound } from 'lucide-react'

const initialState = { name: '', userId: '', email: '', password: '', confirmPassword: '' }

function friendlyAuthError(error) {
  const code = error?.code || ''
  if (code.includes('email-already-in-use')) return 'An account already exists with this email.'
  if (code.includes('invalid-email')) return 'Please enter a valid email address.'
  if (code.includes('weak-password')) return 'Password must be at least 6 characters.'
  if (code.includes('user-not-found') || code.includes('invalid-credential')) return 'Account not found. Please check your email or create an account.'
  if (code.includes('wrong-password')) return 'Incorrect password. Please try again.'
  if (error?.message === 'CONFIG' || code.includes('configuration-not-found')) return 'Unable to sign in right now. Please try again later.'
  return 'We could not complete that request. Please check your details and try again.'
}

export default function AuthForm({ mode, onSubmit, submitting, error }) {
  const [values, setValues] = useState(initialState)
  const [fieldErrors, setFieldErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  function update(field) {
    return (event) => {
      const value = event.target.value
      setValues((prev) => ({ ...prev, [field]: value }))
      setFieldErrors((prev) => (prev[field] ? { ...prev, [field]: '' } : prev))
    }
  }

  function handleSubmit(event) {
    event.preventDefault()
    const errors = {}
    if (mode === 'signup') {
      if (!values.name.trim()) errors.name = 'Please enter your name.'
      if (!values.userId.trim()) errors.userId = 'Please choose a User ID.'
      if (!values.email.trim()) errors.email = 'Please enter your email.'
      if (values.password.length < 6) errors.password = 'Password must be at least 6 characters.'
      if (values.password !== values.confirmPassword) errors.confirmPassword = 'Passwords do not match.'
    } else {
      if (!values.email.trim()) errors.email = 'Please enter your email.'
      if (!values.password) errors.password = 'Please enter your password.'
    }
    setFieldErrors(errors)
    if (Object.keys(errors).length) return
    onSubmit(values).catch?.((err) => {
      setFieldErrors({ form: friendlyAuthError(err) })
    })
  }

  const isSignup = mode === 'signup'
  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      {isSignup && <>
        <div className="field"><label htmlFor="name">Name</label><div className="field__control"><UserRound size={17} className="field__icon" /><input id="name" type="text" placeholder="Your full name" value={values.name} onChange={update('name')} autoComplete="name" /></div>{fieldErrors.name && <span className="field__error">{fieldErrors.name}</span>}</div>
        <div className="field"><label htmlFor="userId">User ID</label><div className="field__control"><UserRound size={17} className="field__icon" /><input id="userId" type="text" placeholder="Choose a User ID" value={values.userId} onChange={update('userId')} autoComplete="username" /></div>{fieldErrors.userId && <span className="field__error">{fieldErrors.userId}</span>}</div>
      </>}
      <div className="field"><label htmlFor="email">Email</label><div className="field__control"><Mail size={17} className="field__icon" /><input id="email" type="email" placeholder="you@example.com" value={values.email} onChange={update('email')} autoComplete="email" /></div>{fieldErrors.email && <span className="field__error">{fieldErrors.email}</span>}</div>
      <div className="field"><label htmlFor="password">Password</label><div className="field__control"><KeyRound size={17} className="field__icon" /><input id="password" type={showPassword ? 'text' : 'password'} placeholder="Enter your password" value={values.password} onChange={update('password')} autoComplete={isSignup ? 'new-password' : 'current-password'} /><button type="button" className="field__toggle" onClick={() => setShowPassword((v) => !v)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div>{fieldErrors.password && <span className="field__error">{fieldErrors.password}</span>}</div>
      {isSignup && <div className="field"><label htmlFor="confirmPassword">Confirm Password</label><div className="field__control"><KeyRound size={17} className="field__icon" /><input id="confirmPassword" type={showConfirm ? 'text' : 'password'} placeholder="Re-enter your password" value={values.confirmPassword} onChange={update('confirmPassword')} autoComplete="new-password" /><button type="button" className="field__toggle" onClick={() => setShowConfirm((v) => !v)} aria-label={showConfirm ? 'Hide password' : 'Show password'}>{showConfirm ? <EyeOff size={17} /> : <Eye size={17} />}</button></div>{fieldErrors.confirmPassword && <span className="field__error">{fieldErrors.confirmPassword}</span>}</div>}
      {(error || fieldErrors.form) && <div className="auth-error" role="alert">{error || fieldErrors.form}</div>}
      <button type="submit" className="btn btn--primary btn--block auth-submit" disabled={submitting}>{submitting ? 'Please wait…' : isSignup ? 'Create Account' : 'Login to Plant Analysis'}</button>
    </form>
  )
}
