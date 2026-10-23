import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
} from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { auth, db, isFirebaseConfigured } from '../firebase.js'

const AuthContext = createContext(null)
const STORAGE_KEY = 'pldsProfile'

function loadStoredProfile() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (parsed && typeof parsed.email === 'string' && typeof parsed.name === 'string') return parsed
    return null
  } catch {
    return null
  }
}

function persistProfile(profile) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(profile)) } catch { /* ignore */ }
}

function clearStoredProfile() {
  try { localStorage.removeItem(STORAGE_KEY) } catch { /* ignore */ }
}

export function AuthProvider({ children }) {
  const [profile, setProfile] = useState(() => loadStoredProfile())
  const [firebaseUser, setFirebaseUser] = useState(null)
  const [initializing, setInitializing] = useState(isFirebaseConfigured)

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      setInitializing(false)
      return undefined
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user)
      if (!user) {
        clearStoredProfile()
        setProfile(null)
      } else if (profile) {
        setProfile((current) => ({
          ...current,
          email: user.email || current.email,
          name: user.displayName || current.name,
        }))
      }
      setInitializing(false)
    })
    return unsubscribe
  }, [])

  async function saveProfile(user, values) {
    const nextProfile = {
      name: values.name.trim(),
      userId: values.userId.trim(),
      email: user.email || values.email.trim(),
    }
    persistProfile(nextProfile)
    setProfile(nextProfile)

    if (db) {
      try {
        await setDoc(doc(db, 'users', user.uid), {
          ...nextProfile,
          uid: user.uid,
          updatedAt: new Date().toISOString(),
        }, { merge: true })
      } catch (error) {
        console.warn('[PLDS] Profile database write failed:', error)
      }
    }
    return nextProfile
  }

  const value = useMemo(() => ({
    profile,
    firebaseUser,
    initializing,
    isFirebaseConfigured,
    isAuthenticated: Boolean(firebaseUser),

    async signUp({ name, userId, email, password }) {
      if (!isFirebaseConfigured || !auth) throw new Error('CONFIG')
      const credential = await createUserWithEmailAndPassword(auth, email.trim(), password)
      await updateProfile(credential.user, { displayName: name.trim() })
      await saveProfile(credential.user, { name, userId, email })
      await firebaseSignOut(auth)
      const saved = { name: name.trim(), userId: userId.trim(), email: email.trim() }
      persistProfile(saved)
      setProfile(saved)
      return credential.user
    },

    async login({ email, password }) {
      if (!isFirebaseConfigured || !auth) throw new Error('CONFIG')
      const credential = await signInWithEmailAndPassword(auth, email.trim(), password)
      const nextProfile = loadStoredProfile() || {
        name: credential.user.displayName || 'User',
        userId: credential.user.email?.split('@')[0] || 'user',
        email: credential.user.email || email.trim(),
      }
      persistProfile({ ...nextProfile, email: credential.user.email || email.trim() })
      setProfile({ ...nextProfile, email: credential.user.email || email.trim() })
      return credential.user
    },

    async logout() {
      clearStoredProfile()
      setProfile(null)
      if (auth) {
        try { await firebaseSignOut(auth) } catch { /* ignore */ }
      }
    },
  }), [profile, firebaseUser, initializing])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}
