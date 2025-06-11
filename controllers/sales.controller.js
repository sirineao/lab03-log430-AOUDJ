//import { Sale, SaleItem, Product, Store, ProductStock } from '../models/index.js';
import db from '../models/index.js';

const { Sale, SaleItem, Product, Store, ProductStock } = db;

const getAllSales = async (req, res) => {
  try {
    const sales = await Sale.findAll({
      include: [
        { model: Store },
        { model: SaleItem, as: 'items', include: Product }
      ]
    });
    res.json(sales);
  } catch (err) {
    console.error('Error fetching sales:', err);
    res.status(500).json({ error: 'Error fetching sales' });
  }
};

const getSaleById = async (req, res) => {
  try {
    const sale = await Sale.findByPk(req.params.id, {
      include: [
        { model: Store },
        { model: SaleItem, as: 'items', include: Product }
      ]
    });
    if (!sale) return res.status(404).json({ error: 'Sale not found' });
    res.json(sale);
  } catch (err) {
    console.error('Error fetching sale:', err);
    res.status(500).json({ error: 'Error fetching sale' });
  }
};

const createSale = async (req, res) => {
  const { store_id, items } = req.body;

  try {
    let total = 0;
    const sale = await Sale.create({ store_id, total_amount: 0 });

    for (const item of items) {
      const product = await Product.findByPk(item.product_id);
      if (!product) continue;

      const subtotal = product.price * item.quantity;
      total += subtotal;

      await SaleItem.create({
        sale_id: sale.id,
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: product.price,
        subtotal
      });

      const stock = await ProductStock.findOne({
        where: { product_id: item.product_id, store_id }
      });

      if (stock) {
        stock.quantity -= item.quantity;
        await stock.save();
      }
    }

    sale.total_amount = total;
    await sale.save();

    res.status(201).json({ sale_id: sale.id, total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error creating sale' });
  }
};

export default {
  getAllSales,
  getSaleById,
  createSale
};
