import { useState, useEffect } from 'react'
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Package, 
  ShoppingCart, 
  DollarSign,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw
} from 'lucide-react'
import api from '../../utils/api'
import AdminAuth from '../../components/admin/AdminAuth'

const AdminStats = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    activeCampaigns: 0,
    pendingOrders: 0,
    completedOrders: 0,
    monthlyRevenue: 0,
    weeklyOrders: 0
  })
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState(new Date())

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setLoading(true)
      const [productsRes, ordersRes, campaignsRes] = await Promise.all([
        api.get('/products'),
        api.get('/orders'),
        api.get('/campaigns')
      ])

      const products = productsRes.data || []
      const orders = ordersRes.data || []
      const campaigns = campaignsRes.data || []

      // İstatistikleri hesapla
      const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0)
      const pendingOrders = orders.filter(order => order.status === 'pending').length
      const completedOrders = orders.filter(order => order.status === 'delivered').length
      const activeCampaigns = campaigns.filter(campaign => campaign.isActive).length

      // Son 30 günlük gelir
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      const monthlyRevenue = orders
        .filter(order => new Date(order.createdAt) >= thirtyDaysAgo)
        .reduce((sum, order) => sum + (order.totalAmount || 0), 0)

      // Son 7 günlük sipariş
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
      const weeklyOrders = orders.filter(order => new Date(order.createdAt) >= sevenDaysAgo).length

      setStats({
        totalProducts: products.length,
        totalOrders: orders.length,
        totalRevenue,
        activeCampaigns,
        pendingOrders,
        completedOrders,
        monthlyRevenue,
        weeklyOrders
      })
      
      setLastUpdated(new Date())
    } catch (error) {
      console.error('İstatistikler yüklenirken hata:', error)
    } finally {
      setLoading(false)
    }
  }

  const StatCard = ({ title, value, icon: Icon, color, trend, trendValue }) => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`${color} w-12 h-12 rounded-xl flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {trend && (
          <div className={`flex items-center space-x-1 ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
            <span className="text-sm font-medium">{trendValue}%</span>
          </div>
        )}
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
      <p className="text-gray-600 text-sm">{title}</p>
    </div>
  )

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount)
  }

  if (loading) {
    return (
      <AdminAuth>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin text-primary-600 mx-auto mb-4" />
            <p className="text-gray-600">İstatistikler yükleniyor...</p>
          </div>
        </div>
      </AdminAuth>
    )
  }

  return (
    <AdminAuth>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">İstatistikler</h1>
              <p className="text-gray-600">
                Son güncelleme: {lastUpdated.toLocaleString('tr-TR')}
              </p>
            </div>
            <button
              onClick={fetchStats}
              className="mt-4 lg:mt-0 btn-primary flex items-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Yenile</span>
            </button>
          </div>

          {/* Ana İstatistikler */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Toplam Ürün"
              value={stats.totalProducts}
              icon={Package}
              color="bg-blue-500"
              trend="up"
              trendValue="12"
            />
            <StatCard
              title="Toplam Sipariş"
              value={stats.totalOrders}
              icon={ShoppingCart}
              color="bg-orange-500"
              trend="up"
              trendValue="8"
            />
            <StatCard
              title="Toplam Gelir"
              value={formatCurrency(stats.totalRevenue)}
              icon={DollarSign}
              color="bg-green-500"
              trend="up"
              trendValue="15"
            />
            <StatCard
              title="Aktif Kampanya"
              value={stats.activeCampaigns}
              icon={TrendingUp}
              color="bg-purple-500"
            />
          </div>

          {/* Detaylı İstatistikler */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Sipariş Durumları */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-primary-600" />
                Sipariş Durumları
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="font-medium text-gray-900">Bekleyen Siparişler</span>
                  </div>
                  <span className="text-2xl font-bold text-yellow-600">{stats.pendingOrders}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="font-medium text-gray-900">Tamamlanan Siparişler</span>
                  </div>
                  <span className="text-2xl font-bold text-green-600">{stats.completedOrders}</span>
                </div>
              </div>
            </div>

            {/* Zaman Bazlı İstatistikler */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-primary-600" />
                Zaman Bazlı Analiz
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
                  <div>
                    <p className="font-medium text-gray-900">Son 30 Gün Gelir</p>
                    <p className="text-sm text-gray-600">Aylık performans</p>
                  </div>
                  <span className="text-2xl font-bold text-blue-600">
                    {formatCurrency(stats.monthlyRevenue)}
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl">
                  <div>
                    <p className="font-medium text-gray-900">Son 7 Gün Sipariş</p>
                    <p className="text-sm text-gray-600">Haftalık aktivite</p>
                  </div>
                  <span className="text-2xl font-bold text-purple-600">{stats.weeklyOrders}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Performans Kartları */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <Package className="w-8 h-8" />
                <span className="text-3xl font-bold">{stats.totalProducts}</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Toplam Ürün</h3>
              <p className="text-blue-100 text-sm">Katalogdaki toplam ürün sayısı</p>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <DollarSign className="w-8 h-8" />
                <span className="text-3xl font-bold">{formatCurrency(stats.totalRevenue)}</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Toplam Gelir</h3>
              <p className="text-green-100 text-sm">Tüm zamanların toplam geliri</p>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <TrendingUp className="w-8 h-8" />
                <span className="text-3xl font-bold">{stats.activeCampaigns}</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Aktif Kampanya</h3>
              <p className="text-purple-100 text-sm">Şu anda aktif kampanya sayısı</p>
            </div>
          </div>
        </div>
      </div>
    </AdminAuth>
  )
}

export default AdminStats
