import { Link, useLocation } from 'react-router-dom'
import { Sun, Moon } from 'lucide-react'
import { i18n } from '../i18n'
import { useTheme } from '../store/themeContext'

export function Navigation() {
  const location = useLocation()
  const { theme, toggleTheme } = useTheme()

  const isActive = (path: string) => location.pathname === path

  const toggleLanguage = () => {
    const newLang = i18n.getLanguage() === 'en' ? 'ru' : 'en'
    i18n.setLanguage(newLang)
    window.location.reload()
  }

  const navItems = [
    { path: '/dashboard', labelKey: 'navigation.dashboard', icon: '📊' },
    { path: '/labs', labelKey: 'navigation.labs', icon: '📚' },
    { path: '/metrics', labelKey: 'navigation.metrics', icon: '📈' },
    { path: '/docker', labelKey: 'navigation.docker', icon: '🐳' },
    { path: '/services', labelKey: 'navigation.services', icon: '⚙️' },
    { path: '/network', labelKey: 'navigation.network', icon: '🌐' },
    { path: '/storage', labelKey: 'navigation.storage', icon: '💾' },
    { path: '/security', labelKey: 'navigation.security', icon: '🔒' },
    { path: '/backup', labelKey: 'navigation.backup', icon: '📦' },
    { path: '/diagnostics', labelKey: 'navigation.diagnostics', icon: '🔍' },
    { path: '/settings', labelKey: 'navigation.settings', icon: '⚡' },
  ]

  return (
    <nav className="bg-light-bg dark:bg-dark-bg text-light-text dark:text-white shadow-lg sticky top-0 z-50 border-b border-light-border dark:border-dark-border backdrop-blur-xs">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <Link to="/dashboard" className="text-2xl font-bold text-accent-primary flex-shrink-0 hover:opacity-80 transition-opacity">
            HOMELAB
          </Link>
          <div className="flex gap-1 overflow-x-auto flex-wrap justify-center flex-1 min-w-0">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap text-xs sm:text-sm flex-shrink-0 transition-all duration-200 ${
                  isActive(item.path)
                    ? 'bg-accent-primary text-white shadow-lg'
                    : 'text-light-muted dark:text-dark-muted hover:bg-light-surface dark:hover:bg-dark-surface hover:text-light-text dark:hover:text-dark-text'
                }`}
              >
                <span>{item.icon}</span>
                <span className="hidden sm:inline">{i18n.t(item.labelKey as any)}</span>
              </Link>
            ))}
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-light-surface dark:bg-dark-surface hover:bg-light-border dark:hover:bg-dark-border text-light-text dark:text-dark-text transition-all duration-200"
              title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              onClick={toggleLanguage}
              className="px-3 py-2 rounded-lg bg-accent-primary hover:bg-accent-secondary text-white text-xs sm:text-sm font-semibold transition-all duration-200"
            >
              {i18n.getLanguage() === 'en' ? '🇷🇺 РУ' : '🇬🇧 EN'}
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

