import { Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('pldsTheme')
    if (saved) return saved
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('pldsTheme', theme)
  }, [theme])

  const next = theme === 'dark' ? 'light' : 'dark'
  return <button type="button" className="theme-toggle" onClick={() => setTheme(next)} aria-label={`Switch to ${next} mode`} title={`Switch to ${next} mode`}>
    {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
    <span>{theme === 'dark' ? 'Dark' : 'Light'}</span>
  </button>
}
