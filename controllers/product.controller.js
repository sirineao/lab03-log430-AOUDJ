import db from '../models/index.js';

const { Product, ProductStock, Store, LogisticsStock } = db;

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [
        { model: ProductStock, as: 'stocks', include: { model: Store } },
        { model: LogisticsStock }
      ]
    });
    res.json(products);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ error: 'Error fetching products' });
  }
};

const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByPk(id, {
      include: [
        { model: ProductStock, as: 'stocks', include: Store },
        { model: LogisticsStock }
      ]
    });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    console.error('Error fetching product:', err);
    res.status(500).json({ error: 'Error fetching product' });
  }
};

const getStockByProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const stocks = await ProductStock.findAll({
      where: { product_id: id },
      include: { model: Store }
    });
    const logisticsStock = await LogisticsStock.findOne({ where: { product_id: id } });

    res.json({
      product_id: id,
      stock_per_store: stocks,
      logistics_stock: logisticsStock?.quantity || 0
    });
  } catch (err) {
    console.error('Error fetching stock data:', err);
    res.status(500).json({ error: 'Error fetching stock data' });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, price, category } = req.body;
    const newProduct = await Product.create({ name, price, category });
    res.status(201).json(newProduct);
  } catch (err) {
    console.error('Error creating product:', err);
    res.status(400).json({ error: 'Error creating product' });
  }
};

export default {
  getAllProducts,
  getProductById,
  getStockByProduct,
  createProduct
};
