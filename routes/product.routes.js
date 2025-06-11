import express from 'express';
import productController from '../controllers/product.controller.js';

const router = express.Router();


router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.get('/:id/stock', productController.getStockByProduct);
router.post('/', productController.createProduct);

export default router;
