import React from 'react';
import { Trash2, ShoppingCart } from 'lucide-react';
import toast from 'react-hot-toast';

const WishlistCard = ({ product, isRecommendation = false }) => {
  const handleAddToCart = () => {
    toast.success(`${product.name} added to bag!`);
  };

  return (
    <div className="group w-full">
      <div className="relative h-[250px] w-full overflow-hidden rounded bg-[#F5F5F5] flex items-center justify-center p-8">
        {/* Discount Badge */}
        {product.discount && (
          <span className="absolute left-3 top-3 rounded bg-[#DB4444] px-3 py-1 text-xs text-white">
            -{product.discount}%
          </span>
        )}
        
        {/* Action Icon: Trash for Wishlist, Eye for Recommendations */}
        <div className="absolute right-3 top-3">
          <button className="rounded-full bg-white p-2 hover:bg-[#DB4444] hover:text-white transition-colors">
            {isRecommendation ? <Eye size={20} /> : <Trash2 size={20} />}
          </button>
        </div>

        <img src={product.image} alt={product.name} className="max-h-full object-contain mix-blend-multiply" />

        {/* Wishlist Specific Add to Cart Button */}
        <button 
          onClick={handleAddToCart}
          className="absolute bottom-0 flex items-center justify-center gap-2 w-full bg-black py-2.5 text-white text-xs font-medium"
        >
          <ShoppingCart size={16} />
          Add To Cart
        </button>
      </div>

      <div className="mt-4 flex flex-col gap-2">
        <h3 className="font-semibold text-base line-clamp-1">{product.name}</h3>
        <div className="flex gap-3">
          <span className="text-[#DB4444] font-medium">${product.price}</span>
          {product.oldPrice && (
            <span className="text-gray-400 line-through">${product.oldPrice}</span>
          )}
        </div>
      </div>
    </div>
  );
};
export default WishlistCard;