import express from 'express';
import { authController } from '../controllers/authController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register-shop', authController.registerShop);
router.post('/login', authController.login);
router.get('/me', authMiddleware, authController.getMe);

export default router;
