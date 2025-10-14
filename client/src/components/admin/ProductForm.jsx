import { useState, useEffect } from 'react'
import { X, Upload, ImagePlus, Trash2, Plus } from 'lucide-react'
import { buildAssetUrl } from '../../utils/api'

const ProductForm = ({ product, campaigns, onSubmit, onCancel }) => {
  const SHOE_SIZES = ['36', '37', '38', '39', '40', '41', '42', '43', '44']
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    campaignId: '',
    images: [],
    colorOptions: [], // [{ name: "Siyah", images: [] }]
    sizeStock: {} // { "36": 10, "37": 15, ... }
  })
  const [imagePreviews, setImagePreviews] = useState([])
  const [colorPreviews, setColorPreviews] = useState([]) // Renk resim preview'ları

  useEffect(() => {
    if (product) {
      const existingColorOptions = product.colorOptions 
        ? (typeof product.colorOptions === 'string' 
            ? JSON.parse(product.colorOptions) 
            : product.colorOptions)
        : []
      
      const existingSizeStock = product.sizeStock
        ? (typeof product.sizeStock === 'string'
            ? JSON.parse(product.sizeStock)
            : product.sizeStock)
        : {}
      
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        stock: product.stock || '',
        campaignId: product.campaignId || '',
        images: [],
        colorOptions: existingColorOptions,
        sizeStock: existingSizeStock
      })
      
      // Mevcut resimleri preview'a ekle
      const existingImages = []
      if (product.images && product.images.length > 0) {
        product.images.forEach(img => {
          existingImages.push(buildAssetUrl(img))
        })
      } else if (product.image) {
        existingImages.push(buildAssetUrl(product.image))
      }
      setImagePreviews(existingImages)
      
      // Renk preview'larını hazırla
      const colorPreviewsData = existingColorOptions.map(color => ({
        name: color.name,
        previews: color.images?.map(img => buildAssetUrl(img)) || []
      }))
      setColorPreviews(colorPreviewsData)
    }
  }, [product])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    if (files.length > 0) {
      setFormData(prev => ({ ...prev, images: [...prev.images, ...files] }))
      
      // Preview'ları ekle
      files.forEach(file => {
        const reader = new FileReader()
        reader.onloadend = () => {
          setImagePreviews(prev => [...prev, reader.result])
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
    setImagePreviews(prev => prev.filter((_, i) => i !== index))
  }

  // Renk Seçeneği Ekleme
  const addColorOption = () => {
    setFormData(prev => ({
      ...prev,
      colorOptions: [...prev.colorOptions, { name: '', images: [] }]
    }))
    setColorPreviews(prev => [...prev, { name: '', previews: [] }])
  }

  // Renk Seçeneği Silme
  const removeColorOption = (colorIndex) => {
    setFormData(prev => ({
      ...prev,
      colorOptions: prev.colorOptions.filter((_, i) => i !== colorIndex)
    }))
    setColorPreviews(prev => prev.filter((_, i) => i !== colorIndex))
  }

  // Renk Adı Değiştirme
  const handleColorNameChange = (colorIndex, newName) => {
    setFormData(prev => {
      const newColorOptions = [...prev.colorOptions]
      newColorOptions[colorIndex] = { ...newColorOptions[colorIndex], name: newName }
      return { ...prev, colorOptions: newColorOptions }
    })
    setColorPreviews(prev => {
      const newPreviews = [...prev]
      newPreviews[colorIndex] = { ...newPreviews[colorIndex], name: newName }
      return newPreviews
    })
  }

  // Renk Resmi Ekleme
  const handleColorImageChange = (colorIndex, e) => {
    const files = Array.from(e.target.files)
    if (files.length > 0) {
      setFormData(prev => {
        const newColorOptions = [...prev.colorOptions]
        newColorOptions[colorIndex] = {
          ...newColorOptions[colorIndex],
          images: [...(newColorOptions[colorIndex].images || []), ...files]
        }
        return { ...prev, colorOptions: newColorOptions }
      })

      // Preview'ları ekle
      files.forEach(file => {
        const reader = new FileReader()
        reader.onloadend = () => {
          setColorPreviews(prev => {
            const newPreviews = [...prev]
            newPreviews[colorIndex] = {
              ...newPreviews[colorIndex],
              previews: [...(newPreviews[colorIndex].previews || []), reader.result]
            }
            return newPreviews
          })
        }
        reader.readAsDataURL(file)
      })
    }
  }

  // Renk Resmini Silme
  const removeColorImage = (colorIndex, imageIndex) => {
    setFormData(prev => {
      const newColorOptions = [...prev.colorOptions]
      newColorOptions[colorIndex] = {
        ...newColorOptions[colorIndex],
        images: newColorOptions[colorIndex].images.filter((_, i) => i !== imageIndex)
      }
      return { ...prev, colorOptions: newColorOptions }
    })
    setColorPreviews(prev => {
      const newPreviews = [...prev]
      newPreviews[colorIndex] = {
        ...newPreviews[colorIndex],
        previews: newPreviews[colorIndex].previews.filter((_, i) => i !== imageIndex)
      }
      return newPreviews
    })
  }

  // Numara stoğu değişimi
  const handleSizeStockChange = (size, value) => {
    setFormData(prev => ({
      ...prev,
      sizeStock: {
        ...prev.sizeStock,
        [size]: parseInt(value) || 0
      }
    }))
  }
  
  const handleSubmit = (e) => {
    e.preventDefault()
    
    // sizeStock kontrolü - en az bir numara 0'dan büyükse gönder
    const hasSizeStock = Object.values(formData.sizeStock).some(stock => stock > 0)
    
    const submitData = {
      ...formData,
      sizeStock: hasSizeStock ? JSON.stringify(formData.sizeStock) : null
    }
    onSubmit(submitData)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">
            {product ? 'Ürün Düzenle' : 'Yeni Ürün Ekle'}
          </h2>
          <button 
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Ürün Adı */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ürün Adı *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="input-field"
              placeholder="Örn: Nike Air Max"
            />
          </div>

          {/* Açıklama */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Açıklama
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="input-field resize-none"
              placeholder="Ürün açıklaması..."
            />
          </div>

          {/* Fiyat ve Stok */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fiyat (₺) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="input-field"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Toplam Stok *
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                required
                min="0"
                className="input-field"
                placeholder="0"
              />
            </div>
          </div>

          {/* Numara Stok Girişi */}
          <div className="border-t border-gray-200 pt-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Numara Bazlı Stok Girişi
            </label>
            <div className="grid grid-cols-3 gap-3">
              {SHOE_SIZES.map(size => (
                <div key={size} className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-gray-600 w-10">
                    {size}
                  </label>
                  <input
                    type="number"
                    value={formData.sizeStock[size] || 0}
                    onChange={(e) => handleSizeStockChange(size, e.target.value)}
                    min="0"
                    className="flex-1 input-field py-1.5 text-center"
                    placeholder="0"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Kampanya Seçimi */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kampanya
            </label>
            <select
              name="campaignId"
              value={formData.campaignId}
              onChange={handleChange}
              className="input-field"
            >
              <option value="">Kampanyasız (Normal Ürün)</option>
              {campaigns.map(campaign => (
                <option key={campaign.id} value={campaign.id}>
                  {campaign.name}
                </option>
              ))}
            </select>
          </div>

          {/* Renk Seçenekleri */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex justify-between items-center mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Renk Seçenekleri
              </label>
              <button
                type="button"
                onClick={addColorOption}
                className="flex items-center space-x-2 text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                <Plus className="w-4 h-4" />
                <span>Renk Ekle</span>
              </button>
            </div>
            
            {formData.colorOptions.length > 0 ? (
              <div className="space-y-4">
                {formData.colorOptions.map((color, colorIndex) => (
                  <div key={colorIndex} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-between items-start mb-3">
                      <input
                        type="text"
                        value={color.name}
                        onChange={(e) => handleColorNameChange(colorIndex, e.target.value)}
                        placeholder="Renk adı (örn: Siyah, Beyaz)"
                        className="flex-1 input-field text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => removeColorOption(colorIndex)}
                        className="ml-2 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Renk için Resimler */}
                    {colorPreviews[colorIndex]?.previews?.length > 0 && (
                      <div className="grid grid-cols-4 gap-2 mb-3">
                        {colorPreviews[colorIndex].previews.map((preview, imgIndex) => (
                          <div key={imgIndex} className="relative group">
                            <img
                              src={preview}
                              alt={`${color.name} ${imgIndex + 1}`}
                              className="w-full h-20 object-cover rounded border border-gray-200"
                            />
                            <button
                              type="button"
                              onClick={() => removeColorImage(colorIndex, imgIndex)}
                              className="absolute -top-1 -right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Renk Resmi Ekleme */}
                    <label className="flex items-center justify-center w-full h-20 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-white hover:bg-gray-50 transition-colors">
                      <div className="flex items-center space-x-2">
                        <ImagePlus className="w-5 h-5 text-gray-400" />
                        <span className="text-sm text-gray-500">Resim Ekle</span>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        multiple
                        onChange={(e) => handleColorImageChange(colorIndex, e)}
                      />
                    </label>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-4 bg-gray-50 rounded-lg">
                Renk seçeneği eklemek için yukarıdaki butona tıklayın
              </p>
            )}
          </div>

          {/* Çoklu Resim Yükleme */}
          <div className="border-t border-gray-200 pt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ürün Resimleri (Ana Resimler)
            </label>
            <div className="mt-2">
              {/* Mevcut Resimler */}
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Resim Ekleme Alanı */}
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex flex-col items-center justify-center pt-3 pb-3">
                  <ImagePlus className="w-8 h-8 text-gray-400 mb-2" />
                  <p className="mb-1 text-sm text-gray-500">
                    <span className="font-semibold">Resim ekleyin</span>
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG, WEBP (MAX. 5MB)</p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                />
              </label>
              
              {imagePreviews.length > 0 && (
                <p className="text-xs text-gray-500 mt-2">
                  {imagePreviews.length} resim seçildi. Daha fazla resim eklemek için yukarıdaki alana tıklayın.
                </p>
              )}
            </div>
          </div>

          {/* Form Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="btn-secondary"
            >
              İptal
            </button>
            <button
              type="submit"
              className="btn-primary"
            >
              {product ? 'Güncelle' : 'Ekle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProductForm

