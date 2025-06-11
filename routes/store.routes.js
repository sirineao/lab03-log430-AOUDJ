import express from 'express';
import  storeController  from '../controllers/store.controller.js';

const router = express.Router();

router.get('/', storeController.getAllStores);
router.get('/:id', storeController.getStoreById);
router.get('/:id/stock', storeController.getStoreStock);

export default router;
