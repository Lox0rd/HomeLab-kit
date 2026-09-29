import axios from 'axios'

const API_BASE_URL = import.meta.env.MODE === 'production'
  ? `${window.location.protocol}//${window.location.hostname}:${window.location.port || (window.location.protocol === 'https:' ? 443 : 80)}/api/v1`
  : 'http://localhost:8000/api/v1'

const client = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
})

// Add token to requests
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const axiosInstance = client
export default client
