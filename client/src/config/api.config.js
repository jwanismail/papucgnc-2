// API Configuration
const API_CONFIG = {
  // Development - local backend
  development: {
    baseURL: 'https://papucgnc-servr-production.up.railway.app/api'
  },
  // Production - Railway backend
  production: {
    baseURL: 'https://papucgnc-servr-production.up.railway.app/api'
  }
}

const currentEnv = import.meta.env.MODE || 'development'

// VITE_API_URL varsa onu kullan, yoksa ortam varsayılanını kullan
const resolvedBaseURL = (
  import.meta.env.VITE_API_URL || (API_CONFIG[currentEnv] && API_CONFIG[currentEnv].baseURL)
)
  ? (import.meta.env.VITE_API_URL || API_CONFIG[currentEnv].baseURL).replace(/\/$/, '')
  : 'https://papucgnc-servr-production.up.railway.app/api'

export const apiConfig = { baseURL: resolvedBaseURL }
export default apiConfig

