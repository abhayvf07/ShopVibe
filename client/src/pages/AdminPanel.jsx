import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiShoppingCart, FiDollarSign, FiUsers, FiPackage } from 'react-icons/fi';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import api from '../api/axiosConfig';
import Loader from '../components/Loader';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

/**
 * AdminPanel — protected admin dashboard with stats, charts, and orders table
 * Access restricted to users with admin role
 */

// ============================================
// Mock chart data — clearly labeled as mock data for demonstration
// In production, this would come from backend analytics endpoints
// ============================================
const MOCK_ORDERS_BY_CATEGORY = {
  labels: ['Electronics', 'Jewelery', "Men's Clothing", "Women's Clothing"],
  datasets: [{
    label: 'Orders',
    data: [45, 28, 62, 53],
    backgroundColor: [
      'rgba(59, 130, 246, 0.8)',
      'rgba(168, 85, 247, 0.8)',
      'rgba(34, 197, 94, 0.8)',
      'rgba(244, 63, 94, 0.8)'
    ],
    borderColor: [
      'rgb(59, 130, 246)',
      'rgb(168, 85, 247)',
      'rgb(34, 197, 94)',
      'rgb(244, 63, 94)'
    ],
    borderWidth: 2,
    borderRadius: 8
  }]
};

const MOCK_REVENUE_BY_CATEGORY = {
  labels: ['Electronics', 'Jewelery', "Men's Clothing", "Women's Clothing"],
  datasets: [{
    data: [42000, 18500, 31000, 27500],
    backgroundColor: [
      'rgba(59, 130, 246, 0.85)',
      'rgba(168, 85, 247, 0.85)',
      'rgba(34, 197, 94, 0.85)',
      'rgba(244, 63, 94, 0.85)'
    ],
    borderWidth: 0,
    hoverOffset: 8
  }]
};

function AdminPanel() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalUsers: 0,
    totalProducts: 20 // FakeStore API has 20 products
  });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      // Fetch stats and orders in parallel
      const [statsRes, usersRes, ordersRes] = await Promise.all([
        api.get('/api/orders/stats'),
        api.get('/api/users/count'),
        api.get('/api/orders/all')
      ]);

      setStats({
        totalOrders: statsRes.data.totalOrders || 0,
        totalRevenue: statsRes.data.totalRevenue || 0,
        totalUsers: usersRes.data.totalUsers || 0,
        totalProducts: 20
      });

      setOrders(ordersRes.data || []);
    } catch (error) {
      // Use default values if admin endpoints fail
    } finally {
      setLoading(false);
    }
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

  const statCards = [
    {
      label: 'Total Orders',
      value: stats.totalOrders,
      icon: <FiShoppingCart />,
      color: '#3b82f6',
      bg: 'rgba(59, 130, 246, 0.1)'
    },
    {
      label: 'Total Revenue',
      value: `₹${(stats.totalRevenue * 83).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`,
      icon: <FiDollarSign />,
      color: '#22c55e',
      bg: 'rgba(34, 197, 94, 0.1)'
    },
    {
      label: 'Total Users',
      value: stats.totalUsers,
      icon: <FiUsers />,
      color: '#a855f7',
      bg: 'rgba(168, 85, 247, 0.1)'
    },
    {
      label: 'Products Listed',
      value: stats.totalProducts,
      icon: <FiPackage />,
      color: '#f43f5e',
      bg: 'rgba(244, 63, 94, 0.1)'
    }
  ];

  // Chart options with theme-aware colors
  const barOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { display: false },
      title: { display: false }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(128, 128, 128, 0.1)' },
        ticks: { color: 'var(--text-muted)' }
      },
      x: {
        grid: { display: false },
        ticks: { color: 'var(--text-muted)' }
      }
    }
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { padding: 16, usePointStyle: true, pointStyle: 'circle' }
      }
    },
    cutout: '65%'
  };

  if (loading) {
    return (
      <div className="page-transition" id="admin-page">
        <div className="dashboard">
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
              <div className="spinner" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-transition" id="admin-page">
      <div className="dashboard">
        <div className="container">
          {/* Header */}
          <motion.div
            className="dashboard-header"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1>Admin Dashboard 🛠️</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Overview of your store's performance</p>
          </motion.div>

          {/* Stats Cards */}
          <div className="admin-stats" id="admin-stats">
            {statCards.map((card, i) => (
              <motion.div
                key={card.label}
                className="admin-stat-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div
                  className="admin-stat-icon"
                  style={{ background: card.bg, color: card.color }}
                >
                  {card.icon}
                </div>
                <div className="admin-stat-value">{card.value}</div>
                <div className="admin-stat-label">{card.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Charts */}
          <motion.div
            className="admin-charts"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            id="admin-charts"
          >
            <div className="admin-chart-card">
              <h3>Orders by Category</h3>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                (Mock data for demonstration)
              </p>
              <Bar data={MOCK_ORDERS_BY_CATEGORY} options={barOptions} />
            </div>
            <div className="admin-chart-card">
              <h3>Revenue by Category</h3>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                (Mock data for demonstration)
              </p>
              <Doughnut data={MOCK_REVENUE_BY_CATEGORY} options={doughnutOptions} />
            </div>
          </motion.div>

          {/* Recent Orders Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            id="admin-orders"
          >
            <h3 style={{ marginBottom: '1rem' }}>Recent Orders</h3>
            {orders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                No orders yet.
              </div>
            ) : (
              <div className="table-wrapper">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Date</th>
                      <th>Items</th>
                      <th>Total</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 10).map(order => (
                      <tr key={order._id}>
                        <td style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}>
                          #{order._id.slice(-8).toUpperCase()}
                        </td>
                        <td>{order.userId?.name || 'Unknown'}</td>
                        <td>{new Date(order.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'short', year: 'numeric'
                        })}</td>
                        <td>{order.items.length}</td>
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
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;
