import heroBg from '../assets/hero_bg.png';

function Hero({ onShopClick }) {
  return (
    <section className="hero">
      <img src={heroBg} alt="shopping background" className="hero-bg" />
      <div className="container hero-inner">
        <div className="hero-content">
          <div className="hero-chip">✦ New arrivals every week</div>
          <h1>
            Shop Smarter,
            <br />
            Live <em>Better</em>
          </h1>
          <p className="hero-desc">
            Discover curated products across electronics, fashion, home & more — all in one
            beautifully simple store.
          </p>
          <div className="hero-actions">
            <button id="hero-shop-btn" className="btn btn-primary" onClick={onShopClick}>
              Shop Now →
            </button>
            <button className="btn btn-outline">View Deals</button>
          </div>

          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-value">9+</div>
              <div className="stat-label">Products</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">5</div>
              <div className="stat-label">Categories</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">4.7★</div>
              <div className="stat-label">Avg Rating</div>
            </div>
          </div>
        </div>

        <div className="hero-visual" aria-hidden="true">
          🛍
        </div>
      </div>
    </section>
  );
}

export default Hero;
