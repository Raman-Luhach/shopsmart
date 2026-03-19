import ProductCard from './ProductCard';

describe('<ProductCard />', () => {
  const product = {
    id: 1,
    name: 'Test Product',
    category: 'Electronics',
    price: 99.99,
    rating: 4.5,
    reviews: 120,
    image: 'headphones',
    badge: 'Best Seller',
  };

  it('renders product details correctly', () => {
    cy.mount(<ProductCard product={product} onAddToCart={() => {}} />);
    cy.get('.product-name').should('contain', 'Test Product');
    cy.get('.product-category').should('contain', 'Electronics');
    cy.get('.product-price').should('contain', '$99.99');
    cy.get('.product-badge').should('contain', 'Best Seller');
    cy.get('.rating-value').should('contain', '4.5');
  });

  it('calls onAddToCart when the button is clicked', () => {
    const onAddToCartSpy = cy.spy().as('onAddToCart');
    cy.mount(<ProductCard product={product} onAddToCart={onAddToCartSpy} />);
    cy.get('.add-to-cart-btn').first().click();
    cy.get('@onAddToCart').should('have.been.calledWith', product);
  });

  it('displays the correct emoji based on image key', () => {
    cy.mount(<ProductCard product={product} onAddToCart={() => {}} />);
    cy.get('.product-card-image span[role="img"]').should('contain', '🎧');
  });
});
