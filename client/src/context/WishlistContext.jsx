import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import api from '../api/axiosConfig';

const WishlistContext = createContext();

/**
 * WishlistProvider — manages wishlist state
 * When logged in: syncs wishlist to backend (User.wishlist in MongoDB)
 * When guest: stores wishlist in localStorage only
 */
export function WishlistProvider({ children }) {
  const { user, token } = useAuth();

  const [wishlistItems, setWishlistItems] = useState(() => {
    const saved = localStorage.getItem('shopvibe-wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  // Persist to localStorage always (as cache/fallback)
  useEffect(() => {
    localStorage.setItem('shopvibe-wishlist', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  // On login, fetch wishlist from backend and merge with local
  useEffect(() => {
    if (user && token) {
      fetchWishlist();
    }
  }, [user, token]);

  const fetchWishlist = async () => {
    try {
      const res = await api.get('/api/users/wishlist');
      if (res.data && res.data.length > 0) {
        setWishlistItems(res.data);
      }
    } catch (error) {
      // Silently fail — use local wishlist as fallback
    }
  };

  // Sync wishlist to backend when it changes (if logged in)
  const syncToBackend = useCallback(async (items) => {
    if (user && token) {
      try {
        await api.put('/api/users/wishlist', { wishlist: items });
      } catch (error) {
        // Silently fail — local state is still correct
      }
    }
  }, [user, token]);

  const addToWishlist = useCallback((product) => {
    setWishlistItems(prev => {
      const exists = prev.find(item => item.productId === product.id);
      if (exists) return prev;
      const newItems = [...prev, {
        productId: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        category: product.category
      }];
      syncToBackend(newItems);
      return newItems;
    });
  }, [syncToBackend]);

  const removeFromWishlist = useCallback((productId) => {
    setWishlistItems(prev => {
      const newItems = prev.filter(item => item.productId !== productId);
      syncToBackend(newItems);
      return newItems;
    });
  }, [syncToBackend]);

  const isInWishlist = useCallback((productId) => {
    return wishlistItems.some(item => item.productId === productId);
  }, [wishlistItems]);

  const toggleWishlist = useCallback((product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  }, [isInWishlist, addToWishlist, removeFromWishlist]);

  const clearWishlist = useCallback(() => {
    setWishlistItems([]);
    syncToBackend([]);
  }, [syncToBackend]);

  return (
    <WishlistContext.Provider value={{
      wishlistItems,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      toggleWishlist,
      clearWishlist
    }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}

export default WishlistContext;
