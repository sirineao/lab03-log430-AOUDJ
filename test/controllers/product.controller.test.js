import { describe, it, expect, vi, beforeEach } from 'vitest';
import productController from '../../controllers/product.controller.js';
const {
  getAllProducts,
  getProductById,
  getStockByProduct,
  createProduct
} = productController;

vi.mock('../../models/index.js', async () => ({
  default: {
    Product: {
      findAll: vi.fn(),
      findByPk: vi.fn(),
      create: vi.fn()
    },
    ProductStock: {
      findAll: vi.fn()
    },
    LogisticsStock: {
      findOne: vi.fn()
    },
    Store: {}
  }
}));

import db from '../../models/index.js';

beforeEach(() => {
  vi.clearAllMocks();
});

describe('getAllProducts', () => {
  it('should return all products with stock and logistics', async () => {
    const products = [{ id: 1 }, { id: 2 }];
    db.Product.findAll.mockResolvedValue(products);

    const req = {};
    const res = { json: vi.fn(), status: vi.fn().mockReturnThis() };

    await getAllProducts(req, res);
    expect(db.Product.findAll).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(products);
  });

  it('should return error', async () => {
    db.Product.findAll.mockRejectedValue(new Error('fail'));
    const req = {};
    const res = { json: vi.fn(), status: vi.fn().mockReturnThis() };

    await getAllProducts(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Error fetching products' });
  });
});

describe('getProductById', () => {
  it('should return a product by id', async () => {
    const product = { id: 1 };
    db.Product.findByPk.mockResolvedValue(product);

    const req = { params: { id: 1 } };
    const res = { json: vi.fn(), status: vi.fn().mockReturnThis() };

    await getProductById(req, res);
    expect(db.Product.findByPk).toHaveBeenCalledWith(1, expect.any(Object));
    expect(res.json).toHaveBeenCalledWith(product);
  });

  it('should return 404 if product not found', async () => {
    db.Product.findByPk.mockResolvedValue(null);

    const req = { params: { id: 999 } };
    const res = { json: vi.fn(), status: vi.fn().mockReturnThis() };

    await getProductById(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Product not found' });
  });

  it('should return error', async () => {
    db.Product.findByPk.mockRejectedValue(new Error('fail'));

    const req = { params: { id: 1 } };
    const res = { json: vi.fn(), status: vi.fn().mockReturnThis() };

    await getProductById(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Error fetching product' });
  });
});

describe('getStockByProduct', () => {
  it('should return stock by store and logistics', async () => {
    db.ProductStock.findAll.mockResolvedValue([{ store_id: 1 }]);
    db.LogisticsStock.findOne.mockResolvedValue({ quantity: 50 });

    const req = { params: { id: 1 } };
    const res = { json: vi.fn(), status: vi.fn().mockReturnThis() };

    await getStockByProduct(req, res);
    expect(res.json).toHaveBeenCalledWith({
      product_id: 1,
      stock_per_store: [{ store_id: 1 }],
      logistics_stock: 50
    });
  });

  it('should return 0 logistics stock if not found', async () => {
    db.ProductStock.findAll.mockResolvedValue([]);
    db.LogisticsStock.findOne.mockResolvedValue(null);

    const req = { params: { id: 2 } };
    const res = { json: vi.fn(), status: vi.fn().mockReturnThis() };

    await getStockByProduct(req, res);
    expect(res.json).toHaveBeenCalledWith({
      product_id: 2,
      stock_per_store: [],
      logistics_stock: 0
    });
  });

  it('should return error', async () => {
    db.ProductStock.findAll.mockRejectedValue(new Error('fail'));

    const req = { params: { id: 3 } };
    const res = { json: vi.fn(), status: vi.fn().mockReturnThis() };

    await getStockByProduct(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Error fetching stock data' });
  });
});

describe('createProduct', () => {
  it('should create and return a product', async () => {
    const newProduct = { id: 1, name: 'Apple' };
    db.Product.create.mockResolvedValue(newProduct);

    const req = { body: { name: 'Apple', price: 1.5, category: 'Fruits' } };
    const res = { json: vi.fn(), status: vi.fn().mockReturnThis() };

    await createProduct(req, res);
    expect(db.Product.create).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(newProduct);
  });

  it('should return 400 on error', async () => {
    db.Product.create.mockRejectedValue(new Error('fail'));

    const req = { body: { name: '', price: null, category: 'Fruits' } };
    const res = { json: vi.fn(), status: vi.fn().mockReturnThis() };

    await createProduct(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Error creating product' });
  });
});
