import express from 'express';
import { shopController } from '../controllers/shopController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { checkRole } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/settings', shopController.getShop);
router.put('/settings', checkRole(['Admin']), shopController.updateShop);

export default router;
