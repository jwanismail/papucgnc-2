import { useState, useEffect } from 'react'
import { Lock } from 'lucide-react'

const ADMIN_PASSWORD = 'apo1919'
const AUTH_KEY = 'admin_authenticated'

const AdminAuth = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Oturum kontrolü
    const authStatus = sessionStorage.getItem(AUTH_KEY)
    if (authStatus === 'true') {
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      sessionStorage.setItem(AUTH_KEY, 'true')
      setError('')
    } else {
      setError('Hatalı şifre!')
      setPassword('')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="w-full max-w-md px-6">
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            {/* Logo/Icon */}
            <div className="flex justify-center mb-8">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                <Lock className="w-8 h-8 text-primary-600" />
              </div>
            </div>

            {/* Title */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Admin Girişi
              </h2>
              <p className="text-gray-600 text-sm">
                Devam etmek için şifrenizi girin
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Şifre
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${
                    error ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Şifrenizi girin"
                  autoFocus
                />
                {error && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <span className="mr-1">⚠️</span>
                    {error}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
              >
                Giriş Yap
              </button>
            </form>

            {/* Footer */}
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                Güvenli admin paneli girişi
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return children
}

export default AdminAuth

