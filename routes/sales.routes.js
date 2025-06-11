import express from 'express';
import salesController from '../controllers/sales.controller.js';

const router = express.Router();

/**
 * @swagger
 * /api/sales:
 *  get:
 *      summary: Retrieve all sales
 *  responses:
 *     '200':
 *      description: A list of sales
 *      content:
 *        application/json:
 *         example:
 *          - id: 1
 *            productId: 101
 *            quantity: 2
 * 
 */
router.get('/', salesController.getAllSales);
router.get('/:id', salesController.getSaleById);
router.post('/', salesController.createSale);

export default router;
