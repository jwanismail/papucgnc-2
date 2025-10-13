# 🚀 ŞİMDİ DEPLOY ET!

Proje deploy için **tamamen hazır**! Sadece bu adımları takip et:

---

## 📦 1. GitHub'a Yükle

```bash
git init
git add .
git commit -m "Production ready - Papucgnc E-commerce"
git branch -M main

# GitHub'da yeni repo oluştur: papucgnc
# Sonra:
git remote add origin https://github.com/KULLANICI_ADIN/papucgnc.git
git push -u origin main
```

---

## ⚡ 2. Railway Backend (5 dakika)

### 2.1 Railway'e Git
👉 https://railway.app

### 2.2 Deploy Et
1. "New Project" → "Deploy from GitHub repo"
2. Repo seç: `papucgnc`
3. "New" → "Database" → "PostgreSQL" (database ekle)
4. "Variables" ekle:
   ```
   NODE_ENV=production
   CORS_ORIGIN=https://papucgnc.com
   ```
5. "Settings" → "Deploy" → Root Directory: `server`
6. "Deploy" tıkla!

### 2.3 Railway URL'i Kopyala
Deploy bitince URL gelecek (örn: `papucgnc-production.up.railway.app`)

📋 **URL'i buraya yaz**: ___________________________________

---

## 🎨 3. Frontend Ayarla (2 dakika)

### 3.1 Railway URL'i Ekle
`client/src/config/api.config.js` aç:

```javascript
production: {
  baseURL: 'https://RAILWAY_URL_BURAYA.up.railway.app/api'
}
```

Railway URL'i yapıştır!

### 3.2 Build Al

**Windows:**
```bash
deploy-frontend.bat
```

**Mac/Linux:**
```bash
chmod +x deploy-frontend.sh
./deploy-frontend.sh
```

Build tamamlandı! Dosyalar: `client/dist/`

---

## 🌐 4. cPanel'e Yükle (5 dakika)

### Yöntem 1: File Manager ⭐ (Kolay)
1. cPanel giriş → File Manager
2. `public_html` aç
3. Upload → `client/dist/*` **TÜM DOSYALARI** seç
4. Yükle
5. Bitti! ✅

### Yöntem 2: FTP (İsteğe bağlı)
```
Host: ftp.papucgnc.com
Username: cPanel kullanıcı adın
```
`client/dist/*` → `public_html/` yükle

---

## 🔒 5. SSL Aktifleştir (2 dakika)

1. cPanel → **SSL/TLS Status**
2. Domain seç: `papucgnc.com`
3. **Run AutoSSL** tıkla
4. Bekle (1-2 dakika)
5. ✅ HTTPS aktif!

---

## ✅ 6. Test Et!

### Backend Test:
```bash
curl https://SENIN-RAILWAY-URL/api/health
```

✅ Cevap: `{"status":"OK"}`

### Frontend Test:
👉 https://papucgnc.com

Kontroller:
- [ ] Ana sayfa açılıyor
- [ ] Ürünler görünüyor
- [ ] Ürün detay sayfası çalışıyor
- [ ] Admin panel açılıyor

---

## 🎉 TAMAMLANDI!

Siteniz artık canlıda! 🚀

**Frontend**: https://papucgnc.com  
**Backend**: https://RAILWAY_URL

---

## 📚 Yardım Gerekirse

- Detaylı kılavuz: `DEPLOYMENT_GUIDE.md`
- Hızlı başlangıç: `QUICK_START_DEPLOYMENT.md`
- Kontrol listesi: `DEPLOYMENT_CHECKLIST.md`

---

## 🔄 Güncelleme Nasıl Yapılır?

### Backend Güncelleme:
```bash
git add .
git commit -m "Backend güncelleme"
git push
```
Railway otomatik deploy eder!

### Frontend Güncelleme:
```bash
# Kodu değiştir
deploy-frontend.bat  # build al
# dist/ dosyalarını cPanel'e yükle
```

---

**Başarılar! İyi satışlar! 💰**

