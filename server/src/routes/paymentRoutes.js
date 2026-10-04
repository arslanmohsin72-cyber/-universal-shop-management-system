import express from 'express';
import { paymentController } from '../controllers/paymentController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', paymentController.getPayments);
router.post('/customer', paymentController.recordCustomerPayment);
router.post('/supplier', paymentController.recordSupplierPayment);

export default router;
