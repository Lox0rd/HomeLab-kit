import { useEffect, useState } from 'react'
import { axiosInstance } from '../api/client'
import { Navigation } from '../components/Navigation'
import { i18n } from '../i18n'

interface Service {
  name: string
  load: string
  active: string
  sub: string
  description: string
}

export default function Services() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'running' | 'stopped'>('all')

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axiosInstance.get('/services/')
        setServices(response.data.services || [])
        setError(null)
      } catch (err) {
        setError('Failed to fetch services')
      } finally {
        setLoading(false)
      }
    }

    fetchServices()
  }, [])

  if (loading) return (
    <>
      <Navigation />
      <div className="p-4">{i18n.t('common.loading')}</div>
    </>
  )
  if (error) return (
    <>
      <Navigation />
      <div className="p-4 text-red-600">{error}</div>
    </>
  )

  const filteredServices = services.filter((s) => {
    if (filter === 'running') return s.active === 'active'
    if (filter === 'stopped') return s.active !== 'active'
    return true
  })

  const getStatusColor = (status: string) => {
    if (status === 'active') return 'bg-status-success/10 text-status-success'
    if (status === 'inactive') return 'bg-light-surface dark:bg-dark-surface text-light-text dark:text-dark-text'
    return 'bg-yellow-100 text-yellow-800'
  }

  return (
    <>
      <Navigation />
      <div className="space-y-6 p-8">
      <h1 className="text-3xl font-bold">{i18n.t('services.title')}</h1>

      <div className="flex gap-2">
        {(['all', 'running', 'stopped'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded capitalize ${
              filter === f
                ? 'bg-accent-primary text-white'
                : 'bg-light-border dark:bg-dark-border text-light-text dark:text-dark-text hover:bg-gray-300'
            }`}
          >
            {i18n.t(`services.${f}` as any)} ({filteredServices.length})
          </button>
        ))}
      </div>

      <div className="bg-light-surface dark:bg-dark-surface rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-light-surface dark:bg-dark-surface">
            <tr>
              <th className="px-4 py-2 text-left">{i18n.t('services.serviceName')}</th>
              <th className="px-4 py-2 text-left">{i18n.t('services.status')}</th>
              <th className="px-4 py-2 text-left">{i18n.t('services.load')}</th>
              <th className="px-4 py-2 text-left">{i18n.t('services.sub')}</th>
              <th className="px-4 py-2 text-left">{i18n.t('services.description')}</th>
            </tr>
          </thead>
          <tbody>
            {filteredServices.map((service) => (
              <tr key={service.name} className="border-t hover:bg-light-surface dark:bg-dark-surface">
                <td className="px-4 py-2 font-mono text-sm">{service.name}</td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-1 rounded text-sm ${getStatusColor(service.active)}`}>
                    {service.active}
                  </span>
                </td>
                <td className="px-4 py-2 text-sm">{service.load}</td>
                <td className="px-4 py-2 text-sm">{service.sub}</td>
                <td className="px-4 py-2 text-sm text-light-muted dark:text-dark-muted">{service.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredServices.length === 0 && (
          <div className="p-4 text-light-muted dark:text-dark-muted">{i18n.t('services.noServices')}</div>
        )}
      </div>
      </div>
    </>
  )
}
