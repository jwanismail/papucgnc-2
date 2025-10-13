@echo off
REM Frontend Production Build Script - Windows
REM Bu script frontend'i build alır ve deploy için hazırlar

echo.
echo 🚀 Papucgnc Frontend Build Başlatılıyor...
echo.

cd client

echo 📦 Dependencies kontrol ediliyor...
call npm install

echo.
echo 🔨 Production build alınıyor...
call npm run build

echo.
echo 📋 .htaccess kopyalanıyor...
copy .htaccess dist\.htaccess

echo.
echo ✅ Build tamamlandı!
echo.
echo 📂 Dosyalar: client\dist\
echo.
echo 📤 Şimdi yapılacaklar:
echo 1. client\dist\ klasöründeki TÜM dosyaları seç
echo 2. cPanel File Manager - public_html klasörüne yükle
echo 3. VEYA FTP ile yükle
echo.
echo 🌐 Site: https://papucgnc.com
echo.
pause

