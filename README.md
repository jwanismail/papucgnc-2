# 👟 Papucgnc - E-Ticaret Ayakkabı Satış Sitesi

Modern ve kullanıcı dostu ayakkabı satış platformu. React, Vite, Tailwind CSS, Express ve Prisma ile geliştirilmiştir.

## 🚀 Özellikler

### 🛍️ Müşteri Tarafı
- ✅ Responsive tasarım (Mobil, Tablet, Desktop)
- ✅ Ürün listeleme ve detay sayfaları
- ✅ Sepet sistemi (Zustand ile state management)
- ✅ Kampanya filtreleme
- ✅ SEO uyumlu yapı
- ✅ Modern UI/UX tasarım

### 🔧 Admin Paneli
- ✅ Ürün ekleme/düzenleme/silme
- ✅ Resim yükleme (yerel dosyalardan)
- ✅ Kampanya yönetimi
  - 2. Çift 699 TL kampanyası
  - Normal ürün (kampanyasız)
- ✅ Stok takibi
- ✅ Kullanıcı dostu formlar

### 🛠️ Teknik Özellikler
- React 18 + Vite
- Tailwind CSS
- Express.js
- Prisma ORM (SQLite)
- Zustand (State Management)
- React Router v6
- Axios
- Multer (Dosya yükleme)

## 📁 Proje Yapısı

```
papucgnc/
├── client/                     # Frontend (React + Vite)
│   ├── public/                 # Static dosyalar
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/        # Navbar, Footer
│   │   │   ├── admin/         # Admin componentleri
│   │   │   └── product/       # Ürün kartları
│   │   ├── pages/
│   │   │   ├── admin/         # Admin sayfaları
│   │   │   └── public/        # Public sayfalar
│   │   ├── store/             # Zustand store
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── server/                     # Backend (Express + Prisma)
│   ├── src/
│   │   ├── routes/            # API routes
│   │   ├── controllers/       # Controller fonksiyonları
│   │   └── index.js           # Express server
│   ├── prisma/
│   │   └── schema.prisma      # Database schema
│   ├── uploads/               # Yüklenen resimler
│   ├── package.json
│   └── .env
│
└── README.md
```

## 🔧 Kurulum

### Gereksinimler
- Node.js (v18 veya üzeri)
- npm veya yarn

### 1️⃣ Projeyi Klonlayın
```bash
git clone <repository-url>
cd papucgnc
```

### 2️⃣ Backend Kurulumu

```bash
cd server
npm install
```

Prisma'yı başlatın:
```bash
npx prisma generate
npx prisma migrate dev --name init
```

Uploads klasörünü oluşturun:
```bash
mkdir uploads
```

Backend'i başlatın:
```bash
npm run dev
```

Backend şu adreste çalışacak: `http://localhost:5000`

### 3️⃣ Frontend Kurulumu

Yeni bir terminal açın:

```bash
cd client
npm install
```

Frontend'i başlatın:
```bash
npm run dev
```

Frontend şu adreste çalışacak: `http://localhost:3000`

## 📝 Kullanım

### Admin Panel
1. Tarayıcınızda `http://localhost:3000/admin` adresine gidin
2. **Kampanya Yönetimi**: Yeni kampanyalar oluşturun
3. **Ürün Yönetimi**: Ürün ekleyin, düzenleyin veya silin

### Kampanya Oluşturma
1. Admin paneline girin
2. "Kampanya Yönetimi"ne tıklayın
3. "Yeni Kampanya Ekle" butonuna basın
4. Kampanya bilgilerini doldurun:
   - **2. Çift 699 TL**: İkinci ürün için özel fiyat
   - **Normal**: Kampanyasız ürün

### Ürün Ekleme
1. "Ürün Yönetimi"ne gidin
2. "Yeni Ürün Ekle" butonuna tıklayın
3. Ürün bilgilerini doldurun:
   - Ürün adı (zorunlu)
   - Açıklama
   - Fiyat (zorunlu)
   - Stok adedi (zorunlu)
   - Kampanya seçimi (opsiyonel)
   - Resim yükleme (yerel dosyalardan)
4. "Ekle" butonuna basın

## 🎨 Tasarım Özellikleri

- **Responsive**: Tüm cihazlarda mükemmel görünüm
- **Modern UI**: Temiz ve güncel tasarım
- **Performans**: Hızlı yükleme süreleri
- **SEO**: Arama motoru dostu yapı
- **Accessibility**: Erişilebilir componentler

## 🔌 API Endpoints

### Products
- `GET /api/products` - Tüm ürünleri listele
- `GET /api/products/:id` - Tek ürün detayı
- `POST /api/products` - Yeni ürün ekle
- `PUT /api/products/:id` - Ürün güncelle
- `DELETE /api/products/:id` - Ürün sil

### Campaigns
- `GET /api/campaigns` - Tüm kampanyaları listele
- `GET /api/campaigns/:id` - Tek kampanya detayı
- `POST /api/campaigns` - Yeni kampanya ekle
- `PUT /api/campaigns/:id` - Kampanya güncelle
- `DELETE /api/campaigns/:id` - Kampanya sil

## 🛡️ Güvenlik

- Input validasyonu
- Dosya tipi kontrolü (resim yüklemede)
- Dosya boyutu limiti (5MB)
- XSS koruması

## 📦 Production Build

### Frontend
```bash
cd client
npm run build
```

Build dosyaları `client/dist` klasöründe oluşturulacak.

### Backend
```bash
cd server
npm start
```

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'feat: Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 📞 İletişim

Sorularınız için: info@papucgnc.com

## 🎯 Roadmap

- [ ] Kullanıcı girişi ve kayıt sistemi
- [ ] Ödeme entegrasyonu
- [ ] Sipariş takibi
- [ ] Favori ürünler
- [ ] Ürün yorumları ve değerlendirmeleri
- [ ] Email bildirimleri
- [ ] İndirim kuponları

---

**Papucgnc** ile yapılmıştır ❤️

