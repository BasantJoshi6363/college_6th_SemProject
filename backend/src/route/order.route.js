import express from 'express';
import { 
  createOrder, 
  getMyOrders, 
  getOrderById,
  getAllOrders, 
  updateOrderToDelivered, 
  deleteOrder,
  verifyEsewaPayment  
} from '../controller/order.controller.js';
import protect, { isAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public route for eSewa verification
router.get('/verify-payment', verifyEsewaPayment);

// Protected routes
router.post('/', protect, createOrder);
router.get('/myorders', protect, getMyOrders);
router.get('/:id', protect, getOrderById);

// Admin routes
router.get('/', protect, isAdmin, getAllOrders);
router.put('/:id/deliver', protect, isAdmin, updateOrderToDelivered);
router.delete('/:id', protect, isAdmin, deleteOrder);

export default router;
