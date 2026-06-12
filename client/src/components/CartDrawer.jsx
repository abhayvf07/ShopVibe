import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiPlus, FiMinus, FiTrash2, FiShoppingBag } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

/**
 * CartDrawer — slides in from the right side
 * Shows cart items with image, name, price, qty controls
 * Total at bottom with Checkout button
 */
function CartDrawer() {
  const {
    cartItems,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    subtotal,
    shipping,
    total,
    cartCount
  } = useCart();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="cart-drawer-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            id="cart-overlay"
          />

          {/* Drawer */}
          <motion.div
            className="cart-drawer"
            initial={{ x: 420 }}
            animate={{ x: 0 }}
            exit={{ x: 420 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            id="cart-drawer"
          >
            {/* Header */}
            <div className="cart-drawer-header">
              <h3>Cart ({cartCount})</h3>
              <button className="cart-drawer-close" onClick={closeCart} aria-label="Close cart">
                <FiX />
              </button>
            </div>

            {/* Items */}
            {cartItems.length > 0 ? (
              <>
                <div className="cart-drawer-items">
                  {cartItems.map((item) => (
                    <motion.div
                      key={item.id}
                      className="cart-drawer-item"
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <div className="cart-drawer-item-image">
                        <img src={item.image} alt={item.title} loading="lazy" />
                      </div>
                      <div className="cart-drawer-item-info">
                        <div className="cart-drawer-item-title">{item.title}</div>
                        <div className="cart-drawer-item-price">
                          ₹{(item.price * 83 * item.quantity).toFixed(0)}
                        </div>
                        <div className="cart-drawer-qty">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            aria-label="Decrease quantity"
                          >
                            <FiMinus size={12} />
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            aria-label="Increase quantity"
                          >
                            <FiPlus size={12} />
                          </button>
                        </div>
                      </div>
                      <button
                        className="cart-drawer-remove"
                        onClick={() => removeFromCart(item.id)}
                        aria-label="Remove item"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </motion.div>
                  ))}
                </div>

                {/* Footer */}
                <div className="cart-drawer-footer">
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                    <span>Subtotal</span>
                    <span>₹{(subtotal * 83).toFixed(0)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                    <span>Shipping</span>
                    <span style={{ color: shipping === 0 ? 'var(--success)' : undefined }}>
                      {shipping === 0 ? 'FREE' : `₹${(shipping * 83).toFixed(0)}`}
                    </span>
                  </div>
                  <div className="cart-drawer-total">
                    <span>Total</span>
                    <span>₹{(total * 83).toFixed(0)}</span>
                  </div>
                  <Link
                    to="/cart"
                    className="btn btn-primary w-full"
                    onClick={closeCart}
                    style={{ textAlign: 'center' }}
                    id="drawer-checkout-btn"
                  >
                    View Cart & Checkout
                  </Link>
                </div>
              </>
            ) : (
              <div className="cart-drawer-empty">
                <div className="cart-drawer-empty-icon">
                  <FiShoppingBag />
                </div>
                <p>Your cart is empty</p>
                <Link
                  to="/products"
                  className="btn btn-primary btn-sm"
                  onClick={closeCart}
                >
                  Start Shopping
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default CartDrawer;
