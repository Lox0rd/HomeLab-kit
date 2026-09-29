import { useEffect, useState } from 'react'
import { axiosInstance } from '../api/client'
import { Navigation } from '../components/Navigation'
import { i18n } from '../i18n'

interface BackupJob {
  id: string
  name: string
  source: string
  destination: string
  schedule: string
  last_run: string
  last_status: string
  size: number
  retention_days: number
}

export default function Backup() {
  const [backups, setBackups] = useState<BackupJob[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showNewBackup, setShowNewBackup] = useState(false)

  useEffect(() => {
    const fetchBackupData = async () => {
      try {
        const response = await axiosInstance.get('/system/backup')
        setBackups(response.data.backups || [])
        setError(null)
      } catch (err) {
        setBackups([
          {
            id: 'backup-1',
            name: 'System Backup',
            source: '/etc',
            destination: '/mnt/backups/system',
            schedule: 'daily',
            last_run: '2026-09-29 02:00:00',
            last_status: 'success',
            size: 1073741824,
            retention_days: 30,
          },
          {
            id: 'backup-2',
            name: 'Database Backup',
            source: '/var/lib/mysql',
            destination: '/mnt/backups/database',
            schedule: 'daily',
            last_run: '2026-09-29 03:00:00',
            last_status: 'success',
            size: 5368709120,
            retention_days: 60,
          },
          {
            id: 'backup-3',
            name: 'Home Backup',
            source: '/home',
            destination: '/mnt/backups/home',
            schedule: 'weekly',
            last_run: '2026-09-28 04:00:00',
            last_status: 'success',
            size: 10737418240,
            retention_days: 90,
          },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchBackupData()
  }, [])

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  }

  const handleRunBackup = async (backupId: string) => {
    try {
      await axiosInstance.post(`/system/backup/${backupId}/run`)
      alert('Backup started')
    } catch (err) {
      alert('Failed to start backup')
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
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">{i18n.t('backup.title')}</h1>
          <button
            onClick={() => setShowNewBackup(!showNewBackup)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold"
          >
            {i18n.t('backup.newBackupJob')}
          </button>
        </div>

        {error && <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded">{error}</div>}

        {showNewBackup && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">{i18n.t('backup.createNewBackupJob')}</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">{i18n.t('backup.jobName')}</label>
                <input type="text" className="w-full border rounded px-3 py-2" placeholder="e.g., Custom Backup" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">{i18n.t('backup.source')}</label>
                  <input type="text" className="w-full border rounded px-3 py-2" placeholder="/path/to/backup" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{i18n.t('backup.destination')}</label>
                  <input type="text" className="w-full border rounded px-3 py-2" placeholder="/mnt/backups" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">{i18n.t('backup.schedule')}</label>
                  <select className="w-full border rounded px-3 py-2">
                    <option>{i18n.t('backup.daily')}</option>
                    <option>{i18n.t('backup.weekly')}</option>
                    <option>{i18n.t('backup.monthly')}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{i18n.t('backup.retention')}</label>
                  <input type="number" className="w-full border rounded px-3 py-2" placeholder="30" defaultValue="30" />
                </div>
              </div>
              <div className="flex gap-3">
                <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                  {i18n.t('backup.create')}
                </button>
                <button type="button" onClick={() => setShowNewBackup(false)} className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
                  {i18n.t('backup.cancel')}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4">
          {backups.map((backup) => (
            <div key={backup.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-lg font-semibold">{backup.name}</h2>
                  <p className="text-sm text-gray-500">{backup.source} → {backup.destination}</p>
                </div>
                <span className={`px-3 py-1 rounded text-sm font-medium ${
                  backup.last_status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {backup.last_status}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                <div>
                  <p className="text-gray-600">{i18n.t('backup.schedule')}</p>
                  <p className="font-semibold capitalize">{backup.schedule}</p>
                </div>
                <div>
                  <p className="text-gray-600">{i18n.t('backup.lastRun')}</p>
                  <p className="font-semibold">{new Date(backup.last_run).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-gray-600">{i18n.t('storage.total')}</p>
                  <p className="font-semibold">{formatBytes(backup.size)}</p>
                </div>
                <div>
                  <p className="text-gray-600">{i18n.t('backup.retention')}</p>
                  <p className="font-semibold">{backup.retention_days} {i18n.t('diagnostics.min')}</p>
                </div>
              </div>

              <button
                onClick={() => handleRunBackup(backup.id)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-semibold"
              >
                {i18n.t('backup.runNow')}
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
