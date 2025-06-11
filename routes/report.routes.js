import express from 'express';
import reportController from '../controllers/report.controller.js';

const router = express.Router();

router.get('/sales', reportController.getSalesReport);
router.get('/dashboard', reportController.getDashboard);

export default router;
