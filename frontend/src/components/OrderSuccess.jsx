import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { CartContext } from '../context/CartContext';

const OrderSuccess = () => {
  const navigate = useNavigate();
  const { clearCart } = useContext(CartContext);

  useEffect(() => {
    // Clear cart when order is successful
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-md animate-in fade-in zoom-in duration-500">
        <CheckCircle size={100} className="text-green-500 mx-auto mb-8" />
        <h1 className="text-5xl font-bold mb-4">Order Placed Successfully!</h1>
        <p className="text-gray-600 mb-4 text-lg">
          Thank you for your order. We'll process it soon.
        </p>
        <p className="text-gray-500 mb-8">
          You will receive a confirmation email with order details.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={() => navigate('/profile')}
            className="bg-[#DB4444] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#c23d3d] transition"
          >
            View My Orders
          </button>
          <button 
            onClick={() => navigate('/')}
            className="bg-white border-2 border-gray-300 px-8 py-3 rounded-lg font-medium hover:bg-gray-50 transition"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;