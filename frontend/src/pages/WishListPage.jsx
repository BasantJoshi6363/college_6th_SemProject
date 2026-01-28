import React, { useContext } from 'react';
import WishlistCard from '../components/WIshlistCard';
// import WishListContext from '../context/WishListContext';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishListContext';

const WishlistPage = ({ recommendedItems = [] }) => {
  const { wishlistItems, clearWishlist } = useContext(WishlistContext);
  const { addToCart } = useContext(CartContext);

  const handleMoveAllToBag = () => {
    wishlistItems.forEach(item => addToCart(item));
    clearWishlist();
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-20">
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-xl font-normal">Wishlist ({wishlistItems.length})</h2>
        <button 
          onClick={handleMoveAllToBag}
          className="rounded border border-black/50 px-12 py-4 font-medium hover:bg-black hover:text-white transition-all"
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
            <WishlistCard key={item.id} product={item} />
          ))
        )}
      </div>

      {/* Recommendations */}
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <div className="h-10 w-5 rounded bg-[#DB4444]" />
          <h2 className="text-xl font-normal">Just For You</h2>
        </div>
        <button className="rounded border border-black/50 px-12 py-4 font-medium hover:bg-black hover:text-white transition-all">
          See All
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {recommendedItems.map((item) => (
          <WishlistCard key={item.id} product={item} isRecommendation={true} />
        ))}
      </div>
    </div>
  );
};

export default WishlistPage;