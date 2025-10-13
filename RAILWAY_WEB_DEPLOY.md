# 🚂 Railway Web Arayüzü ile Deploy

## 🎯 Mevcut Durum

- ✅ Railway hesabı: civanelismail34@gmail.com
- ✅ Proje oluşturuldu: **Gncpapuc**
- ✅ PostgreSQL database eklendi
- ❌ Backend service eksik

**Proje Linki**: https://railway.com/project/2c45f0b9-aedd-4207-acf2-c8e5afce3689

---

## 📝 Adım Adım Kurulum

### 1. Railway Projesini Aç

Tarayıcıda: https://railway.com/project/2c45f0b9-aedd-4207-acf2-c8e5afce3689

### 2. GitHub Repo Ekle

1. **"+ New"** butonuna tıkla
2. **"GitHub Repo"** seç
3. Repository'ni seç (eğer görünmüyorsa "Configure GitHub App" tıkla)

### 3. Backend Service Ayarları

Yeni service oluştu, şimdi ayarla:

#### A) **Settings** Sekmesi

1. Sol menüden **"Settings"** tıkla
2. **"Service Name"** → `backend` yaz (opsiyonel)
3. Aşağı kaydır:
   - **Root Directory**: `server` yaz
   - **Watch Paths**: boş bırak
   - **Start Command**: boş bırak (package.json'daki script kullanılacak)
4. **Save** (otomatik kaydeder)

#### B) **Variables** Sekmesi

1. Sol menüden **"Variables"** tıkla
2. **"New Variable"** → **"Add a Reference"**
   - Service: **Postgres** seç
   - Variable: **`DATABASE_URL`** seç
   - **Add** tıkla
3. Manuel variable'lar ekle:
   - **Variable**: `NODE_ENV`
   - **Value**: `production`
   - Enter tuşuna bas

   - **Variable**: `CORS_ORIGIN`
   - **Value**: `https://papucgnc.com`
   - Enter tuşuna bas

### 4. Deploy

Service otomatik deploy olacak. **"Deployments"** tab'ından takip et.

### 5. Domain Al

Deploy başarılı olduktan sonra:

1. Backend service'e tıkla
2. **"Settings"** → **"Networking"**
3. **"Generate Domain"** tıkla
4. Domain gelecek (örn: `backend-production-xxxx.up.railway.app`)

**Bu URL'i kaydet!** Frontend'de kullanacağız.

---

## 🧪 Test Et

Deploy bitince test et:

```bash
curl https://SENIN-RAILWAY-URL/api/health
```

Cevap:
```json
{"status":"OK","message":"Papucgnc API çalışıyor"}
```

---

## 🎨 Frontend'i Güncelle

Railway URL'i aldıktan sonra:

1. `client/src/config/api.config.js` aç
2. Production URL'i güncelle:

```javascript
production: {
  baseURL: 'https://SENIN-RAILWAY-URL/api'
}
```

---

## 📊 Seed Data Ekle (Opsiyonel)

İlk deploy'dan sonra örnek verileri ekle:

Railway'de backend service → **"Variables"** tab → sağ üstte **"..."** → **"Service Shell"**

Terminal açılınca:
```bash
npm run seed
```

---

## ✅ Tamamlandı!

Backend Railway'de çalışıyor! 🎉

**Sırada**: Frontend build ve cPanel'e yükleme

---

## 🐛 Sorun Giderme

### "Can't reach database" hatası:

**Çözüm**: Variables tab'da `DATABASE_URL` variable'ını kontrol et:
- PostgreSQL'den **reference** olmalı
- Manuel yazılmamalı

### Build hatası:

**Çözüm**: Settings'de Root Directory `server` olduğundan emin ol.

### Import hatası:

**Çözüm**: `package.json`'da `"type": "module"` var mı kontrol et.

