import { NavLink } from 'react-router-dom'
import { Leaf, CloudSun, MessageCircle, History, Cpu, LogOut } from 'lucide-react'
import Logo from './Logo.jsx'
import { useAuth } from '../firebase/AuthContext.jsx'

const NAV_ITEMS = [
  { to: '/app/analysis', label: 'Analysis', icon: Leaf },
  { to: '/app/forecast', label: 'Forecast', icon: CloudSun },
  { to: '/app/chat', label: 'Expert Chat', icon: MessageCircle },
  { to: '/app/history', label: 'History', icon: History },
]

export default function Sidebar({ open, onClose }) {
  const { logout } = useAuth()

  return (
    <>
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <Logo size="sm" title="Plant Leaf Disease Detection System" subtitle="AI-Powered Plant Health Detection" />

        <nav className="sidebar__nav">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) => `sidebar__link${isActive ? ' active' : ''}`}
            >
              <Icon size={18} strokeWidth={2} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar__footer">
          <div className="sidebar__model">
            <Cpu size={18} color="#8fbb85" />
            <div className="sidebar__model-text">
              <div className="sidebar__model-name">MobileNet V3</div>
              <div className="sidebar__model-sub">Edge-ready model</div>
            </div>
          </div>
          <button type="button" className="sidebar__signout" onClick={logout}>
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>
      <div
        className={`sidebar-backdrop ${open ? 'open' : ''}`}
        onClick={onClose}
        role="presentation"
      />
    </>
  )
}
