//import { LogisticsStock, StockRequest, ProductStock, Store, Product } from '../models/index.js';
import db from '../models/index.js';

const { LogisticsStock, StockRequest, ProductStock, Product } = db;

const getLogisticsStock = async (req, res) => {
  try {
    const stock = await LogisticsStock.findAll({ include: Product });
    res.json(stock);
  } catch (err) {
    console.error('Error fetching logistics stock:', err);
    res.status(500).json({ error: 'Error fetching logistics stock' });
  }
};

const createStockRequest = async (req, res) => {
  const { store_id, product_id, quantity } = req.body;
  try {
    const request = await StockRequest.create({
      store_id,
      product_id,
      quantity,
      status: 'pending'
    });
    res.status(201).json(request);
  } catch (err) {
    console.error('Error creating stock request:', err);
    res.status(400).json({ error: 'Error creating stock request' });
  }
};

const processStockRequest = async (req, res) => {
  const requestId = req.params.id;
  try {
    const request = await StockRequest.findByPk(requestId);
    if (!request) return res.status(404).json({ error: 'Request not found' });
    if (request.status !== 'pending') return res.status(400).json({ error: 'Request already processed' });

    const logisticsStock = await LogisticsStock.findOne({
      where: { product_id: request.product_id }
    });

    if (!logisticsStock || logisticsStock.quantity < request.quantity) {
      return res.status(400).json({ error: 'Insufficient logistics stock' });
    }

    logisticsStock.quantity -= request.quantity;
    await logisticsStock.save();

    const [storeStock] = await ProductStock.findOrCreate({
      where: { product_id: request.product_id, store_id: request.store_id },
      defaults: { quantity: 0 }
    });

    storeStock.quantity += request.quantity;
    await storeStock.save();

    request.status = 'completed';
    await request.save();

    res.json({ message: 'Request processed', request });
  } catch (err) {
    console.error('Error processing stock request:', err);
    res.status(500).json({ error: 'Error processing request' });
  }
};

export default {
  getLogisticsStock,
  createStockRequest,
  processStockRequest
};
