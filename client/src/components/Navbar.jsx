function Navbar({ cartCount, onCartOpen, searchQuery, onSearchChange }) {
  return (
    <nav className="navbar" id="navbar">
      <div className="container navbar-inner">
        <a className="navbar-logo" href="#">
          🛍 ShopSmart
          <span>· store</span>
        </a>

        <div className="navbar-search" id="navbar-search">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            id="navbar-search-input"
            placeholder="Search products…"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Search products"
          />
        </div>

        <div className="navbar-actions">
          <button
            id="cart-toggle-btn"
            className="cart-btn"
            onClick={onCartOpen}
            aria-label="Open cart"
          >
            🛒 Cart
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
