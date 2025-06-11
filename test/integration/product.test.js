import request from 'supertest';
import app from '../../app.js';
import db from '../../models/index.js';

beforeAll(async () => {
  await db.sequelize.sync();
});

describe('Products integration tests', () => {
  it('GET /api/products', async () => {
    const res = await request(app).get('/api/products');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('POST /api/products', async () => {
    const newProduct = {
      name: 'Banana',
      price: 9.99,
      category: 'Fruits'
    };

    const res = await request(app).post('/api/products').send(newProduct);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe('Banana');
  });

  it('GET /api/products/:id', async () => {
    const product = await db.Product.create({ name: 'Apple', price: 1.99, category: 'Fruits' });

    const res = await request(app).get(`/api/products/${product.id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id', product.id);
    expect(res.body.name).toBe('Apple');
  });

  it('GET /api/products/:id/stock', async () => {
    const product = await db.Product.create({ name: 'Milk', price: 3.5 });
    const store = await db.Store.create({ name: 'Store A', address: '123 St' });

    await db.ProductStock.create({ product_id: product.id, store_id: store.id, quantity: 15 });
    await db.LogisticsStock.create({ product_id: product.id, quantity: 200 });

    const res = await request(app).get(`/api/products/${product.id}/stock`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('product_id', String(product.id));
    expect(Array.isArray(res.body.stock_per_store)).toBe(true);
    expect(res.body.logistics_stock).toBeGreaterThanOrEqual(0);
  });
});
