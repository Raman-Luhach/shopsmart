const express = require('express');
const cors = require('cors');
const Product = require('./models/Product');
const Category = require('./models/Category');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'ShopSmart Backend is running (MongoDB enabled)',
    timestamp: new Date().toISOString()
  });
});

// Categories
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await Category.find({}).sort({ id: 1 });
    res.json({ categories });
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching categories' });
  }
});

// Products (optional ?category= & ?search= filters)
app.get('/api/products', async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};

    if (category && category !== 'All') {
      query.category = category;
    }
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const products = await Product.find(query).sort({ id: 1 });
    res.json({ products: products, total: products.length });
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching products' });
  }
});

// Single Product
app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findOne({ id: parseInt(req.params.id) });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json({ product });
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching product' });
  }
});

// Root
app.get('/', (req, res) => {
  res.send('ShopSmart Backend Service API');
});

module.exports = app;
