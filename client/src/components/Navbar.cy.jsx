import React from 'react';
import Navbar from './Navbar';
// Removed redundant local CSS import in favor of centralized component.css import

describe('<Navbar />', () => {
  const noop = () => {};

  it('renders with 0 items', () => {
    cy.mount(<Navbar cartCount={0} onCartOpen={noop} searchQuery="" onSearchChange={noop} />);
    cy.get('#navbar').should('be.visible');
    cy.get('.cart-badge').should('not.exist');
  });

  it('renders with 5 items', () => {
    cy.mount(<Navbar cartCount={5} onCartOpen={noop} searchQuery="" onSearchChange={noop} />);
    cy.get('.cart-badge').should('be.visible').and('contain.text', '5');
  });

  it('renders the search input', () => {
    cy.mount(<Navbar cartCount={0} onCartOpen={noop} searchQuery="" onSearchChange={noop} />);
    cy.get('input').should('have.attr', 'placeholder', 'Search products…');
  });

  it('triggers onCartOpen when cart button is clicked', () => {
    const onCartOpenSpy = cy.spy().as('onCartOpen');
    cy.mount(<Navbar cartCount={0} onCartOpen={onCartOpenSpy} searchQuery="" onSearchChange={noop} />);
    cy.get('#cart-toggle-btn').click();
    cy.get('@onCartOpen').should('have.been.called');
  });
});
