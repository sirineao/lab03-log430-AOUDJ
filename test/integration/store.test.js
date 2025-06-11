import request from 'supertest';
import { describe, it, expect, beforeAll } from 'vitest';
import app from '../../app.js';
import db from '../../models/index.js';

beforeAll(async () => {
  await db.sequelize.sync();
});

describe('Stores integration tests', () => {
  it('GET /api/stores', async () => {
    const res = await request(app).get('/api/stores');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /api/stores/:id', async () => {
    const res = await request(app).get('/api/stores/1');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id', 1);
  });

  it('GET /api/stores/:id/stock', async () => {
    const res = await request(app).get('/api/stores/1/stock');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    if (res.body.length > 0) {
      expect(res.body[0]).toHaveProperty('product_id');
      expect(res.body[0]).toHaveProperty('quantity');
    }
  });

  it('GET /api/stores/1234 invalid', async () => {
    const res = await request(app).get('/api/stores/1234');
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error', 'Store not found');
  });
});