import { describe, it, expect, vi, beforeEach } from 'vitest';
import reportController from '../../controllers/report.controller.js';
const { getSalesReport, getDashboard } = reportController;

vi.mock('../../models/index.js', async () => ({
  default: {
    Sale: {
      findAll: vi.fn()
    },
    SaleItem: {
      findAll: vi.fn()
    },
    ProductStock: {
      findAll: vi.fn()
    },
    Store: {},
    Product: {}
  }
}));

import db from '../../models/index.js';

beforeEach(() => {
  vi.clearAllMocks();
});

describe('getSalesReport', () => {
  it('should return sales by store, top products, and stock by store', async () => {
    const sales = [{ store_id: 1, total_sales: 100 }];
    const topProducts = [{ product_id: 1, total_sold: 20 }];
    const stockByStore = [{ product_id: 1, store_id: 1, quantity: 15 }];

    db.Sale.findAll.mockResolvedValue(sales);
    db.SaleItem.findAll.mockResolvedValue(topProducts);
    db.ProductStock.findAll.mockResolvedValue(stockByStore);

    const req = {};
    const res = { json: vi.fn(), status: vi.fn().mockReturnThis() };

    await getSalesReport(req, res);

    expect(db.Sale.findAll).toHaveBeenCalled();
    expect(db.SaleItem.findAll).toHaveBeenCalled();
    expect(db.ProductStock.findAll).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({
      salesByStore: sales,
      topProducts,
      stockByStore
    });
  });

  it('should return error', async () => {
    db.Sale.findAll.mockRejectedValue(new Error('fail'));

    const req = {};
    const res = { json: vi.fn(), status: vi.fn().mockReturnThis() };

    await getSalesReport(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Error generating sales report' });
  });
});

describe('getDashboard', () => {
  it('should return revenue, low stock, and over stock', async () => {
    const revenue = [{ store_id: 1, revenue: 100 }];
    const lowStock = [{ product_id: 1, quantity: 2 }];
    const overStock = [{ product_id: 2, quantity: 150 }];

    db.Sale.findAll.mockResolvedValue(revenue);
    db.ProductStock.findAll
      .mockResolvedValueOnce(lowStock) 
      .mockResolvedValueOnce(overStock); 

    const req = {};
    const res = { json: vi.fn(), status: vi.fn().mockReturnThis() };

    await getDashboard(req, res);

    expect(db.Sale.findAll).toHaveBeenCalled();
    expect(db.ProductStock.findAll).toHaveBeenCalledTimes(2);
    expect(res.json).toHaveBeenCalledWith({
      revenue,
      lowStock,
      overStock
    });
  });

  it('should return error', async () => {
    db.Sale.findAll.mockRejectedValue(new Error('fail'));

    const req = {};
    const res = { json: vi.fn(), status: vi.fn().mockReturnThis() };

    await getDashboard(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Error generating dashboard data' });
  });
});
