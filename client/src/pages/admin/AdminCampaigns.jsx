import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2 } from 'lucide-react'
import axios from 'axios'
import AdminAuth from '../../components/admin/AdminAuth'

const AdminCampaigns = () => {
  const [campaigns, setCampaigns] = useState([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingCampaign, setEditingCampaign] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'normal',
    isActive: true
  })

  useEffect(() => {
    fetchCampaigns()
  }, [])

  const fetchCampaigns = async () => {
    try {
      const response = await axios.get('/api/campaigns')
      setCampaigns(Array.isArray(response.data) ? response.data : [])
    } catch (error) {
      console.error('Kampanyalar yüklenirken hata:', error)
      setCampaigns([])
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingCampaign) {
        await axios.put(`/api/campaigns/${editingCampaign.id}`, formData)
      } else {
        await axios.post('/api/campaigns', formData)
      }
      fetchCampaigns()
      handleCloseForm()
    } catch (error) {
      console.error('Kampanya kaydedilirken hata:', error)
      alert('Bir hata oluştu. Lütfen tekrar deneyin.')
    }
  }

  const handleEdit = (campaign) => {
    setEditingCampaign(campaign)
    setFormData({
      name: campaign.name,
      description: campaign.description || '',
      type: campaign.type,
      isActive: campaign.isActive
    })
    setIsFormOpen(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Bu kampanyayı silmek istediğinize emin misiniz?')) {
      try {
        await axios.delete(`/api/campaigns/${id}`)
        fetchCampaigns()
      } catch (error) {
        console.error('Kampanya silinirken hata:', error)
        alert('Kampanya silinirken bir hata oluştu.')
      }
    }
  }

  const handleCloseForm = () => {
    setIsFormOpen(false)
    setEditingCampaign(null)
    setFormData({ name: '', description: '', type: 'normal', isActive: true })
  }

  return (
    <AdminAuth>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Kampanya Yönetimi</h1>
          <p className="text-gray-600 mt-2">Toplam {campaigns.length} kampanya</p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Yeni Kampanya Ekle</span>
        </button>
      </div>

      {/* Campaigns List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns.map(campaign => (
          <div key={campaign.id} className="card">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="font-bold text-lg text-gray-900">{campaign.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{campaign.description}</p>
              </div>
              <span className={`px-2 py-1 text-xs font-bold rounded ${
                campaign.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
              }`}>
                {campaign.isActive ? 'Aktif' : 'Pasif'}
              </span>
            </div>

            <div className="mb-4">
              <span className="inline-block bg-primary-100 text-primary-700 text-sm font-medium px-3 py-1 rounded-full">
                {campaign.type === 'second_pair_699' ? '2. Çift 699 TL' : 'Normal'}
              </span>
            </div>

            <div className="text-sm text-gray-600 mb-4">
              <p>{campaign.products?.length || 0} ürün</p>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => handleEdit(campaign)}
                className="flex-1 flex items-center justify-center space-x-2 bg-blue-50 hover:bg-blue-100 text-blue-600 font-medium px-4 py-2 rounded-lg transition-colors"
              >
                <Edit className="w-4 h-4" />
                <span>Düzenle</span>
              </button>
              <button
                onClick={() => handleDelete(campaign.id)}
                className="flex-1 flex items-center justify-center space-x-2 bg-red-50 hover:bg-red-100 text-red-600 font-medium px-4 py-2 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Sil</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Campaign Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="border-b border-gray-200 px-6 py-4">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingCampaign ? 'Kampanya Düzenle' : 'Yeni Kampanya Ekle'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kampanya Adı *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="input-field"
                  placeholder="Örn: 2. Çift 699 TL"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Açıklama
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="3"
                  className="input-field resize-none"
                  placeholder="Kampanya açıklaması..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kampanya Tipi *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="input-field"
                  required
                >
                  <option value="normal">Normal Ürün</option>
                  <option value="second_pair_699">2. Çift 699 TL</option>
                </select>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <label htmlFor="isActive" className="ml-2 text-sm font-medium text-gray-700">
                  Kampanya Aktif
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button type="button" onClick={handleCloseForm} className="btn-secondary">
                  İptal
                </button>
                <button type="submit" className="btn-primary">
                  {editingCampaign ? 'Güncelle' : 'Ekle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
    </AdminAuth>
  )
}

export default AdminCampaigns

