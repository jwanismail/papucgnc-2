# 🚀 Papucgnc - Detaylı Kurulum Kılavuzu

Bu dokümanda projeyi sıfırdan kurma adımlarını detaylı olarak bulabilirsiniz.

## 📋 Ön Gereksinimler

Sisteminizde aşağıdaki yazılımların kurulu olması gerekmektedir:

- **Node.js**: v18.0.0 veya üzeri ([İndir](https://nodejs.org/))
- **npm**: v9.0.0 veya üzeri (Node.js ile birlikte gelir)
- **Git**: (Opsiyonel) Versiyon kontrolü için

Node.js ve npm versiyonlarınızı kontrol edin:
```bash
node --version
npm --version
```

## 🔨 Kurulum Adımları

### 1. Proje Dosyalarını İndirin

Projeyi bilgisayarınıza indirin veya klonlayın.

### 2. Backend (Server) Kurulumu

Terminal açın ve server klasörüne gidin:

```bash
cd server
```

#### 2.1. Bağımlılıkları Yükleyin
```bash
npm install
```

#### 2.2. Environment Dosyasını Kontrol Edin

`server/.env` dosyası zaten oluşturulmuş durumda. İçeriği:
```env
DATABASE_URL="file:./dev.db"
PORT=5000
NODE_ENV=development
```

#### 2.3. Veritabanını Oluşturun

Prisma ile veritabanını başlatın:

```bash
# Prisma client'ı oluştur
npx prisma generate

# Database migration'ları çalıştır
npx prisma migrate dev --name init
```

Bu komut SQLite veritabanını oluşturacak ve tablolarınızı hazırlayacak.

#### 2.4. Uploads Klasörünü Kontrol Edin

Uploads klasörü zaten oluşturulmuş durumda. Eğer yoksa:
```bash
mkdir uploads
```

#### 2.5. Backend'i Başlatın

```bash
npm run dev
```

✅ Backend başarıyla başladı! Console'da şu mesajı görmelisiniz:
```
🚀 Server 5000 portunda çalışıyor
```

Backend şu adreste çalışıyor: `http://localhost:5000`

### 3. Frontend (Client) Kurulumu

**YENİ BİR TERMINAL** açın (backend çalışır durumda kalacak):

```bash
cd client
```

#### 3.1. Bağımlılıkları Yükleyin
```bash
npm install
```

#### 3.2. Frontend'i Başlatın
```bash
npm run dev
```

✅ Frontend başarıyla başladı! Console'da şu mesajı görmelisiniz:
```
  VITE v5.x.x  ready in XXX ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

Frontend şu adreste çalışıyor: `http://localhost:3000`

## 🎉 İlk Çalıştırma

### 1. Tarayıcıyı Açın
Tarayıcınızda `http://localhost:3000` adresine gidin.

### 2. İlk Kampanyayı Oluşturun

1. Admin paneline gidin: `http://localhost:3000/admin`
2. "Kampanya Yönetimi" kartına tıklayın
3. "Yeni Kampanya Ekle" butonuna basın
4. Formu doldurun:
   - **Kampanya Adı**: "2. Çift 699 TL"
   - **Açıklama**: "İkinci ürün sadece 699 TL"
   - **Kampanya Tipi**: "2. Çift 699 TL" seçin
   - **Kampanya Aktif**: İşaretli bırakın
5. "Ekle" butonuna basın

### 3. İlk Ürünü Ekleyin

1. Admin panele dönün: `http://localhost:3000/admin`
2. "Ürün Yönetimi" kartına tıklayın
3. "Yeni Ürün Ekle" butonuna basın
4. Formu doldurun:
   - **Ürün Adı**: "Nike Air Max 2024"
   - **Açıklama**: "Rahat ve şık spor ayakkabı"
   - **Fiyat**: "2499.99"
   - **Stok Adedi**: "50"
   - **Kampanya**: "2. Çift 699 TL" seçin (opsiyonel)
   - **Resim**: Bilgisayarınızdan bir ayakkabı resmi seçin
5. "Ekle" butonuna basın

### 4. Siteyi Kullanın

1. Ana sayfaya gidin: `http://localhost:3000`
2. Eklediğiniz ürünü göreceksiniz
3. "Sepete Ekle" butonuna tıklayın
4. Navbar'daki sepet ikonunda ürün sayısını göreceksiniz

## 🛠️ Geliştirme Araçları

### Prisma Studio (Veritabanı Yönetimi)

Veritabanınızı görsel olarak yönetmek için Prisma Studio kullanabilirsiniz:

```bash
cd server
npx prisma studio
```

Tarayıcınızda `http://localhost:5555` açılacak ve veritabanınızı görebileceksiniz.

### API Test Etme

Backend API'yi test etmek için:

```bash
# Sağlık kontrolü
curl http://localhost:5000/api/health

# Tüm ürünleri getir
curl http://localhost:5000/api/products

# Tüm kampanyaları getir
curl http://localhost:5000/api/campaigns
```

## 🐛 Sorun Giderme

### Port Zaten Kullanımda Hatası

**Hata**: `Port 3000 is already in use`

**Çözüm**: 
- Başka bir uygulama portu kullanıyor olabilir
- Client klasöründe `vite.config.js` dosyasını açın
- `server.port` değerini değiştirin (örn: 3001)

### Backend Bağlantı Hatası

**Hata**: `ERR_CONNECTION_REFUSED` veya `Network Error`

**Çözüm**:
- Backend'in çalıştığından emin olun (`http://localhost:5000/api/health`)
- `.env` dosyasındaki PORT değerini kontrol edin
- Firewall ayarlarınızı kontrol edin

### Prisma Hatası

**Hata**: `Prisma Client could not be generated`

**Çözüm**:
```bash
cd server
rm -rf node_modules
npm install
npx prisma generate
npx prisma migrate dev
```

### Resim Yüklenmiyor

**Hata**: Resimler görünmüyor

**Çözüm**:
- `server/uploads` klasörünün var olduğundan emin olun
- Klasör izinlerini kontrol edin
- Backend console'da hata mesajlarını kontrol edin

## 📱 Responsive Test

Sitenin responsive olduğunu test etmek için:

1. Chrome DevTools açın (F12)
2. Device Toolbar'ı aktifleştirin (Ctrl+Shift+M)
3. Farklı cihaz boyutlarını deneyin:
   - iPhone 12/13/14
   - iPad
   - Desktop

## 🚀 Production Build

### Frontend Build

```bash
cd client
npm run build
```

Build dosyaları `client/dist` klasöründe oluşur.

### Production'da Çalıştırma

```bash
# Backend
cd server
NODE_ENV=production npm start

# Frontend (static serve)
cd client
npm run preview
```

## 📚 Faydalı Komutlar

```bash
# Backend - Development mode (auto-restart)
cd server
npm run dev

# Backend - Production mode
cd server
npm start

# Frontend - Development mode
cd client
npm run dev

# Frontend - Production build
cd client
npm run build

# Frontend - Preview production build
cd client
npm run preview

# Linter çalıştır
cd client
npm run lint

# Prisma Studio aç
cd server
npx prisma studio

# Database reset
cd server
npx prisma migrate reset
```

## 🎯 Sonraki Adımlar

Projeyi başarıyla kurdunuz! Şimdi:

1. ✅ Daha fazla ürün ekleyin
2. ✅ Farklı kampanyalar oluşturun
3. ✅ UI/UX'i özelleştirin
4. ✅ Yeni özellikler ekleyin

## 📞 Yardım

Sorun yaşıyorsanız:

1. Bu dokümanı baştan okuyun
2. Console loglarını kontrol edin
3. GitHub Issues'a bakın
4. README.md dosyasını inceleyin

---

**İyi Geliştirmeler! 🚀**

