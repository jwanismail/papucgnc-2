import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
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
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
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
      </div>
    </Router>
  )
}

export default App

