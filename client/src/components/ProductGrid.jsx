import ProductCard from './ProductCard';

function ProductGrid({ products, loading, onAddToCart }) {
  if (loading) {
    return (
      <div className="products-section">
        <div className="container">
          <div className="product-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="product-card">
                <div className="skeleton" style={{ height: 200 }} />
                <div
                  className="product-card-body"
                  style={{ gap: 10, display: 'flex', flexDirection: 'column' }}
                >
                  <div className="skeleton" style={{ height: 12, width: '50%' }} />
                  <div className="skeleton" style={{ height: 16, width: '80%' }} />
                  <div className="skeleton" style={{ height: 12, width: '60%' }} />
                  <div className="skeleton" style={{ height: 20, width: '40%' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="products-section">
      <div className="container">
        <div className="products-toolbar">
          <h2 className="section-title">Products</h2>
          <span className="products-count">
            {products.length} {products.length === 1 ? 'item' : 'items'} found
          </span>
        </div>

        <div className="product-grid" id="product-grid">
          {products.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <h3>No products found</h3>
              <p>Try adjusting your search or category filter.</p>
            </div>
          ) : (
            products.map((product) => (
              <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
            ))
          )}
        </div>
      </div>
    </section>
  );
}

export default ProductGrid;
