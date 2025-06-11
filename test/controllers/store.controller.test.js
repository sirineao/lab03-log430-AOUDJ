import { describe, it, expect, vi, beforeEach } from 'vitest';
import storeController from '../../controllers/store.controller.js';
const { getAllStores, getStoreById, getStoreStock } = storeController;

vi.mock('../../models/index.js', async () => ({
  default: {
    Store: {
      findAll: vi.fn(),
      findByPk: vi.fn()
    },
    ProductStock: {
      findAll: vi.fn()
    },
    Product: {}
  }
}));

import db from '../../models/index.js';

beforeEach(() => {
  vi.clearAllMocks();
});

describe('getAllStores', () => {
  it('should return all stores', async () => {
    const mockStores = [{ id: 1 }, { id: 2 }];
    db.Store.findAll.mockResolvedValue(mockStores);

    const req = {};
    const res = { json: vi.fn(), status: vi.fn().mockReturnThis() };

    await getAllStores(req, res);

    expect(db.Store.findAll).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(mockStores);
  });

  it('should return error', async () => {
    db.Store.findAll.mockRejectedValue(new Error('fail'));

    const req = {};
    const res = { json: vi.fn(), status: vi.fn().mockReturnThis() };

    await getAllStores(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Error fetching stores' });
  });
});

describe('getStoreById', () => {
  it('should return the store by id', async () => {
    const mockStore = { id: 1 };
    db.Store.findByPk.mockResolvedValue(mockStore);

    const req = { params: { id: 1 } };
    const res = { json: vi.fn(), status: vi.fn().mockReturnThis() };

    await getStoreById(req, res);

    expect(db.Store.findByPk).toHaveBeenCalledWith(1);
    expect(res.json).toHaveBeenCalledWith(mockStore);
  });

  it('should return 404 if store not found', async () => {
    db.Store.findByPk.mockResolvedValue(null);

    const req = { params: { id: 999 } };
    const res = { json: vi.fn(), status: vi.fn().mockReturnThis() };

    await getStoreById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Store not found' });
  });

  it('should return error', async () => {
    db.Store.findByPk.mockRejectedValue(new Error('fail'));

    const req = { params: { id: 1 } };
    const res = { json: vi.fn(), status: vi.fn().mockReturnThis() };

    await getStoreById(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Error fetching store' });
  });
});

describe('getStoreStok', () => {
  it('should return stock for a given store', async () => {
    const mockStock = [{ product_id: 1, quantity: 10 }];
    db.ProductStock.findAll.mockResolvedValue(mockStock);

    const req = { params: { id: 1 } };
    const res = { json: vi.fn(), status: vi.fn().mockReturnThis() };

    await getStoreStock(req, res);

    expect(db.ProductStock.findAll).toHaveBeenCalledWith({
      where: { store_id: 1 },
      include: db.Product
    });
    expect(res.json).toHaveBeenCalledWith(mockStock);
  });

  it('should return error', async () => {
    db.ProductStock.findAll.mockRejectedValue(new Error('fail'));

    const req = { params: { id: 1 } };
    const res = { json: vi.fn(), status: vi.fn().mockReturnThis() };

    await getStoreStock(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Error fetching stock for store' });
  });
});
