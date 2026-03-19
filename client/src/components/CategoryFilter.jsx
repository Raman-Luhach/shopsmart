function CategoryFilter({ categories, selected, onSelect }) {
    return (
        <section className="category-section">
            <div className="container">
                <div className="section-header">
                    <h2 className="section-title">Browse Categories</h2>
                </div>
                <div className="category-pills" role="list" aria-label="Product categories">
                    <button
                        id="category-all"
                        className={`category-pill${selected === 'All' ? ' active' : ''}`}
                        onClick={() => onSelect('All')}
                        role="listitem"
                        aria-pressed={selected === 'All'}
                    >
                        🏪 All
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            id={`category-${cat.id}`}
                            className={`category-pill${selected === cat.name ? ' active' : ''}`}
                            onClick={() => onSelect(cat.name)}
                            role="listitem"
                            aria-pressed={selected === cat.name}
                        >
                            {cat.icon} {cat.name}
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default CategoryFilter;
