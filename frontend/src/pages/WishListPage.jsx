import React, { useContext, useState, useEffect } from 'react';
import { CartContext } from '../context/CartContext';
import WishlistCard from '../components/WIshlistCard';
import { WishlistContext } from '../context/WishListContext';
import {RecommendationContext} from "../context/ReccomendationContext"
import { memo } from 'react';

const WishlistPage = () => {
  const { wishlistItems, clearWishlist } = useContext(WishlistContext);
  const { addToCart } = useContext(CartContext);
  const { 
    trackInteraction, 
    getPersonalizedRecommendations
  } = useContext(RecommendationContext);
  
  const [recommendedItems, setRecommendedItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Track wishlist items as "wishlist" interaction
  useEffect(() => {
    wishlistItems.forEach(item => {
      trackInteraction(item._id, 'wishlist');
    });
  }, [wishlistItems, trackInteraction]);

  // Fetch personalized recommendations
  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true);
      
      // Exclude current wishlist items from recommendations
      const excludeIds = wishlistItems.map(item => item._id);
      
      const recommendations = await getPersonalizedRecommendations(excludeIds, 4);
      console.log(recommendations)
      setRecommendedItems(recommendations);
      
      setLoading(false);
    };

    fetchRecommendations();
  }, [wishlistItems, getPersonalizedRecommendations]);

  const handleMoveAllToBag = () => {
    wishlistItems.forEach(item => {
      addToCart(item);
      trackInteraction(item._id, 'cart');
    });
    clearWishlist();
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-20">
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-xl font-normal">Wishlist ({wishlistItems.length})</h2>
        <button 
          onClick={handleMoveAllToBag}
          disabled={wishlistItems.length === 0}
          className="rounded border border-black/50 px-12 py-4 font-medium hover:bg-black hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Move All To Bag
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
        {wishlistItems.length === 0 ? (
          <div className="col-span-full text-center py-20 text-gray-500 border border-dashed rounded">
            Your Wish List is currently empty.
          </div>
        ) : (
          wishlistItems.map((item) => (
            <WishlistCard key={item._id} product={item} />
          ))
        )}
      </div>

      {/* Recommendations Section */}
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <div className="h-10 w-5 rounded bg-[#DB4444]" />
          <h2 className="text-xl font-normal">Just For You</h2>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-500">
          Loading recommendations...
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {recommendedItems.length === 0 ? (
            <div className="col-span-full text-center py-10 text-gray-500 border border-dashed rounded">
              Browse more products to get personalized recommendations!
            </div>
          ) : (
            recommendedItems.map((item) => (
              <WishlistCard key={item._id} product={item} isRecommendation={true} />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default memo(WishlistPage);