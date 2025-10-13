import { AlertCircle } from 'lucide-react'

const ErrorMessage = ({ title = 'Bir Hata Oluştu', message, onRetry }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8 text-red-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-600 mb-6">{message}</p>
        {onRetry && (
          <button onClick={onRetry} className="btn-primary">
            Tekrar Dene
          </button>
        )}
      </div>
    </div>
  )
}

export default ErrorMessage

