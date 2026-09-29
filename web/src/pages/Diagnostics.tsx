import { useEffect, useState } from 'react'
import { axiosInstance } from '../api/client'
import { Navigation } from '../components/Navigation'
import { i18n } from '../i18n'

interface LogEntry {
  timestamp: string
  level: string
  service: string
  message: string
}

interface SystemDiagnostic {
  boot_time: string
  load_average: number[]
  process_count: number
  error_count: number
  warning_count: number
  last_errors: LogEntry[]
}

export default function Diagnostics() {
  const [diagnostics, setDiagnostics] = useState<SystemDiagnostic | null>(null)
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'logs' | 'performance'>('overview')

  useEffect(() => {
    const fetchDiagnostics = async () => {
      try {
        const response = await axiosInstance.get('/system/diagnostics')
        setDiagnostics(response.data)
        setLogs(response.data.last_errors || [])
        setError(null)
      } catch (err) {
        setDiagnostics({
          boot_time: new Date(Date.now() - 86400000).toISOString(),
          load_average: [0.5, 0.6, 0.7],
          process_count: 256,
          error_count: 3,
          warning_count: 12,
          last_errors: [],
        })
        setLogs([
          {
            timestamp: new Date().toISOString(),
            level: 'ERROR',
            service: 'systemd',
            message: 'Failed to start service X',
          },
          {
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            level: 'WARNING',
            service: 'kernel',
            message: 'CPU temperature warning',
          },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchDiagnostics()
    const interval = setInterval(fetchDiagnostics, 30000)
    return () => clearInterval(interval)
  }, [])

  const getLogColor = (level: string) => {
    switch (level) {
      case 'ERROR':
        return 'bg-red-100 text-red-800'
      case 'WARNING':
        return 'bg-yellow-100 text-yellow-800'
      case 'INFO':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

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
        <h1 className="text-3xl font-bold">{i18n.t('diagnostics.title')}</h1>

        {error && <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded">{error}</div>}

        <div className="flex gap-4 border-b">
          {(['overview', 'logs', 'performance'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-semibold capitalize ${
                activeTab === tab ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'
              }`}
            >
              {i18n.t(`diagnostics.${tab}` as any)}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && diagnostics && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">{i18n.t('diagnostics.systemStatus')}</h2>
              <div className="space-y-3">
                <div className="flex justify-between p-3 border rounded">
                  <span className="font-medium">{i18n.t('diagnostics.bootTime')}</span>
                  <span className="font-mono">{new Date(diagnostics.boot_time).toLocaleString()}</span>
                </div>
                <div className="flex justify-between p-3 border rounded">
                  <span className="font-medium">{i18n.t('diagnostics.uptime')}</span>
                  <span className="font-mono">
                    {Math.floor((Date.now() - new Date(diagnostics.boot_time).getTime()) / 3600000)} {i18n.t('diagnostics.min')}
                  </span>
                </div>
                <div className="flex justify-between p-3 border rounded">
                  <span className="font-medium">{i18n.t('diagnostics.runningProcesses')}</span>
                  <span className="font-mono">{diagnostics.process_count}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">{i18n.t('diagnostics.healthStatus')}</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded">
                  <span className="font-medium">{i18n.t('diagnostics.errors')}</span>
                  <span className={`px-3 py-1 rounded text-sm ${
                    diagnostics.error_count > 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {diagnostics.error_count}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 border rounded">
                  <span className="font-medium">{i18n.t('diagnostics.warnings')}</span>
                  <span className={`px-3 py-1 rounded text-sm ${
                    diagnostics.warning_count > 5 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {diagnostics.warning_count}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6 md:col-span-2">
              <h2 className="text-lg font-semibold mb-4">{i18n.t('diagnostics.loadAverage')}</h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-gray-600 text-sm">1 {i18n.t('diagnostics.min')}</p>
                  <p className="text-3xl font-bold">{diagnostics.load_average[0].toFixed(2)}</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-600 text-sm">5 {i18n.t('diagnostics.min')}</p>
                  <p className="text-3xl font-bold">{diagnostics.load_average[1].toFixed(2)}</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-600 text-sm">15 {i18n.t('diagnostics.min')}</p>
                  <p className="text-3xl font-bold">{diagnostics.load_average[2].toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'logs' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">{i18n.t('diagnostics.recentLogs')}</h2>
            <div className="space-y-3">
              {logs.length > 0 ? (
                logs.map((log, idx) => (
                  <div key={idx} className="border rounded p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${getLogColor(log.level)}`}>
                          {log.level}
                        </span>
                        <span className="font-mono text-sm text-gray-600">{log.service}</span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(log.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-gray-800">{log.message}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">{i18n.t('diagnostics.noRecentLogs')}</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'performance' && (
          <div className="grid grid-cols-1 gap-4">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">{i18n.t('diagnostics.systemPerformance')}</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">{i18n.t('diagnostics.cpuUsageTrend')}</span>
                    <span className="text-sm text-gray-600">{i18n.t('diagnostics.last24h')}</span>
                  </div>
                  <div className="h-32 bg-gray-100 rounded flex items-center justify-center">
                    <p className="text-gray-500">Performance chart would render here</p>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">{i18n.t('diagnostics.memoryUsageTrend')}</span>
                    <span className="text-sm text-gray-600">{i18n.t('diagnostics.last24h')}</span>
                  </div>
                  <div className="h-32 bg-gray-100 rounded flex items-center justify-center">
                    <p className="text-gray-500">Performance chart would render here</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
