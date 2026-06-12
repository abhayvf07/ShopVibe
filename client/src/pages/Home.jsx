import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiZap, FiTruck, FiShield, FiHeadphones } from 'react-icons/fi';
import useFetch from '../hooks/useFetch';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';

/**
 * Home — landing page with hero, categories, featured products, newsletter
 */

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

// Category data with icons
const categories = [
  { name: "electronics", icon: "💻", color: "#3b82f6" },
  { name: "jewelery", icon: "💎", color: "#a855f7" },
  { name: "men's clothing", icon: "👔", color: "#22c55e" },
  { name: "women's clothing", icon: "👗", color: "#f43f5e" }
];

function Home() {
  const { data: products, loading } = useFetch('https://fakestoreapi.com/products?limit=8');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    navigate(`/products?category=${encodeURIComponent(category)}`);
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    setEmail('');
  };

  return (
    <div className="page-transition" id="home-page">
      {/* ==================== Hero Section ==================== */}
      <section className="hero" id="hero-section">
        <div className="container">
          <motion.div
            className="hero-content"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
          >
            <motion.div
              className="hero-badge"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <FiZap size={16} />
              New Collection 2024
            </motion.div>

            <motion.h1
              className="hero-title"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
            >
              Shop the{' '}
              <span className="gradient-text">Vibe.</span>
              <br />
              Define Your Style.
            </motion.h1>

            <motion.p
              className="hero-description"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              Discover curated collections of premium products. 
              From electronics to fashion — find everything you love, 
              all in one place.
            </motion.p>

            <motion.div
              className="hero-actions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Link to="/products" className="btn btn-primary btn-lg" id="hero-cta">
                Explore Products <FiArrowRight size={20} />
              </Link>
              <Link to="/register" className="btn btn-outline btn-lg" id="hero-register">
                Create Account
              </Link>
            </motion.div>

            <motion.div
              className="hero-stats"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <div className="hero-stat">
                <div className="hero-stat-value">20+</div>
                <div className="hero-stat-label">Products</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-value">4</div>
                <div className="hero-stat-label">Categories</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-value">5K+</div>
                <div className="hero-stat-label">Happy Customers</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ==================== Features Strip ==================== */}
      <section style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', padding: '2rem 0' }}>
            {[
              { icon: <FiTruck />, title: 'Free Shipping', desc: 'On orders over ₹999' },
              { icon: <FiShield />, title: 'Secure Payment', desc: '100% protected' },
              { icon: <FiHeadphones />, title: '24/7 Support', desc: 'Dedicated support' },
              { icon: <FiZap />, title: 'Fast Delivery', desc: 'Within 3-5 days' }
            ].map((feat, i) => (
              <motion.div
                key={i}
                style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div style={{
                  width: '2.5rem', height: '2.5rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  borderRadius: 'var(--radius-lg)',
                  background: 'var(--accent-light)',
                  color: 'var(--accent)',
                  fontSize: 'var(--text-lg)'
                }}>
                  {feat.icon}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{feat.title}</div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{feat.desc}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== Categories Section ==================== */}
      <section className="section" id="categories-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="section-title">Shop by Category</h2>
            <p className="section-subtitle">
              Browse through our curated collection of categories
            </p>
          </motion.div>

          <motion.div
            className="category-grid"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {categories.map((cat, i) => (
              <motion.div
                key={cat.name}
                className="category-card"
                variants={fadeInUp}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleCategoryClick(cat.name)}
                style={{ cursor: 'pointer' }}
                id={`category-${cat.name.replace(/['\s]/g, '-')}`}
              >
                <div className="category-card-bg" style={{ color: cat.color }}>
                  {cat.icon}
                </div>
                <div className="category-card-content">
                  <span className="category-card-icon">{cat.icon}</span>
                  <span className="category-card-name">{cat.name}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ==================== Featured Products ==================== */}
      <section className="section" style={{ background: 'var(--bg-secondary)' }} id="featured-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="section-title">Featured Products</h2>
            <p className="section-subtitle">
              Handpicked products just for you. Discover our best sellers.
            </p>
          </motion.div>

          {loading ? (
            <Loader count={8} />
          ) : (
            <div className="products-grid">
              {products?.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          )}

          <motion.div
            style={{ textAlign: 'center', marginTop: '2.5rem' }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <Link to="/products" className="btn btn-outline btn-lg" id="view-all-products">
              View All Products <FiArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ==================== Newsletter ==================== */}
      <section className="section" id="newsletter-section">
        <div className="container">
          <motion.div
            className="newsletter"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2>Stay in the Loop</h2>
            <p>Subscribe to our newsletter for the latest drops, exclusive deals, and style tips.</p>
            <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                id="newsletter-email"
              />
              <button type="submit" className="btn btn-primary" id="newsletter-submit">
                Subscribe
              </button>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default Home;
