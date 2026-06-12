import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiLock, FiUserPlus } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

/**
 * Register — registration form with validation
 */
function Register() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.name || formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const result = await register(formData.name, formData.email, formData.password);
    if (result.success) {
      toast.success('Account created! Welcome to ShopVibe! 🎉');
      navigate('/dashboard');
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="page-transition" id="register-page">
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
            <h1>Create Account</h1>
            <p>Join ShopVibe and start shopping today</p>
          </div>

          <form onSubmit={handleSubmit} id="register-form">
            <div className="form-group">
              <label className="form-label" htmlFor="register-name">
                <FiUser size={14} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
                Full Name
              </label>
              <input
                type="text"
                id="register-name"
                name="name"
                className={`form-input ${errors.name ? 'error' : ''}`}
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                autoComplete="name"
              />
              {errors.name && <span className="form-error">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="register-email">
                <FiMail size={14} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
                Email Address
              </label>
              <input
                type="email"
                id="register-email"
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
              <label className="form-label" htmlFor="register-password">
                <FiLock size={14} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
                Password
              </label>
              <input
                type="password"
                id="register-password"
                name="password"
                className={`form-input ${errors.password ? 'error' : ''}`}
                placeholder="Min 6 characters"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
              />
              {errors.password && <span className="form-error">{errors.password}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="register-confirm">
                <FiLock size={14} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
                Confirm Password
              </label>
              <input
                type="password"
                id="register-confirm"
                name="confirmPassword"
                className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
              />
              {errors.confirmPassword && <span className="form-error">{errors.confirmPassword}</span>}
            </div>

            <motion.button
              type="submit"
              className="btn btn-primary w-full"
              disabled={loading}
              whileTap={{ scale: 0.97 }}
              id="register-submit"
              style={{ marginTop: '0.5rem', padding: '1rem' }}
            >
              {loading ? (
                <span className="spinner" style={{ width: '1.25rem', height: '1.25rem', borderWidth: '2px' }} />
              ) : (
                <><FiUserPlus size={18} /> Create Account</>
              )}
            </motion.button>
          </form>

          <div className="auth-footer">
            Already have an account?{' '}
            <Link to="/login">Sign in here</Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Register;
