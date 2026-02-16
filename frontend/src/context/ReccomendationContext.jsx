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
      // console.log('✅ Interactions synced');
      
    } catch (error) {
      console.error('Error syncing interactions:', error);
    }
  }, [baseUrl]);
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
      if (data.success) {
        setRecommendations(data.products);
        // setStrategy(data.strategy);
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  }, [baseUrl]);

  useEffect(() => {
  fetchRecommendations({ limit: 8 });
  
  const interval = setInterval(syncInteractions, 30000);
  return () => {
    clearInterval(interval);
    syncInteractions();
  };
}, [syncInteractions, fetchRecommendations]); // Add dependencies

  // Fetch recommendations
 

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

    console.log("Personalized API response:", data);

    setPersonalizedWishlist(data.products);

    // ✅ FIXED
    return data.products || [];

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

