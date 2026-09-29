import { useEffect, useState } from 'react'
import { axiosInstance } from '../api/client'
import { Navigation } from '../components/Navigation'
import { i18n } from '../i18n'

interface NetworkInterface {
  name: string
  ip_addresses: string[]
  mac_address: string
  mtu: number
  is_up: boolean
}

export default function Network() {
  const [interfaces, setInterfaces] = useState<NetworkInterface[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchNetworkData = async () => {
      try {
        const response = await axiosInstance.get('/system/network')
        setInterfaces(Object.entries(response.data).map(([name, data]: [string, any]) => ({
          name,
          ip_addresses: data.ip_addresses || [],
          mac_address: data.mac_address || 'N/A',
          mtu: data.mtu || 1500,
          is_up: data.is_up !== false,
        })))
        setError(null)
      } catch (err) {
        setError('Failed to fetch network data')
      } finally {
        setLoading(false)
      }
    }

    fetchNetworkData()
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
        <h1 className="text-3xl font-bold">{i18n.t('network.title')}</h1>

        {error && <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded">{error}</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {interfaces.map((iface) => (
            <div key={iface.name} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-lg font-semibold">{iface.name}</h2>
                <span className={`px-3 py-1 rounded text-sm font-medium ${
                  iface.is_up ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {iface.is_up ? i18n.t('network.up') : i18n.t('network.down')}
                </span>
              </div>

              <div className="space-y-3 text-sm">
                <div>
                  <span className="font-semibold text-gray-600">{i18n.t('network.macAddress')}:</span>
                  <p className="font-mono text-gray-900 mt-1">{iface.mac_address}</p>
                </div>

                <div>
                  <span className="font-semibold text-gray-600">{i18n.t('network.ipAddresses')}:</span>
                  <div className="space-y-1 mt-1">
                    {iface.ip_addresses.length > 0 ? (
                      iface.ip_addresses.map((ip, idx) => (
                        <p key={idx} className="font-mono text-gray-900">{ip}</p>
                      ))
                    ) : (
                      <p className="text-gray-500">{i18n.t('network.noIpAddresses')}</p>
                    )}
                  </div>
                </div>

                <div>
                  <span className="font-semibold text-gray-600">{i18n.t('network.mtu')}:</span>
                  <p className="text-gray-900 mt-1">{iface.mtu}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">{i18n.t('network.networkInterfaces')}</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left">{i18n.t('network.interface')}</th>
                  <th className="px-4 py-2 text-left">{i18n.t('network.status')}</th>
                  <th className="px-4 py-2 text-left">{i18n.t('network.ipAddresses')}</th>
                  <th className="px-4 py-2 text-left">{i18n.t('network.macAddress')}</th>
                </tr>
              </thead>
              <tbody>
                {interfaces.map((iface) => (
                  <tr key={iface.name} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2 font-mono font-semibold">{iface.name}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded text-sm ${
                        iface.is_up ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {iface.is_up ? i18n.t('network.up') : i18n.t('network.down')}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-sm">{iface.ip_addresses.join(', ') || i18n.t('network.noIpAddresses')}</td>
                    <td className="px-4 py-2 font-mono text-sm">{iface.mac_address}</td>
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
