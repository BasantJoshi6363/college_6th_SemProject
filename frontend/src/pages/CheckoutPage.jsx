import React from 'react';
import FormField from '../components/FormField';

const CheckoutPage = ({ orderItems }) => {
  return (
    <div className="mx-auto max-w-7xl px-4 py-20">
      {/* Breadcrumb Navigation */}
      <div className="mb-20 text-sm text-gray-500">
        <span>Account</span> <span className="mx-2">/</span>
        <span>My Account</span> <span className="mx-2">/</span>
        <span>Product</span> <span className="mx-2">/</span>
        <span>View Cart</span> <span className="mx-2">/</span>
        <span className="text-black font-medium">CheckOut</span>
      </div>

      <h1 className="text-4xl font-medium tracking-wider mb-12">Billing Details</h1>

      <div className="flex flex-col lg:flex-row justify-between gap-20">
        
        {/* Left Side: Billing Form */}
        <form className="flex flex-col gap-8 w-full">
          <FormField label="First Name" required />
          <FormField label="Company Name" />
          <FormField label="Street Address" required />
          <FormField label="Apartment, floor, etc. (optional)" />
          <FormField label="Town/City" required />
          <FormField label="Phone Number" required type="tel" />
          <FormField label="Email Address" required type="email" />
          
          <label className="flex items-center gap-3 cursor-pointer mt-2">
            <input type="checkbox" className="accent-[#DB4444] h-5 w-5 rounded" defaultChecked />
            <span className="text-sm">Save this information for faster check-out next time</span>
          </label>
        </form>

        {/* Right Side: Order Summary */}
        <div className="w-full lg:max-w-[530px] pt-4">
          {/* Item List */}
          <div className="flex flex-col gap-8 mb-8">
            {orderItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between">
                <div className="flex items-center gap-5">
                  <img src={item.image} alt={item.name} className="h-14 w-14 object-contain" />
                  <span className="font-normal">{item.name}</span>
                </div>
                <span className="font-medium">${item.price}</span>
              </div>
            ))}
          </div>

          {/* Pricing Totals */}
          <div className="flex flex-col gap-4 border-b border-black/20 pb-4 mb-4">
            <div className="flex justify-between"><span>Subtotal:</span><span>$1750</span></div>
            <div className="flex justify-between"><span>Shipping:</span><span>Free</span></div>
          </div>
          <div className="flex justify-between font-medium mb-8">
            <span>Total:</span><span>$1750</span>
          </div>

          {/* Payment Methods */}
          <div className="flex flex-col gap-4 mb-8">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-4 cursor-pointer">
                <input type="radio" name="payment" className="accent-black h-5 w-5" />
                <span>Bank</span>
              </label>
              <div className="flex gap-2">
                <img src="/bkash.png" alt="Bkash" className="h-4" />
                <img src="/visa.png" alt="Visa" className="h-4" />
                <img src="/mastercard.png" alt="Mastercard" className="h-4" />
                <img src="/nagad.png" alt="Nagad" className="h-4" />
              </div>
            </div>
            <label className="flex items-center gap-4 cursor-pointer">
              <input type="radio" name="payment" className="accent-black h-5 w-5" defaultChecked />
              <span>Cash on delivery</span>
            </label>
          </div>

          {/* Coupon and Place Order */}
          <div className="flex gap-4 mb-8">
            <input 
              type="text" 
              placeholder="Coupon Code" 
              className="flex-1 rounded border border-black px-6 py-4 outline-none"
            />
            <button className="rounded bg-[#DB4444] px-12 py-4 text-white hover:bg-red-600 transition-colors">
              Apply Coupon
            </button>
          </div>

          <button className="rounded bg-[#DB4444] px-12 py-4 text-white hover:bg-red-600 transition-colors font-medium">
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;