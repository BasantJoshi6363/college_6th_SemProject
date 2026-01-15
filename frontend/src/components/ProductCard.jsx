import React from 'react';
import { Heart, Eye, Star } from 'lucide-react';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {

  const handleAddToCart = () => {
    toast.success(`${name} added to cart!`, {
      style: { borderRadius: '4px', background: '#333', color: '#fff' },
    });
  };

  return (
    <div className="group relative w-full flex-shrink-0 sm:w-[270px]">
      {/* Image Container */}
      <div className="relative h-[250px] w-full overflow-hidden rounded bg-[#F5F5F5] flex items-center justify-center p-8">
        {/* {discount && (
          <span className="absolute left-3 top-3 rounded bg-[#DB4444] px-3 py-1 text-xs text-white">
            -{discount}%
          </span>
        )} */}
        
        {/* Action Icons */}
        <div className="absolute right-3 top-3 flex flex-col gap-2">
          <button className="rounded-full bg-white p-1.5 hover:bg-[#DB4444] hover:text-white transition-colors">
            <Heart size={20} />
          </button>
          <button className="rounded-full bg-white p-1.5 hover:bg-[#DB4444] hover:text-white transition-colors">
            <Eye size={20} />
          </button>
        </div>

        <img src={product.images[0]} alt={name} className="max-h-full object-contain" />

        {/* Add to Cart Button (Hover) */}
        <button 
          onClick={handleAddToCart}
          className="absolute bottom-0 w-full translate-y-full bg-black py-2 text-white transition-all group-hover:translate-y-0"
        >
          Add To Cart
        </button>
      </div>

      {/* Info */}
      <div className="mt-4 flex flex-col gap-2">
        <h3 className="font-medium text-black line-clamp-1">{product?.title}</h3>
        <div className="flex gap-3 font-medium">
          <span className="text-[#DB4444]">${product?.price}</span>
          {/* <span className="text-gray-400 line-through">${originalPrice}</span> */}
        </div>
        <div className="flex items-center gap-2">
          {/* <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={16} fill={i < Math.floor(rating) ? "currentColor" : "none"} />
            ))}
          </div> */}
          {/* <span className="text-sm font-semibold text-gray-500">({reviews})</span> */}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;