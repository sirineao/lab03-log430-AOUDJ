import express from 'express';
import logisticsController from '../controllers/logistics.controller.js';

const router = express.Router();

router.get('/stock', logisticsController.getLogisticsStock);
router.post('/request', logisticsController.createStockRequest);
router.post('/process/:id', logisticsController.processStockRequest);

export default router;