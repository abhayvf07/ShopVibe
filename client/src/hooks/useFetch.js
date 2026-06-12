import { useState, useEffect } from 'react';

/**
 * useFetch — generic data fetching hook
 * Handles loading, error, and data states
 * Supports direct URL fetching (for FakeStore API)
 * 
 * @param {string} url - The URL to fetch from
 * @param {object} options - Optional fetch configuration
 * @returns {{ data, loading, error, refetch }}
 */
function useFetch(url, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    if (!url) return;
    
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url, options);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [url]);

  const refetch = () => {
    fetchData();
  };

  return { data, loading, error, refetch };
}

export default useFetch;
