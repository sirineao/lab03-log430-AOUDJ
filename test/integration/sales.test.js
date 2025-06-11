import request from 'supertest';
import { describe, it, expect, beforeAll } from 'vitest';
import app from '../../app.js';
import db from '../../models/index.js';

beforeAll(async () => {
  await db.sequelize.sync();
});

describe('Sales integration tests', () => {
  it('GET /api/sales', async () => {
    const res = await request(app).get('/api/sales');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /api/sales/:id', async () => {
    const payload = {
      store_id: 1,
      items: [
        { product_id: 1, quantity: 1, price: 10.00 },
        { product_id: 2, quantity: 1, price: 20.00 }
      ]
    };

    const res = await request(app).post('/api/sales').send(payload);
    const saleId = res.body.sale_id;

    const res2 = await request(app).get(`/api/sales/${saleId}`);
    expect(res2.statusCode).toBe(200);
    expect(res2.body).toHaveProperty('id', saleId);
  });

  it('POST /api/sales', async () => {
    const payload = {
      store_id: 1,
      items: [
        { product_id: 1, quantity: 1, price: 10.00 },
        { product_id: 2, quantity: 1, price: 20.00 }
      ]
    };

    const res = await request(app).post('/api/sales').send(payload);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('sale_id');
    expect(res.body).toHaveProperty('total');
  });

  it('GET /api/sales/1234 invalid', async () => {
    const res = await request(app).get('/api/sales/1234');
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error', 'Sale not found');
  });
});
