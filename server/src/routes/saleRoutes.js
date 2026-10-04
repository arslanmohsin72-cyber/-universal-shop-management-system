import express from 'express';
import { saleController } from '../controllers/saleController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', saleController.getSales);
router.get('/invoice/:invoiceNumber', saleController.getSaleByInvoiceNumber);
router.get('/:id', saleController.getSaleById);
router.post('/', saleController.processSale);

export default router;
