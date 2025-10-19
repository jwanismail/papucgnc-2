import express from 'express';
import {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  updateBulkOrderStatus,
  deleteOrder
} from '../controllers/orderController.js';

const router = express.Router();

// Sipariş oluştur
router.post('/', createOrder);

// Tüm siparişleri getir (Admin)
router.get('/', getAllOrders);

// Sipariş detayını getir
router.get('/:id', getOrderById);

// Sipariş durumunu güncelle
router.put('/:id/status', updateOrderStatus);

// Toplu sipariş durumunu güncelle
router.put('/bulk/status', updateBulkOrderStatus);

// Sipariş sil
router.delete('/:id', deleteOrder);

export default router;
