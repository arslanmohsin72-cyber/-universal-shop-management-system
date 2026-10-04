import express from 'express';
import { inventoryController } from '../controllers/inventoryController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { checkRole } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/adjust', checkRole(['Admin', 'Manager']), inventoryController.adjustStock);
router.get('/logs', checkRole(['Admin', 'Manager']), inventoryController.getLogs);

export default router;
