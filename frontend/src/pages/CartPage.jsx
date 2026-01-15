import React from 'react';
import CartItem from '../components/CartItem';

const CartPage = ({ cartItems }) => {
  return (
    <div className="mx-auto max-w-7xl px-4 py-20">
      {/* Breadcrumb */}
      <div className="mb-20 text-sm text-gray-500">
        <span>Home</span> <span className="mx-2">/</span> <span className="text-black">Cart</span>
      </div>

      {/* Table Headers */}
      <div className="flex items-center justify-between rounded bg-white px-10 py-6 shadow-sm mb-10 font-medium">
        <span className="w-1/4">Product</span>
        <span className="w-1/4 text-center">Price</span>
        <span className="w-1/4 text-center">Quantity</span>
        <span className="w-1/4 text-right">Subtotal</span>
      </div>

      {/* List of Items */}
      {cartItems.map((item) => (
        <CartItem key={item.id} item={item} />
      ))}

      {/* Action Buttons */}
      <div className="flex justify-between mt-6 mb-20">
        <button className="rounded border border-black/50 px-12 py-4 font-medium hover:bg-black hover:text-white transition-all">
          Return To Shop
        </button>
        <button className="rounded border border-black/50 px-12 py-4 font-medium hover:bg-black hover:text-white transition-all">
          Update Cart
        </button>
      </div>

      {/* Bottom Section: Coupon & Cart Total */}
      <div className="flex flex-col lg:flex-row justify-between items-start gap-10">
        {/* Coupon Section */}
        <div className="flex gap-4 w-full lg:w-auto">
          <input 
            type="text" 
            placeholder="Coupon Code" 
            className="rounded border border-black px-6 py-4 outline-none w-full lg:w-[300px]"
          />
          <button className="rounded bg-[#DB4444] px-12 py-4 text-white hover:bg-red-600 transition-colors whitespace-nowrap">
            Apply Coupon
          </button>
        </div>

        {/* Cart Total Summary Card */}
        <div className="w-full lg:w-[470px] rounded border-2 border-black p-8">
          <h3 className="text-xl font-medium mb-8">Cart Total</h3>
          
          <div className="flex justify-between border-b border-black/20 pb-4 mb-4">
            <span>Subtotal:</span>
            <span>$1750</span>
          </div>
          
          <div className="flex justify-between border-b border-black/20 pb-4 mb-4">
            <span>Shipping:</span>
            <span>Free</span>
          </div>
          
          <div className="flex justify-between mb-8 font-medium">
            <span>Total:</span>
            <span>$1750</span>
          </div>

          <div className="flex justify-center">
            <button className="rounded bg-[#DB4444] px-12 py-4 text-white hover:bg-red-600 transition-colors">
              Process to checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;