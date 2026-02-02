import React, { useContext, useMemo, useState } from 'react'; // Added useState
import CartItem from '../components/CartItem';
import { CartContext } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
// import { Link } from 'lucide-react';
import { Link } from 'react-router-dom';

const CartPage = () => {
  const { cartItems } = useContext(CartContext);
  const navigate = useNavigate();

  // --- Coupon States ---
  const [couponInput, setCouponInput] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);

  // 1. Calculate Base Subtotal
  const subtotal = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [cartItems]);

  // 2. Handle Coupon Application
  const handleApplyCoupon = () => {
    if (couponInput.toUpperCase() === "SAVE10") {
      setDiscountPercent(0.10); // 10%
      toast.success("Coupon applied! 10% discount added.");
    } else if (couponInput === "") {
      toast.error("Please enter a code.");
    } else {
      toast.error("Invalid Coupon Code");
      setDiscountPercent(0);
    }
  };

  // 3. Final Calculations
  const discountAmount = subtotal * discountPercent;
  const shipping = 0;
  const total = subtotal - discountAmount + shipping;

  return (
    <div className="mx-auto max-w-7xl px-4 py-20">
      {/* ... (Breadcrumb and Headers remain the same) ... */}

      {/* Cart Items */}
      {cartItems.length === 0 ? (
        <div className="text-center py-20 text-gray-500 border border-dashed rounded-lg mb-10">
          Your cart is currently empty.
        </div>
      ) : (
        cartItems.map((item) => <CartItem key={item.id} item={item} />)
      )}

      {/* Action Buttons */}
      <div className="flex justify-between mt-6 mb-20">
        <button onClick={() => navigate('/')} className="rounded border border-black/50 px-12 py-4 font-medium hover:bg-black hover:text-white transition-all">
          Return To Shop
        </button>
      </div>

      {/* Bottom Section: Coupon & Cart Total */}
      <div className="flex flex-col lg:flex-row justify-between items-start gap-10">
        
        {/* Coupon Section */}
        <div className="flex gap-4 w-full lg:w-auto">
          <input 
            type="text" 
            placeholder="Coupon Code" 
            value={couponInput}
            onChange={(e) => setCouponInput(e.target.value)}
            className="rounded border border-black px-6 py-4 outline-none w-full lg:w-[300px]"
          />
          <button 
            onClick={handleApplyCoupon}
            className="rounded bg-[#DB4444] px-12 py-4 text-white hover:bg-red-600 transition-colors whitespace-nowrap"
          >
            Apply Coupon
          </button>
        </div>

        {/* Cart Total Summary Card */}
        <div className="w-full lg:w-[470px] rounded border-2 border-black p-8">
          <h3 className="text-xl font-medium mb-8">Cart Total</h3>
          
          <div className="flex justify-between border-b border-black/20 pb-4 mb-4">
            <span>Subtotal:</span>
            <span>${subtotal.toLocaleString()}</span>
          </div>

          {/* Show Discount Row only if a coupon is applied */}
          {discountPercent > 0 && (
            <div className="flex justify-between border-b border-black/20 pb-4 mb-4 text-green-600">
              <span>Discount (10%):</span>
              <span>-${discountAmount.toLocaleString()}</span>
            </div>
          )}
          
          <div className="flex justify-between border-b border-black/20 pb-4 mb-4">
            <span>Shipping:</span>
            <span>{shipping === 0 ? 'Free' : `$${shipping}`}</span>
          </div>
          
          <div className="flex justify-between mb-8 font-medium">
            <span>Total:</span>
            <span className="text-xl">${total.toLocaleString()}</span>
          </div>

          {/* <div className="flex justify-center">
            <button 
              disabled={cartItems.length === 0}
              className={`rounded bg-[#DB4444] px-12 py-4 text-white hover:bg-red-600 transition-colors w-full ${cartItems.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
             <Link to={"/checkout"}>Proceed To Checkout</Link>
            </button>
          </div> */}
          <div className="flex justify-center">
            {cartItems.length === 0 ? (
              <span className="text-red-600 mt-2">Add items to cart to proceed to checkout.</span>
            ):<button 
              onClick={() => navigate('/checkout')}
              className="rounded bg-[#DB4444] px-12 py-4 text-white hover:bg-red-600 transition-colors w-full"
            >
             <Link to={"/checkout"}>Proceed To Checkout</Link>
            </button>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;