import express from 'express';
import { reportController } from '../controllers/reportController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { checkRole } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(authMiddleware);
router.use(checkRole(['Admin', 'Manager']));

router.get('/sales', reportController.getSalesReport);
router.get('/purchases', reportController.getPurchaseReport);
router.get('/inventory', reportController.getInventoryReport);
router.get('/profit-loss', reportController.getProfitLossReport);

export default router;
