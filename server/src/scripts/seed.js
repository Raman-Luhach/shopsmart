require('dotenv').config();
const Category = require('../models/Category');
const Product = require('../models/Product');
const connectDB = require('../config/db');

const categories = [
  { id: 1, name: 'Electronics', icon: '💻' },
  { id: 2, name: 'Fashion', icon: '👗' },
  { id: 3, name: 'Home & Kitchen', icon: '🏠' },
  { id: 4, name: 'Books', icon: '📚' },
  { id: 5, name: 'Sports', icon: '⚽' },
];

const products = [
  {
    id: 1,
    name: 'Wireless Noise-Cancelling Headphones',
    category: 'Electronics',
    price: 299.99,
    rating: 4.8,
    reviews: 1240,
    image: 'headphones',
    badge: 'Best Seller',
  },
  {
    id: 2,
    name: 'Premium Leather Jacket',
    category: 'Fashion',
    price: 189.99,
    rating: 4.6,
    reviews: 856,
    image: 'jacket',
    badge: 'New',
  },
  {
    id: 3,
    name: 'Smart Coffee Maker',
    category: 'Home & Kitchen',
    price: 129.99,
    rating: 4.7,
    reviews: 2103,
    image: 'coffee',
    badge: 'Hot',
  },
  {
    id: 4,
    name: 'Mechanical Keyboard',
    category: 'Electronics',
    price: 149.99,
    rating: 4.9,
    reviews: 3421,
    image: 'keyboard',
    badge: 'Top Rated',
  },
  {
    id: 5,
    name: 'Running Shoes Pro',
    category: 'Sports',
    price: 119.99,
    rating: 4.5,
    reviews: 988,
    image: 'shoes',
    badge: null,
  },
  {
    id: 6,
    name: 'Design Thinking Book',
    category: 'Books',
    price: 29.99,
    rating: 4.7,
    reviews: 567,
    image: 'book',
    badge: null,
  },
  {
    id: 7,
    name: '4K Ultra HD Monitor',
    category: 'Electronics',
    price: 399.99,
    rating: 4.8,
    reviews: 1789,
    image: 'monitor',
    badge: 'Best Seller',
  },
  {
    id: 8,
    name: 'Yoga Mat Premium',
    category: 'Sports',
    price: 49.99,
    rating: 4.4,
    reviews: 432,
    image: 'yoga',
    badge: null,
  },
  {
    id: 9,
    name: 'Ceramic Dinner Set',
    category: 'Home & Kitchen',
    price: 79.99,
    rating: 4.6,
    reviews: 310,
    image: 'dinnerSet',
    badge: 'New',
  },
];

const seedDB = async () => {
  try {
    await connectDB();

    await Category.deleteMany();
    await Product.deleteMany();

    await Category.insertMany(categories);
    await Product.insertMany(products);

    console.log('Database Seeded Successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding DB:', error);
    process.exit(1);
  }
};

seedDB();
