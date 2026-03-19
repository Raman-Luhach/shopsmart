import { render, screen, waitFor } from '@testing-library/react';
import App from './App';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// ── Mocks ──────────────────────────────────────────────────────────────────
const mockHealth = {
  status: 'ok',
  message: 'ShopSmart Backend is running',
  timestamp: '2024-01-01T00:00:00Z',
};
const mockCategories = { categories: [{ id: 1, name: 'Electronics', icon: '💻' }] };
const mockProducts = {
  products: [
    {
      id: 1,
      name: 'Wireless Headphones',
      category: 'Electronics',
      price: 299.99,
      rating: 4.8,
      reviews: 1240,
      image: 'headphones',
      badge: 'Best Seller',
    },
  ],
  total: 1,
};

beforeEach(() => {
  global.fetch = vi.fn((url) => {
    if (url.includes('/api/health'))
      return Promise.resolve({ json: () => Promise.resolve(mockHealth) });
    if (url.includes('/api/categories'))
      return Promise.resolve({ json: () => Promise.resolve(mockCategories) });
    if (url.includes('/api/products'))
      return Promise.resolve({ json: () => Promise.resolve(mockProducts) });
    return Promise.reject(new Error('Unknown endpoint'));
  });
});

// ── Tests ──────────────────────────────────────────────────────────────────
describe('App', () => {
  it('renders ShopSmart brand name', () => {
    render(<App />);
    expect(screen.getAllByText(/ShopSmart/i).length).toBeGreaterThan(0);
  });

  it('renders the hero section', () => {
    render(<App />);
    expect(screen.getByText(/Shop Smarter/i)).toBeInTheDocument();
  });

  it('renders the Shop Now button', () => {
    render(<App />);
    expect(screen.getByText(/Shop Now/i)).toBeInTheDocument();
  });

  it('renders the cart button', () => {
    render(<App />);
    expect(screen.getByRole('button', { name: /Open cart/i })).toBeInTheDocument();
  });

  it('shows API status after fetch', async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByRole('status')).toBeInTheDocument();
    });
  });

  it('renders products after loading', async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText(/Wireless Headphones/i)).toBeInTheDocument();
    });
  });

  it('renders category pills', async () => {
    render(<App />);
    await waitFor(() => {
      const items = screen.getAllByText(/Electronics/i);
      expect(items.length).toBeGreaterThan(0);
    });
  });
});
