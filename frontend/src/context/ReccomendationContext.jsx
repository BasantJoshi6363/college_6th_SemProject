import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import axios from 'axios';

export const RecommendationContext = createContext();

const getSessionId = () => {
  let sessionId = localStorage.getItem('sessionId');
  if (!sessionId) {
    sessionId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('sessionId', sessionId);
  }
  return sessionId;
};

export const RecommendationProvider = ({ children }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [strategy, setStrategy] = useState('popularity');
  const [personalizedWishlist, setPersonalizedWishlist] = useState([]);
  
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  // console.log(recommendations)
  // Track interaction (stores in localStorage first)
  const trackInteraction = useCallback((productId, type) => {
    const pending = JSON.parse(
      localStorage.getItem('pending_interactions') || '[]'
    );
    
    pending.push({
      productId,
      type,
      timestamp: Date.now()
    });
    
    localStorage.setItem('pending_interactions', JSON.stringify(pending));
  }, []);

  // Sync interactions with backend
  const syncInteractions = useCallback(async () => {
    const pending = JSON.parse(
      localStorage.getItem('pending_interactions') || '[]'
    );
    
    if (pending.length === 0) return;
    
    try {
      const token = localStorage.getItem('google-token');
      const sessionId = getSessionId();
      
      await axios.post(
        `${baseUrl}/recommendations/track/batch`,
        { interactions: pending },
        { 
          headers: { 
            Authorization: token ? `Bearer ${token}` : '',
            'x-session-id': sessionId
          } 
        }
      );
      
      // Clear after successful sync
      localStorage.removeItem('pending_interactions');
      console.log('✅ Interactions synced');
      
    } catch (error) {
      console.error('Error syncing interactions:', error);
    }
  }, [baseUrl]);

  // Auto-sync every 60 seconds
  useEffect(() => {
    const interval = setInterval(syncInteractions, 60000);
    
    // Also sync on unmount
    fetchRecommendations()
    return () => {
      clearInterval(interval);
      syncInteractions();
    };
  }, [syncInteractions]);

  // Fetch recommendations
  const fetchRecommendations = useCallback(async ({ limit = 8, excludeIds = [] } = {}) => {
    setLoading(true);
    
    try {
      const token = localStorage.getItem('google-token');
      const sessionId = getSessionId();
      
      const excludeIdsParam = excludeIds.length > 0 ? excludeIds.join(',') : '';
      
      const { data } = await axios.get(
        `${baseUrl}/recommendations?limit=${limit}&excludeIds=${excludeIdsParam}`,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : '',
            'x-session-id': sessionId
          }
        }
      );
      console.log(data)
      if (data.success) {
        setRecommendations(data.products);
        setStrategy(data.strategy);
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  }, [baseUrl]);

  // Get recommendations for a specific user based on their wishlist/cart
  const getPersonalizedRecommendations = useCallback(async (excludeIds = [], limit = 4) => {
    try {
      const token = localStorage.getItem('google-token');
      const sessionId = getSessionId();
      
      const excludeIdsParam = excludeIds.length > 0 ? excludeIds.join(',') : '';
      
      const { data } = await axios.get(
        `${baseUrl}/recommendations?limit=${limit}&excludeIds=${excludeIdsParam}`,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : '',
            'x-session-id': sessionId
          }
        }
      );
      // console.log('Personalized recommendations response:', data);
      setPersonalizedWishlist(data.products);
      
      
      return data.success ? data.products : [];
    } catch (error) {
      console.error('Error fetching personalized recommendations:', error);
      return [];
    }
  }, [baseUrl]);

  const value = useMemo(
    () => ({
      recommendations,
      loading,
      strategy,
      personalizedWishlist,
      trackInteraction,
      fetchRecommendations,
      getPersonalizedRecommendations,
      syncInteractions,
    }),
    [
      recommendations,
      loading,
      strategy,
      trackInteraction,
      fetchRecommendations,
      getPersonalizedRecommendations,
      syncInteractions,
    ]
  );

  return (
    <RecommendationContext.Provider value={value}>
      {children}
    </RecommendationContext.Provider>
  );
};

