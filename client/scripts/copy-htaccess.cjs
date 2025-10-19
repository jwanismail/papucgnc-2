const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, '..', 'public', '.htaccess');
const dest = path.join(__dirname, '..', 'dist', '.htaccess');

try {
  if (!fs.existsSync(src)) {
    console.warn('[copy-htaccess] public/.htaccess bulunamadı, atlanıyor.');
    process.exit(0);
  }

  const distDir = path.dirname(dest);
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  fs.copyFileSync(src, dest);
  console.log('[copy-htaccess] .htaccess dist dizinine kopyalandı.');
} catch (err) {
  console.error('[copy-htaccess] Hata:', err.message);
  process.exit(1);
}
