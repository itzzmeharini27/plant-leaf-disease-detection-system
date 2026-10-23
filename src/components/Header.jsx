import { Menu } from 'lucide-react'
import ThemeToggle from './ThemeToggle.jsx'
import Logo from './Logo.jsx'
import { useAuth } from '../firebase/AuthContext.jsx'

function initials(name) {
  const source = name || '?'
  return source
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export default function Header({ onMenuClick }) {
  const { profile } = useAuth()
  const displayName = profile?.name || 'Guest'
  const userId = profile?.userId || '—'

  return (
    <header className="topheader">
      <div className="topheader__left">
        <button type="button" className="topheader__menu" onClick={onMenuClick} aria-label="Open navigation">
          <Menu size={22} />
        </button>
        <Logo title="Plant Leaf Disease Detection System" />
      </div>
      <div className="user-chip">
        <span className="user-chip__avatar">{initials(displayName)}</span>
        <span>
          <span className="user-chip__name">Welcome, {displayName}</span>
          <br />
          <span className="user-chip__email">User ID: {userId}</span>
        </span>
        <ThemeToggle />
      </div>
    </header>
  )
}
