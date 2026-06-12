import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiLogIn } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

/**
 * Login — email/password form with validation and JWT auth
 */
function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field on change
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const result = await login(formData.email, formData.password);
    if (result.success) {
      toast.success('Welcome back! 🎉');
      navigate('/dashboard');
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="page-transition" id="login-page">
      <div className="auth-page">
        <motion.div
          className="auth-card"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="auth-header">
            <Link to="/" className="navbar-logo" style={{ fontSize: '2rem', marginBottom: '1rem', display: 'inline-block' }}>
              ShopVibe
            </Link>
            <h1>Welcome Back</h1>
            <p>Sign in to your account to continue shopping</p>
          </div>

          <form onSubmit={handleSubmit} id="login-form">
            <div className="form-group">
              <label className="form-label" htmlFor="login-email">
                <FiMail size={14} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
                Email Address
              </label>
              <input
                type="email"
                id="login-email"
                name="email"
                className={`form-input ${errors.email ? 'error' : ''}`}
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
              />
              {errors.email && <span className="form-error">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="login-password">
                <FiLock size={14} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
                Password
              </label>
              <input
                type="password"
                id="login-password"
                name="password"
                className={`form-input ${errors.password ? 'error' : ''}`}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
              />
              {errors.password && <span className="form-error">{errors.password}</span>}
            </div>

            <motion.button
              type="submit"
              className="btn btn-primary w-full"
              disabled={loading}
              whileTap={{ scale: 0.97 }}
              id="login-submit"
              style={{ marginTop: '0.5rem', padding: '1rem' }}
            >
              {loading ? (
                <span className="spinner" style={{ width: '1.25rem', height: '1.25rem', borderWidth: '2px' }} />
              ) : (
                <><FiLogIn size={18} /> Sign In</>
              )}
            </motion.button>
          </form>

          <div className="auth-footer">
            Don't have an account?{' '}
            <Link to="/register">Create one here</Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Login;
