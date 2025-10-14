# 🧪 Railway Backend Test Komutları

Deploy bitince Railway domain'i aldıktan sonra test et:

## Test 1: Health Check

```bash
curl https://RAILWAY-DOMAIN-BURAYA/api/health
```

**Başarılı cevap:**
```json
{
  "status": "OK",
  "message": "Papucgnc API çalışıyor"
}
```

## Test 2: Products Endpoint

```bash
curl https://RAILWAY-DOMAIN-BURAYA/api/products
```

**İlk deploy'da boş gelecek:**
```json
[]
```

## Test 3: Campaigns Endpoint

```bash
curl https://RAILWAY-DOMAIN-BURAYA/api/campaigns
```

**İlk deploy'da boş gelecek:**
```json
[]
```

---

## 🌱 Seed Data Ekle

Boş geldiyse örnek verileri ekle:

### Railway Console'da:

1. Backend service'e tıkla
2. Sağ üstte **"..."** → **"Service Shell"**
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

4. Tekrar test et:

```bash
curl https://RAILWAY-DOMAIN-BURAYA/api/products
```

Şimdi ürünler gelecek! ✅

---

## ✅ Backend Hazır!

Railway URL: _________________________ (buraya yaz!)

**Sırada:** Frontend'e bu URL'i ekleyip build alacağız!

