import express from 'express';
import { categoryController } from '../controllers/categoryController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { checkRole } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', categoryController.getCategories);
router.post('/', checkRole(['Admin', 'Manager']), categoryController.createCategory);
router.put('/:id', checkRole(['Admin', 'Manager']), categoryController.updateCategory);
router.delete('/:id', checkRole(['Admin', 'Manager']), categoryController.deleteCategory);

export default router;
