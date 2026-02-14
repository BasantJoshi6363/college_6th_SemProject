import React, { useContext, useMemo } from 'react';
import CartItem from '../components/CartItem';
import { CartContext } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
  const { cartItems } = useContext(CartContext);
  const navigate = useNavigate();

  // Subtotal logic
  const subtotal = useMemo(() => {
    return cartItems.reduce((acc, item) => {
      const price = item.discountedPrice || item.originalPrice || 0;
      return acc + price * item.quantity;
    }, 0);
  }, [cartItems]);

  // No currency rate — use subtotal directly
  const grandTotal = subtotal;

  return (
    <div className="mx-auto max-w-7xl px-4 py-20">
      {/* Breadcrumb */}
      <div className="mb-10 text-sm text-gray-500">
        Home / <span className="text-black">Cart</span>
      </div>

      {cartItems.length === 0 ? (
        <div className="text-center py-20 text-gray-500 border border-dashed rounded-lg mb-10 bg-gray-50">
          <p className="text-xl mb-4">Your cart is currently empty.</p>
          <button
            onClick={() => navigate('/')}
            className="text-[#DB4444] font-medium underline"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="hidden md:flex items-center justify-between rounded bg-white px-10 py-6 shadow-sm mb-6 border border-gray-100 font-medium">
            <span className="w-1/4">Product</span>
            <span className="w-1/4 text-center">Price</span>
            <span className="w-1/4 text-center">Quantity</span>
            <span className="w-1/4 text-right">Subtotal</span>
          </div>

          {cartItems.map(item => (
            <CartItem key={item._id} item={item} />
          ))}
        </div>
      )}

      <div className="flex justify-between mt-6 mb-20">
        <button
          onClick={() => navigate('/')}
          className="rounded border border-black/50 px-12 py-4 font-medium hover:bg-black hover:text-white transition-all"
        >
          Return To Shop
        </button>
      </div>

      {/* Cart Summary */}
      <div className="w-full lg:w-[470px] rounded border-2 border-black p-8 ml-auto">
        <h3 className="text-xl font-medium mb-8">Cart Total</h3>

        <div className="flex justify-between mb-4 pb-4 border-b border-black/10">
          <span>Subtotal:</span>
          <span className="font-medium">Rs {grandTotal.toLocaleString()}</span>
        </div>

        <div className="flex justify-between mb-8 pb-4 border-b border-black/10">
          <span>Shipping:</span>
          <span className="text-[#00FF66]">Free</span>
        </div>

        <div className="flex justify-between mb-8 font-medium">
          <span>Total:</span>
          <span className="text-xl font-bold">Rs {grandTotal.toLocaleString()}</span>
        </div>

        {cartItems.length === 0 ? (
          <p className="text-[#DB4444] text-center text-sm font-medium">
            Your cart is empty.
          </p>
        ) : (
          <button
            onClick={() => navigate('/checkout')}
            className="rounded bg-[#DB4444] px-12 py-4 text-white w-full font-medium hover:bg-red-600 transition-colors shadow-md active:scale-95"
          >
            Proceed To Checkout
          </button>
        )}
      </div>
    </div>
  );
};

export default CartPage;
