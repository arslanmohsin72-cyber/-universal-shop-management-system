import express from 'express';
import { productController } from '../controllers/productController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { checkRole } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', productController.getProducts);
router.get('/search-code', productController.searchBarcodeOrSku);
router.get('/:id', productController.getProductById);

router.post('/', checkRole(['Admin', 'Manager']), productController.createProduct);
router.put('/:id', checkRole(['Admin', 'Manager']), productController.updateProduct);
router.delete('/:id', checkRole(['Admin', 'Manager']), productController.deleteProduct);

export default router;
