import { memo, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHeart, FiShoppingCart, FiCheck } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import StarRating from './StarRating';

/**
 * ProductCard — displays a single product in the grid
 * Features: hover zoom, category badge, wishlist heart, add to cart with brief "Added ✓" feedback
 * Wrapped in React.memo to prevent unnecessary re-renders
 */
const ProductCard = memo(function ProductCard({ product, index = 0 }) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [added, setAdded] = useState(false);

  const wishlisted = isInWishlist(product.id);

  const handleAddToCart = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      category: product.category
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }, [addToCart, product]);

  const handleWishlist = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  }, [toggleWishlist, product]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link to={`/product/${product.id}`} style={{ textDecoration: 'none' }}>
        <div className="product-card" id={`product-card-${product.id}`}>
          {/* Image Section */}
          <div className="product-card-image">
            <span className="product-card-category">{product.category}</span>
            <motion.button
              className={`product-card-wishlist ${wishlisted ? 'active' : ''}`}
              onClick={handleWishlist}
              whileTap={{ scale: 0.8 }}
              aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <FiHeart fill={wishlisted ? '#ef4444' : 'none'} />
            </motion.button>
            <img
              src={product.image}
              alt={product.title}
              loading="lazy"
            />
          </div>

          {/* Body */}
          <div className="product-card-body">
            <h3 className="product-card-title">{product.title}</h3>
            <div className="product-card-rating">
              <StarRating rating={product.rating?.rate || 0} />
              <span className="rating-value">({product.rating?.count || 0})</span>
            </div>
            <div className="product-card-footer">
              <span className="product-card-price">₹{(product.price * 83).toFixed(0)}</span>
              <motion.button
                className={`product-card-btn ${added ? 'added' : ''}`}
                onClick={handleAddToCart}
                whileTap={{ scale: 0.95 }}
              >
                {added ? (
                  <><FiCheck size={14} /> Added</>
                ) : (
                  <><FiShoppingCart size={14} /> Add to Cart</>
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
});

export default ProductCard;
