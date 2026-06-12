import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiTrash2, FiPlus, FiMinus, FiShoppingBag, FiArrowLeft, FiCheck } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosConfig';

/**
 * Cart — full cart page with item list, order summary, checkout
 */
function Cart() {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    shipping,
    total,
    cartCount
  } = useCart();
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = async () => {
    if (!user || !token) {
      toast.info('Please login to place an order');
      navigate('/login');
      return;
    }

    try {
      // Place order via backend API
      const orderItems = cartItems.map(item => ({
        productId: item.id,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
        image: item.image
      }));

      await api.post('/api/orders/place-order', {
        items: orderItems,
        totalAmount: total
      });

      clearCart();
      toast.success('🎉 Order placed successfully! Check your dashboard for details.');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order. Please try again.');
    }
  };

  // Empty cart state
  if (cartItems.length === 0) {
    return (
      <div className="page-transition" id="cart-page">
        <div className="cart-page">
          <div className="container">
            <motion.div
              className="cart-empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="cart-empty-icon">🛒</div>
              <h2>Your cart is empty</h2>
              <p style={{ color: 'var(--text-secondary)' }}>
                Looks like you haven't added anything to your cart yet.
              </p>
              <Link to="/products" className="btn btn-primary btn-lg" id="continue-shopping">
                <FiShoppingBag size={18} /> Continue Shopping
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-transition" id="cart-page">
      <div className="cart-page">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Link
              to="/products"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent)', fontWeight: 500, fontSize: 'var(--text-sm)', marginBottom: '1.5rem' }}
            >
              <FiArrowLeft size={16} /> Continue Shopping
            </Link>
            <h1 style={{ marginBottom: '0.5rem' }}>Shopping Cart</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
              {cartCount} item{cartCount !== 1 ? 's' : ''} in your cart
            </p>
          </motion.div>

          <div className="cart-page-grid">
            {/* Cart Items */}
            <div>
              <AnimatePresence>
                {cartItems.map((item) => (
                  <motion.div
                    key={item.id}
                    className="cart-item"
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                  >
                    <Link to={`/product/${item.id}`} className="cart-item-image">
                      <img src={item.image} alt={item.title} loading="lazy" />
                    </Link>
                    <div className="cart-item-info">
                      <Link to={`/product/${item.id}`}>
                        <div className="cart-item-title">{item.title}</div>
                      </Link>
                      <div className="cart-item-price">
                        ₹{(item.price * 83 * item.quantity).toFixed(0)}
                      </div>
                      <div className="cart-drawer-qty" style={{ marginTop: '0.75rem' }}>
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
                    <motion.button
                      className="cart-drawer-remove"
                      onClick={() => removeFromCart(item.id)}
                      whileTap={{ scale: 0.9 }}
                      aria-label="Remove item"
                    >
                      <FiTrash2 size={18} />
                    </motion.button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Order Summary */}
            <motion.div
              className="cart-summary"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              id="order-summary"
            >
              <h3>Order Summary</h3>
              <div className="cart-summary-row">
                <span>Subtotal ({cartCount} items)</span>
                <span>₹{(subtotal * 83).toFixed(0)}</span>
              </div>
              <div className="cart-summary-row">
                <span>Shipping</span>
                <span style={{ color: shipping === 0 ? 'var(--success)' : undefined }}>
                  {shipping === 0 ? 'FREE' : `₹${(shipping * 83).toFixed(0)}`}
                </span>
              </div>
              {shipping > 0 && (
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--accent)', marginBottom: '0.5rem' }}>
                  Add ₹{((999 - subtotal * 83) > 0 ? (999 - subtotal * 83).toFixed(0) : 0)} more for free shipping!
                </div>
              )}
              <div className="cart-summary-total">
                <span>Total</span>
                <span>₹{(total * 83).toFixed(0)}</span>
              </div>
              <motion.button
                className="btn btn-primary w-full"
                style={{ marginTop: '1.5rem' }}
                onClick={handleCheckout}
                whileTap={{ scale: 0.97 }}
                id="checkout-btn"
              >
                <FiCheck size={18} /> Proceed to Checkout
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
