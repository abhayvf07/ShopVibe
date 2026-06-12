import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiPackage, FiHeart, FiUser, FiSave } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import api from '../api/axiosConfig';

/**
 * Dashboard — protected user dashboard with tabs: Orders, Wishlist, Profile
 */
function Dashboard() {
  const { user, updateProfile } = useAuth();
  const { wishlistItems } = useWishlist();
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    password: ''
  });
  const [saving, setSaving] = useState(false);

  // Fetch user orders
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/api/orders/my-orders');
      setOrders(res.data);
    } catch (error) {
      // Silently handle — user may have no orders yet
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    const data = { name: profileForm.name };
    if (profileForm.password) {
      data.password = profileForm.password;
    }

    const result = await updateProfile(data);
    if (result.success) {
      toast.success('Profile updated successfully! ✨');
      setProfileForm(prev => ({ ...prev, password: '' }));
    } else {
      toast.error(result.message);
    }
    setSaving(false);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Delivered': return 'badge-success';
      case 'Shipped': return 'badge-info';
      case 'Processing': return 'badge-warning';
      case 'Cancelled': return 'badge-error';
      default: return 'badge-accent';
    }
  };

  // Build wishlist products for ProductCard (needs full product shape)
  const wishlistProducts = wishlistItems.map(item => ({
    id: item.productId,
    title: item.title,
    price: item.price,
    image: item.image,
    category: item.category,
    rating: { rate: 0, count: 0 }
  }));

  const tabs = [
    { key: 'orders', label: 'My Orders', icon: <FiPackage size={16} /> },
    { key: 'wishlist', label: 'Wishlist', icon: <FiHeart size={16} /> },
    { key: 'profile', label: 'Profile', icon: <FiUser size={16} /> }
  ];

  return (
    <div className="page-transition" id="dashboard-page">
      <div className="dashboard">
        <div className="container">
          {/* Header */}
          <motion.div
            className="dashboard-header"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1>Welcome back, {user?.name}! 👋</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Manage your orders, wishlist, and profile</p>
          </motion.div>

          {/* Tabs */}
          <div className="dashboard-tabs" id="dashboard-tabs">
            {tabs.map(tab => (
              <button
                key={tab.key}
                className={`dashboard-tab ${activeTab === tab.key ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.key)}
                id={`tab-${tab.key}`}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {tab.icon} {tab.label}
                </span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* ==================== Orders Tab ==================== */}
            {activeTab === 'orders' && (
              <div id="orders-tab">
                {ordersLoading ? (
                  <Loader type="table" />
                ) : orders.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.3 }}>📦</div>
                    <h3 style={{ marginBottom: '0.5rem' }}>No orders yet</h3>
                    <p>Start shopping to see your orders here!</p>
                  </div>
                ) : (
                  <div className="table-wrapper">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Order ID</th>
                          <th>Date</th>
                          <th>Items</th>
                          <th>Total</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map(order => (
                          <tr key={order._id}>
                            <td style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}>
                              #{order._id.slice(-8).toUpperCase()}
                            </td>
                            <td>{new Date(order.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric', month: 'short', year: 'numeric'
                            })}</td>
                            <td>{order.items.length} item{order.items.length !== 1 ? 's' : ''}</td>
                            <td style={{ fontWeight: 700 }}>₹{(order.totalAmount * 83).toFixed(0)}</td>
                            <td>
                              <span className={`badge ${getStatusBadgeClass(order.status)}`}>
                                {order.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* ==================== Wishlist Tab ==================== */}
            {activeTab === 'wishlist' && (
              <div id="wishlist-tab">
                {wishlistProducts.length === 0 ? (
                  <div className="wishlist-empty">
                    <div className="wishlist-empty-icon">💝</div>
                    <h3 style={{ marginBottom: '0.5rem' }}>Your wishlist is empty</h3>
                    <p>Browse products and tap the heart icon to add items here</p>
                  </div>
                ) : (
                  <div className="wishlist-grid">
                    {wishlistProducts.map((product, i) => (
                      <ProductCard key={product.id} product={product} index={i} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ==================== Profile Tab ==================== */}
            {activeTab === 'profile' && (
              <div id="profile-tab">
                <div className="profile-card">
                  <div className="profile-avatar-large">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <form onSubmit={handleProfileUpdate}>
                    <div className="form-group">
                      <label className="form-label" htmlFor="profile-name">Name</label>
                      <input
                        type="text"
                        id="profile-name"
                        className="form-input"
                        value={profileForm.name}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="profile-email">Email</label>
                      <input
                        type="email"
                        id="profile-email"
                        className="form-input"
                        value={user?.email || ''}
                        disabled
                        style={{ opacity: 0.6, cursor: 'not-allowed' }}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="profile-password">
                        New Password (leave blank to keep current)
                      </label>
                      <input
                        type="password"
                        id="profile-password"
                        className="form-input"
                        placeholder="Enter new password"
                        value={profileForm.password}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, password: e.target.value }))}
                      />
                    </div>
                    <motion.button
                      type="submit"
                      className="btn btn-primary"
                      disabled={saving}
                      whileTap={{ scale: 0.97 }}
                      id="save-profile-btn"
                    >
                      {saving ? (
                        <span className="spinner" style={{ width: '1.25rem', height: '1.25rem', borderWidth: '2px' }} />
                      ) : (
                        <><FiSave size={16} /> Save Changes</>
                      )}
                    </motion.button>
                  </form>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
