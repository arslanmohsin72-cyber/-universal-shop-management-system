import express from 'express';
import { purchaseController } from '../controllers/purchaseController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { checkRole } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(authMiddleware);
router.use(checkRole(['Admin', 'Manager']));

router.get('/', purchaseController.getPurchases);
router.get('/:id', purchaseController.getPurchaseById);
router.post('/', purchaseController.createPurchase);

export default router;
