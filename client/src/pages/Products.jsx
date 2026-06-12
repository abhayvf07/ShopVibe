import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSearch } from 'react-icons/fi';
import useFetch from '../hooks/useFetch';
import useDebounce from '../hooks/useDebounce';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';

/**
 * Products — all products page with search, filter, sort
 */
function Products() {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || '';

  const { data: products, loading, error } = useFetch('https://fakestoreapi.com/products');
  const { data: categories } = useFetch('https://fakestoreapi.com/products/categories');

  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState('default');

  const debouncedSearch = useDebounce(searchTerm, 300);

  // Update category from URL params
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setCategory(cat);
  }, [searchParams]);

  // Filter, search, and sort products
  const filteredProducts = useMemo(() => {
    if (!products) return [];

    let result = [...products];

    // Filter by category
    if (category) {
      result = result.filter(p => p.category === category);
    }

    // Search by title
    if (debouncedSearch) {
      const search = debouncedSearch.toLowerCase();
      result = result.filter(p =>
        p.title.toLowerCase().includes(search) ||
        p.description.toLowerCase().includes(search)
      );
    }

    // Sort
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating.rate - a.rating.rate);
        break;
      default:
        break;
    }

    return result;
  }, [products, category, debouncedSearch, sortBy]);

  return (
    <div className="page-transition" id="products-page">
      <section className="section">
        <div className="container">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="section-title" style={{ marginBottom: '0.5rem' }}>
              {category ? category.charAt(0).toUpperCase() + category.slice(1) : 'All Products'}
            </h1>
            <p className="section-subtitle">
              {filteredProducts.length} products found
            </p>
          </motion.div>

          {/* Filters Bar */}
          <motion.div
            className="filters-bar"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            id="filters-bar"
          >
            {/* Search */}
            <div className="search-input-wrapper">
              <FiSearch className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                id="product-search"
              />
            </div>

            {/* Category Filter */}
            <select
              className="filter-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              id="category-filter"
            >
              <option value="">All Categories</option>
              {categories?.map(cat => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              className="filter-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              id="sort-select"
            >
              <option value="default">Sort: Default</option>
              <option value="price-low">Price: Low → High</option>
              <option value="price-high">Price: High → Low</option>
              <option value="rating">Rating: Best First</option>
            </select>
          </motion.div>

          {/* Products Grid */}
          {loading ? (
            <Loader count={8} />
          ) : error ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              <p>Failed to load products. Please try again later.</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <motion.div
              style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div style={{ fontSize: '4rem', marginBottom: '1rem', opacity: 0.3 }}>🔍</div>
              <h3 style={{ marginBottom: '0.5rem' }}>No products found</h3>
              <p>Try adjusting your search or filter criteria</p>
            </motion.div>
          ) : (
            <div className="products-grid">
              {filteredProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Products;
