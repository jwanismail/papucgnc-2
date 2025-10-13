# ⚡ Hızlı Deploy Kılavuzu

## 🎯 Özet

- **Backend**: Railway (PostgreSQL)
- **Frontend**: cPanel (papucgnc.com)
- **Tahmini Süre**: 20-30 dakika

---

## 📝 Gereksinimler

- ✅ GitHub hesabı
- ✅ Railway.app hesabı (GitHub ile giriş)
- ✅ cPanel erişimi (papucgnc.com)
- ✅ FTP bilgileri (opsiyonel)

---

## 🚀 Adım Adım Deployment

### ADIM 1: GitHub'a Kod Yükle (5 dakika)

```bash
# Terminal'de proje klasöründe
git init
git add .
git commit -m "Initial commit - Papucgnc E-commerce"
git branch -M main

# GitHub'da yeni repo oluştur (papucgnc veya istediğin isim)
# Sonra:
git remote add origin https://github.com/KULLANICI_ADIN/papucgnc.git
git push -u origin main
```

---

### ADIM 2: Railway'de Backend Deploy (10 dakika)

#### 2.1 Proje Oluştur
1. https://railway.app → "New Project"
2. "Deploy from GitHub repo" → Repo'nu seç
3. "Add variables" tıkla

#### 2.2 PostgreSQL Ekle
1. "New" → "Database" → "PostgreSQL"
2. Otomatik bağlanacak

#### 2.3 Environment Variables
```
NODE_ENV=production
CORS_ORIGIN=https://papucgnc.com
```

⚠️ `DATABASE_URL` Railway otomatik ekler!

#### 2.4 Deploy Settings
- **Settings** → **Deploy**
- **Root Directory**: `server`
- **Start Command**: `npm start`

#### 2.5 Deploy
- "Deploy" tıkla
- Railway URL'ini kopyala (örn: `https://papucgnc-production.up.railway.app`)

---

### ADIM 3: Frontend Ayarla (2 dakika)

`client/src/config/api.config.js` dosyasını aç:

```javascript
production: {
  baseURL: 'https://SENIN-RAILWAY-URL.up.railway.app/api'
}
```

Railway URL'ini yapıştır!

---

### ADIM 4: Frontend Build (3 dakika)

**Windows:**
```bash
deploy-frontend.bat
```

**Mac/Linux:**
```bash
chmod +x deploy-frontend.sh
./deploy-frontend.sh
```

**Manuel:**
```bash
cd client
npm install
npm run build
```

Build dosyaları: `client/dist/`

---

### ADIM 5: cPanel'e Yükle (5 dakika)

#### Yöntem 1: File Manager
1. cPanel → File Manager
2. `public_html` klasörüne git
3. Upload → `client/dist/*` tüm dosyaları seç
4. Yükle

#### Yöntem 2: FTP (FileZilla)
1. FileZilla aç
2. Host: `ftp.papucgnc.com`
3. `client/dist/*` → `public_html/` yükle

---

### ADIM 6: SSL Aktifleştir (2 dakika)

1. cPanel → SSL/TLS Status
2. Domain seç: `papucgnc.com`
3. "Run AutoSSL"
4. Bekle (1-2 dakika)

---

## ✅ Test Et

### Backend:
```bash
curl https://SENIN-RAILWAY-URL.up.railway.app/api/health
```

Cevap:
```json
{"status":"OK","message":"Papucgnc API çalışıyor"}
```

### Frontend:
- https://papucgnc.com → Ana sayfa açılmalı
- Ürünler görünmeli
- Admin panel çalışmalı

---

## 🔄 Güncelleme Yapmak

### Backend:
```bash
git add .
git commit -m "Backend güncelleme"
git push
```
Railway otomatik deploy eder!

### Frontend:
```bash
# Kod değiştir
deploy-frontend.bat  # veya .sh
# Yeni dist/ dosyalarını cPanel'e yükle
```

---

## 🆘 Sorun mu var?

### "API bağlanamıyor" hatası:
1. `client/src/config/api.config.js` Railway URL'i doğru mu?
2. Railway deployed mi? (yeşil check)
3. CORS ayarları doğru mu?

### "Resim yüklenmiyor":
Railway dosyaları kalıcı tutmaz. Çözüm:
- Cloudinary kullan (ücretsiz)
- AWS S3 kullan

### "Sayfa yüklenmiyor":
1. `.htaccess` dosyası yüklendi mi?
2. SSL aktif mi?
3. cPanel dosya izinleri 644 mi?

---

## 📞 Yardım

Detaylı kılavuz: `DEPLOYMENT_GUIDE.md`

---

## 🎉 Tebrikler!

Siteniz canlıda: **https://papucgnc.com** 🚀

