import { useEffect, useState } from 'react'
import { axiosInstance } from '../api/client'
import { Navigation } from '../components/Navigation'
import { i18n } from '../i18n'

interface SystemMetrics {
  cpu_percent: number
  memory: {
    percent: number
    used: number
    total: number
  }
  disk: {
    percent: number
    used: number
    total: number
  }
  network: Record<string, any>
  system_info: {
    hostname: string
    cpu_count: number
    uptime_seconds: number
  }
}

export default function Metrics() {
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await axiosInstance.get('/system/metrics')
        setMetrics(response.data)
        setError(null)
      } catch (err) {
        setError('Failed to fetch metrics')
      } finally {
        setLoading(false)
      }
    }

    fetchMetrics()
    const interval = setInterval(fetchMetrics, 5000)
    return () => clearInterval(interval)
  }, [])

  if (loading) return <><Navigation /><div className="p-4">{i18n.t('common.loading')}</div></>
  if (error) return <><Navigation /><div className="p-4 text-red-600">{error}</div></>
  if (!metrics) return <><Navigation /><div className="p-4">{i18n.t('common.noData')}</div></>

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  }

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400)
    const hours = Math.floor((seconds % 86400) / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    return `${days}d ${hours}h ${mins}m`
  }

  return (
    <>
      <Navigation />
      <div className="space-y-6 p-8">
        <h1 className="text-3xl font-bold">{i18n.t('metrics.title')}</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">{i18n.t('metrics.cpu')}</h2>
            <div className="text-4xl font-bold text-blue-600">{metrics.cpu_percent.toFixed(1)}%</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${metrics.cpu_percent}%` }}
              />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">{i18n.t('metrics.memory')}</h2>
            <div className="text-4xl font-bold text-green-600">{metrics.memory.percent.toFixed(1)}%</div>
            <div className="text-sm text-gray-600 mt-2">
              {formatBytes(metrics.memory.used)} / {formatBytes(metrics.memory.total)}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
              <div
                className="bg-green-600 h-2 rounded-full"
                style={{ width: `${metrics.memory.percent}%` }}
              />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">{i18n.t('metrics.disk')}</h2>
            <div className="text-4xl font-bold text-orange-600">{metrics.disk.percent.toFixed(1)}%</div>
            <div className="text-sm text-gray-600 mt-2">
              {formatBytes(metrics.disk.used)} / {formatBytes(metrics.disk.total)}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
              <div
                className="bg-orange-600 h-2 rounded-full"
                style={{ width: `${metrics.disk.percent}%` }}
              />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">{i18n.t('metrics.systemInfo')}</h2>
            <div className="space-y-2 text-sm">
              <div><span className="font-semibold">{i18n.t('metrics.hostname')}:</span> {metrics.system_info.hostname}</div>
              <div><span className="font-semibold">{i18n.t('metrics.cpuCores')}:</span> {metrics.system_info.cpu_count}</div>
              <div><span className="font-semibold">{i18n.t('diagnostics.uptime')}:</span> {formatUptime(metrics.system_info.uptime_seconds)}</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">{i18n.t('metrics.networkInterfaces')}</h2>
          <div className="space-y-2">
            {Object.entries(metrics.network).map(([iface, data]: [string, any]) => (
              <div key={iface} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="font-mono">{iface}</span>
                <span className="text-sm text-gray-600">
                  {data.ip_addresses.join(', ') || i18n.t('metrics.noIp')}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
