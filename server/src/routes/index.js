import express from 'express';
import authRoutes from './authRoutes.js';
import shopRoutes from './shopRoutes.js';
import userRoutes from './userRoutes.js';
import categoryRoutes from './categoryRoutes.js';
import productRoutes from './productRoutes.js';
import inventoryRoutes from './inventoryRoutes.js';
import customerRoutes from './customerRoutes.js';
import supplierRoutes from './supplierRoutes.js';
import purchaseRoutes from './purchaseRoutes.js';
import saleRoutes from './saleRoutes.js';
import returnRoutes from './returnRoutes.js';
import expenseRoutes from './expenseRoutes.js';
import paymentRoutes from './paymentRoutes.js';
import reportRoutes from './reportRoutes.js';
import dashboardRoutes from './dashboardRoutes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/shops', shopRoutes);
router.use('/users', userRoutes);
router.use('/categories', categoryRoutes);
router.use('/products', productRoutes);
router.use('/inventory', inventoryRoutes);
router.use('/customers', customerRoutes);
router.use('/suppliers', supplierRoutes);
router.use('/purchases', purchaseRoutes);
router.use('/sales', saleRoutes);
router.use('/returns', returnRoutes);
router.use('/expenses', expenseRoutes);
router.use('/payments', paymentRoutes);
router.use('/reports', reportRoutes);
router.use('/dashboard', dashboardRoutes);

export default router;
