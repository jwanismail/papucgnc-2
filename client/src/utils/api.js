import axios from 'axios'
import apiConfig from '../config/api.config'

const api = axios.create({
  baseURL: apiConfig.baseURL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: false
})

export const buildAssetUrl = (path) => {
  if (!path) return ''
  const origin = apiConfig.baseURL.replace(/\/$/, '').replace(/\/api$/, '')
  return `${origin}${path}`
}

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

export default api

