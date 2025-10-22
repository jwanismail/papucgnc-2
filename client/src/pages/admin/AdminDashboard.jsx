import { Link } from 'react-router-dom'
import { Package, Tag, BarChart3, ShoppingCart } from 'lucide-react'
import { useState, useEffect } from 'react'
import api from '../../utils/api'
import AdminAuth from '../../components/admin/AdminAuth'

const AdminDashboard = () => {
  const [quickStats, setQuickStats] = useState({
    totalProducts: 0,
    activeCampaigns: 0,
    totalSales: 0
  })

  useEffect(() => {
    fetchQuickStats()
  }, [])

  const fetchQuickStats = async () => {
    try {
      const [productsRes, campaignsRes, ordersRes] = await Promise.all([
        api.get('/products'),
        api.get('/campaigns'),
        api.get('/orders')
      ])

      const products = productsRes.data || []
      const campaigns = campaignsRes.data || []
      const orders = ordersRes.data || []

      const totalSales = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0)
      const activeCampaigns = campaigns.filter(campaign => campaign.isActive).length

      setQuickStats({
        totalProducts: products.length,
        activeCampaigns,
        totalSales
      })
    } catch (error) {
      console.error('Hızlı istatistikler yüklenirken hata:', error)
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount)
  }

  const menuItems = [
    {
      title: 'Ürün Yönetimi',
      description: 'Ürün ekle, düzenle ve sil',
      icon: Package,
      link: '/jwanadmin/products',
      color: 'bg-blue-500'
    },
    {
      title: 'Sipariş Yönetimi',
      description: 'Gelen siparişleri görüntüle ve yönet',
      icon: ShoppingCart,
      link: '/jwanadmin/orders',
      color: 'bg-orange-500'
    },
    {
      title: 'Kampanya Yönetimi',
      description: 'Kampanyaları yönet',
      icon: Tag,
      link: '/jwanadmin/campaigns',
      color: 'bg-purple-500'
    },
    {
      title: 'İstatistikler',
      description: 'Satış ve ürün istatistikleri',
      icon: BarChart3,
      link: '/jwanadmin/stats',
      color: 'bg-green-500'
    }
  ]

  return (
    <AdminAuth>
      <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Paneli</h1>
          <p className="text-gray-600">Papucgnc yönetim panelinize hoş geldiniz</p>
        </div>

        {/* Menu Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.link}
              className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200"
            >
              <div className="p-8">
                <div className={`${item.color} w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <item.icon className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                  {item.title}
                </h2>
                <p className="text-gray-600">
                  {item.description}
                </p>
              </div>
              <div className="bg-gray-50 px-8 py-4 group-hover:bg-primary-50 transition-colors">
                <span className="text-sm font-medium text-gray-700 group-hover:text-primary-600">
                  Yönetim Sayfasına Git →
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
            <p className="text-blue-100 text-sm font-medium mb-1">Toplam Ürün</p>
            <p className="text-4xl font-bold">{quickStats.totalProducts}</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
            <p className="text-purple-100 text-sm font-medium mb-1">Aktif Kampanya</p>
            <p className="text-4xl font-bold">{quickStats.activeCampaigns}</p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white">
            <p className="text-green-100 text-sm font-medium mb-1">Toplam Satış</p>
            <p className="text-4xl font-bold">{formatCurrency(quickStats.totalSales)}</p>
          </div>
        </div>
      </div>
      </div>
    </AdminAuth>
  )
}

export default AdminDashboard

