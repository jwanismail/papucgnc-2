# 🧪 Railway Backend Test

Deploy bittikten sonra bu komutla test et:

```bash
# Railway URL'ini al (Settings → Networking → Generate Domain)
# Sonra test et:

curl https://SENIN-RAILWAY-URL/api/health
```

**Başarılı Cevap:**
```json
{
  "status": "OK",
  "message": "Papucgnc API çalışıyor"
}
```

---

## 📊 Seed Data Ekle

Backend çalıştıktan sonra örnek ürünleri ekle:

### Railway Console'da:

1. Backend service → Settings → sağ üstte **"..."** menü
2. **"Service Shell"** tıkla
3. Terminal açılınca:

```bash
npm run seed
```

**Çıktı:**
```
🌱 Seed işlemi başlatılıyor...
✅ Kampanyalar oluşturuldu
✅ Örnek ürünler oluşturuldu
🎉 Seed işlemi tamamlandı!
```

---

## ✅ Railway Backend Hazır!

Şimdi sırada:
1. Railway URL'ini al
2. Frontend'e ekle
3. Frontend build al
4. cPanel'e yükle

**Railway URL**: _________________________ (buraya yaz!)

