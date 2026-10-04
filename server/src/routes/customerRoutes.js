import express from 'express';
import { customerController } from '../controllers/customerController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', customerController.getCustomers);
router.get('/:id', customerController.getCustomerById);
router.post('/', customerController.createCustomer);
router.put('/:id', customerController.updateCustomer);
router.delete('/:id', customerController.deleteCustomer);

export default router;
