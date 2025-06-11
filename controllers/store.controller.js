//import { Store, ProductStock, Product } from '../models/index.js';
import db from '../models/index.js';
import Sale from '../models/Sale.js';

const { Store, ProductStock, Product } = db;

const getAllStores = async (req, res) => {
  try {
    const stores = await Store.findAll();
    res.json(stores);
  } catch (err) {
    console.error('Error fetching stores:', err);
    res.status(500).json({ error: 'Error fetching stores' });
  }
};

const getStoreById = async (req, res) => {
  try {
    const store = await Store.findByPk(req.params.id);
    if (!store) return res.status(404).json({ error: 'Store not found' });
    res.json(store);
  } catch (err) {
    console.error('Error fetching store:', err);
    res.status(500).json({ error: 'Error fetching store' });
  }
};

const getStoreStock = async (req, res) => {
  try {
    const storeId = req.params.id;
    const stock = await ProductStock.findAll({
      where: { store_id: storeId },
      include: Product
    });
    res.json(stock);
  } catch (err) {
    console.error('Error fetching stock for store:', err);
    res.status(500).json({ error: 'Error fetching stock for store' });
  }
};

const getStoreDashboard = async (req, res) => {
  const storeId = req.params.id;
  try {
    const revenu = await Sale.sum('price', {
      where: { store_id: storeId }
    });
    const stock = await ProductStock.findAll({
      where: { store_id: storeId },
      include: Product
    });

    const lowStock = stock.filter(item => item.quantity < 5);
    const overStock = stock.filter(item => item.quantity > 100);

    res.json({
      storeId: storeId,
      revenue: revenu || 0,
      lowStock: lowStock,
      overStock: overStock});
  } catch (err) {
    console.error('Error fetching store dashboard:', err);
    res.status(500).json({ error: 'Error fetching store dashboard' });
  }
};

export default {
  getAllStores,
  getStoreById,
  getStoreStock,
  getStoreDashboard
};
