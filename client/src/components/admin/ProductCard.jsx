import { useState } from 'react'
import { Edit, Trash2, Package, AlertTriangle, Star } from 'lucide-react'
import { buildAssetUrl } from '../../utils/api'

const ProductCard = ({ product, onEdit, onDelete, onAddToFeatured, isFeatured = false }) => {
  const [imageError, setImageError] = useState(false)
  
  // Numara stoklarını kontrol et
  const sizeStock = product.sizeStock 
    ? (typeof product.sizeStock === 'string' ? JSON.parse(product.sizeStock) : product.sizeStock)
    : null
  
  const lowStockSizes = sizeStock 
    ? Object.entries(sizeStock).filter(([size, stock]) => stock > 0 && stock <= 5)
    : []
  
  const outOfStockSizes = sizeStock 
    ? Object.entries(sizeStock).filter(([size, stock]) => stock === 0)
    : []
  
  return (
    <div className="card group hover:shadow-lg transition-all duration-200">
      {/* Product Images */}
      <div className="relative overflow-hidden rounded-lg mb-4 bg-gray-100 h-48">
        {imageError || (!product.images?.length && !product.image) ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="flex flex-col items-center justify-center text-gray-500">
              <Package className="w-16 h-16 mb-2" />
              <span className="text-sm">Resim Yüklenemedi</span>
            </div>
          </div>
        ) : (
          <div className="relative w-full h-full">
            <img
              src={product.images?.length > 0 
                ? buildAssetUrl(product.images[0]) 
                : buildAssetUrl(product.image)
              }
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={() => setImageError(true)}
            />
            {product.images?.length > 1 && (
              <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                +{product.images.length - 1} daha
              </div>
            )}
          </div>
        )}
        
        <div className="absolute top-2 right-2 flex flex-col space-y-1">
          {product.featuredOrder && (
            <span className="bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center space-x-1">
              <Star className="w-3 h-3" />
              <span>#{product.featuredOrder}</span>
            </span>
          )}
          {product.campaign && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              Kampanyalı
            </span>
          )}
        </div>
      </div>

      {/* Product Info */}
      <div className="space-y-2">
        <h3 className="font-semibold text-lg text-gray-900 truncate">
          {product.name}
        </h3>
        
        {product.description && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {product.description}
          </p>
        )}

        <div className="flex items-center justify-between pt-2">
          <div>
            <p className="text-2xl font-bold text-primary-600">
              ₺{product.price.toFixed(2)}
            </p>
            <p className="text-sm text-gray-500">
              Stok: {product.stock} adet
            </p>
          </div>
        </div>

        {product.campaign && (
          <div className="text-xs bg-red-50 text-red-700 px-2 py-1 rounded">
            {product.campaign.name}
          </div>
        )}
        
        {/* Numara Stok Durumu */}
        {sizeStock && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-xs font-medium text-gray-700 mb-2">Numara Stokları:</p>
            <div className="grid grid-cols-3 gap-1">
              {Object.entries(sizeStock).map(([size, stock]) => (
                <div
                  key={size}
                  className={`text-xs py-1 px-2 rounded text-center ${
                    stock === 0
                      ? 'bg-gray-200 text-gray-400 line-through'
                      : stock <= 5
                      ? 'bg-red-100 text-red-700 font-bold'
                      : 'bg-green-100 text-green-700'
                  }`}
                  title={stock === 0 ? 'Stokta Yok' : stock <= 5 ? `UYARI: ${stock} adet kaldı!` : `${stock} adet mevcut`}
                >
                  {size}: {stock}
                </div>
              ))}
            </div>
            
            {/* Stok Uyarıları */}
            {lowStockSizes.length > 0 && (
              <div className="mt-2 flex items-start space-x-2 bg-amber-50 border border-amber-200 rounded p-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-amber-800">
                  <p className="font-bold">Düşük Stok Uyarısı!</p>
                  <p>
                    Numara {lowStockSizes.map(([size, stock]) => `${size} (${stock} adet)`).join(', ')} 
                    {' '}tükenmek üzere
                  </p>
                </div>
              </div>
            )}
            
            {outOfStockSizes.length > 0 && (
              <div className="mt-2 text-xs bg-red-50 border border-red-200 text-red-700 rounded p-2">
                <p className="font-bold">Tükenen Numaralar:</p>
                <p>{outOfStockSizes.map(([size]) => size).join(', ')}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        {/* Öne Çıkarma Butonu */}
        {onAddToFeatured && (
          <div className="mb-3">
            <button
              onClick={() => onAddToFeatured(product)}
              disabled={isFeatured}
              className={`w-full flex items-center justify-center space-x-2 font-medium px-4 py-2 rounded-lg transition-colors ${
                isFeatured || product.featuredOrder
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-yellow-50 hover:bg-yellow-100 text-yellow-600'
              }`}
            >
              <Star className={`w-4 h-4 ${!isFeatured && !product.featuredOrder ? 'fill-current' : ''}`} />
              <span>
                {isFeatured || product.featuredOrder ? 'Zaten Öne Çıkarılmış' : 'Öne Çıkar'}
              </span>
            </button>
          </div>
        )}
        
        {/* Ana Butonlar */}
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(product)}
            className="flex-1 flex items-center justify-center space-x-2 bg-blue-50 hover:bg-blue-100 text-blue-600 font-medium px-4 py-2 rounded-lg transition-colors"
          >
            <Edit className="w-4 h-4" />
            <span>Düzenle</span>
          </button>
          <button
            onClick={() => onDelete(product.id)}
            className="flex-1 flex items-center justify-center space-x-2 bg-red-50 hover:bg-red-100 text-red-600 font-medium px-4 py-2 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Sil</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard

