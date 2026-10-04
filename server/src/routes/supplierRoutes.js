import express from 'express';
import { supplierController } from '../controllers/supplierController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { checkRole } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(authMiddleware);
router.use(checkRole(['Admin', 'Manager']));

router.get('/', supplierController.getSuppliers);
router.get('/:id', supplierController.getSupplierById);
router.post('/', supplierController.createSupplier);
router.put('/:id', supplierController.updateSupplier);
router.delete('/:id', supplierController.deleteSupplier);

export default router;
