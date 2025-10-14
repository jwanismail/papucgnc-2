import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import ProductCard from '../../components/product/ProductCard'

const HomePage = () => {
  const [products, setProducts] = useState([])
  const [campaigns, setCampaigns] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [productsRes, campaignsRes] = await Promise.all([
        axios.get('/api/products'),
        axios.get('/api/campaigns')
      ])
      
      // Defensive: Array kontrolü
      const productsData = Array.isArray(productsRes.data) ? productsRes.data : []
      const campaignsData = Array.isArray(campaignsRes.data) ? campaignsRes.data : []
      
      setProducts(productsData.slice(0, 8)) // Son 8 ürün
      setCampaigns(campaignsData.filter(c => c.isActive))
    } catch (error) {
      console.error('Veri yüklenirken hata:', error)
      // Hata durumunda boş array kullan
      setProducts([])
      setCampaigns([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative bg-primary-50 min-h-[90vh] flex items-center">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white pointer-events-none"></div>
        
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-24">
          <div className="max-w-4xl mx-auto text-center space-y-12">
            {/* Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="badge">
                  Yeni Sezon Koleksiyonu
                </div>
                
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-light tracking-tight leading-tight text-neutral-900">
                  Her Adımda
                  <span className="block font-normal mt-2">Konfor & Stil</span>
                </h1>
                
                <p className="text-xl text-neutral-600 font-light leading-relaxed max-w-2xl mx-auto">
                  Zamansız tasarımlar, üstün kalite. Tarzınızı yansıtan ayakkabılarla tanışın.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  to="/products" 
                  className="btn-primary"
                >
                  Koleksiyonu Keşfedin
                </Link>
                
                <Link 
                  to="/products" 
                  className="btn-secondary"
                >
                  Yeni Ürünler
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 pt-16 max-w-2xl mx-auto">
                <div className="text-center border-l border-neutral-300 first:border-l-0">
                  <div className="text-3xl font-light text-neutral-900">10K+</div>
                  <div className="text-sm text-neutral-600 uppercase tracking-wider mt-2">Müşteri</div>
                </div>
                <div className="text-center border-l border-neutral-300">
                  <div className="text-3xl font-light text-neutral-900">500+</div>
                  <div className="text-sm text-neutral-600 uppercase tracking-wider mt-2">Ürün</div>
                </div>
                <div className="text-center border-l border-neutral-300">
                  <div className="text-3xl font-light text-neutral-900">24/7</div>
                  <div className="text-sm text-neutral-600 uppercase tracking-wider mt-2">Destek</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Campaign Banner */}
      {campaigns.length > 0 && (
        <section className="py-16 bg-neutral-900 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center text-white">
              <div className="mb-8">
                <h2 className="text-3xl md:text-4xl font-light tracking-tight text-white">Özel Kampanyalar</h2>
              </div>
              
              <div className="flex flex-wrap justify-center gap-6">
                {campaigns.map(campaign => (
                  <div key={campaign.id} className="group border border-white/20 hover:border-white/40 px-8 py-4 hover:bg-white/5 transition-all duration-300">
                    <p className="font-medium text-sm uppercase tracking-wider">{campaign.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="space-y-4">
              <p className="text-sm text-neutral-600 uppercase tracking-wider font-medium">Öne Çıkan Ürünler</p>
              <h2 className="section-heading">
                En Popüler Koleksiyon
              </h2>
              <p className="section-subheading mx-auto">
                Müşterilerimizin en çok tercih ettiği, zamansız tasarımlar ve üstün konfor
              </p>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-24">
              <div className="space-y-4 text-center">
                <div className="w-16 h-16 border-2 border-neutral-900 border-t-transparent animate-spin mx-auto"></div>
                <p className="text-sm text-neutral-600 uppercase tracking-wider">Yükleniyor</p>
              </div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-neutral-500 text-lg font-light">Henüz ürün bulunmuyor.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-16">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <div className="text-center">
            <Link 
              to="/products" 
              className="btn-primary inline-block"
            >
              Tüm Koleksiyonu Görüntüle
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-primary-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="section-heading">Neden Papucgnc?</h2>
            <p className="section-subheading mx-auto">
              Size en iyi alışveriş deneyimini sunmak için buradayız
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <div className="text-center space-y-4">
              <div className="w-1 h-16 bg-neutral-900 mx-auto"></div>
              <h3 className="text-xl font-medium text-neutral-900 tracking-tight">Premium Kalite</h3>
              <p className="text-neutral-600 leading-relaxed font-light">En kaliteli malzemelerden üretilmiş, dayanıklı ayakkabılar</p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-1 h-16 bg-neutral-900 mx-auto"></div>
              <h3 className="text-xl font-medium text-neutral-900 tracking-tight">Ücretsiz Kargo</h3>
              <p className="text-neutral-600 leading-relaxed font-light">150₺ üzeri siparişlerde ücretsiz ve hızlı teslimat</p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-1 h-16 bg-neutral-900 mx-auto"></div>
              <h3 className="text-xl font-medium text-neutral-900 tracking-tight">Güvenli Ödeme</h3>
              <p className="text-neutral-600 leading-relaxed font-light">256-bit SSL ile güvenli ödeme ve 30 gün iade garantisi</p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-1 h-16 bg-neutral-900 mx-auto"></div>
              <h3 className="text-xl font-medium text-neutral-900 tracking-tight">Müşteri Memnuniyeti</h3>
              <p className="text-neutral-600 leading-relaxed font-light">7/24 müşteri desteği ve 10.000+ mutlu müşteri</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-24 bg-neutral-900">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <div className="space-y-12">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-light tracking-tight text-white">Kampanyalardan Haberdar Olun</h2>
              <p className="text-lg text-neutral-400 font-light">
                E-posta listemize katılın ve özel indirimlerden ilk siz haberdar olun
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-0 max-w-2xl mx-auto">
              <input
                type="email"
                placeholder="E-posta adresiniz"
                className="flex-1 px-6 py-4 border border-neutral-700 bg-transparent text-white placeholder-neutral-500 focus:outline-none focus:border-white transition-colors"
              />
              <button className="bg-white hover:bg-neutral-100 text-neutral-900 font-medium px-8 py-4 uppercase text-sm tracking-wider transition-colors whitespace-nowrap">
                Abone Ol
              </button>
            </div>

            <div className="flex items-center justify-center divide-x divide-neutral-700 text-sm text-neutral-400">
              <div className="px-6">
                <span>4.9/5 Müşteri Puanı</span>
              </div>
              <div className="px-6">
                <span>Güvenli Alışveriş</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage

