// hooks/useInteractionTracker.js
import { useEffect } from 'react';
import axios from 'axios';

export const useInteractionTracker = () => {
  useEffect(() => {
    const interval = setInterval(async () => {
      const pending = JSON.parse(
        localStorage.getItem('pending_interactions') || '[]'
      );
      
      if (pending.length === 0) return;
      
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        
        for (const interaction of pending) {
          await axios.post('/api/recommendations/track', interaction, {
            headers: { Authorization: `Bearer ${token}` }
          });
        }
        
        localStorage.removeItem('pending_interactions');
        
        const pendingTags = JSON.parse(
          localStorage.getItem('pending_tags') || '[]'
        );
        
        if (pendingTags.length > 0) {
          await axios.post('/api/recommendations/update-tags', 
            { tags: pendingTags },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          localStorage.removeItem('pending_tags');
        }
        
      } catch (error) {
        console.error('Error syncing interactions:', error);
      }
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);
};
