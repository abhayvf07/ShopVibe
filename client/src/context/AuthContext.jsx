import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axiosConfig';

const AuthContext = createContext();

/**
 * AuthProvider — manages authentication state
 * Stores JWT token and user object in localStorage
 * Provides login, register, logout, and updateProfile methods
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('shopvibe-user');
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('shopvibe-token') || null;
  });

  const [loading, setLoading] = useState(false);

  // Sync token to localStorage and axios headers
  useEffect(() => {
    if (token) {
      localStorage.setItem('shopvibe-token', token);
    } else {
      localStorage.removeItem('shopvibe-token');
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('shopvibe-user', JSON.stringify(user));
    } else {
      localStorage.removeItem('shopvibe-user');
    }
  }, [user]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.post('/api/auth/login', { email, password });
      setToken(res.data.token);
      setUser(res.data.user);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed. Please try again.';
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const res = await api.post('/api/auth/register', { name, email, password });
      setToken(res.data.token);
      setUser(res.data.user);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed. Please try again.';
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('shopvibe-token');
    localStorage.removeItem('shopvibe-user');
  };

  const updateProfile = async (data) => {
    try {
      const res = await api.put('/api/users/update-profile', data);
      setUser(res.data.user);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Update failed.';
      return { success: false, message };
    }
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      isAdmin,
      login,
      register,
      logout,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
