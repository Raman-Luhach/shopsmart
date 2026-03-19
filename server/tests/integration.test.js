require('dotenv').config();
const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../src/app');
const Product = require('../src/models/Product');
const Category = require('../src/models/Category');

let mongoServer;

beforeAll(async () => {
  // Start a MongoDB Memory Server for safe Integration Testing
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  // Clean DB before each integration test
  await Product.deleteMany({});
  await Category.deleteMany({});
});

describe('API + DB Integration Tests', () => {
  it('should fetch data from DB through the API successfully', async () => {
    // 1. Direct DB Interaction (Simulating Database state)
    await Category.create({ id: 10, name: 'Integration Tools', icon: '⚙️' });
    await Product.create({ 
      id: 999, 
      name: 'Super Integration Tester', 
      category: 'Integration Tools', 
      price: 49.99, 
      image: 'tester-img' 
    });

    // 2. API Interaction (Testing the Express -> Mongoose flow)
    const res = await request(app).get('/api/products?category=Integration Tools');
    
    // 3. Validation
    expect(res.statusCode).toEqual(200);
    expect(res.body.products).toBeDefined();
    expect(res.body.products.length).toBe(1);
    
    const fetchedProduct = res.body.products[0];
    expect(fetchedProduct.name).toBe('Super Integration Tester');
    expect(fetchedProduct.price).toBe(49.99);
    expect(fetchedProduct.category).toBe('Integration Tools');
  });

  it('should return empty array when DB has no matching products', async () => {
    // DB is intentionally left empty for this test
    const res = await request(app).get('/api/products?category=NonExistent');
    
    expect(res.statusCode).toEqual(200);
    expect(res.body.products.length).toBe(0);
    expect(res.body.total).toBe(0);
  });
});
