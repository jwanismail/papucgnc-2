import { useState, useEffect } from 'react'
import axios from 'axios'
import ProductCard from '../../components/product/ProductCard'

const ProductListPage = () => {
  const [products, setProducts] = useState([])
  const [campaigns, setCampaigns] = useState([])
  const [selectedFilter, setSelectedFilter] = useState('all') // 'all', 'second-pair-699', 'new-season'
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
      
      setProducts(productsData)
      setCampaigns(campaignsData)
    } catch (error) {
      console.error('Veri yüklenirken hata:', error)
      // Hata durumunda boş array kullan
      setProducts([])
      setCampaigns([])
    } finally {
      setLoading(false)
    }
  }

  // Filtre mantığı
  const filteredProducts = (() => {
    if (selectedFilter === 'all') {
      return products
    }
    
    if (selectedFilter === 'second-pair-699') {
      // "2. Çift 699 TL" kampanyalı ürünler
      const campaign699 = campaigns.find(c => c.type === 'second_pair_699')
      return campaign699 ? products.filter(p => p.campaignId === campaign699.id) : []
    }
    
    if (selectedFilter === 'new-season') {
      // "Yeni Sezon İndirimleri" - kampanyalı tüm ürünler
      return products.filter(p => p.campaignId)
    }
    
    return products
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
        {/* Sonuç Sayısı */}
        <div className="mb-6">
          <p className="text-gray-600 text-sm">
            <span className="font-semibold text-gray-900">{filteredProducts.length}</span> ürün bulundu
          </p>
        </div>

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

