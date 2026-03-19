const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Product = require('../src/models/Product');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Product.deleteMany({});
});

describe('Product Model Unit Tests', () => {
  it('should create and save a product successfully', async () => {
    const validProduct = new Product({
      id: 99,
      name: 'Test Headphones',
      category: 'Electronics',
      price: 199.99,
      image: 'test-image'
    });
    const savedProduct = await validProduct.save();
    
    expect(savedProduct._id).toBeDefined();
    expect(savedProduct.id).toBe(99);
    expect(savedProduct.name).toBe('Test Headphones');
    expect(savedProduct.category).toBe('Electronics');
    expect(savedProduct.rating).toBe(0); // Testing default value
    expect(savedProduct.reviews).toBe(0); // Testing default value
  });

  it('should fail to save product without required fields', async () => {
    const productWithoutRequiredFields = new Product({ name: 'Incomplete Product' });
    let err;
    try {
      await productWithoutRequiredFields.save();
    } catch (error) {
      err = error;
    }
    
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.id).toBeDefined();
    expect(err.errors.category).toBeDefined();
    expect(err.errors.price).toBeDefined();
    expect(err.errors.image).toBeDefined();
  });

  it('should enforce unique ID constraint', async () => {
    const product1 = new Product({
      id: 100, name: 'P1', category: 'Cat1', price: 10, image: 'img1'
    });
    await product1.save();

    const product2 = new Product({
      id: 100, name: 'P2', category: 'Cat2', price: 20, image: 'img2'
    });

    let err;
    try {
      await product2.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeDefined();
    // MongoDB duplicate key error code is 11000
    expect(err.code).toBe(11000); 
  });
});
