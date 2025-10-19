import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import productRoutes from './routes/productRoutes.js';
import campaignRoutes from './routes/campaignRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

dotenv.config();

// Uploads klasörünü oluştur (Railway için)
const uploadsDir = 'uploads';
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('📁 Uploads klasörü oluşturuldu');
}

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://papucgnc.com', 'https://www.papucgnc.com']
    : '*',
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/products', productRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/orders', orderRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Papucgnc API çalışıyor' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Bir hata oluştu', 
    message: process.env.NODE_ENV === 'development' ? err.message : undefined 
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server ${PORT} portunda çalışıyor`);
});

