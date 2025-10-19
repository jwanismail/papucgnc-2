import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { ShoppingCart } from 'lucide-react'
import useCartStore from '../../store/cartStore'

const Navbar = () => {
  const cartItems = useCartStore((state) => state.items)
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const [bump, setBump] = useState(false)

  useEffect(() => {
    if (cartCount <= 0) return
    setBump(true)
    const t = setTimeout(() => setBump(false), 250)
    return () => clearTimeout(t)
  }, [cartCount])

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-white/20 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img 
              src="/papuc-logo.png" 
              alt="Papucgnc" 
              className="h-16 w-auto"
              onError={(e) => {
                e.target.style.display = 'none'
                e.target.nextElementSibling.style.display = 'inline'
              }}
            />
            <span className="hidden text-xl font-light tracking-wider text-neutral-900 uppercase">
              papucgnc
            </span>
          </Link>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center space-x-12">
            <Link 
              to="/" 
              className="text-sm text-neutral-700 hover:text-neutral-900 font-medium tracking-wide uppercase transition-colors"
            >
              Ana Sayfa
            </Link>
            <Link 
              to="/products" 
              className="text-sm text-neutral-700 hover:text-neutral-900 font-medium tracking-wide uppercase transition-colors"
            >
              Koleksiyon
            </Link>
          </div>

          {/* Shopping Cart - Direkt Sepet Sayfasına */}
          <Link 
            to="/cart"
            className="relative group text-neutral-900 transition-colors"
            aria-label="Sepet"
          >
            <ShoppingCart className="w-6 h-6 group-hover:opacity-70 transition-opacity" />
            {cartCount > 0 && (
              <span
                className={`absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-md transform transition-transform duration-200 ${bump ? 'scale-110' : 'scale-100'}`}
              >
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

