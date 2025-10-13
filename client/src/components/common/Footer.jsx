import { Link } from 'react-router-dom'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-neutral-900 text-neutral-400 mt-auto">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="md:col-span-2">
            <h3 className="text-white text-xl font-light tracking-wider uppercase mb-6">papucgnc</h3>
            <p className="text-sm font-light leading-relaxed max-w-md">
              En kaliteli ayakkabılar, zamansız tasarımlar. Her adımda konfor ve stil bir arada.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-medium mb-6 text-sm uppercase tracking-wider">Keşfet</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-sm hover:text-white transition-colors font-light">
                  Ana Sayfa
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-sm hover:text-white transition-colors font-light">
                  Koleksiyon
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-medium mb-6 text-sm uppercase tracking-wider">İletişim</h4>
            <ul className="space-y-3 text-sm font-light">
              <li>info@papucgnc.com</li>
              <li>+90 (555) 123 45 67</li>
              <li>İstanbul, Türkiye</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm font-light">&copy; {currentYear} Papucgnc. Tüm hakları saklıdır.</p>
          <div className="flex gap-6 text-sm font-light">
            <Link to="#" className="hover:text-white transition-colors">Gizlilik</Link>
            <Link to="#" className="hover:text-white transition-colors">Şartlar</Link>
            <Link to="#" className="hover:text-white transition-colors">İade</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

