import express from 'express';
import { createOrder, getMyOrders, getAllOrders, updateOrderStatus } from '../controllers/orderController.js';
import { protect } from '../middleware/auth.js';
import { adminOnly } from '../middleware/adminOnly.js';

const router = express.Router();

// Замовлення користувача
router.post('/', protect, createOrder);
router.get('/my', protect, getMyOrders);

// Адмін-роути (ВАЖЛИВО: /my має бути перед /:id)
router.get('/', protect, adminOnly, getAllOrders);
router.put('/:id/status', protect, adminOnly, updateOrderStatus);

export default router;
