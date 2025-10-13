#!/bin/bash

# Frontend Production Build Script
# Bu script frontend'i build alır ve deploy için hazırlar

echo "🚀 Papucgnc Frontend Build Başlatılıyor..."

# Client klasörüne git
cd client

# Dependencies kontrolü
echo "📦 Dependencies kontrol ediliyor..."
npm install

# Build al
echo "🔨 Production build alınıyor..."
npm run build

# .htaccess dosyasını dist'e kopyala
echo "📋 .htaccess kopyalanıyor..."
cp .htaccess dist/.htaccess

echo ""
echo "✅ Build tamamlandı!"
echo ""
echo "📂 Dosyalar: client/dist/"
echo ""
echo "📤 Şimdi yapılacaklar:"
echo "1. client/dist/ klasöründeki TÜM dosyaları seç"
echo "2. cPanel File Manager > public_html klasörüne yükle"
echo "3. VEYA FTP ile yükle"
echo ""
echo "🌐 Site: https://papucgnc.com"
echo ""

