import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, CheckCircle, Truck, CreditCard, Banknote, Building2 } from 'lucide-react'
import useCartStore from '../../store/cartStore'
import api from '../../utils/api'

const CheckoutPage = () => {
  const { items, getTotalItems, getTotalPrice, getCampaignDiscount, clearCart } = useCartStore()
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    address: '',
    detailedAddress: '', // Yeni: Detaylı adres
    city: '',
    district: '',
    orderNote: '',
    billingAddressDifferent: false
  })
  
  const [paymentMethod, setPaymentMethod] = useState('')
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showSuccessToast, setShowSuccessToast] = useState(false)
  const [orderNumber, setOrderNumber] = useState('')
  
  // Kargo firması sabit: Sürat Kargo
  const shippingMethod = 'Sürat Kargo'

  const cities = [
    'Adana', 'Adıyaman', 'Afyonkarahisar', 'Ağrı', 'Amasya', 'Ankara', 'Antalya', 'Artvin',
    'Aydın', 'Balıkesir', 'Bilecik', 'Bingöl', 'Bitlis', 'Bolu', 'Burdur', 'Bursa',
    'Çanakkale', 'Çankırı', 'Çorum', 'Denizli', 'Diyarbakır', 'Edirne', 'Elazığ', 'Erzincan',
    'Erzurum', 'Eskişehir', 'Gaziantep', 'Giresun', 'Gümüşhane', 'Hakkari', 'Hatay', 'Isparta',
    'Mersin', 'İstanbul', 'İzmir', 'Kars', 'Kastamonu', 'Kayseri', 'Kırklareli', 'Kırşehir',
    'Kocaeli', 'Konya', 'Kütahya', 'Malatya', 'Manisa', 'Kahramanmaraş', 'Mardin', 'Muğla',
    'Muş', 'Nevşehir', 'Niğde', 'Ordu', 'Rize', 'Sakarya', 'Samsun', 'Siirt',
    'Sinop', 'Sivas', 'Tekirdağ', 'Tokat', 'Trabzon', 'Tunceli', 'Şanlıurfa', 'Uşak',
    'Van', 'Yozgat', 'Zonguldak', 'Aksaray', 'Bayburt', 'Karaman', 'Kırıkkale', 'Batman',
    'Şırnak', 'Bartın', 'Ardahan', 'Iğdır', 'Yalova', 'Karabük', 'Kilis', 'Osmaniye', 'Düzce'
  ]

  const [showIbanModal, setShowIbanModal] = useState(false)

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsProcessing(true)
    
    try {
      // Sipariş verilerini hazırla
      const orderData = {
        ...formData,
        items: items,
        totalAmount: parseFloat(finalTotal),
        campaignDiscount: getCampaignDiscount(),
        shippingCost: shippingCost,
        paymentMethod: paymentMethod,
        shippingMethod: shippingMethod
      }

      // API'ye sipariş gönder
      const response = await api.post('/orders', orderData)
      
      if (response.data?.success) {
        setOrderNumber(response.data.order.orderNumber)
        setShowSuccessToast(true)
        clearCart()
        
        // 3 saniye sonra ana sayfaya yönlendir
        setTimeout(() => {
          window.location.href = '/'
        }, 3000)
      } else {
        throw new Error('Sipariş oluşturulurken hata oluştu')
      }
    } catch (error) {
      console.error('Sipariş hatası:', error)
      alert('Sipariş oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.')
    } finally {
      setIsProcessing(false)
    }
  }

  // KDV kaldırıldı, toplam = indirimli ara toplam + kargo
  const shippingCost = 100
  const discountedSubtotal = getTotalPrice() // kampanya indirimi uygulanmış ara toplam
  const finalTotal = (discountedSubtotal + shippingCost).toFixed(2)

  return (
    <div className="min-h-screen bg-neutral-50 py-8">
      {/* Success Toast Notification */}
      {showSuccessToast && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-slide-down">
          <div className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3 max-w-md">
            <div className="flex-shrink-0">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg">Siparişiniz Başarıyla Oluşturuldu! 🎉</h3>
              <p className="text-sm opacity-90">Sipariş No: {orderNumber}</p>
              <p className="text-xs opacity-75 mt-1">Ana sayfaya yönlendiriliyorsunuz...</p>
            </div>
          </div>
        </div>
      )}
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/cart"
            className="inline-flex items-center space-x-2 text-neutral-600 hover:text-neutral-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm uppercase tracking-wider">Geri Dön</span>
          </Link>
          
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-light tracking-tight text-neutral-900 mb-2">
              Sepetim ({getTotalItems()} Ürün ₺{finalTotal})
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sol Kolon - Teslimat Bilgileri */}
          <div className="lg:col-span-2 space-y-8">
            {/* Üyelik Banner */}
            <div className="bg-accent-50 border border-accent-200 rounded-lg p-4">
              <p className="text-accent-700 text-sm font-medium text-center">
                Üyelik bilgileriniz ile giriş yapmak için tıklayın.
              </p>
            </div>

            {/* Teslimat Bilgileri Formu */}
            <div className="bg-white rounded-lg border border-neutral-200 p-8">
              <h2 className="text-2xl font-medium text-neutral-900 mb-6">Teslimat Bilgileriniz</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Kişisel Bilgiler */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Adınız *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                      placeholder="Adınız"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Soyadınız *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                      placeholder="Soyadınız"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Cep Telefonunuz *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                      placeholder="(XXX) XXX-XXXX"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Email Adresiniz *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                      placeholder="email@adresiniz.com"
                    />
                  </div>
                </div>

                {/* Şehir ve İlçe */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Şehir *
                    </label>
                    <select
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                    >
                      <option value="">Şehir Seçin</option>
                      {cities.map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      İlçe *
                    </label>
                    <input
                      type="text"
                      name="district"
                      value={formData.district}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                      placeholder="İlçe adınızı yazın"
                    />
                  </div>
                </div>

                {/* Adres Bilgileri */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Mahalle/Sokak *
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    rows="2"
                    className="input-field resize-none"
                    placeholder="Mahalle, cadde, sokak bilgilerinizi yazın"
                  />
                </div>

                {/* Detaylı Adres */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Detaylı Adres (Bina No, Daire No, vb.) *
                  </label>
                  <textarea
                    name="detailedAddress"
                    value={formData.detailedAddress}
                    onChange={handleInputChange}
                    required
                    rows="2"
                    className="input-field resize-none"
                    placeholder="Bina no, kat, daire no, diğer detaylar..."
                  />
                </div>

                {/* Bilgilendirme */}
                <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-5 h-5 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold">!</span>
                    </div>
                    <p className="text-sm text-primary-700">
                      <strong>Önemli:</strong> Adres bilgilerinizi eksiksiz doldurunuz. Eksik adres bilgileri teslimatı geciktirebilir veya iptal edilebilir.
                    </p>
                  </div>
                </div>

                {/* Fatura Adresi */}
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="billingAddressDifferent"
                    checked={formData.billingAddressDifferent}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-neutral-900 border-neutral-300 rounded focus:ring-neutral-900"
                  />
                  <label className="text-sm font-medium text-neutral-700">
                    Fatura Adresim Farklı
                  </label>
                </div>

                {/* Sipariş Notu */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Sipariş Notu
                  </label>
                  <textarea
                    name="orderNote"
                    value={formData.orderNote}
                    onChange={handleInputChange}
                    rows="3"
                    className="input-field resize-none"
                    placeholder="Sipariş Notu"
                  />
                </div>
              </form>
            </div>
          </div>

          {/* Sağ Kolon - Ödeme ve Sipariş Özeti */}
          <div className="lg:col-span-1 space-y-6">
            {/* Promosyon Kodu */}
            <div className="bg-white rounded-lg border border-neutral-200 p-6">
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Promosyon Kodu"
                  className="flex-1 input-field"
                />
                <button className="btn-primary whitespace-nowrap">
                  Kupon Kullan
                </button>
              </div>
            </div>

            {/* Sipariş Özeti */}
            <div className="bg-white rounded-lg border border-neutral-200 p-6">
              <h3 className="text-lg font-medium text-neutral-900 mb-4">Sipariş Özeti</h3>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">Ara Toplam</span>
                  <span>₺{getTotalPrice().toFixed(2)}</span>
                </div>
                {getCampaignDiscount() > 0 && (
                  <div className="flex justify-between text-sm text-accent-600">
                    <span>Kampanya İndirimi</span>
                    <span>-₺{getCampaignDiscount().toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">Kargo</span>
                  <span>₺{shippingCost}</span>
                </div>
                <div className="border-t border-neutral-200 pt-3">
                  <div className="flex justify-between">
                    <span className="font-medium text-neutral-900">Toplam</span>
                    <span className="font-medium text-neutral-900">₺{finalTotal}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Ödeme Yöntemleri */}
            <div className="bg-white rounded-lg border border-neutral-200 p-6">
              <h3 className="text-lg font-medium text-neutral-900 mb-4">Ödeme Şekliniz</h3>
              
              <div className="space-y-3">
                <label className="flex items-center space-x-3 p-3 border border-neutral-200 rounded-lg cursor-pointer hover:bg-neutral-50">
                  <input
                    type="radio"
                    name="payment"
                    value="bank_transfer"
                    checked={paymentMethod === 'bank_transfer'}
                    onChange={(e) => {
                      setPaymentMethod(e.target.value)
                      setShowIbanModal(true)
                    }}
                    className="w-4 h-4 text-neutral-900"
                  />
                  <Building2 className="w-5 h-5 text-neutral-600" />
                  <span className="flex-1 text-sm font-medium">HAVALE/EFT İLE ÖDEME</span>
                  <span className="bg-accent-500 text-white text-xs px-2 py-1 rounded">+%5</span>
                </label>

                <label className="flex items-center space-x-3 p-3 border border-neutral-200 rounded-lg cursor-pointer hover:bg-neutral-50">
                  <input
                    type="radio"
                    name="payment"
                    value="cash_on_delivery"
                    checked={paymentMethod === 'cash_on_delivery'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 text-neutral-900"
                  />
                  <Banknote className="w-5 h-5 text-neutral-600" />
                  <span className="flex-1 text-sm font-medium">KAPIDA NAKİT ÖDEME</span>
                </label>

                <label className="flex items-center space-x-3 p-3 border border-neutral-200 rounded-lg cursor-pointer hover:bg-neutral-50">
                  <input
                    type="radio"
                    name="payment"
                    value="card_on_delivery"
                    checked={paymentMethod === 'card_on_delivery'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 text-neutral-900"
                  />
                  <CreditCard className="w-5 h-5 text-neutral-600" />
                  <span className="flex-1 text-sm font-medium">KAPIDA KREDİ KARTI İLE ÖDEME</span>
                </label>
              </div>
            </div>

            {/* Kargo Seçimi */}
            <div className="bg-white rounded-lg border border-neutral-200 p-6">
              <h3 className="text-lg font-medium text-neutral-900 mb-4">Kargo Firması</h3>
              
              <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Truck className="w-6 h-6 text-primary-600" />
                    <div>
                      <p className="font-medium text-neutral-900">Sürat Kargo</p>
                      <p className="text-sm text-neutral-600">2-3 iş günü içinde teslimat</p>
                    </div>
                  </div>
                  <div className="bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Seçili
                  </div>
                </div>
              </div>
            </div>

            {/* Sipariş Onayı */}
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="w-4 h-4 text-neutral-900 border-neutral-300 rounded focus:ring-neutral-900 mt-1"
                />
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Ön satış bilgilendirme, satın alma kurallarını ve kişisel verilerin koruma korunması 
                  kurallarını okudum ve onaylıyorum.
                </p>
              </div>

              <button
                type="submit"
                disabled={
                  !paymentMethod || 
                  !termsAccepted || 
                  !formData.detailedAddress || 
                  !formData.district || 
                  isProcessing
                }
                onClick={handleSubmit}
                className="w-full btn-primary text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'İşleniyor...' : 'SİPARİŞİ ONAYLA'}
              </button>
            </div>
          </div>
        </div>

        {/* Alt Bilgi */}
        <div className="mt-12 text-center">
          <div className="flex items-center justify-center space-x-2 text-sm text-neutral-500">
            <span>Güvenli Ödeme</span>
            <span>•</span>
            <span>SSL Sertifikası</span>
            <span>•</span>
            <span>7/24 Destek</span>
          </div>
        </div>
      </div>

      {/* IBAN Modal */}
      {showIbanModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-neutral-900">Havale/EFT Bilgileri</h3>
              <button
                onClick={() => setShowIbanModal(false)}
                className="text-neutral-500 hover:text-neutral-700"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                <h4 className="font-medium text-primary-900 mb-2">Banka Bilgileri</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Hesap Sahibi:</span> ABDURRAHMAN ELİSMAİL
                  </div>
                  <div>
                    <span className="font-medium">IBAN:</span> TR90 0021 0000 0013 5602 2000 01
                  </div>
                  <div>
                    <span className="font-medium">Banka:</span> Vakıf Katılım
                  </div>
                </div>
              </div>
              
              <div className="bg-accent-50 border border-accent-200 rounded-lg p-4">
                <h4 className="font-medium text-accent-900 mb-2">Önemli Notlar</h4>
                <ul className="text-sm text-accent-700 space-y-1">
                  <li>• Havale/EFT işlemi için +%5 ek ücret alınmaktadır</li>
                  <li>• Ödemenizi yaptıktan sonra dekontunuzu WhatsApp hattımıza gönderin</li>
                  <li>• Sipariş numaranızı açıklama kısmına yazmayı unutmayın</li>
                  <li>• Ödeme onaylandıktan sonra siparişiniz hazırlanmaya başlayacaktır</li>
                </ul>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowIbanModal(false)}
                  className="flex-1 btn-secondary"
                >
                  Anladım
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText('TR90 0021 0000 0013 5602 2000 01')
                    alert('IBAN kopyalandı!')
                  }}
                  className="flex-1 btn-primary"
                >
                  IBAN'ı Kopyala
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CheckoutPage
