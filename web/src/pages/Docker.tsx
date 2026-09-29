import { useEffect, useState } from 'react'
import { axiosInstance } from '../api/client'
import { Navigation } from '../components/Navigation'
import { i18n } from '../i18n'

interface Container {
  id: string
  name: string
  image: string
  status: string
  state: string
  ports: Record<string, any>
  created: string
  started: string
}

interface DockerImage {
  id: string
  tags: string[]
  size: number
  created: string
}

interface DockerNetwork {
  id: string
  name: string
  driver: string
  scope: string
  containers: number
}

interface DockerVolume {
  name: string
  driver: string
  mountpoint: string
}

export default function Docker() {
  const [available, setAvailable] = useState(false)
  const [containers, setContainers] = useState<Container[]>([])
  const [images, setImages] = useState<DockerImage[]>([])
  const [networks, setNetworks] = useState<DockerNetwork[]>([])
  const [volumes, setVolumes] = useState<DockerVolume[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'containers' | 'images' | 'networks' | 'volumes'>('containers')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const availRes = await axiosInstance.get('/docker/available')
        setAvailable(availRes.data.available)

        if (availRes.data.available) {
          const [contRes, imgRes, netRes, volRes] = await Promise.all([
            axiosInstance.get('/docker/containers'),
            axiosInstance.get('/docker/images'),
            axiosInstance.get('/docker/networks'),
            axiosInstance.get('/docker/volumes')
          ])

          setContainers(contRes.data.containers || [])
          setImages(imgRes.data.images || [])
          setNetworks(netRes.data.networks || [])
          setVolumes(volRes.data.volumes || [])
        }

        setError(null)
      } catch (err) {
        setError('Failed to fetch Docker data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) return (
    <>
      <Navigation />
      <div className="p-4">{i18n.t('common.loading')}</div>
    </>
  )
  if (!available) return (
    <>
      <Navigation />
      <div className="p-4 text-yellow-600">{i18n.t('common.warning')}: Docker is not available</div>
    </>
  )

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  }

  return (
    <>
      <Navigation />
      <div className="space-y-6 p-8">
      <h1 className="text-3xl font-bold">{i18n.t('docker.title')}</h1>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded">{error}</div>}

      <div className="flex gap-4 border-b">
        {(['containers', 'images', 'networks', 'volumes'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-semibold capitalize ${
              activeTab === tab ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'
            }`}
          >
            {i18n.t(`docker.${tab}` as any)} ({tab === 'containers' ? containers.length : tab === 'images' ? images.length : tab === 'networks' ? networks.length : volumes.length})
          </button>
        ))}
      </div>

      {activeTab === 'containers' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">{i18n.t('docker.id')}</th>
                <th className="px-4 py-2 text-left">{i18n.t('docker.name')}</th>
                <th className="px-4 py-2 text-left">{i18n.t('docker.image')}</th>
                <th className="px-4 py-2 text-left">{i18n.t('docker.status')}</th>
                <th className="px-4 py-2 text-left">{i18n.t('docker.state')}</th>
              </tr>
            </thead>
            <tbody>
              {containers.map((c: Container) => (
                <tr key={c.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2 font-mono text-sm">{c.id}</td>
                  <td className="px-4 py-2">{c.name}</td>
                  <td className="px-4 py-2 text-sm">{c.image}</td>
                  <td className="px-4 py-2">{c.status}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        c.state === 'running' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {c.state}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {containers.length === 0 && <div className="p-4 text-gray-600">{i18n.t('docker.noContainers')}</div>}
        </div>
      )}

      {activeTab === 'images' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">{i18n.t('docker.id')}</th>
                <th className="px-4 py-2 text-left">{i18n.t('docker.tags')}</th>
                <th className="px-4 py-2 text-left">{i18n.t('docker.size')}</th>
                <th className="px-4 py-2 text-left">{i18n.t('docker.created')}</th>
              </tr>
            </thead>
            <tbody>
              {images.map((img: DockerImage) => (
                <tr key={img.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2 font-mono text-sm">{img.id}</td>
                  <td className="px-4 py-2">{img.tags.join(', ')}</td>
                  <td className="px-4 py-2">{formatBytes(img.size)}</td>
                  <td className="px-4 py-2 text-sm">{new Date(img.created).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {images.length === 0 && <div className="p-4 text-gray-600">{i18n.t('docker.noImages')}</div>}
        </div>
      )}

      {activeTab === 'networks' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">{i18n.t('docker.name')}</th>
                <th className="px-4 py-2 text-left">{i18n.t('docker.driver')}</th>
                <th className="px-4 py-2 text-left">{i18n.t('docker.scope')}</th>
                <th className="px-4 py-2 text-left">{i18n.t('docker.containers')}</th>
              </tr>
            </thead>
            <tbody>
              {networks.map((net: DockerNetwork) => (
                <tr key={net.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{net.name}</td>
                  <td className="px-4 py-2">{net.driver}</td>
                  <td className="px-4 py-2">{net.scope}</td>
                  <td className="px-4 py-2">{net.containers}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {networks.length === 0 && <div className="p-4 text-gray-600">{i18n.t('docker.noNetworks')}</div>}
        </div>
      )}

      {activeTab === 'volumes' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">{i18n.t('docker.name')}</th>
                <th className="px-4 py-2 text-left">{i18n.t('docker.driver')}</th>
                <th className="px-4 py-2 text-left">{i18n.t('docker.mountpoint')}</th>
              </tr>
            </thead>
            <tbody>
              {volumes.map((vol: DockerVolume) => (
                <tr key={vol.name} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{vol.name}</td>
                  <td className="px-4 py-2">{vol.driver}</td>
                  <td className="px-4 py-2 text-sm font-mono">{vol.mountpoint}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {volumes.length === 0 && <div className="p-4 text-gray-600">{i18n.t('docker.noVolumes')}</div>}
        </div>
      )}
    </div>
    </>
  )
}
