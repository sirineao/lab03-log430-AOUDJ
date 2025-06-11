import { Sequelize } from 'sequelize';
import db from '../models/index.js'; 

const { Sale, SaleItem, Product, Store, ProductStock } = db;

const getSalesReport = async (req, res) => {
  try {
    const salesByStore = await Sale.findAll({
      attributes: [
        'store_id',
        [Sequelize.fn('SUM', Sequelize.col('price')), 'total_sales']
      ],
      group: ['store_id'],
      include: { model: Store }
    });

    const topProducts = await SaleItem.findAll({
      attributes: [
        'product_id',
        [Sequelize.fn('SUM', Sequelize.col('quantity')), 'total_sold']
      ],
      group: ['product_id'],
      order: [[Sequelize.literal('total_sold'), 'DESC']],
      limit: 5,
      include: { model: Product }
    });

    const stockByStore = await ProductStock.findAll({
      include: [Product, Store]
    });

    res.json({
      salesByStore,
      topProducts,
      stockByStore
    });
  } catch (err) {
    console.error('Error generating sales report:', err);
    res.status(500).json({ error: 'Error generating sales report' });
  }
};

const getDashboard = async (req, res) => {
  try {
    const revenue = await Sale.findAll({
      attributes: [
        'store_id',
        [Sequelize.fn('SUM', Sequelize.col('price')), 'revenue']
      ],
      group: ['store_id'],
      include: { model: Store }
    });

    const lowStock = await ProductStock.findAll({
      where: { quantity: { [Sequelize.Op.lt]: 5 } },
      include: [Product, Store]
    });

    const overStock = await ProductStock.findAll({
      where: { quantity: { [Sequelize.Op.gt]: 100 } },
      include: [Product, Store]
    });

    res.json({
      revenue,
      lowStock,
      overStock
    });
  } catch (err) {
    console.error('Error generating dashboard data:', err);
    res.status(500).json({ error: 'Error generating dashboard data' });
  }
};

export default {
  getSalesReport,
  getDashboard
};
