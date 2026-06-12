import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiShoppingCart, FiHeart, FiPlus, FiMinus, FiCheck } from 'react-icons/fi';
import useFetch from '../hooks/useFetch';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import StarRating from '../components/StarRating';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';

/**
 * ProductDetail — single product view with image zoom, qty selector, related products
 */
function ProductDetail() {
  const { id } = useParams();
  const { data: product, loading } = useFetch(`https://fakestoreapi.com/products/${id}`);
  const { data: allProducts } = useFetch('https://fakestoreapi.com/products');
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (loading) {
    return <Loader type="detail" />;
  }

  if (!product) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
        Product not found.
      </div>
    );
  }

  const wishlisted = isInWishlist(product.id);

  // Get 4 related products from the same category
  const relatedProducts = allProducts
    ?.filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4) || [];

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      category: product.category,
      quantity
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleWishlist = () => {
    toggleWishlist(product);
  };

  return (
    <div className="page-transition" id="product-detail-page">
      <div className="product-detail">
        <div className="container">
          <motion.div
            className="product-detail-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Product Image */}
            <motion.div
              className="product-detail-image"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <img src={product.image} alt={product.title} loading="lazy" />
            </motion.div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <span className="badge badge-accent product-detail-category">
                {product.category}
              </span>

              <h1 className="product-detail-title">{product.title}</h1>

              <div className="product-detail-rating">
                <StarRating rating={product.rating?.rate || 0} size={18} />
                <span style={{ fontWeight: 600, marginLeft: '0.25rem' }}>
                  {product.rating?.rate}
                </span>
                <span className="product-detail-rating-count">
                  ({product.rating?.count} reviews)
                </span>
              </div>

              <div className="product-detail-price">
                ₹{(product.price * 83).toFixed(0)}
              </div>

              <p className="product-detail-description">
                {product.description}
              </p>

              {/* Quantity Selector */}
              <div className="product-detail-qty">
                <label>Quantity:</label>
                <div className="qty-controls">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                  >
                    <FiMinus />
                  </button>
                  <span>{quantity}</span>
                  <button
                    onClick={() => setQuantity(q => q + 1)}
                    aria-label="Increase quantity"
                  >
                    <FiPlus />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="product-detail-actions">
                <motion.button
                  className={`btn ${added ? 'btn-ghost' : 'btn-primary'} btn-lg`}
                  onClick={handleAddToCart}
                  whileTap={{ scale: 0.97 }}
                  id="add-to-cart-btn"
                  style={{ minWidth: '200px' }}
                >
                  {added ? (
                    <><FiCheck size={20} /> Added to Cart</>
                  ) : (
                    <><FiShoppingCart size={20} /> Add to Cart</>
                  )}
                </motion.button>

                <motion.button
                  className={`btn btn-outline btn-lg`}
                  onClick={handleWishlist}
                  whileTap={{ scale: 0.97 }}
                  id="wishlist-btn"
                  style={{
                    color: wishlisted ? '#ef4444' : undefined,
                    borderColor: wishlisted ? '#ef4444' : undefined
                  }}
                >
                  <FiHeart size={20} fill={wishlisted ? '#ef4444' : 'none'} />
                  {wishlisted ? 'Wishlisted' : 'Wishlist'}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <motion.section
              className="section"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              id="related-products"
            >
              <h2 className="section-title" style={{ fontSize: 'var(--text-2xl)' }}>
                You May Also Like
              </h2>
              <p className="section-subtitle">
                More products from {product.category}
              </p>
              <div className="products-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
                {relatedProducts.map((p, i) => (
                  <ProductCard key={p.id} product={p} index={i} />
                ))}
              </div>
            </motion.section>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
