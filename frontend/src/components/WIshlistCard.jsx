import React, { useContext } from 'react';
import { Trash2, ShoppingCart, Eye } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishListContext';
const WishlistCard = ({ product, isRecommendation = false }) => {
  const { addToCart } = useContext(CartContext);
  const { removeFromWishlist } = useContext(WishlistContext);

  // Helper to handle the "Add to Cart" with quantity 1
  const handleAddToCart = () => {
    addToCart({ ...product, quantity: 1 });
  };

  return (
    <div className="group w-full">
      <div className="relative h-[250px] w-full overflow-hidden rounded bg-[#F5F5F5] flex items-center justify-center p-8">
        
        {/* Dynamic Discount Badge based on your schema's percentage */}
        {product.discountedPercent > 0 && (
          <span className="absolute left-3 top-3 rounded bg-[#DB4444] px-3 py-1 text-xs text-white">
            -{product.discountedPercent}%
          </span>
        )}
        
        <div className="absolute right-3 top-3">
          <button 
            // Using product._id for Mongoose compatibility
            onClick={() => !isRecommendation && removeFromWishlist(product._id)}
            className="rounded-full bg-white p-2 hover:bg-[#DB4444] hover:text-white transition-colors cursor-pointer shadow-sm"
          >
            {isRecommendation ? <Eye size={20} /> : <Trash2 size={20} />}
          </button>
        </div>

        {/* Updated Image mapping: images[0].url */}
        <img 
          src={product.images?.[0]?.url || '/placeholder.png'} 
          alt={product.name} 
          className="max-h-full object-contain mix-blend-multiply transition-transform duration-300 group-hover:scale-110" 
        />

        <button 
          onClick={handleAddToCart}
          className="absolute bottom-0 flex items-center justify-center gap-2 w-full bg-black py-2.5 text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
        >
          <ShoppingCart size={16} />
          Add To Cart
        </button>
      </div>

      <div className="mt-4 flex flex-col gap-2">
        {/* Changed title to name */}
        <h3 className="font-semibold text-base line-clamp-1 text-black">{product.name}</h3>
        
        <div className="flex gap-3 items-center">
          {/* Price mapping for Discount vs Original */}
          <span className="text-[#DB4444] font-medium">
            ${product.discountedPrice || product.originalPrice}
          </span>
          
          {product.discountedPrice && (
            <span className="text-gray-400 line-through text-sm">
              ${product.originalPrice}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default WishlistCard;