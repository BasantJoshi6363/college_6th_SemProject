import { useState, useEffect } from 'react';
import axios from 'axios';

const RecommendedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [strategy, setStrategy] = useState('hybrid');
  
  // Smart caching with localStorage
  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        // Check cache first
        const cacheKey = 'recommendations_cache';
        const cacheTimeKey = 'recommendations_cache_time';
        const cached = localStorage.getItem(cacheKey);
        const cacheTime = localStorage.getItem(cacheTimeKey);
        
        // Use cache if less than 5 minutes old
        if (cached && cacheTime) {
          const age = Date.now() - parseInt(cacheTime);
          if (age < 5 * 60 * 1000) { // 5 minutes
            setProducts(JSON.parse(cached));
            setLoading(false);
            return;
          }
        }
        
        // Fetch fresh data
        const { data } = await axios.get(
          `/api/recommendations?strategy=${strategy}&limit=12`,
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
        
        setProducts(data.products);
        setStrategy(data.strategy);
        
        // Update cache
        localStorage.setItem(cacheKey, JSON.stringify(data.products));
        localStorage.setItem(cacheTimeKey, Date.now().toString());
        
        setLoading(false);
        
      } catch (error) {
        console.error('Error fetching recommendations:', error);
        setLoading(false);
      }
    };
    
    fetchRecommendations();
  }, [strategy]);
  
  // Track product view
  const handleProductView = async (productId) => {
    // Store in localStorage for batch processing
    const pendingInteractions = JSON.parse(
      localStorage.getItem('pending_interactions') || '[]'
    );
    
    pendingInteractions.push({
      productId,
      type: 'view',
      timestamp: Date.now()
    });
    
    localStorage.setItem('pending_interactions', JSON.stringify(pendingInteractions));
    
    // Navigate to product
    window.location.href = `/products/${productId}`;
  };
  
  if (loading) {
    return <div className="loading">Loading recommendations...</div>;
  }
  
  return (
    <div className="recommended-products">
      <h2>Recommended For You</h2>
      <div className="products-grid">
        {products.map(product => (
          <div 
            key={product._id} 
            className="product-card"
            onClick={() => handleProductView(product._id)}
          >
            <img src={product.images[0]} alt={product.name} />
            <h3>{product.name}</h3>
            <p>${product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendedProducts;