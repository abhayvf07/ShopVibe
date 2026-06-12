import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShoppingCart, FiSun, FiMoon, FiMenu, FiX, FiUser, FiLogOut, FiGrid } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

/**
 * Navbar — responsive sticky navigation with blur backdrop
 * Features: logo, nav links, dark mode toggle, cart badge, user menu, hamburger
 */
function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { user, isAdmin, logout } = useAuth();
  const { cartCount, toggleCart } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Track scroll position for navbar styling
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setDropdownOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`} id="main-navbar">
      <div className="navbar-inner">
        {/* Logo */}
        <Link to="/" className="navbar-logo" id="navbar-logo">
          ShopVibe
        </Link>

        {/* Nav Links */}
        <div className={`navbar-links ${mobileOpen ? 'open' : ''}`} id="navbar-links">
          <Link 
            to="/" 
            className={`navbar-link ${isActive('/') ? 'active' : ''}`}
            id="nav-home"
          >
            Home
          </Link>
          <Link 
            to="/products" 
            className={`navbar-link ${isActive('/products') ? 'active' : ''}`}
            id="nav-products"
          >
            Products
          </Link>
          {user && (
            <Link 
              to="/dashboard" 
              className={`navbar-link ${isActive('/dashboard') ? 'active' : ''}`}
              id="nav-dashboard"
            >
              Dashboard
            </Link>
          )}
          {isAdmin && (
            <Link 
              to="/admin" 
              className={`navbar-link ${isActive('/admin') ? 'active' : ''}`}
              id="nav-admin"
            >
              Admin
            </Link>
          )}
        </div>

        {/* Actions */}
        <div className="navbar-actions" id="navbar-actions">
          {/* Theme Toggle */}
          <motion.button
            className="theme-toggle"
            onClick={toggleTheme}
            whileTap={{ scale: 0.9 }}
            aria-label="Toggle theme"
            id="theme-toggle-btn"
          >
            {theme === 'light' ? <FiMoon /> : <FiSun />}
          </motion.button>

          {/* Cart Button */}
          <motion.button
            className="cart-btn"
            onClick={toggleCart}
            whileTap={{ scale: 0.9 }}
            aria-label="Open cart"
            id="cart-toggle-btn"
          >
            <FiShoppingCart />
            {cartCount > 0 && (
              <motion.span
                className="cart-badge"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                key={cartCount}
              >
                {cartCount}
              </motion.span>
            )}
          </motion.button>

          {/* User Menu or Login */}
          {user ? (
            <div className="user-menu" id="user-menu">
              <button
                className="user-avatar"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                id="user-avatar-btn"
              >
                {user.name?.charAt(0).toUpperCase()}
              </button>
              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    className="user-dropdown"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.15 }}
                    id="user-dropdown"
                  >
                    <div style={{ padding: '0.5rem 0.875rem', borderBottom: '1px solid var(--border)', marginBottom: '0.25rem' }}>
                      <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{user.name}</div>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{user.email}</div>
                    </div>
                    <Link to="/dashboard" className="user-dropdown-item" id="dropdown-dashboard">
                      <FiGrid size={16} /> Dashboard
                    </Link>
                    {isAdmin && (
                      <Link to="/admin" className="user-dropdown-item" id="dropdown-admin">
                        <FiUser size={16} /> Admin Panel
                      </Link>
                    )}
                    <div className="user-dropdown-divider" />
                    <button className="user-dropdown-item" onClick={handleLogout} id="dropdown-logout">
                      <FiLogOut size={16} /> Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary btn-sm" id="login-btn">
              Login
            </Link>
          )}

          {/* Hamburger */}
          <button
            className={`hamburger ${mobileOpen ? 'active' : ''}`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle mobile menu"
            id="hamburger-btn"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
