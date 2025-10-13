import express from 'express';
import multer from 'multer';
import path from 'path';
import { 
  getAllProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct 
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

// Multer konfigürasyonu - resim yükleme
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'product-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { 
    fileSize: 5 * 1024 * 1024, // 5MB limit per file
    files: 50 // Maximum 50 files (ana resimler + renk resimleri)
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Sadece resim dosyaları yüklenebilir!'));
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
router.get('/:id', getProductById);
router.post('/', uploadFields, handleMulterError, createProduct);
router.put('/:id', uploadFields, handleMulterError, updateProduct);
router.delete('/:id', deleteProduct);

export default router;

