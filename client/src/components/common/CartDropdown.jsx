import { Link } from 'react-router-dom'
import useCartStore from '../../store/cartStore'
import { buildAssetUrl } from '../../utils/api'

const CartDropdown = ({ isOpen, onClose }) => {
  const { items, removeItem, getTotalItems, getTotalPrice, getCampaignDiscount } = useCartStore()

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40 bg-black bg-opacity-20" 
        onClick={onClose}
      />
      
      {/* Dropdown */}
      <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white shadow-2xl border border-neutral-200 z-50 max-h-96 overflow-hidden">
        {/* Header */}
        <div className="bg-neutral-50 px-6 py-5 border-b border-neutral-200">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-neutral-900 text-sm uppercase tracking-wider">Sepet</h3>
            <span className="text-xs text-neutral-600 uppercase tracking-wider">{getTotalItems()} Ürün</span>
          </div>
        </div>

        {/* Items */}
        <div className="max-h-64 overflow-y-auto">
          {items.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-neutral-500 text-sm font-light">Sepetiniz boş</p>
            </div>
          ) : (
            <div className="divide-y divide-neutral-200">
              {items.slice(0, 3).map((item) => {
                // Renk bilgisine göre resim seç
                const displayImage = item.selectedColor?.images?.[0] || item.image;
                
                return (
                  <div key={item.cartKey} className="p-4 hover:bg-neutral-50 transition-colors">
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-20 bg-neutral-100 overflow-hidden flex-shrink-0">
                        {displayImage ? (
                          <img
                            src={buildAssetUrl(displayImage)}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-xs text-neutral-300 uppercase tracking-wider">Görsel Yok</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-grow min-w-0">
                        <p className="font-medium text-neutral-900 text-sm truncate mb-1">
                          {item.name}
                        </p>
                        {item.selectedColor && (
                          <p className="text-xs text-neutral-500 mb-1">
                            Renk: {item.selectedColor.name}
                          </p>
                        )}
                        {item.selectedSize && (
                          <p className="text-xs text-neutral-500 mb-1">
                            Numara: {item.selectedSize}
                          </p>
                        )}
                        <p className="text-neutral-600 text-sm font-light mb-2">
                          ₺{item.price.toFixed(2)} × {item.quantity}
                        </p>
                        <button
                          onClick={() => removeItem(item.cartKey)}
                          className="text-xs text-neutral-500 hover:text-neutral-900 uppercase tracking-wider font-medium transition-colors"
                        >
                          Kaldır
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
              {items.length > 3 && (
                <div className="p-4 text-center text-xs text-neutral-500 uppercase tracking-wider">
                  +{items.length - 3} Ürün Daha
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="bg-neutral-50 px-6 py-5 border-t border-neutral-200">
            {getCampaignDiscount() > 0 && (
              <div className="flex items-center justify-between mb-3 text-xs text-accent-600 uppercase tracking-wider">
                <span>Kampanya İndirimi</span>
                <span className="font-medium">-₺{getCampaignDiscount().toFixed(2)}</span>
              </div>
            )}
            <div className="flex items-center justify-between mb-4">
              <span className="font-medium text-neutral-900 text-sm uppercase tracking-wider">Toplam</span>
              <span className="font-light text-xl text-neutral-900">
                ₺{getTotalPrice().toFixed(2)}
              </span>
            </div>
            <Link
              to="/cart"
              onClick={onClose}
              className="w-full btn-primary text-center block"
            >
              Sepete Git
            </Link>
          </div>
        )}
      </div>
    </>
  )
}

export default CartDropdown
