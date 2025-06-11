import { describe, it, expect, vi, beforeEach } from 'vitest';
import logisticsController from '../../controllers/logistics.controller.js';
const {
  getLogisticsStock,
  createStockRequest,
  processStockRequest
} = logisticsController;

vi.mock('../../models/index.js', async () => ({
  default: {
    LogisticsStock: {
      findAll: vi.fn(),
      findOne: vi.fn()
    },
    StockRequest: {
      create: vi.fn(),
      findByPk: vi.fn()
    },
    ProductStock: {
      findOrCreate: vi.fn()
    },
    Product: {},
    Store: {}
  }
}));

import db from '../../models/index.js';

beforeEach(() => {
  vi.clearAllMocks();
});

describe('getLogisticsStock()', () => {
  it('should return logistics stock with products', async () => {
    const mockData = [{ product_id: 1, quantity: 100 }];
    db.LogisticsStock.findAll.mockResolvedValue(mockData);

    const req = {};
    const res = { json: vi.fn(), status: vi.fn().mockReturnThis() };

    await getLogisticsStock(req, res);

    expect(db.LogisticsStock.findAll).toHaveBeenCalledWith({ include: db.Product });
    expect(res.json).toHaveBeenCalledWith(mockData);
  });

  it('should return error', async () => {
    db.LogisticsStock.findAll.mockRejectedValue(new Error('fail'));

    const req = {};
    const res = { json: vi.fn(), status: vi.fn().mockReturnThis() };

    await getLogisticsStock(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Error fetching logistics stock' });
  });
});

describe('createStockRequest()', () => {
  it('should create a new stock request', async () => {
    const mockRequest = { id: 1 };
    db.StockRequest.create.mockResolvedValue(mockRequest);

    const req = {
      body: {
        store_id: 1,
        product_id: 2,
        quantity: 20
      }
    };
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };

    await createStockRequest(req, res);

    expect(db.StockRequest.create).toHaveBeenCalledWith({
      store_id: 1,
      product_id: 2,
      quantity: 20,
      status: 'pending'
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(mockRequest);
  });

  it('should return error', async () => {
    db.StockRequest.create.mockRejectedValue(new Error('fail'));

    const req = { body: {} };
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };

    await createStockRequest(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Error creating stock request' });
  });
});

describe('processStockRequest', () => {
  it('should process a valid pending request', async () => {
    const request = {
      id: 1,
      store_id: 1,
      product_id: 2,
      quantity: 10,
      status: 'pending',
      save: vi.fn()
    };

    const logisticsStock = {
      quantity: 50,
      save: vi.fn()
    };

    const productStock = [
      { quantity: 5, save: vi.fn() },
      false
    ];

    db.StockRequest.findByPk.mockResolvedValue(request);
    db.LogisticsStock.findOne.mockResolvedValue(logisticsStock);
    db.ProductStock.findOrCreate.mockResolvedValue(productStock);

    const req = { params: { id: 1 } };
    const res = { json: vi.fn(), status: vi.fn().mockReturnThis() };

    await processStockRequest(req, res);

    expect(logisticsStock.save).toHaveBeenCalled();
    expect(productStock[0].save).toHaveBeenCalled();
    expect(request.save).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({ message: 'Request processed', request });
  });

  it('should return 404', async () => {
    db.StockRequest.findByPk.mockResolvedValue(null);

    const req = { params: { id: 999 } };
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };

    await processStockRequest(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Request not found' });
  });

  it('should return 400 if request is not pending', async () => {
    const request = { status: 'completed' };
    db.StockRequest.findByPk.mockResolvedValue(request);

    const req = { params: { id: 1 } };
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };

    await processStockRequest(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Request already processed' });
  });

  it('should return 400 if logistics stock is insufficient', async () => {
    const request = { product_id: 2, quantity: 100, status: 'pending' };
    db.StockRequest.findByPk.mockResolvedValue(request);
    db.LogisticsStock.findOne.mockResolvedValue({ quantity: 50 });

    const req = { params: { id: 1 } };
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };

    await processStockRequest(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Insufficient logistics stock' });
  });

  it('should return error', async () => {
    db.StockRequest.findByPk.mockRejectedValue(new Error('fail'));

    const req = { params: { id: 1 } };
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };

    await processStockRequest(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Error processing request' });
  });
});
