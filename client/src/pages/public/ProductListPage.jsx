import { useState, useEffect, useMemo } from 'react'
import api from '../../utils/api'
import ProductCard from '../../components/product/ProductCard'
import BrandScroller from '../../components/common/BrandScroller'

const ProductListPage = () => {
  const [products, setProducts] = useState([])
  const [campaigns, setCampaigns] = useState([])
  const [selectedFilter, setSelectedFilter] = useState('all') // 'all', 'second-pair-699', 'new-season'
  const [loading, setLoading] = useState(true)
  const [selectedBrand, setSelectedBrand] = useState(null)
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [featuredLoading, setFeaturedLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [productsRes, campaignsRes, featuredRes] = await Promise.all([
        api.get('/products'),
        api.get('/campaigns'),
        api.get('/products/featured')
      ])
      
      console.log('🔍 API Response Debug:', {
        productsRes: productsRes.data,
        productsIsArray: Array.isArray(productsRes.data),
        campaignsRes: campaignsRes.data,
        featuredRes: featuredRes.data
      })
      
      // Defensive: Array kontrolü
      const productsData = Array.isArray(productsRes.data) ? productsRes.data : []
      const campaignsData = Array.isArray(campaignsRes.data) ? campaignsRes.data : []
      const featuredData = Array.isArray(featuredRes.data) ? featuredRes.data : []
      
      console.log('📦 Parsed Data:', {
        productsCount: productsData.length,
        campaignsCount: campaignsData.length,
        featuredCount: featuredData.length
      })
      
      setProducts(productsData)
      setCampaigns(campaignsData)
      setFeaturedProducts(featuredData)
    } catch (error) {
      console.error('Veri yüklenirken hata:', error)
      // Hata durumunda boş array kullan
      setProducts([])
      setCampaigns([])
      setFeaturedProducts([])
    } finally {
      setLoading(false)
      setFeaturedLoading(false)
    }
  }

  // Admin paneldeki mevcut ürünlerden benzersiz marka listesi (ürün adından çıkarım)
  const normalize = (s) => (s || '')
    .toLowerCase()
    .replace(/[^a-z0-9ğüşiıçö\s\-]/g, '') // harf, sayı, boşluk, tire dışını at
    .replace(/[\-_]/g, ' ') // tire/alt tire -> boşluk
    .replace(/\s+/g, ' ') // birden fazla boşluğu tekle
    .trim()

  const brandList = useMemo(() => {
    const names = new Set()
    const candidates = ['nike','adidas','vans','puma','new balance','calvin klein','reebok','asics','converse','skechers','lacoste','hummel','kinetix','dockers']
    // Ürün başlığı ve açıklamasında geçen markaları topla
    products.forEach(p => {
      const haystack = normalize(`${p.name || ''} ${p.description || ''}`)
      candidates.forEach(c => {
        const brand = normalize(c)
        if (haystack.includes(` ${brand} `) || haystack.startsWith(`${brand} `) || haystack.endsWith(` ${brand}`) || haystack === brand) {
          names.add(c)
        }
      })
    })
    // Zorunlu olarak gösterilecek markalar
    names.add('nike')
    names.add('adidas')
    names.add('puma')
    names.add('calvin klein')

    return Array.from(names).map(n => ({ id: n, name: n.replace(/\b\w/g, (m) => m.toUpperCase()) }))
  }, [products])

  const matchesSelectedBrand = (product) => {
    if (!selectedBrand) return true
    const haystack = normalize(`${product.name || ''} ${product.description || ''}`)
    const brand = normalize(selectedBrand.id)
    return (
      haystack.includes(` ${brand} `) ||
      haystack.startsWith(`${brand} `) ||
      haystack.endsWith(` ${brand}`) ||
      haystack === brand
    )
  }

  // Filtre mantığı
  const filteredProducts = (() => {
    if (selectedFilter === 'all') {
      return products.filter(matchesSelectedBrand)
    }
    
    if (selectedFilter === 'second-pair-699') {
      // "2. Çift 699 TL" kampanyalı ürünler
      const campaign699 = campaigns.find(c => c.type === 'second_pair_699')
      const base = campaign699 ? products.filter(p => p.campaignId === campaign699.id) : []
      return base.filter(matchesSelectedBrand)
    }
    
    if (selectedFilter === 'new-season') {
      // "Yeni Sezon İndirimleri" - kampanyalı tüm ürünler
      const base = products.filter(p => p.campaignId)
      return base.filter(matchesSelectedBrand)
    }
    
    return products.filter(matchesSelectedBrand)
  })()

  return (
    <div className="min-h-screen bg-white">
      {/* Filtre Butonları - Navbar'ın hemen altında */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 py-4 overflow-x-auto">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`whitespace-nowrap px-6 py-2.5 rounded-full font-medium transition-all duration-200 text-sm ${
                selectedFilter === 'all'
                  ? 'bg-neutral-900 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Tüm Ürünler
            </button>
            <button
              onClick={() => setSelectedFilter('second-pair-699')}
              className={`whitespace-nowrap px-6 py-2.5 rounded-full font-medium transition-all duration-200 text-sm ${
                selectedFilter === 'second-pair-699'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
              }`}
            >
              🔥 2. Çift 699 TL
            </button>
            <button
              onClick={() => setSelectedFilter('new-season')}
              className={`whitespace-nowrap px-6 py-2.5 rounded-full font-medium transition-all duration-200 text-sm ${
                selectedFilter === 'new-season'
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-primary-50 text-primary-700 hover:bg-primary-100 border border-primary-200'
              }`}
            >
              ✨ Yeni Sezon İndirimleri
            </button>
          </div>
        </div>
      </div>

      {/* İçerik */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Kampanyaların hemen altında marka kaydırma şeridi */}
        {brandList.length > 0 && (
          <div className="mb-6">
            <BrandScroller
              brands={brandList}
              selectedBrand={selectedBrand}
              onSelect={(b) => setSelectedBrand(prev => (prev && prev.id === (b.id || b) ? null : (b.id ? b : { id: b, name: b })))}
            />
          </div>
        )}

        {/* Öne Çıkarılmış Ürünler Section */}
        {featuredProducts.length > 0 && selectedFilter === 'all' && !selectedBrand && (
          <div className="mb-12">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-1 h-8 bg-yellow-500"></div>
              <h2 className="text-2xl font-bold text-gray-900">Öne Çıkarılan Ürünler</h2>
            </div>
            
            {featuredLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
                {featuredProducts.slice(0, 6).map((product, index) => (
                  <div key={product.id} className="relative group">
                    <div className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center z-10">
                      {index + 1}
                    </div>
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Ürünler yükleniyor...</p>
            </div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">Bu kategoride ürün bulunamadı.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductListPage

