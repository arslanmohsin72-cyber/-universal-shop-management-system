import express from 'express';
import { returnController } from '../controllers/returnController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', returnController.getReturns);
router.get('/:id', returnController.getReturnById);
router.post('/sale', returnController.processSaleReturn);
router.post('/purchase', returnController.processPurchaseReturn);

export default router;
