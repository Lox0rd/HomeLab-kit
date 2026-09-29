import { Link, useLocation } from 'react-router-dom'
import { i18n } from '../i18n'

export function Navigation() {
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  const toggleLanguage = () => {
    const newLang = i18n.getLanguage() === 'en' ? 'ru' : 'en'
    i18n.setLanguage(newLang)
    window.location.reload()
  }

  const navItems = [
    { path: '/', labelKey: 'navigation.dashboard', icon: '📊' },
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
    <nav className="bg-gray-900 text-white shadow-lg sticky top-0 z-50">
      <div className="px-4 py-2">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <Link to="/" className="text-2xl font-bold text-blue-400 flex-shrink-0">
            HOMELAB
          </Link>
          <div className="flex gap-1 overflow-x-auto flex-wrap justify-center flex-1 min-w-0">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-2 py-1 rounded flex items-center gap-1 whitespace-nowrap text-xs sm:text-sm flex-shrink-0 ${
                  isActive(item.path)
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                <span>{item.icon}</span>
                <span className="hidden sm:inline">{i18n.t(item.labelKey as any)}</span>
              </Link>
            ))}
          </div>
          <button
            onClick={toggleLanguage}
            className="px-2 py-1 rounded bg-blue-600 hover:bg-blue-700 text-xs sm:text-sm font-semibold flex items-center gap-1 flex-shrink-0"
          >
            {i18n.getLanguage() === 'en' ? '🇷🇺 РУ' : '🇬🇧 EN'}
          </button>
        </div>
      </div>
    </nav>
  )
}
