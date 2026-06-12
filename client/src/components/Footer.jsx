import { Link } from 'react-router-dom';
import { FiGithub, FiTwitter, FiInstagram, FiLinkedin, FiHeart } from 'react-icons/fi';

/**
 * Footer — site footer with brand info, quick links, social icons
 */
function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer" id="site-footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <Link to="/" className="navbar-logo" style={{ fontSize: '1.75rem' }}>
              ShopVibe
            </Link>
            <p>
              Discover the latest trends and shop with confidence. 
              Quality products, unbeatable prices, and a vibe you'll love.
            </p>
            <div className="footer-social">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="GitHub">
                <FiGithub />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="Twitter">
                <FiTwitter />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="Instagram">
                <FiInstagram />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="LinkedIn">
                <FiLinkedin />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="footer-title">Shop</h4>
            <Link to="/products" className="footer-link">All Products</Link>
            <Link to="/products?category=electronics" className="footer-link">Electronics</Link>
            <Link to="/products?category=jewelery" className="footer-link">Jewelery</Link>
            <Link to="/products?category=men's clothing" className="footer-link">Men's Clothing</Link>
            <Link to="/products?category=women's clothing" className="footer-link">Women's Clothing</Link>
          </div>

          {/* Account */}
          <div>
            <h4 className="footer-title">Account</h4>
            <Link to="/login" className="footer-link">Login</Link>
            <Link to="/register" className="footer-link">Register</Link>
            <Link to="/dashboard" className="footer-link">My Dashboard</Link>
            <Link to="/cart" className="footer-link">My Cart</Link>
          </div>

          {/* Info */}
          <div>
            <h4 className="footer-title">Info</h4>
            <span className="footer-link">About Us</span>
            <span className="footer-link">Contact</span>
            <span className="footer-link">Privacy Policy</span>
            <span className="footer-link">Terms of Service</span>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <span>© {currentYear} ShopVibe. All rights reserved.</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            Made with <FiHeart size={14} style={{ color: 'var(--error)' }} /> using MERN Stack
          </span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
