// API Configuration
const API_CONFIG = {
  // Development - local backend
  development: {
    baseURL: 'http://localhost:5000/api'
  },
  // Production - Railway backend
  production: {
    baseURL: import.meta.env.VITE_API_URL || 'https://your-railway-backend.up.railway.app/api'
  }
}

const currentEnv = import.meta.env.MODE || 'development'

export const apiConfig = API_CONFIG[currentEnv]
export default apiConfig

