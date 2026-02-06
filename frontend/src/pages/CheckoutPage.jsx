import React, { useContext, useMemo, useState } from 'react';
import FormField from '../components/FormField';
import { CartContext } from '../context/CartContext';
import toast from 'react-hot-toast';

const CheckoutPage = () => {
  const { cartItems } = useContext(CartContext);

  // Coupon state
  const [couponInput, setCouponInput] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);

  // Calculate subtotal
  const subtotal = useMemo(() => {
    return cartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
  }, [cartItems]);

  // Apply coupon
  const handleApplyCoupon = () => {
    if (couponInput.toUpperCase() === 'SAVE10') {
      setDiscountPercent(0.1);
      toast.success('Coupon applied! 10% discount added.');
    } else if (!couponInput) {
      toast.error('Please enter a coupon code.');
    } else {
      toast.error('Invalid coupon code.');
      setDiscountPercent(0);
    }
  };

  const discountAmount = subtotal * discountPercent;
  const shipping = 0;
  const total = subtotal - discountAmount + shipping;

  return (
    <div className="mx-auto max-w-7xl px-4 py-20">

      {/* Breadcrumb */}
      <div className="mb-20 text-sm text-gray-500">
        Account <span className="mx-2">/</span>
        My Account <span className="mx-2">/</span>
        Product <span className="mx-2">/</span>
        View Cart <span className="mx-2">/</span>
        <span className="text-black font-medium">Checkout</span>
      </div>

      <h1 className="text-4xl font-medium tracking-wider mb-12">
        Billing Details
      </h1>

      <div className="flex flex-col lg:flex-row justify-between gap-20">

        {/* LEFT: Billing Form */}
        <form className="flex flex-col gap-8 w-full">
          <FormField label="First Name" required />
          <FormField label="Company Name" />
          <FormField label="Street Address" required />
          <FormField label="Apartment, floor, etc. (optional)" />
          <FormField label="Town/City" required />
          <FormField label="Phone Number" required type="tel" />
          <FormField label="Email Address" required type="email" />

          <label className="flex items-center gap-3 cursor-pointer mt-2">
            <input
              type="checkbox"
              className="accent-[#DB4444] h-5 w-5 rounded"
              defaultChecked
            />
            <span className="text-sm">
              Save this information for faster check-out next time
            </span>
          </label>
        </form>

        {/* RIGHT: Order Summary */}
        <div className="w-full lg:max-w-[530px] pt-4">

          {/* Cart Items */}
          <div className="flex flex-col gap-8 mb-8">
            {cartItems.length === 0 ? (
              <p className="text-gray-500">No items in the cart.</p>
            ) : (
              cartItems.map(item => (
                <div
                  key={item.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-5">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-14 w-14 object-contain"
                    />
                    <span>
                      {item.name} × {item.quantity}
                    </span>
                  </div>
                  <span className="font-medium">
                    ${(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))
            )}
          </div>

          {/* Totals */}
          <div className="flex flex-col gap-4 border-b border-black/20 pb-4 mb-4">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>${subtotal.toLocaleString()}</span>
            </div>

            {discountPercent > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount (10%):</span>
                <span>- ${discountAmount.toLocaleString()}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span>Shipping:</span>
              <span>Free</span>
            </div>
          </div>

          <div className="flex justify-between font-medium mb-8">
            <span>Total:</span>
            <span className="text-xl">
              ${total.toLocaleString()}
            </span>
          </div>

          {/* Payment Methods */}
          <div className="flex flex-col gap-4 mb-8">
            <label className="flex items-center gap-4 cursor-pointer">
              <input
                type="radio"
                name="payment"
                className="accent-black h-5 w-5"
              />
              <span>Bank</span>
            </label>

            <label className="flex items-center gap-4 cursor-pointer">
              <input
                type="radio"
                name="payment"
                className="accent-black h-5 w-5"
                defaultChecked
              />
              <span>Cash on delivery</span>
            </label>
          </div>

          {/* Coupon */}
          <div className="flex gap-4 mb-8">
            <input
              type="text"
              placeholder="Coupon Code"
              value={couponInput}
              onChange={e => setCouponInput(e.target.value)}
              className="flex-1 rounded border border-black px-6 py-4 outline-none"
            />
            <button
              onClick={handleApplyCoupon}
              type="button"
              className="rounded bg-[#DB4444] px-12 py-4 text-white hover:bg-red-600"
            >
              Apply Coupon
            </button>
          </div>

          {/* Place Order */}
          <button
            disabled={cartItems.length === 0}
            className={`rounded bg-[#DB4444] px-12 py-4 text-white font-medium w-full
              ${cartItems.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-600'}
            `}
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
