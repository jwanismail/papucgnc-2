import { PrismaClient } from '@prisma/client';
import { uploadToFirebase } from '../utils/firebase.js';

const prisma = new PrismaClient();

// Firebase'e dosya yükle ve URL döndür
const uploadFileToFirebase = async (file, folder = 'products') => {
  try {
    if (!file || !file.buffer) {
      return '';
    }
    
    const result = await uploadToFirebase(file, folder);
    return result.url;
  } catch (error) {
    console.error('Firebase upload hatası:', error);
    return '';
  }
};

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
    
    console.log(`📦 ${products.length} ürün veritabanından getirildi`);
    
    // Her ürün için images ve colorOptions array'ini parse et
    const productsWithParsedImages = products.map(product => {
      let parsedImages = [];
      let parsedColorOptions = [];
      
      // Images parse et
      try {
        parsedImages = product.images ? JSON.parse(product.images) : [];
      } catch (e) {
        console.error('Images parse hatası:', e, product.images);
        parsedImages = [];
      }
      
      // ColorOptions parse et
      try {
        parsedColorOptions = product.colorOptions ? JSON.parse(product.colorOptions) : [];
      } catch (e) {
        console.error('ColorOptions parse hatası:', e, product.colorOptions);
        parsedColorOptions = [];
      }
      
      return {
        ...product,
        images: parsedImages,
        colorOptions: parsedColorOptions
      };
    });
    
    console.log(`✅ ${productsWithParsedImages.length} ürün başarıyla parse edildi`);
    res.json(productsWithParsedImages);
  } catch (error) {
    console.error('❌ getAllProducts hatası:', error);
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
    
    // Ana ürün resimleri - Firebase'e yükle
    let image = '';
    let images = null;
    
    if (mainImages.length > 0) {
      const imageUrls = [];
      for (const file of mainImages) {
        const url = await uploadFileToFirebase(file, 'products');
        if (url) imageUrls.push(url);
      }
      image = imageUrls[0] || '';
      images = imageUrls.length > 0 ? JSON.stringify(imageUrls) : null;
    }
    
    // Renk seçeneklerini işle
    let colorOptionsJSON = null;
    if (colorOptions && colorOptions !== 'null' && colorOptions !== '[]') {
      try {
        const colorOptionsData = typeof colorOptions === 'string' ? JSON.parse(colorOptions) : colorOptions;
        let colorImageIndex = 0;
        
        // Her renk için resimleri ata
        const processedColorOptions = await Promise.all(colorOptionsData.map(async colorOption => {
          const imageCount = colorOption.imageCount || 0;
          const colorImagePaths = [];
          
          for (let i = 0; i < imageCount && colorImageIndex < colorImages.length; i++) {
            const url = await uploadFileToFirebase(colorImages[colorImageIndex], 'products/colors');
            if (url) colorImagePaths.push(url);
            colorImageIndex++;
          }
          
          return {
            name: colorOption.name,
            images: colorImagePaths
          };
        }));
        
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
    
    // Yeni ana resimler varsa güncelle - Firebase'e yükle
    if (mainImages.length > 0) {
      const imageUrls = [];
      for (const file of mainImages) {
        const url = await uploadFileToFirebase(file, 'products');
        if (url) imageUrls.push(url);
      }
      updateData.image = imageUrls[0] || '';
      updateData.images = imageUrls.length > 0 ? JSON.stringify(imageUrls) : null;
    }
    
    // Renk seçeneklerini güncelle
    if (colorOptions && colorOptions !== 'null' && colorOptions !== '[]') {
      try {
        const colorOptionsData = typeof colorOptions === 'string' ? JSON.parse(colorOptions) : colorOptions;
        let colorImageIndex = 0;
        
        const processedColorOptions = await Promise.all(colorOptionsData.map(async colorOption => {
          const imageCount = colorOption.imageCount || 0;
          const colorImagePaths = [];
          
          for (let i = 0; i < imageCount && colorImageIndex < colorImages.length; i++) {
            const url = await uploadFileToFirebase(colorImages[colorImageIndex], 'products/colors');
            if (url) colorImagePaths.push(url);
            colorImageIndex++;
          }
          
          return {
            name: colorOption.name,
            images: colorImagePaths
          };
        }));
        
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

// Öne çıkarılmış ürünleri getir (koleksiyon sayfası için)
export const getFeaturedProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        featuredOrder: {
          not: null
        }
      },
      include: {
        campaign: true
      },
      orderBy: {
        featuredOrder: 'asc'
      }
    });
    
    console.log(`⭐ ${products.length} öne çıkarılmış ürün bulundu`);
    
    // Her ürün için images ve colorOptions array'ini parse et
    const productsWithParsedImages = products.map(product => {
      let parsedImages = [];
      let parsedColorOptions = [];
      
      // Images parse et
      try {
        parsedImages = product.images ? JSON.parse(product.images) : [];
      } catch (e) {
        console.error('Featured - Images parse hatası:', e, product.images);
        parsedImages = [];
      }
      
      // ColorOptions parse et
      try {
        parsedColorOptions = product.colorOptions ? JSON.parse(product.colorOptions) : [];
      } catch (e) {
        console.error('Featured - ColorOptions parse hatası:', e, product.colorOptions);
        parsedColorOptions = [];
      }
      
      return {
        ...product,
        images: parsedImages,
        colorOptions: parsedColorOptions
      };
    });
    
    console.log(`✅ ${productsWithParsedImages.length} öne çıkarılmış ürün parse edildi`);
    res.json(productsWithParsedImages);
  } catch (error) {
    console.error('❌ getFeaturedProducts hatası:', error);
    res.status(500).json({ error: 'Öne çıkarılmış ürünler getirilirken hata oluştu', message: error.message });
  }
};

// Ürün öne çıkarma sırasını güncelle
export const updateFeaturedOrder = async (req, res) => {
  try {
    const { productId, featuredOrder } = req.body;
    
    if (!productId) {
      return res.status(400).json({ error: 'Ürün ID gerekli' });
    }

    // featuredOrder null ise öne çıkarmayı kaldır
    const orderValue = featuredOrder === null || featuredOrder === undefined ? null : parseInt(featuredOrder);
    
    const product = await prisma.product.update({
      where: { id: productId },
      data: { featuredOrder: orderValue },
      include: {
        campaign: true
      }
    });
    
    res.json({
      ...product,
      images: product.images ? JSON.parse(product.images) : [],
      colorOptions: product.colorOptions ? JSON.parse(product.colorOptions) : []
    });
  } catch (error) {
    res.status(500).json({ error: 'Öne çıkarma sırası güncellenirken hata oluştu', message: error.message });
  }
};

// Tüm öne çıkarma sıralarını toplu güncelle
export const updateFeaturedOrders = async (req, res) => {
  try {
    const { featuredProducts } = req.body; // [{ id: 'xxx', featuredOrder: 1 }, ...]
    
    if (!Array.isArray(featuredProducts)) {
      return res.status(400).json({ error: 'Geçersiz veri formatı' });
    }

    // Transaction kullanarak toplu güncelleme
    await prisma.$transaction(async (tx) => {
      // Önce tüm ürünlerin featuredOrder'ını null yap
      await tx.product.updateMany({
        data: { featuredOrder: null }
      });
      
      // Sonra sadece belirtilen ürünleri güncelle
      for (const item of featuredProducts) {
        if (item.id && item.featuredOrder !== null && item.featuredOrder !== undefined) {
          await tx.product.update({
            where: { id: item.id },
            data: { featuredOrder: parseInt(item.featuredOrder) }
          });
        }
      }
    });
    
    res.json({ message: 'Öne çıkarma sıraları başarıyla güncellendi' });
  } catch (error) {
    res.status(500).json({ error: 'Öne çıkarma sıraları güncellenirken hata oluştu', message: error.message });
  }
};

