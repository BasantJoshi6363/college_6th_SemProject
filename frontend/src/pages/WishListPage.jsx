import React from 'react';
import ProductCard from '../components/ProductCard';

const WishlistPage = ({ wishlistItems, recommendedItems }) => {
  return (
    <div className="mx-auto max-w-7xl px-4 py-20">
      {/* Wishlist Header Section */}
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-xl font-normal">Wishlist ({wishlistItems.length})</h2>
        <button className="rounded border border-black/50 px-12 py-4 font-medium hover:bg-black hover:text-white transition-all">
          Move All To Bag
        </button>
      </div>

      {/* Wishlist Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
        {wishlistItems.length === 0 ?  <div className="text-center py-20 text-gray-500">
          Your Wish List is currently empty.
        </div> :wishlistItems.map((item) => (
          <ProductCard key={item.id} product={item} />
        ))}
      
      </div>

      {/* Just For You Section */}
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <div className="h-10 w-5 rounded bg-[#DB4444]" />
          <h2 className="text-xl font-normal">Just For You</h2>
        </div>
        <button className="rounded border border-black/50 px-12 py-4 font-medium hover:bg-black hover:text-white transition-all">
          See All
        </button>
      </div>

      {/* Recommendations Grid */}
      {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {recommendedItems.length === 0 ?  <div className="text-center py-20 text-gray-500">
          No recommendations available.
        </div> :recommendedItems.map((item) => (
          <ProductCard key={item.id} product={item} isRecommendation={true} />
        ))}
        
      </div> */}
    </div>
  );
};

export default WishlistPage;