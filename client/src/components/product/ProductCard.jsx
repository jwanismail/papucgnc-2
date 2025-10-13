import { Link } from 'react-router-dom'
import useCartStore from '../../store/cartStore'

const ProductCard = ({ product }) => {
  const addItem = useCartStore((state) => state.addItem)

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(product, null, null) // Renk ve numara seçeneği olmadan
  }

  return (
    <Link to={`/products/${product.id}`}>
      <div className="group cursor-pointer h-full flex flex-col">
        {/* Product Images */}
        <div className="relative overflow-hidden bg-neutral-100 aspect-[3/4] mb-2 md:mb-4">
          {product.images && product.images.length > 0 ? (
            <div className="relative w-full h-full">
              <img
                src={`http://localhost:5000${product.images[0]}`}
                alt={product.name}
                className="w-full h-full object-cover group-hover:opacity-90 transition-opacity duration-300"
                loading="lazy"
              />
              {product.images.length > 1 && (
                <div className="absolute bottom-1.5 left-1.5 md:bottom-3 md:left-3 bg-white text-neutral-900 text-[10px] md:text-xs px-1.5 py-0.5 md:px-3 md:py-1 uppercase tracking-wider font-medium">
                  +{product.images.length - 1}
                </div>
              )}
            </div>
          ) : product.image ? (
            <img
              src={`http://localhost:5000${product.image}`}
              alt={product.name}
              className="w-full h-full object-cover group-hover:opacity-90 transition-opacity duration-300"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-neutral-300 text-sm uppercase tracking-wider">Görsel Yok</div>
            </div>
          )}
          
          {product.campaign && (
            <div className="absolute top-1.5 right-1.5 md:top-3 md:right-3 bg-neutral-900 text-white text-[9px] md:text-xs px-1.5 py-0.5 md:px-3 md:py-1 uppercase tracking-wider font-medium">
              {product.campaign.name}
            </div>
          )}

          {product.stock === 0 && (
            <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center">
              <span className="text-neutral-900 font-medium text-sm uppercase tracking-wider">
                Tükendi
              </span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex-grow space-y-1 md:space-y-3">
          <h3 className="font-medium text-neutral-900 group-hover:opacity-70 transition-opacity line-clamp-2 tracking-tight text-xs md:text-base leading-tight">
            {product.name}
          </h3>
          
          {product.description && (
            <p className="text-xs md:text-sm text-neutral-600 line-clamp-1 md:line-clamp-2 font-light hidden md:block">
              {product.description}
            </p>
          )}

          <div className="pt-1">
            <p className="text-base md:text-2xl font-light text-neutral-900">
              ₺{product.price.toFixed(2)}
            </p>
            {product.stock > 0 && product.stock <= 10 && (
              <p className="text-[10px] md:text-xs text-accent-600 font-medium mt-1 md:mt-2 uppercase tracking-wider">
                Son {product.stock} ürün
              </p>
            )}
          </div>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="w-full mt-2 md:mt-4 btn-primary disabled:opacity-30 disabled:cursor-not-allowed text-[11px] md:text-sm py-1.5 md:py-3.5"
        >
          Sepete Ekle
        </button>
      </div>
    </Link>
  )
}

export default ProductCard

