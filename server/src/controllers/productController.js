import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Tüm ürünleri getir
export const getAllProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        campaign: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    // Her ürün için images ve colorOptions array'ini parse et
    const productsWithParsedImages = products.map(product => ({
      ...product,
      images: product.images ? JSON.parse(product.images) : [],
      colorOptions: product.colorOptions ? JSON.parse(product.colorOptions) : []
    }));
    
    res.json(productsWithParsedImages);
  } catch (error) {
    res.status(500).json({ error: 'Ürünler getirilirken hata oluştu', message: error.message });
  }
};

// Tekil ürün getir
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        campaign: true
      }
    });
    
    if (!product) {
      return res.status(404).json({ error: 'Ürün bulunamadı' });
    }
    
    // Images ve colorOptions array'ini parse et
    const productWithParsedImages = {
      ...product,
      images: product.images ? JSON.parse(product.images) : [],
      colorOptions: product.colorOptions ? JSON.parse(product.colorOptions) : []
    };
    
    res.json(productWithParsedImages);
  } catch (error) {
    res.status(500).json({ error: 'Ürün getirilirken hata oluştu', message: error.message });
  }
};

// Yeni ürün ekle
export const createProduct = async (req, res) => {
  try {
    console.log('📝 Ürün oluşturma isteği alındı:', {
      body: req.body,
      files: req.files
    });

    const { name, description, price, stock, campaignId, colorOptions, sizeStock } = req.body;
    const mainImages = req.files?.images || [];
    const colorImages = req.files?.colorImages || [];
    
    // Validation
    if (!name || !price) {
      console.log('❌ Validation hatası: name veya price eksik');
      return res.status(400).json({ error: 'Ürün adı ve fiyatı zorunludur' });
    }

    // CampaignId validation - boş string ise null yap
    const validCampaignId = campaignId && campaignId.trim() !== '' ? campaignId : null;
    
    // Ana ürün resimleri
    const image = mainImages.length > 0 ? `/uploads/${mainImages[0].filename}` : '';
    const images = mainImages.length > 0 ? JSON.stringify(mainImages.map(file => `/uploads/${file.filename}`)) : null;
    
    // Renk seçeneklerini işle
    let colorOptionsJSON = null;
    if (colorOptions && colorOptions !== 'null' && colorOptions !== '[]') {
      try {
        const colorOptionsData = typeof colorOptions === 'string' ? JSON.parse(colorOptions) : colorOptions;
        let colorImageIndex = 0;
        
        // Her renk için resimleri ata
        const processedColorOptions = colorOptionsData.map(colorOption => {
          const imageCount = colorOption.imageCount || 0;
          const colorImagePaths = [];
          
          for (let i = 0; i < imageCount && colorImageIndex < colorImages.length; i++) {
            colorImagePaths.push(`/uploads/${colorImages[colorImageIndex].filename}`);
            colorImageIndex++;
          }
          
          return {
            name: colorOption.name,
            images: colorImagePaths
          };
        });
        
        colorOptionsJSON = JSON.stringify(processedColorOptions);
      } catch (e) {
        console.error('ColorOptions parse hatası:', e);
      }
    }
    
    console.log('💾 Veritabanına kaydediliyor:', {
      name,
      price: parseFloat(price),
      stock: parseInt(stock) || 0,
      campaignId: validCampaignId,
      image,
      imagesCount: mainImages.length,
      colorImagesCount: colorImages.length
    });
    
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        stock: parseInt(stock) || 0,
        sizeStock: sizeStock || null,
        image,
        images,
        colorOptions: colorOptionsJSON,
        campaignId: validCampaignId
      },
      include: {
        campaign: true
      }
    });
    
    console.log('✅ Ürün başarıyla oluşturuldu:', product.id);
    
    // JSON parse edilmiş images ve colorOptions ile response döndür
    const response = {
      ...product,
      images: images ? JSON.parse(images) : [],
      colorOptions: colorOptionsJSON ? JSON.parse(colorOptionsJSON) : []
    };
    
    res.status(201).json(response);
  } catch (error) {
    console.error('❌ Ürün oluşturma hatası:', error);
    res.status(500).json({ 
      error: 'Ürün eklenirken hata oluştu', 
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Ürün güncelle
export const updateProduct = async (req, res) => {
  try {
    console.log('📝 Ürün güncelleme isteği alındı:', {
      id: req.params.id,
      body: req.body,
      files: req.files
    });

    const { id } = req.params;
    const { name, description, price, stock, campaignId, colorOptions, sizeStock } = req.body;
    const mainImages = req.files?.images || [];
    const colorImages = req.files?.colorImages || [];
    
    // CampaignId validation - boş string ise null yap
    const validCampaignId = campaignId && campaignId.trim() !== '' ? campaignId : null;
    
    const updateData = {
      name,
      description,
      price: parseFloat(price),
      stock: parseInt(stock),
      sizeStock: sizeStock || null,
      campaignId: validCampaignId
    };
    
    // Yeni ana resimler varsa güncelle
    if (mainImages.length > 0) {
      updateData.image = `/uploads/${mainImages[0].filename}`;
      updateData.images = JSON.stringify(mainImages.map(file => `/uploads/${file.filename}`));
    }
    
    // Renk seçeneklerini güncelle
    if (colorOptions && colorOptions !== 'null' && colorOptions !== '[]') {
      try {
        const colorOptionsData = typeof colorOptions === 'string' ? JSON.parse(colorOptions) : colorOptions;
        let colorImageIndex = 0;
        
        const processedColorOptions = colorOptionsData.map(colorOption => {
          const imageCount = colorOption.imageCount || 0;
          const colorImagePaths = [];
          
          for (let i = 0; i < imageCount && colorImageIndex < colorImages.length; i++) {
            colorImagePaths.push(`/uploads/${colorImages[colorImageIndex].filename}`);
            colorImageIndex++;
          }
          
          return {
            name: colorOption.name,
            images: colorImagePaths
          };
        });
        
        updateData.colorOptions = JSON.stringify(processedColorOptions);
      } catch (e) {
        console.error('ColorOptions parse hatası:', e);
      }
    }
    
    console.log('💾 Veritabanı güncelleniyor:', updateData);
    
    const product = await prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        campaign: true
      }
    });
    
    console.log('✅ Ürün başarıyla güncellendi:', product.id);
    
    // JSON parse edilmiş images ve colorOptions ile response döndür
    const response = {
      ...product,
      images: product.images ? JSON.parse(product.images) : [],
      colorOptions: product.colorOptions ? JSON.parse(product.colorOptions) : []
    };
    
    res.json(response);
  } catch (error) {
    console.error('❌ Ürün güncelleme hatası:', error);
    res.status(500).json({ 
      error: 'Ürün güncellenirken hata oluştu', 
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Ürün sil
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.product.delete({
      where: { id }
    });
    
    res.json({ message: 'Ürün başarıyla silindi' });
  } catch (error) {
    res.status(500).json({ error: 'Ürün silinirken hata oluştu', message: error.message });
  }
};

