import { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CategoryFilter from './components/CategoryFilter';
import ProductGrid from './components/ProductGrid';
import CartDrawer from './components/CartDrawer';
import Footer from './components/Footer';

const API_URL = import.meta.env.VITE_API_URL || '';

function App() {
    // ── State ──────────────────────────────────────────────────────────────
    const [products,   setProducts]   = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading,    setLoading]    = useState(true);
    const [apiStatus,  setApiStatus]  = useState(null);

    const [selectedCat, setSelectedCat] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [cartOpen,    setCartOpen]    = useState(false);
    const [cartItems,   setCartItems]   = useState([]);

    const productsRef = useRef(null);

    // ── Fetch health & data ────────────────────────────────────────────────
    useEffect(() => {
        // Health check
        fetch(`${API_URL}/api/health`)
            .then(r => r.json())
            .then(data => setApiStatus(data))
            .catch(() => setApiStatus({ status: 'error', message: 'Backend unreachable' }));

        // Categories
        fetch(`${API_URL}/api/categories`)
            .then(r => r.json())
            .then(data => setCategories(data.categories || []))
            .catch(() => setCategories([]));
    }, []);

    // ── Fetch products whenever filter changes ─────────────────────────────
    useEffect(() => {
        setLoading(true);
        const params = new URLSearchParams();
        if (selectedCat !== 'All')  params.set('category', selectedCat);
        if (searchQuery.trim())     params.set('search', searchQuery.trim());

        const url = `${API_URL}/api/products${params.toString() ? '?' + params.toString() : ''}`;
        fetch(url)
            .then(r => r.json())
            .then(data => {
                setProducts(data.products || []);
                setLoading(false);
            })
            .catch(() => {
                setProducts([]);
                setLoading(false);
            });
    }, [selectedCat, searchQuery]);

    // ── Cart helpers ───────────────────────────────────────────────────────
    const addToCart = (product) => {
        setCartItems(prev => {
            const existing = prev.find(i => i.id === product.id);
            if (existing) {
                return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
            }
            return [...prev, { ...product, qty: 1 }];
        });
        setCartOpen(true);
    };

    const updateQty = (id, qty) => {
        if (qty <= 0) {
            setCartItems(prev => prev.filter(i => i.id !== id));
        } else {
            setCartItems(prev => prev.map(i => i.id === id ? { ...i, qty } : i));
        }
    };

    const removeItem = (id) => {
        setCartItems(prev => prev.filter(i => i.id !== id));
    };

    const cartCount = cartItems.reduce((sum, i) => sum + i.qty, 0);

    const scrollToProducts = () => {
        productsRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // ── Render ─────────────────────────────────────────────────────────────
    return (
        <>
            <Navbar
                cartCount={cartCount}
                onCartOpen={() => setCartOpen(true)}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
            />

            <main>
                <Hero onShopClick={scrollToProducts} />

                <CategoryFilter
                    categories={categories}
                    selected={selectedCat}
                    onSelect={cat => { setSelectedCat(cat); scrollToProducts(); }}
                />

                <div ref={productsRef} />

                {/* API Status Banner */}
                {apiStatus && (
                    <div className="container">
                        <div
                            className="status-bar"
                            id="api-status-bar"
                            role="status"
                            aria-live="polite"
                        >
                            <div className={`status-dot${apiStatus.status !== 'ok' ? ' error' : ''}`} />
                            <span className="status-text">
                                <strong>API:</strong>{' '}
                                {apiStatus.status === 'ok'
                                    ? `Connected · ${apiStatus.message}`
                                    : apiStatus.message}
                            </span>
                        </div>
                    </div>
                )}

                <ProductGrid
                    products={products}
                    loading={loading}
                    onAddToCart={addToCart}
                />
            </main>

            <Footer />

            <CartDrawer
                isOpen={cartOpen}
                onClose={() => setCartOpen(false)}
                items={cartItems}
                onUpdateQty={updateQty}
                onRemove={removeItem}
            />
        </>
    );
}

export default App;
