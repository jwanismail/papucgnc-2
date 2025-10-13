# 🚀 Papucgnc Deployment Kılavuzu

## 📦 Backend Deployment (Railway)

### Adım 1: Railway Hesabı ve Proje Oluşturma

1. [Railway.app](https://railway.app) sitesine git
2. GitHub ile giriş yap
3. "New Project" > "Deploy from GitHub repo" seç
4. Repository'yi seç (veya önce GitHub'a push et)

### Adım 2: PostgreSQL Database Ekleme

1. Railway projesinde "New" > "Database" > "PostgreSQL" seç
2. Database otomatik oluşturulacak
3. Database bağlantı bilgileri otomatik `DATABASE_URL` olarak eklenecek

### Adım 3: Environment Variables Ayarlama

Railway projesinde "Variables" sekmesine git ve şunları ekle:

```
NODE_ENV=production
PORT=5000
CORS_ORIGIN=https://papucgnc.com
```

⚠️ **ÖNEMLİ**: `DATABASE_URL` Railway tarafından otomatik eklenir, sen ekleme!

### Adım 4: Deploy Settings

1. "Settings" > "Deploy" bölümüne git
2. **Root Directory**: `server` yaz (önemli!)
3. **Start Command**: `npm start` (varsayılan)
4. **Install Command**: `npm install` (varsayılan)

### Adım 5: Deploy Et

1. "Deploy" butonuna tıkla
2. Build loglarını izle
3. Deploy tamamlandığında Railway URL'ini al (örn: `https://papucgnc-production.up.railway.app`)

### Adım 6: Database Migration ve Seed

İlk deploy'dan sonra Railway'de otomatik çalışacak:
- `postinstall` script Prisma client oluşturacak
- `start` script veritabanı tablolarını oluşturup sunucuyu başlatacak

**Manuel Seed** yapmak için Railway CLI ile:
```bash
railway login
railway run npm run seed
```

---

## 🌐 Frontend Deployment (cPanel)

### Adım 1: Backend URL'i Güncelle

`client/src/config/api.config.js` dosyasını aç ve Railway URL'ini ekle:

```javascript
production: {
  baseURL: 'https://papucgnc-production.up.railway.app/api'
}
```

### Adım 2: Production Build

Terminal'de client klasöründe:

```bash
cd client
npm run build
```

Bu komut `client/dist` klasörü oluşturacak.

### Adım 3: cPanel File Manager ile Upload

1. cPanel'e giriş yap
2. **File Manager** aç
3. `public_html` klasörüne git
4. **Upload** butonuna tıkla
5. `client/dist` klasöründeki **TÜM DOSYALARI** seç ve yükle

**VEYA** FTP ile:

```
Host: ftp.papucgnc.com
Username: cPanel kullanıcı adın
Password: cPanel şifren
Port: 21
```

`client/dist/*` dosyalarını `public_html/` klasörüne yükle

### Adım 4: .htaccess Dosyası (SPA Routing için)

cPanel File Manager'da `public_html` içinde `.htaccess` dosyası oluştur:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]
</IfModule>

# Gzip compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript
</IfModule>

# Browser caching
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
  ExpiresByType application/pdf "access plus 1 month"
  ExpiresByType image/x-icon "access plus 1 year"
</IfModule>
```

### Adım 5: SSL Sertifikası (HTTPS)

cPanel'de:

1. **SSL/TLS Status** aç
2. Domain'i seç (papucgnc.com)
3. **Run AutoSSL** tıkla
4. Let's Encrypt sertifikası otomatik kurulacak

---

## ✅ Test ve Doğrulama

### Backend Test:

```bash
curl https://papucgnc-production.up.railway.app/api/health
```

Yanıt:
```json
{"status":"OK","message":"Papucgnc API çalışıyor"}
```

### Frontend Test:

1. https://papucgnc.com aç
2. Ana sayfada ürünler görünmeli
3. Ürün detay sayfası çalışmalı
4. Admin paneline giriş yapabilmeli

---

## 🔄 Güncelleme Nasıl Yapılır?

### Backend Güncelleme:

1. Kodu değiştir
2. GitHub'a push et
3. Railway otomatik deploy edecek

### Frontend Güncelleme:

1. Kodu değiştir
2. `cd client && npm run build`
3. `dist` klasörünü cPanel'e yükle

---

## 🐛 Sorun Giderme

### Backend çalışmıyor:

1. Railway loglarını kontrol et: "Deployments" > son deploy > "View Logs"
2. Environment variables doğru mu?
3. Database bağlantısı var mı?

### Frontend API'ye bağlanamıyor:

1. `api.config.js`'de Railway URL doğru mu?
2. Railway'de CORS ayarları doğru mu?
3. Browser Console'da network hatalarını kontrol et

### Resimler yüklenmiyor:

Railway'de dosya yükleme geçici! Çözüm:
- **Cloudinary** kullan (ücretsiz 25GB)
- **AWS S3** kullan
- Başka bir image hosting servisi

---

## 📊 Performans Optimizasyonu

### Frontend:

- ✅ Gzip compression aktif
- ✅ Browser caching aktif
- ✅ Code splitting yapıldı
- ✅ Lazy loading kullanıldı

### Backend:

- Railway otomatik scale ediyor
- PostgreSQL connection pooling aktif
- Rate limiting eklenebilir (opsiyonel)

---

## 💰 Maliyet Tahmini

### Railway:
- **Starter Plan**: $5/ay (500 saat)
- **Developer Plan**: $10/ay (1000 saat)

### Hosting (cPanel):
- Mevcut hosting planınıza göre değişir
- SSL ücretsiz (Let's Encrypt)

---

## 🎉 Tamamlandı!

Siteniz artık canlıda: **https://papucgnc.com**

Başarılar! 🚀

