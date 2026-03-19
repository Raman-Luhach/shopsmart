// Map imageKey → emoji so cards look visually distinct
const IMAGE_MAP = {
    headphones: '🎧',
    jacket:     '🧥',
    coffee:     '☕',
    keyboard:   '⌨️',
    shoes:      '👟',
    book:       '📖',
    monitor:    '🖥',
    yoga:       '🧘',
    dinnerSet:  '🍽',
};

const BADGE_CLASS = {
    'Best Seller': 'badge-best',
    'New':         'badge-new',
    'Hot':         'badge-hot',
    'Top Rated':   'badge-rated',
};

function renderStars(rating) {
    const full  = Math.floor(rating);
    const half  = rating % 1 >= 0.5 ? 1 : 0;
    const empty = 5 - full - half;
    return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty);
}

function ProductCard({ product, onAddToCart }) {
    const emoji      = IMAGE_MAP[product.image] || '📦';
    const badgeClass = BADGE_CLASS[product.badge] || '';

    return (
        <article
            className="product-card"
            id={`product-card-${product.id}`}
            aria-label={product.name}
        >
            <div className="product-card-image">
                {product.badge && (
                    <span className={`product-badge ${badgeClass}`}>
                        {product.badge}
                    </span>
                )}
                <span role="img" aria-label={product.name}>{emoji}</span>
                <button
                    className="add-to-cart-overlay"
                    id={`quick-add-${product.id}`}
                    onClick={() => onAddToCart(product)}
                    aria-label={`Quick add ${product.name} to cart`}
                >
                    + Add to Cart
                </button>
            </div>

            <div className="product-card-body">
                <div className="product-category">{product.category}</div>
                <div className="product-name">{product.name}</div>

                <div className="product-rating">
                    <span className="stars">{renderStars(product.rating)}</span>
                    <span className="rating-value">{product.rating}</span>
                    <span className="rating-reviews">({product.reviews.toLocaleString()})</span>
                </div>

                <div className="product-footer">
                    <div className="product-price">${product.price.toFixed(2)}</div>
                    <button
                        className="add-btn-sm"
                        id={`add-btn-${product.id}`}
                        onClick={() => onAddToCart(product)}
                        aria-label={`Add ${product.name} to cart`}
                    >
                        Add +
                    </button>
                </div>
            </div>
        </article>
    );
}

export default ProductCard;
