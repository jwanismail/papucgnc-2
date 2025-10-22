// Supabase geçici olarak devre dışı - Local storage kullanılıyor
console.log('⚠️ Supabase devre dışı - Local storage kullanılıyor');

const supabase = null;

// Supabase Storage'a dosya yükle
export const uploadToSupabase = async (file, folder = 'products') => {
  try {
    if (!supabase) {
      throw new Error('Supabase client bulunamadı - Local storage kullanın');
    }
    
    if (!file || !file.buffer) {
      throw new Error('Dosya veya buffer bulunamadı');
    }
    
    // Unique dosya adı oluştur
    const timestamp = Date.now();
    const random = Math.round(Math.random() * 1E9);
    const fileExtension = getFileExtension(file.originalname);
    const fileName = `${folder}/product-${timestamp}-${random}${fileExtension}`;
    
    console.log('📤 Supabase\'e yükleniyor:', fileName);
    
    // Buffer'ı Supabase Storage'a yükle
    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('❌ Supabase upload hatası:', error);
      throw error;
    }

    // Public URL oluştur
    const { data: publicData } = supabase.storage
      .from('product-images')
      .getPublicUrl(fileName);

    const publicUrl = publicData.publicUrl;
    
    console.log('✅ Supabase\'e yüklendi:', publicUrl);
    
    return {
      url: publicUrl,
      fileName: fileName,
      originalName: file.originalname
    };
    
  } catch (error) {
    console.error('❌ Supabase upload genel hatası:', error);
    throw error;
  }
};

// Dosya uzantısını al
const getFileExtension = (filename) => {
  return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
};

// Supabase Storage bucket oluştur (gerekirse)
export const createStorageBucket = async () => {
  try {
    const { data, error } = await supabase.storage.createBucket('product-images', {
      public: true,
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
      fileSizeLimit: 5242880 // 5MB
    });

    if (error && error.message.includes('already exists')) {
      console.log('✅ Storage bucket zaten mevcut');
      return true;
    }

    if (error) {
      console.error('❌ Bucket oluşturma hatası:', error);
      throw error;
    }

    console.log('✅ Storage bucket oluşturuldu:', data);
    return true;
  } catch (error) {
    console.error('❌ Bucket oluşturma genel hatası:', error);
    throw error;
  }
};

export default supabase;
