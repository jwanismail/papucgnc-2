import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../utils/api'
import ProductCard from '../../components/product/ProductCard'

const HomePage = () => {
  const [products, setProducts] = useState([])
  const [campaigns, setCampaigns] = useState([])
  const [loading, setLoading] = useState(true)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    fetchData()
    setIsVisible(true)
  }, [])

  const fetchData = async () => {
    try {
      const [productsRes, campaignsRes] = await Promise.all([
        api.get('/products'),
        api.get('/campaigns')
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
      {/* Hero Section - Ultra Modern */}
      <section className="relative min-h-screen flex items-center bg-gradient-to-br from-neutral-50 via-white to-primary-50 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-radial from-neutral-100/30 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-radial from-primary-100/20 to-transparent rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                
                {/* Left Content */}
                <div className="space-y-10 lg:space-y-12 text-center lg:text-left">
                  <div className="space-y-8">
                    <div className="inline-flex items-center justify-center lg:justify-start">
                      <div className="relative">
                        <div className="absolute inset-0 bg-neutral-900/10 blur-sm rounded-full"></div>
                        <div className="relative bg-neutral-900 text-white px-6 py-3 text-sm font-medium tracking-wider uppercase rounded-full">
                          Yeni Sezon Koleksiyonu
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-light tracking-tight leading-[0.9] text-neutral-900">
                        <span className="block">Her Adımda</span>
                        <span className="block font-normal text-neutral-700">Konfor & Stil</span>
                      </h1>
                      
                      <p className="text-lg sm:text-xl lg:text-2xl text-neutral-600 font-light leading-relaxed max-w-xl mx-auto lg:mx-0">
                        Zamansız tasarımlar, üstün kalite. Tarzınızı yansıtan ayakkabılarla tanışın.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                    <Link 
                      to="/products" 
                      className="group relative overflow-hidden bg-neutral-900 hover:bg-neutral-800 text-white font-medium px-8 py-4 text-sm uppercase tracking-wider transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
                    >
                      <span className="relative z-10">Koleksiyonu Keşfedin</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-neutral-800 to-neutral-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </Link>
                    
                    <Link 
                      to="/products" 
                      className="group relative border-2 border-neutral-900 hover:bg-neutral-900 hover:text-white text-neutral-900 font-medium px-8 py-4 text-sm uppercase tracking-wider transition-all duration-300 transform hover:scale-105"
                    >
                      <span className="relative z-10">Yeni Ürünler</span>
                    </Link>
                  </div>

                  {/* Enhanced Stats */}
                  <div className="grid grid-cols-3 gap-8 lg:gap-12 pt-8 lg:pt-16 max-w-2xl mx-auto lg:mx-0">
                    <div className="text-center lg:text-left group">
                      <div className="text-3xl lg:text-4xl font-light text-neutral-900 group-hover:text-neutral-600 transition-colors duration-300">10K+</div>
                      <div className="text-xs lg:text-sm text-neutral-600 uppercase tracking-wider mt-2 font-medium">Müşteri</div>
                    </div>
                    <div className="text-center lg:text-left group">
                      <div className="text-3xl lg:text-4xl font-light text-neutral-900 group-hover:text-neutral-600 transition-colors duration-300">500+</div>
                      <div className="text-xs lg:text-sm text-neutral-600 uppercase tracking-wider mt-2 font-medium">Ürün</div>
                    </div>
                    <div className="text-center lg:text-left group">
                      <div className="text-3xl lg:text-4xl font-light text-neutral-900 group-hover:text-neutral-600 transition-colors duration-300">24/7</div>
                      <div className="text-xs lg:text-sm text-neutral-600 uppercase tracking-wider mt-2 font-medium">Destek</div>
                    </div>
                  </div>
                </div>

                {/* Right Visual Element */}
                <div className="hidden lg:block relative">
                  <div className="relative w-full h-[600px] rounded-3xl overflow-hidden bg-gradient-to-br from-neutral-100 to-primary-50">
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-white/40"></div>
                    <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-neutral-900/10 to-transparent"></div>
                    
                    {/* Floating Elements */}
                    <div className="absolute top-20 left-8 w-24 h-24 bg-neutral-900/5 rounded-2xl rotate-12 animate-pulse"></div>
                    <div className="absolute top-40 right-12 w-16 h-16 bg-primary-300/20 rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>
                    <div className="absolute bottom-32 left-16 w-20 h-20 bg-neutral-700/10 rounded-xl rotate-45 animate-pulse" style={{animationDelay: '2s'}}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Campaign Banner - Modern */}
      {campaigns.length > 0 && (
        <section className="relative py-20 lg:py-28 bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: '40px 40px'
            }}></div>
          </div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="mb-12 lg:mb-16">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-white mb-4">
                  Özel Kampanyalar
                </h2>
                <div className="w-24 h-1 bg-white mx-auto"></div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
                {campaigns.map((campaign, index) => (
                  <div 
                    key={campaign.id} 
                    className="group relative overflow-hidden bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/30 px-8 py-8 hover:bg-white/10 transition-all duration-500 transform hover:scale-105"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative text-center">
                      <p className="font-medium text-sm uppercase tracking-wider text-white/90 group-hover:text-white transition-colors duration-300">
                        {campaign.name}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Featured Products - Ultra Modern */}
      <section className="relative py-24 lg:py-32 bg-gradient-to-b from-white via-neutral-50/30 to-white overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-72 h-72 bg-gradient-radial from-primary-100/20 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-64 h-64 bg-gradient-radial from-neutral-100/30 to-transparent rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 lg:mb-24">
            <div className="space-y-8 max-w-4xl mx-auto">
              <div className="inline-flex items-center justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-neutral-900/5 blur-sm rounded-full"></div>
                  <p className="relative text-sm text-neutral-600 uppercase tracking-wider font-medium bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full border border-neutral-200">
                    Öne Çıkan Ürünler
                  </p>
                </div>
              </div>
              
              <h2 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-light tracking-tight text-neutral-900 leading-tight">
                En Popüler Koleksiyon
              </h2>
              
              <p className="text-lg sm:text-xl lg:text-2xl text-neutral-600 font-light leading-relaxed max-w-3xl mx-auto">
                Müşterilerimizin en çok tercih ettiği, zamansız tasarımlar ve üstün konfor
              </p>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-24 lg:py-32">
              <div className="space-y-6 text-center">
                <div className="relative">
                  <div className="w-20 h-20 border-4 border-neutral-200 border-t-neutral-900 rounded-full animate-spin mx-auto"></div>
                  <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-neutral-400 rounded-full animate-spin mx-auto" style={{animationDirection: 'reverse', animationDuration: '1.5s'}}></div>
                </div>
                <p className="text-sm text-neutral-600 uppercase tracking-wider font-medium">Yükleniyor</p>
              </div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-24 lg:py-32">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <div className="w-12 h-12 bg-neutral-300 rounded-full"></div>
                </div>
                <p className="text-neutral-500 text-lg lg:text-xl font-light">Henüz ürün bulunmuyor.</p>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-16 lg:mb-20">
                {products.map((product, index) => (
                  <div 
                    key={product.id}
                    className="transform transition-all duration-700 hover:scale-105"
                    style={{ 
                      animationDelay: `${index * 100}ms`,
                      animation: 'fadeInUp 0.6s ease-out forwards'
                    }}
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>

              <div className="text-center">
                <Link 
                  to="/products" 
                  className="group relative inline-flex items-center justify-center overflow-hidden bg-neutral-900 hover:bg-neutral-800 text-white font-medium px-10 py-4 text-sm uppercase tracking-wider transition-all duration-500 transform hover:scale-105 hover:shadow-2xl"
                >
                  <span className="relative z-10 flex items-center gap-3">
                    Tüm Koleksiyonu Görüntüle
                    <div className="w-2 h-2 bg-white rounded-full group-hover:translate-x-1 transition-transform duration-300"></div>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-neutral-800 to-neutral-900 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Features Section - Ultra Modern with Special Mobile Design */}
      <section className="relative py-12 sm:py-24 lg:py-32 bg-gradient-to-br from-primary-50 via-white to-neutral-50 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-white/50 via-transparent to-transparent"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12 sm:mb-16 lg:mb-24">
            <div className="space-y-6 sm:space-y-8 max-w-4xl mx-auto">
              <div className="inline-flex items-center justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary-200/30 blur-sm rounded-full"></div>
                  <p className="relative text-xs sm:text-sm text-primary-700 uppercase tracking-wider font-medium bg-white/80 backdrop-blur-sm px-4 sm:px-6 py-2 sm:py-3 rounded-full border border-primary-200">
                    Neden Papucgnc?
                  </p>
                </div>
              </div>
              
              <h2 className="text-3xl sm:text-4xl lg:text-6xl xl:text-7xl font-light tracking-tight text-neutral-900 leading-tight">
                Size En İyi Hizmet
              </h2>
              
              <p className="text-base sm:text-lg lg:text-xl xl:text-2xl text-neutral-600 font-light leading-relaxed max-w-3xl mx-auto px-4">
                Size en iyi alışveriş deneyimini sunmak için buradayız
              </p>
            </div>
          </div>

          {/* Desktop/Tablet Grid Layout */}
          <div className="hidden sm:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {[
              {
                title: "Premium Kalite",
                description: "En kaliteli malzemelerden üretilmiş, dayanıklı ayakkabılar",
                color: "from-neutral-900 to-neutral-700"
              },
              {
                title: "Hızlı Kargo",
                description: "Standart kargo ücreti ₺100 – 2-3 iş günü teslimat",
                color: "from-primary-600 to-primary-500"
              },
              {
                title: "Güvenli Ödeme",
                description: "256-bit SSL ile güvenli ödeme ve 30 gün iade garantisi",
                color: "from-green-600 to-green-500"
              },
              {
                title: "Müşteri Memnuniyeti",
                description: "7/24 müşteri desteği ve 10.000+ mutlu müşteri",
                color: "from-blue-600 to-blue-500"
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="group relative bg-white/60 backdrop-blur-sm border border-white/40 rounded-3xl p-8 lg:p-10 hover:bg-white/80 hover:border-white/60 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-500`}></div>
                
                <div className="relative text-center space-y-6">
                  {/* Icon */}
                  <div className="relative mx-auto w-20 h-20">
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-10 rounded-2xl group-hover:opacity-20 transition-opacity duration-500`}></div>
                    <div className="relative w-full h-full bg-white border border-neutral-200 rounded-2xl flex items-center justify-center group-hover:border-neutral-300 transition-colors duration-300">
                      <div className={`w-8 h-8 bg-gradient-to-br ${feature.color} rounded-lg group-hover:scale-110 transition-transform duration-300`}></div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-4">
                    <h3 className="text-xl lg:text-2xl font-medium text-neutral-900 tracking-tight group-hover:text-neutral-700 transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-neutral-600 leading-relaxed font-light text-sm lg:text-base group-hover:text-neutral-700 transition-colors duration-300">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile Exclusive Design - Vertical Scrolling Cards */}
          <div className="sm:hidden space-y-6">
            {[
              {
                title: "Premium Kalite",
                description: "En kaliteli malzemelerden üretilmiş, dayanıklı ayakkabılar",
                color: "from-neutral-900 to-neutral-700",
                bgColor: "from-neutral-50 to-white",
                accent: "bg-neutral-900"
              },
              {
                title: "Hızlı Kargo",
                description: "Standart kargo ücreti ₺100 – 2-3 iş günü teslimat",
                color: "from-primary-600 to-primary-500",
                bgColor: "from-primary-50 to-white",
                accent: "bg-primary-600"
              },
              {
                title: "Güvenli Ödeme",
                description: "256-bit SSL ile güvenli ödeme ve 30 gün iade garantisi",
                color: "from-green-600 to-green-500",
                bgColor: "from-green-50 to-white",
                accent: "bg-green-600"
              },
              {
                title: "Müşteri Memnuniyeti",
                description: "7/24 müşteri desteği ve 10.000+ mutlu müşteri",
                color: "from-blue-600 to-blue-500",
                bgColor: "from-blue-50 to-white",
                accent: "bg-blue-600"
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="group relative overflow-hidden rounded-3xl shadow-xl"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                {/* Mobile Card Background */}
                <div className={`absolute inset-0 bg-gradient-to-r ${feature.bgColor}`}></div>
                
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
                  <div className={`w-full h-full bg-gradient-to-br ${feature.color} rounded-full blur-3xl`}></div>
                </div>
                
                <div className="relative p-6 space-y-4">
                  {/* Mobile Header with Icon */}
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className={`w-14 h-14 ${feature.accent} rounded-2xl flex items-center justify-center shadow-lg`}>
                        <div className="w-6 h-6 bg-white rounded-lg"></div>
                      </div>
                      <div className="absolute -inset-1 bg-white/20 rounded-2xl blur-sm"></div>
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-neutral-900 tracking-tight">
                        {feature.title}
                      </h3>
                    </div>
                  </div>

                  {/* Mobile Description */}
                  <div className="pl-[4.5rem]">
                    <p className="text-sm text-neutral-600 leading-relaxed font-light">
                      {feature.description}
                    </p>
                  </div>

                  {/* Mobile Decorative Line */}
                  <div className="flex items-center pl-[4.5rem]">
                    <div className={`w-12 h-1 ${feature.accent} rounded-full opacity-30`}></div>
                  </div>
                </div>

                {/* Mobile Hover Effect */}
                <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-active:opacity-5 transition-opacity duration-300`}></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section - Ultra Modern */}
      <section className="relative py-24 lg:py-32 bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-radial from-white/5 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-radial from-primary-500/10 to-transparent rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-16 lg:space-y-20">
            <div className="space-y-8 max-w-4xl mx-auto">
              <div className="inline-flex items-center justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-white/10 blur-sm rounded-full"></div>
                  <p className="relative text-sm text-white/80 uppercase tracking-wider font-medium bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20">
                    Kampanyalardan Haberdar Olun
                  </p>
                </div>
              </div>
              
              <h2 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-light tracking-tight text-white leading-tight">
                Özel İndirimlerden
                <span className="block text-white/80">İlk Siz Haberdar Olun</span>
              </h2>
              
              <p className="text-lg sm:text-xl lg:text-2xl text-neutral-300 font-light leading-relaxed max-w-3xl mx-auto">
                E-posta listemize katılın ve özel indirimlerden ilk siz haberdar olun
              </p>
            </div>

            <div className="max-w-2xl mx-auto">
              <div className="group relative overflow-hidden bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-2 focus-within:border-white/30 transition-all duration-500">
                <div className="flex flex-col sm:flex-row gap-0">
                  <input
                    type="email"
                    placeholder="E-posta adresiniz"
                    className="flex-1 px-6 py-4 bg-transparent text-white placeholder-neutral-400 focus:outline-none text-sm lg:text-base"
                  />
                  <button className="group/btn relative overflow-hidden bg-white hover:bg-neutral-100 text-neutral-900 font-medium px-8 py-4 uppercase text-sm tracking-wider transition-all duration-300 transform hover:scale-105 whitespace-nowrap">
                    <span className="relative z-10 flex items-center gap-2">
                      Abone Ol
                      <div className="w-1.5 h-1.5 bg-neutral-900 rounded-full group-hover/btn:translate-x-1 transition-transform duration-300"></div>
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-neutral-100 to-white opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-12 text-sm lg:text-base">
              <div className="flex items-center gap-3 text-neutral-300">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-medium">4.9/5 Müşteri Puanı</span>
              </div>
              <div className="hidden sm:block w-px h-6 bg-neutral-700"></div>
              <div className="flex items-center gap-3 text-neutral-300">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                <span className="font-medium">Güvenli Alışveriş</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage

