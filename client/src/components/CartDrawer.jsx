const IMAGE_MAP = {
    headphones: '🎧', jacket: '🧥', coffee: '☕', keyboard: '⌨️',
    shoes: '👟', book: '📖', monitor: '🖥', yoga: '🧘', dinnerSet: '🍽',
};

function CartDrawer({ isOpen, onClose, items, onUpdateQty, onRemove }) {
    const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);
    const totalItems = items.reduce((sum, item) => sum + item.qty, 0);

    return (
        <>
            {/* Overlay */}
            <div
                className={`drawer-overlay${isOpen ? ' open' : ''}`}
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Drawer */}
            <aside
                id="cart-drawer"
                className={`cart-drawer${isOpen ? ' open' : ''}`}
                role="dialog"
                aria-modal="true"
                aria-label="Shopping cart"
            >
                <div className="drawer-header">
                    <h2 className="drawer-title">
                        🛒 Cart {totalItems > 0 && <span style={{ color: 'var(--clr-text-3)', fontWeight: 400 }}>({totalItems})</span>}
                    </h2>
                    <button
                        id="cart-close-btn"
                        className="close-btn"
                        onClick={onClose}
                        aria-label="Close cart"
                    >
                        ✕
                    </button>
                </div>

                <div className="drawer-body">
                    {items.length === 0 ? (
                        <div className="cart-empty">
                            <div className="cart-empty-icon">🛒</div>
                            <p>Your cart is empty</p>
                            <p style={{ fontSize: '0.82rem' }}>Add some products to get started!</p>
                        </div>
                    ) : (
                        items.map(item => (
                            <div key={item.id} className="cart-item" id={`cart-item-${item.id}`}>
                                <div className="cart-item-emoji">
                                    {IMAGE_MAP[item.image] || '📦'}
                                </div>
                                <div className="cart-item-info">
                                    <div className="cart-item-name">{item.name}</div>
                                    <div className="cart-item-price">
                                        ${(item.price * item.qty).toFixed(2)}
                                    </div>
                                    <div className="cart-item-qty">
                                        <button
                                            className="qty-btn"
                                            onClick={() => onUpdateQty(item.id, item.qty - 1)}
                                            aria-label="Decrease quantity"
                                        >−</button>
                                        <span className="qty-val">{item.qty}</span>
                                        <button
                                            className="qty-btn"
                                            onClick={() => onUpdateQty(item.id, item.qty + 1)}
                                            aria-label="Increase quantity"
                                        >+</button>
                                    </div>
                                </div>
                                <button
                                    className="remove-item-btn"
                                    onClick={() => onRemove(item.id)}
                                    aria-label={`Remove ${item.name} from cart`}
                                >
                                    🗑
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {items.length > 0 && (
                    <div className="drawer-footer">
                        <div className="total-row">
                            <span className="total-label">Total</span>
                            <span className="total-amount">${total.toFixed(2)}</span>
                        </div>
                        <button
                            id="checkout-btn"
                            className="btn btn-primary checkout-btn"
                        >
                            Checkout →
                        </button>
                    </div>
                )}
            </aside>
        </>
    );
}

export default CartDrawer;
