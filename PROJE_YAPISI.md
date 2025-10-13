# 📂 Papucgnc - Proje Yapısı

Bu dokümanda projenin detaylı klasör ve dosya yapısını bulabilirsiniz.

## 🌲 Klasör Ağacı

```
papucgnc/
│
├── 📁 client/                          # Frontend (React + Vite + Tailwind)
│   ├── 📁 public/                      # Static dosyalar
│   │   └── logo.svg                    # Site logosu
│   │
│   ├── 📁 src/                         # Kaynak kodlar
│   │   │
│   │   ├── 📁 components/              # React componentleri
│   │   │   │
│   │   │   ├── 📁 common/             # Ortak componentler
│   │   │   │   ├── Navbar.jsx         # Üst navigasyon (logo, sepet)
│   │   │   │   └── Footer.jsx         # Alt bilgi
│   │   │   │
│   │   │   ├── 📁 admin/              # Admin panel componentleri
│   │   │   │   ├── ProductForm.jsx    # Ürün ekleme/düzenleme formu
│   │   │   │   └── ProductCard.jsx    # Admin ürün kartı
│   │   │   │
│   │   │   └── 📁 product/            # Ürün componentleri
│   │   │       └── ProductCard.jsx    # Public ürün kartı
│   │   │
│   │   ├── 📁 pages/                   # Sayfa componentleri
│   │   │   │
│   │   │   ├── 📁 admin/              # Admin sayfaları
│   │   │   │   ├── AdminDashboard.jsx # Admin ana panel
│   │   │   │   ├── AdminProducts.jsx  # Ürün yönetimi
│   │   │   │   └── AdminCampaigns.jsx # Kampanya yönetimi
│   │   │   │
│   │   │   └── 📁 public/             # Public sayfalar
│   │   │       ├── HomePage.jsx       # Ana sayfa
│   │   │       ├── ProductListPage.jsx # Ürün listesi
│   │   │       └── ProductDetailPage.jsx # Ürün detayı
│   │   │
│   │   ├── 📁 store/                   # State management
│   │   │   └── cartStore.js           # Sepet store (Zustand)
│   │   │
│   │   ├── 📁 utils/                   # Yardımcı fonksiyonlar
│   │   │   └── api.js                 # Axios instance
│   │   │
│   │   ├── App.jsx                    # Ana App component
│   │   ├── main.jsx                   # React entry point
│   │   └── index.css                  # Global CSS + Tailwind
│   │
│   ├── .eslintrc.cjs                  # ESLint konfigürasyonu
│   ├── .prettierrc                    # Prettier konfigürasyonu
│   ├── .gitignore                     # Git ignore kuralları
│   ├── index.html                     # HTML template
│   ├── package.json                   # Frontend bağımlılıkları
│   ├── postcss.config.js              # PostCSS konfigürasyonu
│   ├── tailwind.config.js             # Tailwind CSS ayarları
│   └── vite.config.js                 # Vite konfigürasyonu
│
├── 📁 server/                          # Backend (Express + Prisma)
│   │
│   ├── 📁 src/                         # Kaynak kodlar
│   │   │
│   │   ├── 📁 routes/                 # API routes
│   │   │   ├── productRoutes.js       # Ürün endpoints
│   │   │   └── campaignRoutes.js      # Kampanya endpoints
│   │   │
│   │   ├── 📁 controllers/            # Controller fonksiyonları
│   │   │   ├── productController.js   # Ürün işlemleri
│   │   │   └── campaignController.js  # Kampanya işlemleri
│   │   │
│   │   └── index.js                   # Express server
│   │
│   ├── 📁 prisma/                      # Prisma ORM
│   │   ├── schema.prisma              # Database schema
│   │   └── seed.js                    # Seed data script
│   │
│   ├── 📁 uploads/                     # Yüklenen dosyalar
│   │   └── .gitkeep                   # Klasörü git'te tut
│   │
│   ├── .env                           # Environment variables
│   ├── .gitignore                     # Git ignore kuralları
│   └── package.json                   # Backend bağımlılıkları
│
├── 📁 .vscode/                         # VSCode ayarları
│   ├── extensions.json                # Önerilen eklentiler
│   └── settings.json                  # Workspace ayarları
│
├── .cursorrules                       # AI geliştirme kuralları
├── .gitignore                         # Root git ignore
├── package.json                       # Root package.json
├── README.md                          # Ana dokümantasyon
├── KURULUM.md                         # Detaylı kurulum kılavuzu
└── PROJE_YAPISI.md                    # Bu dosya
```

## 📋 Dosya Açıklamaları

### Frontend (Client)

#### Components
- **common/Navbar.jsx**: Üst navigasyon çubuğu. Logo (sol), sepet ikonu (sağ)
- **common/Footer.jsx**: Alt bilgi alanı. İletişim, linkler
- **admin/ProductForm.jsx**: Ürün ekleme/düzenleme modal formu
- **admin/ProductCard.jsx**: Admin paneldeki ürün kartı (Düzenle/Sil butonları)
- **product/ProductCard.jsx**: Müşteri tarafındaki ürün kartı (Sepete Ekle butonu)

#### Pages
- **HomePage.jsx**: Ana sayfa - Hero section, kampanya banner, öne çıkan ürünler
- **ProductListPage.jsx**: Tüm ürünler sayfası - Filtreleme, grid görünüm
- **ProductDetailPage.jsx**: Ürün detay sayfası - Büyük resim, açıklama, sepete ekleme
- **AdminDashboard.jsx**: Admin ana sayfa - Yönetim kartları
- **AdminProducts.jsx**: Ürün yönetim sayfası - CRUD işlemleri
- **AdminCampaigns.jsx**: Kampanya yönetim sayfası - CRUD işlemleri

#### Store
- **cartStore.js**: Sepet state management (Zustand ile)
  - `addItem()`: Sepete ürün ekle
  - `removeItem()`: Sepetten ürün çıkar
  - `updateQuantity()`: Miktar güncelle
  - `getTotalItems()`: Toplam ürün sayısı
  - `getTotalPrice()`: Toplam fiyat

### Backend (Server)

#### Routes
- **productRoutes.js**: 
  - `GET /api/products` - Tüm ürünler
  - `GET /api/products/:id` - Tek ürün
  - `POST /api/products` - Yeni ürün (multipart/form-data)
  - `PUT /api/products/:id` - Ürün güncelle
  - `DELETE /api/products/:id` - Ürün sil

- **campaignRoutes.js**:
  - `GET /api/campaigns` - Tüm kampanyalar
  - `GET /api/campaigns/:id` - Tek kampanya
  - `POST /api/campaigns` - Yeni kampanya
  - `PUT /api/campaigns/:id` - Kampanya güncelle
  - `DELETE /api/campaigns/:id` - Kampanya sil

#### Controllers
- **productController.js**: Ürün CRUD işlemleri
- **campaignController.js**: Kampanya CRUD işlemleri

#### Prisma
- **schema.prisma**: Database modelleri
  - `Product`: Ürün modeli
  - `Campaign`: Kampanya modeli
- **seed.js**: Örnek veri oluşturma scripti

## 🎨 Tasarım Sistemi

### Renkler (Tailwind)
- **Primary**: Blue tones (#0ea5e9 - primary-500)
- **Success**: Green tones
- **Danger**: Red tones
- **Background**: White & Gray-50
- **Text**: Gray-900, Gray-600

### Typography
- **Font**: Inter (Google Fonts)
- **Headings**: Bold, 2xl-4xl
- **Body**: Regular, sm-base

### Components
- **Buttons**: 
  - `btn-primary`: Mavi, yuvarlak köşeli
  - `btn-secondary`: Gri, yuvarlak köşeli
- **Cards**: Beyaz, shadow-sm, border, rounded-xl
- **Inputs**: Border, focus ring, rounded-lg

## 🔄 Data Flow

### Ürün Ekleme Akışı
```
Admin Panel → ProductForm → Axios POST → 
Express Route → Controller → Prisma → 
SQLite Database → Response → UI Update
```

### Sepete Ekleme Akışı
```
ProductCard → addItem() → Zustand Store → 
LocalStorage (persist) → Navbar Badge Update
```

### Kampanya Filtreleme
```
ProductListPage → Filter Button → 
State Change → Filter Products → 
Re-render Grid
```

## 📦 Bağımlılıklar

### Frontend (client/package.json)
- **react**: ^18.3.1 - UI kütüphanesi
- **react-router-dom**: ^6.26.0 - Routing
- **axios**: ^1.7.2 - HTTP client
- **zustand**: ^4.5.4 - State management
- **tailwindcss**: ^3.4.7 - CSS framework
- **vite**: ^5.3.4 - Build tool
- **lucide-react**: İkonlar

### Backend (server/package.json)
- **express**: ^4.19.2 - Web framework
- **@prisma/client**: ^5.18.0 - Database client
- **cors**: ^2.8.5 - CORS middleware
- **multer**: ^1.4.5 - File upload
- **dotenv**: ^16.4.5 - Environment variables

## 🚀 Geliştirme Komutları

```bash
# Tüm projeyi çalıştır (root)
npm run dev

# Sadece backend
cd server && npm run dev

# Sadece frontend
cd client && npm run dev

# Database Studio
cd server && npx prisma studio

# Seed data
cd server && npm run seed

# Linter
cd client && npm run lint

# Production build
cd client && npm run build
```

## 📱 Responsive Breakpoints

```css
sm: 640px   /* Mobil landscape */
md: 768px   /* Tablet */
lg: 1024px  /* Laptop */
xl: 1280px  /* Desktop */
2xl: 1536px /* Large Desktop */
```

## 🔒 Güvenlik Katmanları

1. **Input Validation**: Form validasyonları
2. **File Upload**: Tip ve boyut kontrolü (5MB max)
3. **CORS**: Cross-origin koruma
4. **SQL Injection**: Prisma ORM ile korumalı
5. **XSS**: React otomatik escape

## 📈 Gelecek Geliştirmeler

- [ ] Authentication (JWT)
- [ ] Payment Gateway
- [ ] Order Management
- [ ] Email Notifications
- [ ] Product Reviews
- [ ] Wishlist
- [ ] Advanced Search
- [ ] Analytics Dashboard

---

**Güncellenme**: 2024

