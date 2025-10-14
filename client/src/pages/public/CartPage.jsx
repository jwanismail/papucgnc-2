import { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  ShoppingCart, 
  Minus, 
  Plus, 
  Trash2, 
  ArrowLeft, 
  CreditCard,
  Truck,
  Shield,
  CheckCircle
} from 'lucide-react'
import useCartStore from '../../store/cartStore'
import { buildAssetUrl } from '../../utils/api'

const CartPage = () => {
  const { 
    items, 
    updateQuantity, 
    removeItem, 
    clearCart, 
    getTotalItems, 
    getTotalPrice,
    getCampaignDiscount
  } = useCartStore()


  const handleQuantityChange = (cartKey, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(cartKey)
    } else {
      updateQuantity(cartKey, newQuantity)
    }
  }


  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Link
            to="/products"
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-8"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Alışverişe Devam Et</span>
          </Link>

          {/* Empty Cart */}
          <div className="text-center py-20">
            <div className="bg-gray-100 w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="w-16 h-16 text-gray-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Sepetiniz Boş</h1>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Henüz sepetinize ürün eklemediniz. Hemen başlayın ve favori ayakkabılarınızı keşfedin!
            </p>
            <Link
              to="/products"
              className="btn-primary inline-flex items-center space-x-2 text-lg px-8 py-4"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>Ürünleri Keşfet</span>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 space-y-4 sm:space-y-0">
          <div className="text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Sepetim</h1>
            <p className="text-gray-600 mt-1 sm:mt-2">{getTotalItems()} ürün</p>
          </div>
          <Link
            to="/products"
            className="inline-flex items-center justify-center space-x-2 text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-base">Alışverişe Devam Et</span>
          </Link>
        </div>

        {/* Campaign Info Banner */}
        {items.some(item => item.campaign && 
          (item.campaign.type === 'second_pair_699' || 
           item.campaign.name?.includes('2 çift 699') ||
           item.campaign.name?.includes('2 Çift 699'))) && (
          <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 shadow-lg">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 text-2xl">🎉</div>
              <div className="flex-grow">
                <h3 className="font-bold text-lg mb-2">2 Çift 699 TL Kampanyası!</h3>
                <p className="text-sm opacity-90">
                  Kampanyaya dahil olan ürünlerden 2 adet aldığınızda, toplam sadece 699 TL ödeyeceksiniz!
                </p>
                {(() => {
                  const campaign699Count = items.reduce((count, item) => {
                    const isCampaign699 = item.campaign && 
                      (item.campaign.type === 'second_pair_699' || 
                       item.campaign.name?.includes('2 çift 699') ||
                       item.campaign.name?.includes('2 Çift 699'));
                    return count + (isCampaign699 ? item.quantity : 0);
                  }, 0);
                  
                  if (campaign699Count === 1) {
                    return (
                      <p className="text-sm font-semibold mt-2 bg-white/20 rounded-lg px-3 py-2 inline-block">
                        💡 1 ürün daha ekleyin ve kampanyadan yararlanın!
                      </p>
                    );
                  } else if (campaign699Count >= 2) {
                    const pairs = Math.floor(campaign699Count / 2);
                    const remaining = campaign699Count % 2;
                    return (
                      <p className="text-sm font-semibold mt-2 bg-white/20 rounded-lg px-3 py-2 inline-block">
                        ✅ {pairs} çift için kampanya aktif! {remaining > 0 && `(${remaining} ürün daha ekleyin, bir çift daha tamamlayın!)`}
                      </p>
                    );
                  }
                })()}
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Cart Header */}
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-gray-900">Sepetteki Ürünler</h2>
                  <button
                    onClick={clearCart}
                    className="text-red-600 hover:text-red-700 font-medium text-sm"
                  >
                    Sepeti Temizle
                  </button>
                </div>
              </div>

              {/* Cart Items List */}
              <div className="divide-y divide-gray-200">
                {items.map((item) => {
                  // Renk bilgisine göre resim seç
                  const displayImage = item.selectedColor?.images?.[0] || item.image;
                  
                  return (
                    <div key={item.cartKey} className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                        {/* Product Image */}
                        <div className="flex-shrink-0 mx-auto sm:mx-0">
                          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-lg overflow-hidden">
                            {displayImage ? (
                              <img
                                src={buildAssetUrl(displayImage)}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <ShoppingCart className="w-6 h-6 sm:w-8 sm:h-8 text-gray-300" />
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Product Info */}
                        <div className="flex-grow min-w-0 text-center sm:text-left">
                          <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                            {item.name}
                          </h3>
                          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 mt-0.5">
                            {item.selectedColor && (
                              <p className="text-xs text-neutral-600">
                                Renk: <span className="font-medium">{item.selectedColor.name}</span>
                              </p>
                            )}
                            {item.selectedSize && (
                              <p className="text-xs text-neutral-600">
                                Numara: <span className="font-medium">{item.selectedSize}</span>
                              </p>
                            )}
                          </div>
                          {item.description && (
                            <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 mt-1">
                              {item.description}
                            </p>
                          )}
                          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mt-2 space-y-2 sm:space-y-0">
                            <p className="text-base sm:text-lg font-bold text-primary-600">
                              ₺{item.price.toFixed(2)}
                            </p>
                            {item.campaign && (
                              <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full inline-block w-fit mx-auto sm:mx-0 shadow-md">
                                🎉 {item.campaign.name}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Controls Section */}
                        <div className="flex items-center justify-between sm:justify-end space-x-4">
                          {/* Quantity Controls */}
                          <div className="flex items-center space-x-2 sm:space-x-3">
                            <button
                              onClick={() => handleQuantityChange(item.cartKey, item.quantity - 1)}
                              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                            >
                              <Minus className="w-4 h-4 text-gray-600" />
                            </button>
                            <span className="text-base sm:text-lg font-semibold w-8 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(item.cartKey, item.quantity + 1)}
                            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                          >
                            <Plus className="w-4 h-4 text-gray-600" />
                          </button>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => removeItem(item.cartKey)}
                          className="text-red-500 hover:text-red-700 p-2 transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Sipariş Özeti</h2>

              {/* Price Breakdown */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Ara Toplam:</span>
                  <span>₺{(items.reduce((sum, item) => sum + (item.price * item.quantity), 0)).toFixed(2)}</span>
                </div>
                {getCampaignDiscount() > 0 && (
                  <div className="flex justify-between text-green-600 font-medium">
                    <span>🎉 Kampanya İndirimi:</span>
                    <span>-₺{getCampaignDiscount().toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Kargo:</span>
                  <span className="text-green-600 font-medium">Ücretsiz</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>KDV:</span>
                  <span>₺{(getTotalPrice() * 0.18).toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-xl font-bold text-gray-900">
                    <span>Toplam:</span>
                    <span>₺{(getTotalPrice() * 1.18).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <Link
                to="/checkout"
                className="w-full btn-primary flex items-center justify-center space-x-2 text-lg py-4 mb-6"
              >
                <CreditCard className="w-5 h-5" />
                <span>Güvenli Ödeme</span>
              </Link>

              {/* Security Features */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <Shield className="w-5 h-5 text-green-600" />
                  <span>256-bit SSL ile güvenli ödeme</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <Truck className="w-5 h-5 text-blue-600" />
                  <span>Ücretsiz kargo (150₺ üzeri)</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>30 gün iade garantisi</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartPage
