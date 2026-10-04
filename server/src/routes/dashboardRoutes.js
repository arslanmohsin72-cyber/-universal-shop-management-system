import express from 'express';
import { dashboardController } from '../controllers/dashboardController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/summary', dashboardController.getSummary);

export default router;
