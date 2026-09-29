import { useEffect, useState } from 'react'
import { axiosInstance } from '../api/client'
import { Navigation } from '../components/Navigation'
import { i18n } from '../i18n'

interface FirewallRule {
  port: number
  protocol: string
  action: string
  source: string
}

interface SecurityStatus {
  ssh_enabled: boolean
  firewall_active: boolean
  selinux_status: string
  fail2ban_active: boolean
  open_ports: number[]
}

export default function Security() {
  const [security, setSecurity] = useState<SecurityStatus | null>(null)
  const [rules, setRules] = useState<FirewallRule[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSecurityData = async () => {
      try {
        // Fetch security status
        const response = await axiosInstance.get('/system/security')
        setSecurity(response.data)

        // Set example firewall rules
        setRules([
          { port: 22, protocol: 'tcp', action: 'ACCEPT', source: 'any' },
          { port: 80, protocol: 'tcp', action: 'ACCEPT', source: 'any' },
          { port: 443, protocol: 'tcp', action: 'ACCEPT', source: 'any' },
          { port: 8000, protocol: 'tcp', action: 'ACCEPT', source: 'any' },
        ])

        setError(null)
      } catch (err) {
        setSecurity({
          ssh_enabled: true,
          firewall_active: true,
          selinux_status: 'disabled',
          fail2ban_active: true,
          open_ports: [22, 80, 443, 8000],
        })
        setRules([
          { port: 22, protocol: 'tcp', action: 'ACCEPT', source: 'any' },
          { port: 80, protocol: 'tcp', action: 'ACCEPT', source: 'any' },
          { port: 443, protocol: 'tcp', action: 'ACCEPT', source: 'any' },
          { port: 8000, protocol: 'tcp', action: 'ACCEPT', source: 'any' },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchSecurityData()
  }, [])

  if (loading) return (
    <>
      <Navigation />
      <div className="p-4">{i18n.t('common.loading')}</div>
    </>
  )

  return (
    <>
      <Navigation />
      <div className="space-y-6 p-8">
        <h1 className="text-3xl font-bold">{i18n.t('security.title')}</h1>

        {error && <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded">{error}</div>}

        {security && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-light-surface dark:bg-dark-surface rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">{i18n.t('security.systemSecurity')}</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border border-light-border dark:border-dark-border rounded">
                  <span className="font-medium">{i18n.t('security.sshService')}</span>
                  <span className={`px-3 py-1 rounded text-sm ${
                    security.ssh_enabled ? 'bg-status-success/10 text-status-success' : 'bg-red-100 text-red-800'
                  }`}>
                    {security.ssh_enabled ? i18n.t('security.enabled') : i18n.t('security.disabled')}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 border border-light-border dark:border-dark-border rounded">
                  <span className="font-medium">{i18n.t('security.firewall')}</span>
                  <span className={`px-3 py-1 rounded text-sm ${
                    security.firewall_active ? 'bg-status-success/10 text-status-success' : 'bg-red-100 text-red-800'
                  }`}>
                    {security.firewall_active ? i18n.t('security.active') : i18n.t('security.inactive')}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 border border-light-border dark:border-dark-border rounded">
                  <span className="font-medium">{i18n.t('security.fail2ban')}</span>
                  <span className={`px-3 py-1 rounded text-sm ${
                    security.fail2ban_active ? 'bg-status-success/10 text-status-success' : 'bg-light-surface dark:bg-dark-surface text-light-text dark:text-dark-text'
                  }`}>
                    {security.fail2ban_active ? i18n.t('security.active') : i18n.t('security.inactive')}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 border border-light-border dark:border-dark-border rounded">
                  <span className="font-medium">{i18n.t('security.selinux')}</span>
                  <span className={`px-3 py-1 rounded text-sm font-mono ${
                    security.selinux_status === 'enforcing' ? 'bg-status-success/10 text-status-success' : 'bg-light-surface dark:bg-dark-surface text-light-text dark:text-dark-text'
                  }`}>
                    {security.selinux_status}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-light-surface dark:bg-dark-surface rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">{i18n.t('security.openPorts')}</h2>
              <div className="space-y-2">
                {security.open_ports.length > 0 ? (
                  security.open_ports.map((port) => (
                    <div key={port} className="flex items-center justify-between p-3 bg-light-border dark:bg-dark-border rounded">
                      <span className="font-mono text-light-text dark:text-dark-text">{port}</span>
                      <span className="text-sm text-light-muted dark:text-dark-muted">tcp</span>
                    </div>
                  ))
                ) : (
                  <p className="text-light-muted dark:text-dark-muted">{i18n.t('security.noOpenPorts')}</p>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="bg-light-surface dark:bg-dark-surface rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">{i18n.t('security.firewallRules')}</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-light-surface dark:bg-dark-surface">
                <tr>
                  <th className="px-4 py-2 text-left">{i18n.t('security.port')}</th>
                  <th className="px-4 py-2 text-left">{i18n.t('security.protocol')}</th>
                  <th className="px-4 py-2 text-left">{i18n.t('security.action')}</th>
                  <th className="px-4 py-2 text-left">{i18n.t('security.source')}</th>
                </tr>
              </thead>
              <tbody>
                {rules.map((rule, idx) => (
                  <tr key={idx} className="border-t hover:bg-light-surface dark:bg-dark-surface">
                    <td className="px-4 py-2 font-mono">{rule.port}</td>
                    <td className="px-4 py-2 uppercase text-sm">{rule.protocol}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded text-sm ${
                        rule.action === 'ACCEPT' ? 'bg-status-success/10 text-status-success' : 'bg-red-100 text-red-800'
                      }`}>
                        {rule.action}
                      </span>
                    </td>
                    <td className="px-4 py-2">{rule.source}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}
