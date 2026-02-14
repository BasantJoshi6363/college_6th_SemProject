import React, { useContext } from 'react';
import { ChevronUp, ChevronDown, X } from 'lucide-react';
import { CartContext } from '../context/CartContext';

const CartItem = ({ item }) => {
  const { removeFromCart, updateQuantity } = useContext(CartContext);

  // Use discountedPrice if available, otherwise originalPrice
  const itemPrice = item.discountedPrice || item.originalPrice || 0;

  return (
    <div className="flex items-center justify-between rounded bg-white px-10 py-6 shadow-sm mb-10 border border-gray-100">
      
      {/* Product Info */}
      <div className="flex w-1/4 items-center gap-4">
        <div className="relative group">
          <img 
            src={item.images?.[0]?.url || '/placeholder.png'} 
            alt={item.name} 
            className="h-14 w-14 object-contain" 
          />
          
          <button 
            onClick={() => removeFromCart(item._id)}
            className="absolute -left-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#DB4444] text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
          >
            <X size={12} />
          </button>
        </div>

        <span className="text-base font-medium text-black truncate">
          {item.name}
        </span>
      </div>

      {/* Price */}
      <div className="w-1/4 text-center font-medium">
        <span>Rs {itemPrice.toLocaleString()}</span>
      </div>

      {/* Quantity Selector */}
      <div className="w-1/4 flex justify-center">
        <div className="flex items-center gap-3 rounded border border-black/30 px-3 py-1.5 min-w-[80px] justify-between">
          <span className="font-medium text-black">
            {item.quantity.toString().padStart(2, '0')}
          </span>
          <div className="flex flex-col">
            <ChevronUp 
              size={14}
              className="cursor-pointer hover:text-[#DB4444]"
              onClick={() => updateQuantity(item._id, 1)}
            />
            <ChevronDown 
              size={14}
              className="cursor-pointer hover:text-[#DB4444]"
              onClick={() => updateQuantity(item._id, -1)}
            />
          </div>
        </div>
      </div>

      {/* Subtotal */}
      <div className="w-1/4 text-right font-semibold text-black">
        <span>
          Rs {(itemPrice * item.quantity).toLocaleString()}
        </span>
      </div>
    </div>
  );
};

export default CartItem;
