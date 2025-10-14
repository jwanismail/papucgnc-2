// API Configuration
const API_CONFIG = {
  // Development - local backend
  development: {
    baseURL: 'http://localhost:5000/api'
  },
  // Production - Railway backend
  production: {
    baseURL: 'https://papucgnc-servr-production.up.railway.app/api'
  }
}

const currentEnv = import.meta.env.MODE || 'development'

export const apiConfig = API_CONFIG[currentEnv]
export default apiConfig

