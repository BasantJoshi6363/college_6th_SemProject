import React from 'react';
import { ChevronUp, ChevronDown, X } from 'lucide-react';

const CartItem = ({ item }) => {
  return (
    <div className="flex items-center justify-between rounded bg-white px-10 py-6 shadow-sm mb-10 border border-gray-50">
      {/* Product Info */}
      <div className="flex w-1/4 items-center gap-4">
        <div className="relative group">
          <img src={item.image} alt={item.name} className="h-14 w-14 object-contain" />
          <button className="absolute -left-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#DB4444] text-white opacity-0 group-hover:opacity-100 transition-opacity">
            <X size={12} />
          </button>
        </div>
        <span className="text-base font-normal">{item.name}</span>
      </div>

      {/* Price */}
      <div className="w-1/4 text-center">
        <span>${item.price}</span>
      </div>

      {/* Quantity Selector */}
      <div className="w-1/4 flex justify-center">
        <div className="flex items-center gap-3 rounded border border-black/40 px-3 py-1.5 min-w-[72px] justify-between">
          <span>{item.quantity.toString().padStart(2, '0')}</span>
          <div className="flex flex-col">
            <ChevronUp size={14} className="cursor-pointer hover:text-[#DB4444]" />
            <ChevronDown size={14} className="cursor-pointer hover:text-[#DB4444]" />
          </div>
        </div>
      </div>

      {/* Subtotal */}
      <div className="w-1/4 text-right">
        <span>${item.price * item.quantity}</span>
      </div>
    </div>
  );
};

export default CartItem;