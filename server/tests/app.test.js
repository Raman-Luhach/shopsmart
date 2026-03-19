require('dotenv').config();
const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../src/app');
const Product = require('../src/models/Product');
const Category = require('../src/models/Category');

let mongoServer;

beforeAll(async () => {
  // Use in-memory DB instead of cloud connection for pure isolated testing
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  // Seed mock data for tests
  await Category.insertMany([
    { id: 1, name: 'Electronics', icon: '💻' },
    { id: 2, name: 'Books', icon: '📚' },
  ]);

  await Product.insertMany([
    { id: 1, name: 'Keyboard', category: 'Electronics', price: 100, image: 'kb' },
    { id: 2, name: 'Mouse', category: 'Electronics', price: 50, image: 'ms' },
    { id: 3, name: 'Novel', category: 'Books', price: 15, image: 'nvl' },
  ]);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('GET /api/health', () => {
  it('should return 200 and status ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('status', 'ok');
  });
});

describe('GET /api/categories', () => {
  it('should return 200 with categories array', async () => {
    const res = await request(app).get('/api/categories');
    expect(res.statusCode).toEqual(200);
    expect(res.body.categories.length).toBe(2);
    expect(res.body.categories[0].name).toBe('Electronics');
  });
});

describe('GET /api/products', () => {
  it('should return 200 with all products', async () => {
    const res = await request(app).get('/api/products');
    expect(res.statusCode).toEqual(200);
    expect(res.body.products.length).toBe(3);
  });

  it('should filter products by category', async () => {
    const res = await request(app).get('/api/products?category=Electronics');
    expect(res.statusCode).toEqual(200);
    expect(res.body.products.length).toBe(2);
  });

  it('should filter products by search query', async () => {
    const res = await request(app).get('/api/products?search=novel');
    expect(res.statusCode).toEqual(200);
    expect(res.body.products.length).toBe(1);
    expect(res.body.products[0].name).toBe('Novel');
  });
});

describe('GET /api/products/:id', () => {
  it('should return a single product', async () => {
    const res = await request(app).get('/api/products/1');
    expect(res.statusCode).toEqual(200);
    expect(res.body.product.name).toBe('Keyboard');
  });

  it('should return 404 for a non-existent product', async () => {
    const res = await request(app).get('/api/products/9999');
    expect(res.statusCode).toEqual(404);
  });
});
