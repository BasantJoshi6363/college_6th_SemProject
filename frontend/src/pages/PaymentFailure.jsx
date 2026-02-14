import React from 'react';
import { XCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PaymentFailure = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-md">
        <XCircle size={100} className="text-[#DB4444] mx-auto mb-8" />
        <h1 className="text-5xl font-bold mb-4">Payment Cancelled</h1>
        <p className="text-gray-600 mb-4 text-lg">
          Your payment was cancelled or declined.
        </p>
        <p className="text-gray-500 mb-8">
          Don't worry, your cart items are safe. You can try again whenever you're ready.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={() => navigate('/checkout')}
            className="bg-[#DB4444] text-white px-10 py-3 rounded-lg font-medium hover:bg-[#c23d3d] transition"
          >
            Try Again
          </button>
          <button 
            onClick={() => navigate('/cart')}
            className="bg-white border-2 border-gray-300 px-10 py-3 rounded-lg font-medium hover:bg-gray-50 transition"
          >
            Back to Cart
          </button>
        </div>

        <div className="mt-12 flex items-center justify-center gap-2 text-sm text-gray-400">
          <AlertCircle size={16} />
          <span>Need help? Contact our support team</span>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailure;