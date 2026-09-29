import { useEffect, useState } from 'react'
import { useHealth, useSystemStatus } from '../api/hooks'
import { Navigation } from '../components/Navigation'
import { StatCard } from '../components/StatCard'
import { AchievementProgress } from '../components/AchievementProgress'
import { i18n } from '../i18n'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface MetricHistory {
  time: string
  cpu: number
  memory: number
}

export function Dashboard() {
  const { health, loading } = useHealth()
  const status = useSystemStatus()
  const [metrics, setMetrics] = useState<MetricHistory[]>([])
  const [completedLabs, setCompletedLabs] = useState(0)
  const [totalLabs, setTotalLabs] = useState(0)

  useEffect(() => {
    const loadLabsProgress = async () => {
      try {
        const progress = localStorage.getItem('labProgress')
        if (progress) {
          const labs = JSON.parse(progress)
          const completed = Object.values(labs).filter((status: any) => status === 'completed').length
          setCompletedLabs(completed)
          setTotalLabs(Object.keys(labs).length)
        }
      } catch (err) {
        console.error('Failed to load labs progress:', err)
      }
    }
    loadLabsProgress()
  }, [])

  useEffect(() => {
    setMetrics(prev => {
      const now = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      const newMetrics = [...prev, {
        time: now,
        cpu: status?.cpu_percent || 0,
        memory: status?.ram_percent || 0,
      }]
      return newMetrics.slice(-20)
    })
  }, [status])

  if (loading) {
    return (
      <>
        <Navigation />
        <div className="flex items-center justify-center min-h-screen bg-dark-bg dark:bg-dark-bg">
          <div className="text-dark-text dark:text-dark-text">{i18n.t('common.loading')}</div>
        </div>
      </>
    )
  }

  const systemHealth = Math.max(0, 100 - (((status?.cpu_percent || 0) + (status?.ram_percent || 0)) / 2))

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-light-bg dark:bg-dark-bg">
        <div className="p-6 md:p-8 max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 animate-fadeIn">
            <h1 className="text-4xl md:text-5xl font-bold text-light-text dark:text-dark-text mb-2">
              {i18n.t('dashboard.title')}
            </h1>
            <p className="text-light-muted dark:text-dark-muted">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          {/* Achievement Progress */}
          <div className="mb-12 animate-slideUp">
            <div className="bg-light-surface dark:bg-dark-surface rounded-xl p-8 border border-light-border dark:border-dark-border">
              <h2 className="text-xl font-semibold text-light-text dark:text-dark-text mb-6">
                Progress
              </h2>
              <div className="flex flex-col md:flex-row items-center gap-8">
                <AchievementProgress completed={completedLabs} total={totalLabs || 20} size="lg" />
                <div className="flex-1">
                  <p className="text-light-muted dark:text-dark-muted mb-4">
                    Completed Labs: <span className="text-2xl font-bold text-accent-primary">{completedLabs}</span> / {totalLabs || 20}
                  </p>
                  <div className="w-full bg-light-border dark:bg-dark-border border-light-border dark:border-dark-border rounded-full h-2">
                    <div
                      className="bg-accent-primary h-2 rounded-full transition-all duration-500"
                      style={{ width: `${totalLabs > 0 ? (completedLabs / totalLabs) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title={i18n.t('metrics.cpu')}
              value={status?.cpu_percent?.toFixed(1) || '0'}
              unit="%"
              icon="⚙️"
              color={((status?.cpu_percent || 0) > 80) ? 'error' : (status?.cpu_percent || 0) > 50 ? 'warning' : 'success'}
            />
            <StatCard
              title="RAM"
              value={status?.ram_percent?.toFixed(1) || '0'}
              unit="%"
              icon="🧠"
              color={((status?.ram_percent || 0) > 80) ? 'error' : (status?.ram_percent || 0) > 50 ? 'warning' : 'success'}
            />
            <StatCard
              title={i18n.t('metrics.disk')}
              value={status?.disk_percent?.toFixed(1) || '0'}
              unit="%"
              icon="💾"
              color={((status?.disk_percent || 0) > 80) ? 'error' : (status?.disk_percent || 0) > 50 ? 'warning' : 'success'}
            />
            <StatCard
              title={i18n.t('diagnostics.uptime')}
              value={health ? (health.uptime / 3600).toFixed(1) : '0'}
              unit="h"
              icon="⏱️"
              color="primary"
            />
          </div>

          {/* System Health Gauge */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2 bg-light-surface dark:bg-dark-surface rounded-xl p-6 border border-light-border dark:border-dark-border animate-slideUp">
              <h2 className="text-xl font-semibold text-light-text dark:text-dark-text mb-4">
                {i18n.t('metrics.systemInfo')}
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={metrics}>
                  <defs>
                    <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorMemory" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="time" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#F9FAFB',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                      color: '#111827'
                    }}
                  />
                  <Area type="monotone" dataKey="cpu" stroke="#6366F1" fillOpacity={1} fill="url(#colorCpu)" />
                  <Area type="monotone" dataKey="memory" stroke="#8B5CF6" fillOpacity={1} fill="url(#colorMemory)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-light-surface dark:bg-dark-surface rounded-xl p-6 border border-light-border dark:border-dark-border animate-slideUp">
              <h3 className="text-lg font-semibold text-light-text dark:text-dark-text mb-4">
                System Health
              </h3>
              <div className="flex flex-col items-center justify-center h-64">
                <div className="relative w-32 h-32">
                  <svg className="transform -rotate-90" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="45" fill="none" stroke="currentColor" strokeWidth="8" className="text-light-border dark:text-dark-border"/>
                    <circle
                      cx="60" cy="60" r="45" fill="none" stroke="currentColor" strokeWidth="8"
                      className={systemHealth > 70 ? 'text-status-success' : systemHealth > 40 ? 'text-status-warning' : 'text-status-error'}
                      style={{
                        strokeDasharray: `${2 * Math.PI * 45}`,
                        strokeDashoffset: `${2 * Math.PI * 45 - (systemHealth / 100) * 2 * Math.PI * 45}`,
                      }}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-bold text-light-text dark:text-dark-text">
                      {systemHealth.toFixed(0)}%
                    </span>
                  </div>
                </div>
                <p className="text-light-muted dark:text-dark-muted text-sm mt-4 text-center">
                  {systemHealth > 70 ? '✓ Good' : systemHealth > 40 ? '⚠ Fair' : '✗ Poor'}
                </p>
              </div>
            </div>
          </div>

          {/* System Info */}
          <div className="bg-light-surface dark:bg-dark-surface rounded-xl p-6 border border-light-border dark:border-dark-border animate-slideUp">
            <h2 className="text-lg font-semibold text-light-text dark:text-dark-text mb-4">
              {i18n.t('metrics.systemInfo')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-light-muted dark:text-dark-muted">{i18n.t('metrics.hostname')}:</span>
                <span className="text-light-text dark:text-dark-text ml-2 font-semibold">{status?.hostname}</span>
              </div>
              <div>
                <span className="text-light-muted dark:text-dark-muted">Version:</span>
                <span className="text-light-text dark:text-dark-text ml-2 font-semibold">{health?.version}</span>
              </div>
              <div>
                <span className="text-light-muted dark:text-dark-muted">Boot Time:</span>
                <span className="text-light-text dark:text-dark-text ml-2 font-semibold">
                  {status?.boot_time ? new Date(status.boot_time).toLocaleDateString() : 'N/A'}
                </span>
              </div>
              <div>
                <span className="text-light-muted dark:text-dark-muted">API Status:</span>
                <span className="text-status-success ml-2 font-semibold">● Running</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
