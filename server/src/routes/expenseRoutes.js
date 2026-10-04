import express from 'express';
import { expenseController } from '../controllers/expenseController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { checkRole } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(authMiddleware);
router.use(checkRole(['Admin', 'Manager']));

router.get('/', expenseController.getExpenses);
router.post('/', expenseController.createExpense);
router.put('/:id', expenseController.updateExpense);
router.delete('/:id', expenseController.deleteExpense);

export default router;
