import express from 'express';
import multer from 'multer';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { 
  getAllProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct,
  getFeaturedProducts,
  updateFeaturedOrder,
  updateFeaturedOrders
} from '../controllers/productController.js';

// Multer error handling middleware
const handleMulterError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'Dosya boyutu çok büyük. Maksimum 5MB olmalıdır.' });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ error: 'Çok fazla dosya. Maksimum 10 resim yükleyebilirsiniz.' });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({ error: 'Beklenmeyen dosya alanı.' });
    }
  }
  next(error);
};

const router = express.Router();

// Cloudinary konfigürasyonu
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Cloudinary storage konfigürasyonu
const cloudinaryStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'papucgnc/products',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
    public_id: (req, file) => {
      // Unique dosya adı oluştur
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      return `product-${uniqueSuffix}`;
    },
    transformation: [
      { width: 800, height: 800, crop: 'limit', quality: 'auto' }
    ]
  }
});

// Fallback için local storage (development için)
const localStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'product-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Storage seçimi - Cloudinary varsa onu kullan, yoksa local
const storage = process.env.CLOUDINARY_CLOUD_NAME ? cloudinaryStorage : localStorage;

const upload = multer({ 
  storage: storage,
  limits: { 
    fileSize: 5 * 1024 * 1024, // 5MB limit per file
    files: 50 // Maximum 50 files (ana resimler + renk resimleri)
  },
  fileFilter: (req, file, cb) => {
    console.log('📁 Dosya yükleme:', {
      fieldname: file.fieldname,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size
    });
    
    const allowedTypes = /jpeg|jpg|png|webp|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      console.log('❌ Dosya reddedildi:', file.originalname, file.mimetype);
      cb(new Error('Sadece resim dosyaları yüklenebilir! (JPEG, JPG, PNG, WEBP, GIF)'));
    }
  }
});

// Multer fields configuration - hem ana resimler hem renk resimleri için
const uploadFields = upload.fields([
  { name: 'images', maxCount: 10 },      // Ana ürün resimleri
  { name: 'colorImages', maxCount: 40 }   // Renk resimleri
]);

// Routes
router.get('/', getAllProducts);
router.get('/featured', getFeaturedProducts);
router.get('/:id', getProductById);
router.post('/', uploadFields, handleMulterError, createProduct);
router.put('/:id', uploadFields, handleMulterError, updateProduct);
router.put('/featured/order', updateFeaturedOrder);
router.put('/featured/orders', updateFeaturedOrders);
router.delete('/:id', deleteProduct);

export default router;

