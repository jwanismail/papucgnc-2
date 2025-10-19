import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, ShoppingCart, Package, Tag, ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react'
import api, { buildAssetUrl } from '../../utils/api'
import useCartStore from '../../store/cartStore'
import ProductCard from '../../components/product/ProductCard'

const ProductDetailPage = () => {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)
  const [touchStart, setTouchStart] = useState(null)
  const [touchEnd, setTouchEnd] = useState(null)
  const [selectedColorIndex, setSelectedColorIndex] = useState(null)
  const [selectedSize, setSelectedSize] = useState(null)
  const addItem = useCartStore((state) => state.addItem)
  const [showAddedModal, setShowAddedModal] = useState(false)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [relatedLoading, setRelatedLoading] = useState(true)

  useEffect(() => {
    fetchProduct()
    fetchRelatedProducts()
  }, [id])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isImageModalOpen) return

      switch (e.key) {
        case 'Escape':
          closeImageModal()
          break
        case 'ArrowLeft':
          prevImage()
          break
        case 'ArrowRight':
          nextImage()
          break
        default:
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isImageModalOpen])

  const fetchProduct = async () => {
    try {
      const response = await api.get(`/products/${id}`)
      setProduct(response.data || null)
    } catch (error) {
      console.error('Ürün yüklenirken hata:', error)
      setProduct(null)
    } finally {
      setLoading(false)
    }
  }

  const fetchRelatedProducts = async () => {
    try {
      setRelatedLoading(true)
      const response = await api.get('/products')
      const allProducts = Array.isArray(response.data) ? response.data : []
      
      // Mevcut ürünü hariç tut ve ilk 8 ürünü al
      const filteredProducts = allProducts
        .filter(p => p.id !== parseInt(id))
        .slice(0, 8)
      
      setRelatedProducts(filteredProducts)
    } catch (error) {
      console.error('İlgili ürünler yüklenirken hata:', error)
      setRelatedProducts([])
    } finally {
      setRelatedLoading(false)
    }
  }

  const handleAddToCart = () => {
    if (product) {
      // Numara kontrolü - sadece sizeStock varsa
      if (product.sizeStock && !selectedSize) {
        alert('Lütfen bir numara seçin!')
        return
      }
      
      // Seçili renk bilgisini hazırla
      const selectedColorData = selectedColorIndex !== null && product.colorOptions && product.colorOptions[selectedColorIndex]
        ? {
            index: selectedColorIndex,
            name: product.colorOptions[selectedColorIndex].name,
            images: product.colorOptions[selectedColorIndex].images
          }
        : null;
      
      for (let i = 0; i < quantity; i++) {
        addItem(product, selectedColorData, selectedSize)
      }

      // Başarı modalını göster
      setShowAddedModal(true)
    }
  }

  // Resim carousel fonksiyonları
  const getProductImages = () => {
    // Eğer bir renk seçiliyse, o rengin resimlerini göster
    if (selectedColorIndex !== null && product?.colorOptions && product.colorOptions[selectedColorIndex]) {
      const colorImages = product.colorOptions[selectedColorIndex].images
      if (colorImages && colorImages.length > 0) {
        return colorImages
      }
    }
    
    // Değilse ana ürün resimlerini göster
    if (product?.images && product.images.length > 0) {
      return product.images
    } else if (product?.image) {
      return [product.image]
    }
    return []
  }

  const nextImage = () => {
    const images = getProductImages()
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    const images = getProductImages()
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const openImageModal = (index = 0) => {
    setCurrentImageIndex(index)
    setIsImageModalOpen(true)
  }

  const closeImageModal = () => {
    setIsImageModalOpen(false)
  }

  // Touch/swipe handlers
  const minSwipeDistance = 50

  const onTouchStart = (e) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      nextImage()
    }
    if (isRightSwipe) {
      prevImage()
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <p className="text-gray-500 text-lg mb-4">Ürün bulunamadı</p>
        <Link to="/products" className="text-primary-600 hover:text-primary-700">
          Ürünlere Dön
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <Link
        to="/products"
        className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-8"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Ürünlere Dön</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          {/* Ana Resim Carousel */}
          <div className="relative bg-gray-100 rounded-2xl overflow-hidden group">
            {(() => {
              const images = getProductImages()
              if (images.length === 0) {
                return (
                  <div className="w-full h-96 flex items-center justify-center">
                    <Package className="w-32 h-32 text-gray-300" />
                  </div>
                )
              }

              return (
                <>
                  {/* Ana Resim */}
                  <div 
                    className="relative w-full h-96 cursor-pointer" 
                    onClick={() => openImageModal(currentImageIndex)}
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                  >
                    <img
                      src={buildAssetUrl(images[currentImageIndex])}
                      alt={`${product.name} ${currentImageIndex + 1}`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    
                    {/* Zoom Icon */}
                    <div className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <ZoomIn className="w-5 h-5" />
                    </div>

                    {/* Resim Sayısı */}
                    {images.length > 1 && (
                      <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                        {currentImageIndex + 1} / {images.length}
                      </div>
                    )}
                  </div>

                  {/* Navigation Buttons */}
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <ChevronRight className="w-6 h-6" />
                      </button>
                    </>
                  )}
                </>
              )
            })()}
          </div>
          
          {/* Küçük Resimler Thumbnails */}
          {(() => {
            const images = getProductImages()
            if (images.length <= 1) return null

            return (
              <div className="grid grid-cols-4 gap-3">
                {images.slice(0, 4).map((image, index) => (
                  <div 
                    key={index} 
                    className={`bg-gray-100 rounded-lg overflow-hidden cursor-pointer transition-all duration-200 ${
                      index === currentImageIndex 
                        ? 'ring-2 ring-primary-500 scale-105' 
                        : 'hover:scale-105'
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                  >
                    <img
                      src={buildAssetUrl(image)}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-20 object-cover"
                    />
                  </div>
                ))}
                {images.length > 4 && (
                  <div 
                    className="bg-gray-200 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-300 transition-colors"
                    onClick={() => openImageModal(4)}
                  >
                    <span className="text-gray-600 text-sm font-medium">
                      +{images.length - 4}
                    </span>
                  </div>
                )}
              </div>
            )
          })()}
        </div>

        {/* Product Info */}
        <div className="flex flex-col justify-center">
          {product.campaign && (
            <div className="inline-flex items-center space-x-2 bg-red-100 text-red-700 px-4 py-2 rounded-full w-fit mb-4">
              <Tag className="w-4 h-4" />
              <span className="font-bold">{product.campaign.name}</span>
            </div>
          )}

          <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>

          {product.description && (
            <p className="text-gray-600 mb-6 text-lg leading-relaxed">
              {product.description}
            </p>
          )}

          <div className="mb-8">
            <div className="flex items-baseline gap-3 mb-2">
              <span className="line-through text-neutral-400 text-base">₺699.00</span>
              <p className="text-5xl font-bold text-primary-600">
                ₺{product.price.toFixed(2)}
              </p>
            </div>
            {product.stock > 0 ? (
              <div className="text-sm">
                <p className={`font-medium ${product.stock <= 10 ? 'text-red-600' : 'text-green-600'}`}>
                  Sınırlı stokta mevcuttur
                </p>
                <p className="text-gray-600 mt-1">
                  Stoklar tükenmeden acele edin!
                </p>
              </div>
            ) : (
              <p className="text-red-600 font-medium">Stokta yok</p>
            )}
          </div>

          {/* Renk Seçenekleri */}
          {product.colorOptions && product.colorOptions.length > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Renk Seçenekleri
              </label>
              <div className="flex flex-wrap gap-3">
                {/* Ana Ürün Rengi */}
                <button
                  onClick={() => {
                    setSelectedColorIndex(null)
                    setCurrentImageIndex(0)
                  }}
                  className={`relative group/color transition-all ${
                    selectedColorIndex === null
                      ? 'ring-2 ring-primary-600 scale-105'
                      : 'hover:scale-105'
                  }`}
                  title="Orijinal"
                >
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 border-gray-200">
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={buildAssetUrl(product.images[0])}
                        alt="Orijinal"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <span className="text-xs text-gray-400">Ana</span>
                      </div>
                    )}
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover/color:bg-opacity-10 rounded-lg transition-opacity" />
                  <p className="text-xs text-center mt-1 font-medium text-gray-700">Orijinal</p>
                </button>

                {/* Diğer Renkler */}
                {product.colorOptions.map((color, index) => (
                  color.images && color.images.length > 0 && (
                    <button
                      key={index}
                      onClick={() => {
                        setSelectedColorIndex(index)
                        setCurrentImageIndex(0)
                      }}
                      className={`relative group/color transition-all ${
                        selectedColorIndex === index
                          ? 'ring-2 ring-primary-600 scale-105'
                          : 'hover:scale-105'
                      }`}
                      title={color.name}
                    >
                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 border-gray-200">
                        <img
                          src={buildAssetUrl(color.images[0])}
                          alt={color.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover/color:bg-opacity-10 rounded-lg transition-opacity" />
                      <p className="text-xs text-center mt-1 font-medium text-gray-700 line-clamp-1">
                        {color.name}
                      </p>
                    </button>
                  )
                ))}
              </div>
            </div>
          )}

          {/* Numara Seçimi */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Numara Seçin *
            </label>
            {product.sizeStock ? (
              <>
                <div className="grid grid-cols-5 md:grid-cols-9 gap-2">
                  {Object.entries(
                    typeof product.sizeStock === 'string'
                      ? JSON.parse(product.sizeStock)
                      : product.sizeStock || {}
                  ).map(([size, stock]) => {
                    const isAvailable = stock > 0
                    const isSelected = selectedSize === size
                    
                    return (
                      <button
                        key={size}
                        onClick={() => isAvailable && setSelectedSize(size)}
                        disabled={!isAvailable}
                        className={`
                          py-3 px-2 rounded-lg border-2 transition-all font-medium text-sm
                          ${isSelected 
                            ? 'bg-primary-600 text-white border-primary-600 scale-105' 
                            : isAvailable
                              ? 'bg-white text-gray-700 border-gray-300 hover:border-primary-400 hover:bg-primary-50'
                              : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed line-through'
                          }
                        `}
                      >
                        {size}
                        {!isAvailable && <div className="text-[10px]">Tükendi</div>}
                      </button>
                    )
                  })}
                </div>
                {selectedSize && (
                  <p className="mt-2 text-sm text-green-600">
                    ✓ Numara {selectedSize} seçildi
                  </p>
                )}
              </>
            ) : (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-sm text-amber-800">
                  ⚠️ Bu ürün için henüz numara stokları tanımlanmamış. 
                  Lütfen farklı bir ürün seçin veya yönetici ile iletişime geçin.
                </p>
              </div>
            )}
          </div>

          {/* Quantity Selector */}
          {product.stock > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Miktar
              </label>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-lg bg-gray-200 hover:bg-gray-300 font-bold"
                >
                  -
                </button>
                <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="w-10 h-10 rounded-lg bg-gray-200 hover:bg-gray-300 font-bold"
                >
                  +
                </button>
              </div>
            </div>
          )}

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="btn-primary flex items-center justify-center space-x-3 text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingCart className="w-6 h-6" />
            <span>Sepete Ekle</span>
          </button>
        </div>
      </div>

      {/* Resim Modal */}
      {isImageModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-7xl max-h-full">
            {/* Close Button */}
            <button
              onClick={closeImageModal}
              className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Modal Content */}
            <div 
              className="relative"
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              {(() => {
                const images = getProductImages()
                if (images.length === 0) return null

                return (
                  <>
                    {/* Ana Resim */}
                    <img
                      src={buildAssetUrl(images[currentImageIndex])}
                      alt={`${product.name} ${currentImageIndex + 1}`}
                      className="max-w-full max-h-[80vh] object-contain"
                    />

                    {/* Navigation Buttons */}
                    {images.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors"
                        >
                          <ChevronLeft className="w-8 h-8" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors"
                        >
                          <ChevronRight className="w-8 h-8" />
                        </button>
                      </>
                    )}

                    {/* Resim Sayısı */}
                    {images.length > 1 && (
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full">
                        {currentImageIndex + 1} / {images.length}
                      </div>
                    )}
                  </>
                )
              })()}
            </div>

            {/* Thumbnail Navigation */}
            {(() => {
              const images = getProductImages()
              if (images.length <= 1) return null

              return (
                <div className="flex justify-center space-x-2 mt-4 overflow-x-auto max-w-full">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden transition-all duration-200 ${
                        index === currentImageIndex 
                          ? 'ring-2 ring-white scale-110' 
                          : 'opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={buildAssetUrl(image)}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )
            })()}
          </div>
        </div>
      )}

      {/* Diğer Ürünlerimiz Section */}
      {relatedProducts.length > 0 && (
        <section className="mt-16 lg:mt-24 py-12 lg:py-20 bg-gradient-to-b from-white via-neutral-50/30 to-white border-t border-neutral-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center mb-12 lg:mb-16">
              <div className="space-y-6 max-w-4xl mx-auto">
                {/* Badge */}
                <div className="inline-flex items-center justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary-200/30 blur-sm rounded-full"></div>
                    <p className="relative text-xs sm:text-sm text-primary-700 uppercase tracking-wider font-medium bg-white/80 backdrop-blur-sm px-4 sm:px-6 py-2 sm:py-3 rounded-full border border-primary-200">
                      Koleksiyonumuzdan
                    </p>
                  </div>
                </div>
                
                {/* Title */}
                <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-light tracking-tight text-neutral-900 leading-tight">
                  Diğer Ürünlerimiz
                </h2>
                
                {/* Subtitle */}
                <p className="text-base sm:text-lg lg:text-xl text-neutral-600 font-light leading-relaxed max-w-2xl mx-auto px-4">
                  Beğeneceğinizi düşündüğümüz ürünler
                </p>
              </div>
            </div>

            {/* Products Grid */}
            {relatedLoading ? (
              <div className="flex justify-center py-12">
                <div className="text-center space-y-4">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-neutral-200 border-t-neutral-900 rounded-full animate-spin mx-auto"></div>
                  </div>
                  <p className="text-sm text-neutral-600 uppercase tracking-wider font-medium">Yükleniyor</p>
                </div>
              </div>
            ) : (
              <>
                {/* Desktop/Tablet Grid */}
                <div className="hidden sm:grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-8">
                  {relatedProducts.slice(0, 8).map((relatedProduct, index) => (
                    <div 
                      key={relatedProduct.id}
                      className="transform transition-all duration-700 hover:scale-105"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <ProductCard product={relatedProduct} />
                    </div>
                  ))}
                </div>

                {/* Mobile Horizontal Scroll */}
                <div className="sm:hidden">
                  <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 no-scrollbar">
                    {relatedProducts.slice(0, 6).map((relatedProduct, index) => (
                      <div 
                        key={relatedProduct.id}
                        className="flex-shrink-0 w-48 transform transition-all duration-700"
                        style={{ animationDelay: `${index * 150}ms` }}
                      >
                        <ProductCard product={relatedProduct} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* View All Button */}
                {relatedProducts.length > 0 && (
                  <div className="text-center mt-8 lg:mt-12">
                    <Link 
                      to="/products" 
                      className="group relative inline-flex items-center justify-center overflow-hidden bg-neutral-900 hover:bg-neutral-800 text-white font-medium px-8 lg:px-10 py-3 lg:py-4 text-sm lg:text-base uppercase tracking-wider transition-all duration-500 transform hover:scale-105 hover:shadow-2xl rounded-lg"
                    >
                      <span className="relative z-10 flex items-center gap-3">
                        Tüm Koleksiyonu Görüntüle
                        <div className="w-2 h-2 bg-white rounded-full group-hover:translate-x-1 transition-transform duration-300"></div>
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-neutral-800 to-neutral-900 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      )}

      {/* Sepete Eklendi Modal */}
      {showAddedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowAddedModal(false)} />
          <div className="relative bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 z-10">
            <div className="text-center space-y-3">
              <div className="mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-green-600 text-xl">✓</span>
              </div>
              <h3 className="text-lg font-semibold text-neutral-900">Siparişiniz sepete eklendi</h3>
              <p className="text-sm text-neutral-600">Alışverişe devam edebilir veya sepetinize gidebilirsiniz.</p>
            </div>
            <div className="mt-6 space-y-2">
              <button
                onClick={() => setShowAddedModal(false)}
                className="w-full btn-secondary"
              >
                Alışverişe Devam Et
              </button>
              <Link
                to="/cart"
                className="w-full btn-primary inline-flex items-center justify-center"
                onClick={() => setShowAddedModal(false)}
              >
                Sepete Git
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductDetailPage

