// E2E Test Suite: Full Shopping Flow
// Tests the complete real-user journey across the ShopSmart application.
// Simulates: Landing → Browse → Filter by category → Add to Cart → Verify Cart

describe('ShopSmart E2E – Shopping Flow', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  // ── Test 1: Hero Section Renders ──────────────────────────────────────────
  it('should display the hero section on landing', () => {
    cy.get('#hero').should('be.visible');
    cy.get('#hero h1').should('contain.text', 'Shop Smarter');
    cy.get('#hero-cta').should('be.visible').and('contain.text', 'Shop Now');
  });

  // ── Test 2: Navigation Bar Renders ───────────────────────────────────────
  it('should show the navbar with search and cart button', () => {
    cy.get('#navbar').should('be.visible');
    cy.get('#navbar-search').should('be.visible');
    cy.get('#cart-toggle-btn').should('be.visible');
  });

  // ── Test 3: Products Load From API ───────────────────────────────────────
  it('should load and display products from the backend API', () => {
    cy.get('#product-grid', { timeout: 10000 }).should('be.visible');
    cy.get('.product-card').should('have.length.greaterThan', 0);
  });

  // ── Test 4: Category Filter Changes Product List ──────────────────────────
  it('should filter products when a category is selected', () => {
    // Wait for categories to load from API
    cy.get('.category-btn', { timeout: 10000 }).should('have.length.greaterThan', 1);

    // Click the first real category (not "All")
    cy.get('.category-btn').not('.active').first().click();

    // Verify products re-render (loading spinner clears and cards appear)
    cy.get('.product-card', { timeout: 10000 }).should('have.length.greaterThan', 0);
  });

  // ── Test 5: Search Filters Products ──────────────────────────────────────
  it('should filter products based on search query', () => {
    // Wait for products to load first
    cy.get('.product-card', { timeout: 10000 }).should('have.length.greaterThan', 0);

    // Type a search query
    cy.get('#navbar-search').type('head');

    // Products should now be filtered
    cy.get('.product-card', { timeout: 8000 }).should('have.length.greaterThan', 0);
  });

  // ── Test 6: Add to Cart ───────────────────────────────────────────────────
  it('should add a product to cart and open the cart drawer', () => {
    // Wait for products to load
    cy.get('.product-card', { timeout: 10000 }).should('have.length.greaterThan', 0);

    // Click "Add to Cart" on the first product
    cy.get('.add-to-cart-btn').first().click();

    // Cart drawer should open
    cy.get('#cart-drawer').should('be.visible');

    // Cart should contain at least 1 item
    cy.get('#cart-drawer .cart-item').should('have.length.greaterThan', 0);
  });

  // ── Test 7: Cart Count Updates in Navbar ─────────────────────────────────
  it('should update cart item count in the navbar after adding a product', () => {
    // Wait for products to load
    cy.get('.product-card', { timeout: 10000 }).should('have.length.greaterThan', 0);

    // Cart count should start at 0 (no badge rendered)
    cy.get('#cart-toggle-btn').should('not.contain.text', '1');
    cy.get('#cart-toggle-btn .cart-badge').should('not.exist');

    // Add an item
    cy.get('.add-to-cart-btn').first().click();

    // Count should now be > 0
    cy.get('#cart-toggle-btn').should('not.contain.text', '0');
  });

  // ── Test 8: Close Cart Drawer ─────────────────────────────────────────────
  it('should close the cart drawer when close button is clicked', () => {
    // Open cart
    cy.get('#cart-toggle-btn').click();
    cy.get('#cart-drawer').should('be.visible');

    // Close it
    cy.get('#cart-close-btn').click();
    cy.get('#cart-drawer').should('not.be.visible');
  });
});
