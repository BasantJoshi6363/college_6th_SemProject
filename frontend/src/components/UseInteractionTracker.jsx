import { useEffect } from 'react';
import axios from 'axios';

export const useInteractionTracker = () => {
  useEffect(() => {
    const syncData = async () => {
      const pending = JSON.parse(localStorage.getItem('pending_interactions') || '[]');
      if (pending.length === 0) return;

      const token = localStorage.getItem('google-token');
      if (!token) return; 

      try {
        const { data } = await axios.post(
          'http://localhost:5000/api/recommendations/track/batch', 
          { interactions: pending },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (data.success) {
          localStorage.removeItem('pending_interactions');
          console.log("✅ Successfully synced interactions and updated user tags");
        }
      } catch (error) {
        console.error('❌ Sync failed:', error.response?.data || error.message);
      }
    };

    const interval = setInterval(syncData, 30000); 
    
    syncData();

    return () => clearInterval(interval);
  }, []);
};