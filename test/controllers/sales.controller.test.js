import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../models/index.js', async () => {
  return {
    default: {
      Sale: { create: vi.fn(), findAll: vi.fn(), findByPk: vi.fn() },
      SaleItem: { create: vi.fn() },
      Product: { findByPk: vi.fn() },
      ProductStock: { findOne: vi.fn() },
      Store: {}
    }
  };
});

import db from '../../models/index.js';
import salesController from '../../controllers/sales.controller.js';
const { createSale, getAllSales, getSaleById } = salesController;

describe('reateSale', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create a sale and return total', async () => {
    const saleMock = { id: 1, total_amount: 0, save: vi.fn() };
    db.Sale.create.mockResolvedValue(saleMock);
    db.Product.findByPk.mockResolvedValueOnce({ id: 1, price: 2.0 });
    db.ProductStock.findOne.mockResolvedValue({ quantity: 10, save: vi.fn() });

    const req = {
      body: {
        store_id: 1,
        items: [{ product_id: 1, quantity: 2 }]
      }
    };
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    };

    await createSale(req, res);

    expect(db.Sale.create).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ sale_id: 1, total: 4 });
  });
});

describe('getAllSales', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return all sales with details', async () => {
    const mockSales = [{ id: 1 }, { id: 2 }];
    db.Sale.findAll.mockResolvedValue(mockSales);

    const req = {};
    const res = {
      json: vi.fn(),
      status: vi.fn().mockReturnThis()
    };

    await getAllSales(req, res);
    expect(db.Sale.findAll).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(mockSales);
  });

  it('should return error', async () => {
    db.Sale.findAll.mockRejectedValue(new Error('fail'));

    const req = {};
    const res = {
      json: vi.fn(),
      status: vi.fn().mockReturnThis()
    };

    await getAllSales(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Error fetching sales' });
  });
});

describe('getSaleById', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return sale by ID with details', async () => {
    const mockSale = { id: 1, store_id: 1, items: [] };
    db.Sale.findByPk.mockResolvedValue(mockSale);

    const req = { params: { id: 1 } };
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    };

    await getSaleById(req, res);

    expect(db.Sale.findByPk).toHaveBeenCalledWith(1, expect.any(Object));
    expect(res.json).toHaveBeenCalledWith(mockSale);
  });

  it('should return 404 if sale is not found', async () => {
    db.Sale.findByPk.mockResolvedValue(null);

    const req = { params: { id: 999 } };
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    };

    await getSaleById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Sale not found' });
  });

  it('should return error', async () => {
    db.Sale.findByPk.mockRejectedValue(new Error('fail'));

    const req = { params: { id: 1 } };
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    };

    await getSaleById(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Error fetching sale' });
  });
});

