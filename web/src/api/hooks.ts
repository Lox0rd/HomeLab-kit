import { useState, useEffect } from 'react'
import client from './client'

export function useHealth() {
  const [health, setHealth] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    client.get('/health')
      .then(res => setHealth(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  return { health, loading }
}

export function useSystemStatus() {
  const [status, setStatus] = useState<any>(null)

  useEffect(() => {
    client.get('/system/status')
      .then(res => setStatus(res.data))
      .catch(err => console.error(err))
  }, [])

  return status
}
