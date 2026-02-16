import React, { useContext } from 'react';
import { Heart, Eye, Star } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishListContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);
  const { wishlistItems, addToWishlist, removeFromWishlist } = useContext(WishlistContext);
  const { trackInteraction } = useContext(WishlistContext);
  const navigate = useNavigate();

  const isInWishlist = wishlistItems.some((item) => item._id === product._id);

  const handleWishlistToggle = (e) => {
    e.preventDefault(); 
    e.stopPropagation();
    if (isInWishlist) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product);
      trackInteraction(product._id, 'wishlist');
    }
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    trackInteraction(product._id, 'cart');
  };

  const handleProductClick = () => {
    trackInteraction(product._id, 'view');
  };

  return (
    <div className="group relative w-full flex-shrink-0 sm:w-[270px]">
      <Link 
        to={`/products/${product._id}`} 
        className="block"
        onClick={handleProductClick}
      >
        <div className="relative h-[250px] w-full overflow-hidden rounded bg-[#F5F5F5] flex items-center justify-center p-8">
          
          {/* Action Icons */}
          <div className="absolute right-3 top-3 flex flex-col gap-2 z-10">
            <button 
              onClick={handleWishlistToggle}
              className={`rounded-full p-1.5 transition-colors shadow-sm cursor-pointer ${
                isInWishlist ? 'bg-[#DB4444] text-white' : 'bg-white text-black hover:bg-[#DB4444] hover:text-white'
              }`}
            >
              <Heart size={20} fill={isInWishlist ? "currentColor" : "none"} />
            </button>
            <button className="rounded-full bg-white p-1.5 hover:bg-[#DB4444] hover:text-white transition-colors cursor-pointer">
              <Eye size={20} />
            </button>
          </div>

          <img 
            src={product?.images[0]?.url} 
            alt={product?.name} 
            className="max-h-full object-contain mix-blend-multiply" 
          />

          {/* Add to Cart Button */}
          <button 
            onClick={handleAddToCart}
            className="absolute bottom-0 w-full translate-y-full bg-black py-2 text-white transition-all group-hover:translate-y-0 cursor-pointer"
          >
            Add To Cart
          </button>
        </div>
      </Link>

      <div className="mt-4 flex flex-col gap-2">
        <Link 
          to={`/products/${product._id}`}
          onClick={handleProductClick}
        >
          <h3 className="font-medium text-black line-clamp-1 hover:text-[#DB4444] transition-colors">
            {product?.name}
          </h3>
        </Link>
        <div className="flex gap-3 font-medium">
          <span className="text-[#DB4444]">
            Rs {product?.discountedPrice || product?.originalPrice}
          </span>
          {product?.discountedPrice && (
            <span className="text-gray-500 line-through">
              Rs {product?.originalPrice}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;