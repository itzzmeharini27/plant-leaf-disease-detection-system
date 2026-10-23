import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar.jsx'
import Header from '../components/Header.jsx'

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="app-shell botanical-shell"><div className="botanical-bg" aria-hidden="true"><span /><span /><span /><span /></div>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="app-main">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <Outlet />
      </div>
    </div>
  )
}
