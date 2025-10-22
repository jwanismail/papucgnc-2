import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/common/Navbar'
import Footer from './components/common/Footer'
import WhatsAppButton from './components/common/WhatsAppButton'
import HomePage from './pages/public/HomePage'
import ProductListPage from './pages/public/ProductListPage'
import ProductDetailPage from './pages/public/ProductDetailPage'
import CartPage from './pages/public/CartPage'
import CheckoutPage from './pages/public/CheckoutPage'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminProducts from './pages/admin/AdminProducts'
import AdminCampaigns from './pages/admin/AdminCampaigns'
import AdminOrders from './pages/admin/AdminOrders'

function App() {
  // Bakım modu - gerekirse .env ile yönetilebilir: import.meta.env.VITE_MAINTENANCE === 'true'
  const maintenanceEnabled = true

  // Admin rotalarında bakım overlay'i gösterme
  const LocationAwareLayout = () => {
    const location = useLocation()
    const isAdminRoute = location.pathname.startsWith('/jwanadmin')

    return (
      <div className="flex flex-col min-h-screen relative">
        {/* İçerik */}
        <Navbar />
        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductListPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />

            {/* Admin Routes - jwanadmin */}
            <Route path="/jwanadmin" element={<AdminDashboard />} />
            <Route path="/jwanadmin/products" element={<AdminProducts />} />
            <Route path="/jwanadmin/campaigns" element={<AdminCampaigns />} />
            <Route path="/jwanadmin/orders" element={<AdminOrders />} />
          </Routes>
        </main>
        {/* Footer - Sadece Desktop'ta Görünür */}
        <div className="hidden md:block">
          <Footer />
        </div>

        {/* WhatsApp Floating Button */}
        <WhatsAppButton />

        {/* Bakım Overlay (Admin sayfalarında görünmez) */}
        {maintenanceEnabled && !isAdminRoute && (
          <div className="fixed inset-0 z-[9999] backdrop-blur-md bg-black/40 flex items-center justify-center px-6">
            <div className="max-w-md w-full bg-white/90 backdrop-blur rounded-2xl shadow-2xl border border-neutral-200 p-8 text-center">
              <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center">
                <span className="text-2xl">🛠️</span>
              </div>
              <h2 className="text-xl md:text-2xl font-semibold text-neutral-900 mb-2">Web sitemiz şu an bakımdadır</h2>
              <p className="text-neutral-600 mb-6">Kısa süre içinde tekrar yayında olacağız. Anlayışınız için teşekkürler.</p>
              <div className="text-sm text-neutral-500">Sorularınız için: <a href="mailto:destek@papucgnc.com" className="text-primary-600 hover:underline">destek@papucgnc.com</a></div>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <Router>
      <LocationAwareLayout />
    </Router>
  )
}

export default App

