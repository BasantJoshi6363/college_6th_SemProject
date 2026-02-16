import React, { useEffect, useContext, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Loader2, XCircle } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { memo } from 'react';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { clearCart } = useContext(CartContext);
  const [status, setStatus] = useState('verifying');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const verifyEsewaPayment = async () => {
      const encodedData = searchParams.get('data');
      
      
      if (!encodedData) {
        console.error("❌ No data parameter found");
        setStatus('error');
        setErrorMessage('No payment data received');
        return;
      }

      try {
        console.log("📡 Calling verification endpoint...");
        
        const { data } = await axios.get(
          `http://localhost:5000/api/orders/verify-payment?data=${encodedData}`
        );
        
        console.log("✅ Verification response:", data);
        
        if (data.success) {
          setStatus('success');
          clearCart();
          toast.success("Payment verified successfully!");
        } else {
          setStatus('error');
          setErrorMessage(data.message || 'Verification failed');
          toast.error(data.message || 'Payment verification failed');
        }
        
      } catch (err) {
        console.error("❌ Verification error:", err.response?.data || err);
        setStatus('error');
        setErrorMessage(err.response?.data?.message || 'Payment verification failed');
        toast.error(err.response?.data?.message || 'Payment verification failed');
      }
    };

    verifyEsewaPayment();
  }, [searchParams, clearCart]);

  if (status === 'verifying') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6">
        <Loader2 className="animate-spin text-[#DB4444]" size={64} />
        <h2 className="text-3xl font-semibold">Verifying Payment...</h2>
        <p className="text-gray-500">Please wait while we confirm your payment</p>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <div className="text-center max-w-md animate-in fade-in zoom-in duration-500">
          <CheckCircle size={100} className="text-green-500 mx-auto mb-8" />
          <h1 className="text-5xl font-bold mb-4">Payment Successful!</h1>
          <p className="text-gray-600 mb-4 text-lg">
            Thank you for your order. Your payment has been confirmed.
          </p>
          <p className="text-gray-500 mb-8">
            Product stock has been updated and you will receive a confirmation email shortly.
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
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-md">
        <XCircle size={100} className="text-[#DB4444] mx-auto mb-8" />
        <h1 className="text-5xl font-bold mb-4 text-[#DB4444]">Verification Failed</h1>
        <p className="text-gray-600 mb-4 text-lg">
          {errorMessage || "We couldn't verify your payment."}
        </p>
        <p className="text-gray-500 mb-8">
          Please contact support if money was deducted from your account.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={() => navigate('/checkout')}
            className="bg-[#DB4444] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#c23d3d] transition"
          >
            Try Again
          </button>
          <button 
            onClick={() => navigate('/contact')}
            className="bg-white border-2 border-gray-300 px-8 py-3 rounded-lg font-medium hover:bg-gray-50 transition"
          >
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default memo(PaymentSuccess);