import { useEffect, useState } from 'react'
import { axiosInstance } from '../api/client'
import { Navigation } from '../components/Navigation'
import { i18n } from '../i18n'

interface SettingsGroup {
  name: string
  description: string
  settings: Setting[]
}

interface Setting {
  key: string
  label: string
  value: string | boolean | number
  type: 'text' | 'boolean' | 'number' | 'select'
  options?: string[]
}

export default function Settings() {
  const [settings, setSettings] = useState<SettingsGroup[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('general')
  const [changes, setChanges] = useState<Record<string, any>>({})
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axiosInstance.get('/settings')
        setSettings(response.data.settings || [])
        setError(null)
      } catch (err) {
        setSettings([
          {
            name: 'general',
            description: 'General Settings',
            settings: [
              { key: 'app_name', label: 'Application Name', value: 'HOMELAB', type: 'text' },
              { key: 'app_version', label: 'Version', value: '1.0.0', type: 'text' },
              { key: 'debug_mode', label: 'Debug Mode', value: false, type: 'boolean' },
            ],
          },
          {
            name: 'security',
            description: 'Security Settings',
            settings: [
              { key: 'token_expire', label: 'Token Expiration (minutes)', value: 60, type: 'number' },
              { key: 'enforce_ssl', label: 'Enforce SSL', value: true, type: 'boolean' },
              { key: 'password_policy', label: 'Password Policy', value: 'strong', type: 'select', options: ['weak', 'medium', 'strong'] },
            ],
          },
          {
            name: 'backup',
            description: 'Backup Settings',
            settings: [
              { key: 'backup_retention', label: 'Retention Period (days)', value: 30, type: 'number' },
              { key: 'auto_backup', label: 'Automatic Backup', value: true, type: 'boolean' },
              { key: 'backup_time', label: 'Backup Time', value: '02:00', type: 'text' },
            ],
          },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [])

  const handleSettingChange = (groupName: string, key: string, value: any) => {
    setChanges({
      ...changes,
      [`${groupName}.${key}`]: value,
    })
    setSaved(false)
  }

  const handleSaveSettings = async () => {
    try {
      await axiosInstance.post('/settings', { changes })
      setSaved(true)
      setChanges({})
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      alert('Failed to save settings')
    }
  }

  if (loading) return (
    <>
      <Navigation />
      <div className="p-4">{i18n.t('common.loading')}</div>
    </>
  )

  const groups = settings.length > 0 ? settings : []

  return (
    <>
      <Navigation />
      <div className="space-y-6 p-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">{i18n.t('settings.title')}</h1>
          {saved && <div className="text-green-600 font-medium">✓ {i18n.t('settings.saved')}</div>}
        </div>

        {error && <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded">{error}</div>}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-light-surface dark:bg-dark-surface rounded-lg shadow p-4">
              <nav className="space-y-2">
                {groups.map((group) => (
                  <button
                    key={group.name}
                    onClick={() => setActiveTab(group.name)}
                    className={`w-full text-left px-4 py-2 rounded capitalize ${
                      activeTab === group.name
                        ? 'bg-accent-primary text-white'
                        : 'text-light-muted dark:text-dark-muted hover:bg-light-surface dark:bg-dark-surface'
                    }`}
                  >
                    {group.name}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          <div className="lg:col-span-3">
            {groups.map((group) => (
              activeTab === group.name && (
                <div key={group.name} className="bg-light-surface dark:bg-dark-surface rounded-lg shadow p-6 space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold">{i18n.t(`settings.${group.name}.title` as any)}</h2>
                    <p className="text-light-muted dark:text-dark-muted text-sm">{i18n.t(`settings.${group.name}.description` as any)}</p>
                  </div>

                  <div className="space-y-4">
                    {group.settings.map((setting) => {
                      const key = `${group.name}.${setting.key}`
                      const value = changes[key] !== undefined ? changes[key] : setting.value

                      return (
                        <div key={setting.key} className="border border-light-border dark:border-dark-border border-light-border dark:border-dark-border rounded p-4">
                          <label className="block font-medium text-light-text dark:text-dark-text mb-2">
                            {setting.label}
                          </label>

                          {setting.type === 'text' && (
                            <input
                              type="text"
                              value={value as string}
                              onChange={(e) => handleSettingChange(group.name, setting.key, e.target.value)}
                              className="w-full border border-light-border dark:border-dark-border rounded px-3 py-2 text-light-text dark:text-dark-text bg-light-surface dark:bg-dark-surface"
                            />
                          )}

                          {setting.type === 'number' && (
                            <input
                              type="number"
                              value={value as number}
                              onChange={(e) => handleSettingChange(group.name, setting.key, parseInt(e.target.value))}
                              className="w-full border border-light-border dark:border-dark-border rounded px-3 py-2 text-light-text dark:text-dark-text bg-light-surface dark:bg-dark-surface"
                            />
                          )}

                          {setting.type === 'boolean' && (
                            <label className="flex items-center gap-3 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={value as boolean}
                                onChange={(e) => handleSettingChange(group.name, setting.key, e.target.checked)}
                                className="w-5 h-5"
                              />
                              <span className="text-light-muted dark:text-dark-muted">{value ? i18n.t('settings.enabled') : i18n.t('settings.disabled')}</span>
                            </label>
                          )}

                          {setting.type === 'select' && (
                            <select
                              value={value as string}
                              onChange={(e) => handleSettingChange(group.name, setting.key, e.target.value)}
                              className="w-full border border-light-border dark:border-dark-border rounded px-3 py-2 text-light-text dark:text-dark-text bg-light-surface dark:bg-dark-surface"
                            >
                              {setting.options?.map((opt) => (
                                <option key={opt} value={opt}>
                                  {opt.charAt(0).toUpperCase() + opt.slice(1)}
                                </option>
                              ))}
                            </select>
                          )}
                        </div>
                      )
                    })}
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleSaveSettings}
                      disabled={Object.keys(changes).length === 0}
                      className="px-6 py-2 bg-accent-primary text-white rounded hover:bg-accent-secondary disabled:bg-gray-400 font-semibold"
                    >
                      {i18n.t('settings.saveChanges')}
                    </button>
                    <button
                      onClick={() => setChanges({})}
                      className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 font-semibold"
                    >
                      {i18n.t('settings.cancel')}
                    </button>
                  </div>
                </div>
              )
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
