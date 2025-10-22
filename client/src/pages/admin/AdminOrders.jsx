import { useState, useEffect } from 'react'
import { 
  Eye, 
  CheckCircle, 
  Truck, 
  Package, 
  X, 
  Clock,
  DollarSign,
  MapPin,
  Phone,
  Mail,
  CheckSquare,
  Square
} from 'lucide-react'
import api from '../../utils/api'
import AdminAuth from '../../components/admin/AdminAuth'
import { buildAssetUrl } from '../../utils/api'

const AdminOrders = () => {
  const [orders, setOrders] = useState([])
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [pendingCount, setPendingCount] = useState(0)
  
  // Toplu işlem için state'ler
  const [selectedOrders, setSelectedOrders] = useState([])
  const [bulkLoading, setBulkLoading] = useState(false)

  useEffect(() => {
    fetchOrders()
  }, [filter])

  // Filter değiştiğinde seçili siparişleri temizle
  useEffect(() => {
    setSelectedOrders([])
  }, [filter])

  const fetchOrders = async () => {
    try {
      const url = filter === 'all' ? '/orders' : `/orders?status=${filter}`
      const response = await api.get(url)
      const ordersData = Array.isArray(response.data?.orders) ? response.data.orders : []
      setOrders(ordersData)
      
      // Bekleyen sipariş sayısını al
      if (filter === 'all') {
        const pendingResponse = await api.get('/orders?status=pending')
        const pendingData = Array.isArray(pendingResponse.data?.orders) ? pendingResponse.data.orders : []
        setPendingCount(pendingData.length)
      }
    } catch (error) {
      console.error('Siparişler yüklenirken hata:', error)
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId, status) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status })
      fetchOrders()
      setSelectedOrder(null)
      alert('Sipariş durumu güncellendi!')
    } catch (error) {
      console.error('Sipariş güncellenirken hata:', error)
      alert('Sipariş güncellenirken hata oluştu!')
    }
  }

  // Toplu sipariş durumu güncelleme
  const updateBulkOrderStatus = async (status) => {
    if (selectedOrders.length === 0) {
      alert('Lütfen en az bir sipariş seçin!')
      return
    }

    // Limit kaldırıldı - artık sınırsız sipariş seçilebilir

    setBulkLoading(true)
    try {
      const response = await api.put('/orders/bulk/status', {
        orderIds: selectedOrders,
        status: status
      })
      
      alert(response.data.message)
      setSelectedOrders([])
      fetchOrders()
    } catch (error) {
      console.error('Toplu sipariş güncelleme hatası:', error)
      alert('Toplu güncelleme sırasında hata oluştu!')
    } finally {
      setBulkLoading(false)
    }
  }

  // Sipariş seçimi
  const toggleOrderSelection = (orderId) => {
    setSelectedOrders(prev => {
      if (prev.includes(orderId)) {
        return prev.filter(id => id !== orderId)
      } else {
        // Limit kaldırıldı - artık sınırsız sipariş seçilebilir
        return [...prev, orderId]
      }
    })
  }

  // Tümünü seç/seçimi kaldır
  const toggleSelectAll = () => {
    const currentPendingOrders = orders.filter(order => order.status === 'pending')
    const pendingOrdersIds = currentPendingOrders.map(order => order.id)
    
    if (selectedOrders.length === pendingOrdersIds.length && pendingOrdersIds.length > 0) {
      setSelectedOrders([])
    } else {
      setSelectedOrders(pendingOrdersIds)
    }
  }

  // Sadece beklemede olan siparişleri filtrele
  const pendingOrders = orders.filter(order => order.status === 'pending')

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4 text-yellow-500" />
      case 'confirmed': return <CheckCircle className="w-4 h-4 text-blue-500" />
      case 'preparing': return <Package className="w-4 h-4 text-orange-500" />
      case 'shipped': return <Truck className="w-4 h-4 text-purple-500" />
      case 'delivered': return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'cancelled': return <X className="w-4 h-4 text-red-500" />
      default: return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Beklemede'
      case 'confirmed': return 'Onaylandı'
      case 'preparing': return 'Hazırlanıyor'
      case 'shipped': return 'Kargoya Verildi'
      case 'delivered': return 'Teslim Edildi'
      case 'cancelled': return 'İptal Edildi'
      default: return status
    }
  }

  const getPaymentStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Beklemede'
      case 'paid': return 'Ödendi'
      case 'failed': return 'Başarısız'
      case 'refunded': return 'İade Edildi'
      default: return status
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-neutral-600">Siparişler yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <AdminAuth>
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-light tracking-tight text-neutral-900 mb-2">Sipariş Yönetimi</h1>
            <p className="text-neutral-600">Tüm siparişleri görüntüleyin ve yönetin</p>
          </div>
          {pendingCount > 0 && (
            <div className="bg-accent-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <span className="font-medium">{pendingCount} Bekleyen Sipariş</span>
            </div>
          )}
        </div>
      </div>

      {/* Filter */}
      <div className="mb-6">
        <div className="flex space-x-4">
          {[
            { key: 'all', label: 'Tümü' },
            { key: 'pending', label: 'Beklemede' },
            { key: 'confirmed', label: 'Onaylandı' },
            { key: 'preparing', label: 'Hazırlanıyor' },
            { key: 'shipped', label: 'Kargoya Verildi' },
            { key: 'delivered', label: 'Teslim Edildi' },
            { key: 'cancelled', label: 'İptal Edildi' }
          ].map(filterOption => (
            <button
              key={filterOption.key}
              onClick={() => setFilter(filterOption.key)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                filter === filterOption.key
                  ? 'bg-neutral-900 text-white'
                  : 'bg-white text-neutral-700 border border-neutral-300 hover:bg-neutral-50'
              }`}
            >
              {filterOption.label}
            </button>
          ))}
        </div>
      </div>

      {/* Toplu İşlem Section */}
      {pendingOrders.length > 0 && (
        <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={toggleSelectAll}
                  className="flex items-center space-x-2 text-sm font-medium text-yellow-700 hover:text-yellow-800"
                >
                  {selectedOrders.length === pendingOrders.length && pendingOrders.length > 0 ? (
                    <CheckSquare className="w-5 h-5" />
                  ) : (
                    <Square className="w-5 h-5" />
                  )}
                  <span>
                    Tümünü Seç ({selectedOrders.length}/{pendingOrders.length})
                  </span>
                </button>
              </div>
              
              {selectedOrders.length > 0 && (
                <div className="text-sm text-yellow-700 font-medium">
                  {selectedOrders.length} sipariş seçildi
                </div>
              )}
            </div>

            {selectedOrders.length > 0 && (
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                <button
                  onClick={() => updateBulkOrderStatus('confirmed')}
                  disabled={bulkLoading}
                  className="w-full sm:w-auto flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>
                    {bulkLoading ? 'İşleniyor...' : `${selectedOrders.length} Siparişi Onayla`}
                  </span>
                </button>

                <button
                  onClick={() => setSelectedOrders([])}
                  className="w-full sm:w-auto px-3 py-2 text-sm text-neutral-600 hover:text-neutral-800 border border-neutral-300 rounded-lg hover:bg-white transition-colors"
                >
                  Seçimi Temizle
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Orders List */}
      {orders.length === 0 ? (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
          <p className="text-neutral-500 text-lg">Henüz sipariş bulunmuyor.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className={`bg-white rounded-lg border border-neutral-200 p-6 ${selectedOrders.includes(order.id) ? 'ring-2 ring-yellow-400 bg-yellow-50' : ''}`}>
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div className="flex items-start space-x-4 flex-1">
                  {/* Checkbox for bulk selection */}
                  {order.status === 'pending' && (
                    <div className="flex items-center pt-1">
                      <button
                        onClick={() => toggleOrderSelection(order.id)}
                        className="flex items-center justify-center w-5 h-5"
                      >
                        {selectedOrders.includes(order.id) ? (
                          <CheckSquare className="w-5 h-5 text-yellow-600" />
                        ) : (
                          <Square className="w-5 h-5 text-neutral-400 hover:text-yellow-600" />
                        )}
                      </button>
                    </div>
                  )}

                  {/* Order Info */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-3">
                      <h3 className="text-lg font-medium text-neutral-900">
                        {order.orderNumber}
                      </h3>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(order.status)}
                        <span className="text-sm font-medium text-neutral-700">
                          {getStatusText(order.status)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-neutral-600">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-4 h-4" />
                        <span>₺{order.totalAmount.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4" />
                        <span>{order.city}, {order.district}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4" />
                        <span>{order.phone}</span>
                      </div>
                    </div>
                    
                    <div className="mt-2 text-sm text-neutral-500">
                      {new Date(order.createdAt).toLocaleDateString('tr-TR')} - {new Date(order.createdAt).toLocaleTimeString('tr-TR')}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="btn-outline flex items-center space-x-2"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Detay</span>
                  </button>
                  
                  {order.status === 'pending' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'confirmed')}
                      className="btn-primary text-sm"
                    >
                      Onayla
                    </button>
                  )}
                  
                  {order.status === 'confirmed' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'preparing')}
                      className="btn-primary text-sm"
                    >
                      Hazırla
                    </button>
                  )}
                  
                  {order.status === 'preparing' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'shipped')}
                      className="btn-primary text-sm"
                    >
                      Kargoya Ver
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-neutral-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-light tracking-tight text-neutral-900">
                Sipariş Detayı - {selectedOrder.orderNumber}
              </h2>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="text-neutral-500 hover:text-neutral-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Customer Info */}
              <div>
                <h3 className="text-lg font-medium text-neutral-900 mb-4">Müşteri Bilgileri</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700">Ad Soyad</label>
                    <p className="text-neutral-900">{selectedOrder.firstName} {selectedOrder.lastName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700">Telefon</label>
                    <p className="text-neutral-900">{selectedOrder.phone}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700">Email</label>
                    <p className="text-neutral-900">{selectedOrder.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700">Şehir/İlçe</label>
                    <p className="text-neutral-900">{selectedOrder.city}, {selectedOrder.district}</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-neutral-700">Adres</label>
                    <p className="text-neutral-900">{selectedOrder.address}</p>
                  </div>
                  {selectedOrder.detailedAddress && (
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-neutral-700">Detaylı Adres</label>
                      <p className="text-neutral-900 bg-primary-50 p-2 rounded">{selectedOrder.detailedAddress}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="text-lg font-medium text-neutral-900 mb-4">Sipariş Ürünleri</h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, index) => {
                    // Renk bilgisine göre resim seç
                    const displayImage = item.selectedColor?.images?.[0] || item.image;
                    
                    return (
                      <div key={index} className="flex items-center space-x-4 p-3 bg-neutral-50 rounded-lg">
                        <div className="w-16 h-16 bg-neutral-200 rounded-lg overflow-hidden flex-shrink-0">
                          {displayImage ? (
                            <img
                              src={buildAssetUrl(displayImage)}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="w-6 h-6 text-neutral-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-neutral-900">{item.name}</h4>
                          <div className="flex flex-wrap gap-x-3 mt-0.5">
                            {item.selectedColor && (
                              <p className="text-xs text-neutral-600">
                                Renk: <span className="font-medium text-primary-600">{item.selectedColor.name}</span>
                              </p>
                            )}
                            {item.selectedSize && (
                              <p className="text-xs text-neutral-600">
                                Numara: <span className="font-medium text-primary-600">{item.selectedSize}</span>
                              </p>
                            )}
                          </div>
                          <p className="text-sm text-neutral-600 mt-1">Adet: {item.quantity}</p>
                          <p className="text-sm font-medium text-neutral-900">₺{item.price.toFixed(2)}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order Summary */}
              <div>
                <h3 className="text-lg font-medium text-neutral-900 mb-4">Sipariş Özeti</h3>
                <div className="bg-neutral-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Toplam Tutar:</span>
                    <span className="font-medium">₺{selectedOrder.totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ödeme Yöntemi:</span>
                    <span className="font-medium">
                      {selectedOrder.paymentMethod === 'bank_transfer' && 'Havale/EFT'}
                      {selectedOrder.paymentMethod === 'cash_on_delivery' && 'Kapıda Nakit'}
                      {selectedOrder.paymentMethod === 'card_on_delivery' && 'Kapıda Kredi Kartı'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Kargo:</span>
                    <span className="font-medium">
                      {selectedOrder.shippingCost === 0 ? 'Ücretsiz' : `₺${selectedOrder.shippingCost}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ödeme Durumu:</span>
                    <span className="font-medium">{getPaymentStatusText(selectedOrder.paymentStatus)}</span>
                  </div>
                </div>
              </div>

              {/* Order Note */}
              {selectedOrder.orderNote && (
                <div>
                  <h3 className="text-lg font-medium text-neutral-900 mb-4">Sipariş Notu</h3>
                  <p className="text-neutral-700 bg-neutral-50 rounded-lg p-4">{selectedOrder.orderNote}</p>
                </div>
              )}

              {/* Status Actions */}
              <div className="flex space-x-3 pt-4 border-t border-neutral-200">
                {selectedOrder.status === 'pending' && (
                  <button
                    onClick={() => updateOrderStatus(selectedOrder.id, 'confirmed')}
                    className="btn-primary"
                  >
                    Siparişi Onayla
                  </button>
                )}
                
                {selectedOrder.status === 'confirmed' && (
                  <button
                    onClick={() => updateOrderStatus(selectedOrder.id, 'preparing')}
                    className="btn-primary"
                  >
                    Hazırlamaya Başla
                  </button>
                )}
                
                {selectedOrder.status === 'preparing' && (
                  <button
                    onClick={() => updateOrderStatus(selectedOrder.id, 'shipped')}
                    className="btn-primary"
                  >
                    Kargoya Ver
                  </button>
                )}
                
                {selectedOrder.status === 'shipped' && (
                  <button
                    onClick={() => updateOrderStatus(selectedOrder.id, 'delivered')}
                    className="btn-primary"
                  >
                    Teslim Edildi Olarak İşaretle
                  </button>
                )}
                
                {selectedOrder.status !== 'cancelled' && selectedOrder.status !== 'delivered' && (
                  <button
                    onClick={() => updateOrderStatus(selectedOrder.id, 'cancelled')}
                    className="btn-secondary"
                  >
                    İptal Et
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </AdminAuth>
  )
}

export default AdminOrders
