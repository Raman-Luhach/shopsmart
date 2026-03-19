require('dotenv').config();
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const connectDB = require('../src/config/db');

beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('GET /api/health', () => {
    it('should return 200 and status ok', async () => {
        const res = await request(app).get('/api/health');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('status', 'ok');
        expect(res.body).toHaveProperty('message');
        expect(res.body).toHaveProperty('timestamp');
    });
});

describe('GET /api/categories', () => {
    it('should return 200 with categories array', async () => {
        const res = await request(app).get('/api/categories');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('categories');
        expect(Array.isArray(res.body.categories)).toBe(true);
        expect(res.body.categories.length).toBeGreaterThan(0);
    });

    it('each category should have id, name, and icon', async () => {
        const res = await request(app).get('/api/categories');
        const cat = res.body.categories[0];
        expect(cat).toHaveProperty('id');
        expect(cat).toHaveProperty('name');
        expect(cat).toHaveProperty('icon');
    });
});

describe('GET /api/products', () => {
    it('should return 200 with products array', async () => {
        const res = await request(app).get('/api/products');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('products');
        expect(Array.isArray(res.body.products)).toBe(true);
        expect(res.body.total).toBeGreaterThan(0);
    });

    it('should filter products by category', async () => {
        const res = await request(app).get('/api/products?category=Electronics');
        expect(res.statusCode).toEqual(200);
        res.body.products.forEach(p => {
            expect(p.category).toBe('Electronics');
        });
    });

    it('should filter products by search query', async () => {
        const res = await request(app).get('/api/products?search=keyboard');
        expect(res.statusCode).toEqual(200);
        expect(res.body.products.length).toBeGreaterThan(0);
        res.body.products.forEach(p => {
            expect(p.name.toLowerCase()).toContain('keyboard');
        });
    });
});

describe('GET /api/products/:id', () => {
    it('should return a single product', async () => {
        const res = await request(app).get('/api/products/1');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('product');
        expect(res.body.product.id).toBe(1);
    });

    it('should return 404 for a non-existent product', async () => {
        const res = await request(app).get('/api/products/9999');
        expect(res.statusCode).toEqual(404);
        expect(res.body).toHaveProperty('error');
    });
});
