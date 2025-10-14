import { useState, useEffect } from 'react'
import { Plus, Filter, X } from 'lucide-react'
import axios from 'axios'
import ProductCard from '../../components/admin/ProductCard'
import ProductForm from '../../components/admin/ProductForm'
import AdminAuth from '../../components/admin/AdminAuth'

const AdminProducts = () => {
  const [products, setProducts] = useState([])
  const [campaigns, setCampaigns] = useState([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedBrand, setSelectedBrand] = useState(null)
  const [filteredProducts, setFilteredProducts] = useState([])

  // Marka listesi
  const brands = [
    { id: 'nike', name: 'Nike', color: 'bg-gray-900', textColor: 'text-white' },
    { id: 'adidas', name: 'Adidas', color: 'bg-black', textColor: 'text-white' },
    { id: 'new-balance', name: 'New Balance', color: 'bg-red-600', textColor: 'text-white' },
    { id: 'calvin-klein', name: 'Calvin Klein', color: 'bg-blue-800', textColor: 'text-white' },
    { id: 'vans', name: 'Vans', color: 'bg-white', textColor: 'text-black', border: 'border-2 border-gray-300' }
  ]

  useEffect(() => {
    fetchProducts()
    fetchCampaigns()
  }, [])

  // Ürünleri markaya göre filtrele
  useEffect(() => {
    if (selectedBrand) {
      const filtered = products.filter(product => 
        product.name.toLowerCase().includes(selectedBrand.toLowerCase())
      )
      setFilteredProducts(filtered)
    } else {
      setFilteredProducts(products)
    }
  }, [products, selectedBrand])

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/products')
      setProducts(Array.isArray(response.data) ? response.data : [])
    } catch (error) {
      console.error('Ürünler yüklenirken hata:', error)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  const fetchCampaigns = async () => {
    try {
      const response = await axios.get('/api/campaigns')
      setCampaigns(Array.isArray(response.data) ? response.data : [])
    } catch (error) {
      console.error('Kampanyalar yüklenirken hata:', error)
      setCampaigns([])
    }
  }

  const handleSubmit = async (formData) => {
    try {
      const data = new FormData()
      data.append('name', formData.name)
      data.append('description', formData.description)
      data.append('price', formData.price)
      data.append('stock', formData.stock)
      data.append('campaignId', formData.campaignId)
      
      // Ana ürün resimlerini ekle
      if (formData.images && formData.images.length > 0) {
        formData.images.forEach(image => {
          data.append('images', image)
        })
      }
      
      // Renk seçeneklerini handle et
      if (formData.colorOptions && formData.colorOptions.length > 0) {
        // Renk resimlerini ekle
        formData.colorOptions.forEach((colorOption, colorIndex) => {
          if (colorOption.images && colorOption.images.length > 0) {
            colorOption.images.forEach(image => {
              if (image instanceof File) {
                data.append('colorImages', image)
              }
            })
          }
        })
        
        // ColorOptions metadata'sını ekle
        data.append('colorOptions', JSON.stringify(formData.colorOptions.map(co => ({
          name: co.name,
          imageCount: co.images?.filter(img => img instanceof File).length || 0
        }))))
      }

      // Numara stoklarını ekle (sizeStock zaten JSON string olarak geliyor veya null)
      if (formData.sizeStock) {
        data.append('sizeStock', formData.sizeStock)
      }

      if (editingProduct) {
        await axios.put(`/api/products/${editingProduct.id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
      } else {
        await axios.post('/api/products', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
      }

      fetchProducts()
      setIsFormOpen(false)
      setEditingProduct(null)
    } catch (error) {
      console.error('Ürün kaydedilirken hata:', error)
      
      let errorMessage = 'Bir hata oluştu. Lütfen tekrar deneyin.'
      
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.message) {
        errorMessage = error.message
      }
      
      // Detaylı hata bilgisi varsa göster
      if (error.response?.data?.details) {
        errorMessage += '\n\nDetaylar: ' + error.response.data.details
      }
      
      alert(`Hata: ${errorMessage}`)
    }
  }

  const handleEdit = (product) => {
    setEditingProduct(product)
    setIsFormOpen(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Bu ürünü silmek istediğinize emin misiniz?')) {
      try {
        await axios.delete(`/api/products/${id}`)
        fetchProducts()
      } catch (error) {
        console.error('Ürün silinirken hata:', error)
        alert('Ürün silinirken bir hata oluştu.')
      }
    }
  }

  const handleAddNew = () => {
    setEditingProduct(null)
    setIsFormOpen(true)
  }

  const handleAddNewForBrand = (brandName) => {
    setEditingProduct(null)
    setIsFormOpen(true)
    setSelectedBrand(brandName)
  }

  const clearBrandFilter = () => {
    setSelectedBrand(null)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <AdminAuth>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-8 space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Ürün Yönetimi</h1>
          <p className="text-gray-600 mt-2">
            {selectedBrand ? `${selectedBrand} - ${filteredProducts.length} ürün` : `Toplam ${products.length} ürün`}
          </p>
        </div>
        
        {/* Brand Filter */}
        {selectedBrand && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Filtre:</span>
            <div className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full flex items-center space-x-2">
              <span className="font-medium">{selectedBrand}</span>
              <button
                onClick={clearBrandFilter}
                className="hover:bg-primary-200 rounded-full p-1 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        <button
          onClick={handleAddNew}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Yeni Ürün Ekle</span>
        </button>
      </div>

      {/* Brand Categories */}
      <div className="mb-8">
        <div className="flex items-center space-x-2 mb-4">
          <Filter className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Marka Kategorileri</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {brands.map(brand => {
            const brandProducts = products.filter(product => 
              product.name.toLowerCase().includes(brand.id.replace('-', ' '))
            )
            
            return (
              <div
                key={brand.id}
                className={`relative group cursor-pointer rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg ${brand.color} ${brand.border || ''}`}
                onClick={() => setSelectedBrand(brand.name)}
              >
                {/* Brand Name */}
                <div className={`p-4 text-center ${brand.textColor}`}>
                  <h3 className="font-bold text-lg">{brand.name}</h3>
                  <p className="text-sm opacity-80">{brandProducts.length} ürün</p>
                </div>

                {/* Add Product Button */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleAddNewForBrand(brand.name)
                    }}
                    className="opacity-0 group-hover:opacity-100 bg-white text-gray-900 px-4 py-2 rounded-lg font-medium transition-all duration-300 transform translate-y-2 group-hover:translate-y-0"
                  >
                    Ürün Ekle
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          {selectedBrand ? (
            <>
              <p className="text-gray-500 text-lg">
                {selectedBrand} markasında henüz ürün bulunmuyor.
              </p>
              <button
                onClick={() => handleAddNewForBrand(selectedBrand)}
                className="btn-primary mt-4"
              >
                İlk {selectedBrand} Ürününü Ekle
              </button>
            </>
          ) : (
            <>
              <p className="text-gray-500 text-lg">Henüz ürün eklenmemiş.</p>
              <button
                onClick={handleAddNew}
                className="btn-primary mt-4"
              >
                İlk Ürünü Ekle
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Product Form Modal */}
      {isFormOpen && (
        <ProductForm
          product={editingProduct}
          campaigns={campaigns}
          selectedBrand={selectedBrand}
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsFormOpen(false)
            setEditingProduct(null)
            setSelectedBrand(null)
          }}
        />
      )}
      </div>
    </AdminAuth>
  )
}

export default AdminProducts

