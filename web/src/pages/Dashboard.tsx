import { useHealth, useSystemStatus } from '../api/hooks'
import { Navigation } from '../components/Navigation'
import { i18n } from '../i18n'

export function Dashboard() {
  const { health, loading } = useHealth()
  const status = useSystemStatus()

  if (loading) {
    return <div className="p-8">{i18n.t('common.loading')}</div>
  }

  return (
    <>
      <Navigation />
      <div className="p-8">
        <h1 className="text-4xl font-bold mb-8">{i18n.t('dashboard.title')}</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {status && (
            <>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-gray-600 text-sm font-medium mb-2">{i18n.t('metrics.cpu')}</h3>
                <div className="text-3xl font-bold">{status.cpu_percent?.toFixed(1)}%</div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-gray-600 text-sm font-medium mb-2">RAM</h3>
                <div className="text-3xl font-bold">{status.ram_percent?.toFixed(1)}%</div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-gray-600 text-sm font-medium mb-2">{i18n.t('metrics.disk')}</h3>
                <div className="text-3xl font-bold">{status.disk_percent?.toFixed(1)}%</div>
              </div>
            </>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">{i18n.t('metrics.systemInfo')}</h2>
          <p className="text-gray-600">{i18n.t('metrics.hostname')}: {status?.hostname}</p>
          {health && (
            <>
              <p className="text-gray-600">Version: {health.version}</p>
              <p className="text-gray-600">{i18n.t('diagnostics.uptime')}: {(health.uptime / 3600).toFixed(2)} {i18n.t('diagnostics.min')}</p>
            </>
          )}
        </div>
      </div>
    </>
  )
}
