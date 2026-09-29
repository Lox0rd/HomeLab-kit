import { useEffect, useState } from 'react'
import { axiosInstance } from '../api/client'
import { Navigation } from '../components/Navigation'
import { i18n } from '../i18n'

interface StorageDevice {
  device: string
  total: number
  used: number
  free: number
  percent: number
  fstype: string
  mountpoint: string
}

export default function Storage() {
  const [devices, setDevices] = useState<StorageDevice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStorageData = async () => {
      try {
        const response = await axiosInstance.get('/system/disk')
        const diskData = response.data
        setDevices([{
          device: diskData.device || '/dev/root',
          total: diskData.total || 0,
          used: diskData.used || 0,
          free: diskData.free || 0,
          percent: diskData.percent || 0,
          fstype: 'ext4',
          mountpoint: '/',
        }])
        setError(null)
      } catch (err) {
        setError('Failed to fetch storage data')
      } finally {
        setLoading(false)
      }
    }

    fetchStorageData()
  }, [])

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  }

  const getStorageColor = (percent: number) => {
    if (percent < 50) return 'bg-green-600'
    if (percent < 75) return 'bg-yellow-600'
    if (percent < 90) return 'bg-orange-600'
    return 'bg-red-600'
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
        <h1 className="text-3xl font-bold">{i18n.t('storage.title')}</h1>

        {error && <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded">{error}</div>}

        <div className="grid grid-cols-1 gap-4">
          {devices.map((device) => (
            <div key={device.device} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-lg font-semibold">{device.device}</h2>
                  <p className="text-sm text-gray-500">{device.mountpoint}</p>
                </div>
                <span className="text-2xl font-bold">{device.percent.toFixed(1)}%</span>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                <div
                  className={`h-3 rounded-full transition-all ${getStorageColor(device.percent)}`}
                  style={{ width: `${device.percent}%` }}
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-600 font-medium">{i18n.t('storage.total')}</p>
                  <p className="text-gray-900 font-semibold">{formatBytes(device.total)}</p>
                </div>
                <div>
                  <p className="text-gray-600 font-medium">{i18n.t('storage.used')}</p>
                  <p className="text-gray-900 font-semibold">{formatBytes(device.used)}</p>
                </div>
                <div>
                  <p className="text-gray-600 font-medium">{i18n.t('storage.free')}</p>
                  <p className="text-gray-900 font-semibold">{formatBytes(device.free)}</p>
                </div>
                <div>
                  <p className="text-gray-600 font-medium">{i18n.t('storage.type')}</p>
                  <p className="text-gray-900 font-semibold">{device.fstype}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">{i18n.t('storage.storageOverview')}</h2>
          <div className="space-y-4">
            {devices.map((device) => (
              <div key={device.device} className="flex items-center justify-between p-4 border rounded">
                <div>
                  <p className="font-semibold">{device.device}</p>
                  <p className="text-sm text-gray-500">{device.mountpoint}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatBytes(device.used)} / {formatBytes(device.total)}</p>
                  <p className={`text-sm ${device.percent > 80 ? 'text-red-600' : 'text-gray-600'}`}>
                    {device.percent.toFixed(1)}% {i18n.t('storage.used')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
