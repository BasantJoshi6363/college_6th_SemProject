import React, { useContext, useMemo, useState } from 'react';
import { CartContext } from '../context/CartContext';
import toast from 'react-hot-toast';
import axios from 'axios';
import esewaLogo from '../assets/esewa.png';

const CheckoutPage = () => {
  const { cartItems, clearCart } = useContext(CartContext);
  console.log(cartItems)
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [formData, setFormData] = useState({
    fullName: '', 
    street: '', 
    city: '', 
    phone: '', 
    email: ''
  });

  // Calculate prices with rounding
  const subtotal = useMemo(() => {
    const total = cartItems.reduce((acc, item) => {
      const price = item.discountedPrice || item.originalPrice || 0;
      return acc + price * item.quantity;
    }, 0);
    return Math.round(total);
  }, [cartItems]);

  const taxPrice = useMemo(() => Math.round(subtotal * 0.13), [subtotal]);
  const shippingPrice = useMemo(() => subtotal > 500 ? 0 : 100, [subtotal]);
  const totalPrice = useMemo(() => subtotal + taxPrice + shippingPrice, [subtotal, taxPrice, shippingPrice]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

 const handlePlaceOrder = async (e) => {
  e.preventDefault();
  
  if (cartItems.length === 0) {
    return toast.error("Cart is empty");
  }

  const orderData = {
    orderItems: cartItems.map(item => ({
      product: item._id,
      name: item.name,
      quantity: item.quantity,
      price: item.discountedPrice || item.originalPrice,
    })),
    shippingAddress: {
      addressLine1: formData.street,
      city: formData.city,
      state: "Bagmati",
      postalCode: "44600",
      country: "Nepal",
    },
    paymentMethod,
    itemsPrice: subtotal,
    taxPrice,
    shippingPrice,
    totalPrice,
  };

  console.log("📦 Placing order:", orderData);

  try {
    const { data } = await axios.post(
      'http://localhost:5000/api/orders',
      orderData,
      { 
        headers: { 
          Authorization: `Bearer ${localStorage.getItem("google-token")}` 
        } 
      }
    );

    console.log("✅ Order created:", data);

    if (paymentMethod === 'eSewa') {
      toast.loading("Redirecting to eSewa...", { duration: 2000 });
      setTimeout(() => {
        makeEsewaPayment(
          data.createdOrder, 
          data.signature, 
          data.totalAmountForPayment
        );
      }, 500);
    } else {
      toast.success("Order placed successfully!");
      clearCart(); // Clear cart immediately for COD
      
      // Redirect to order success page for COD
      window.location.href = "/order-success"; // Make sure this route exists
    }

  } catch (err) {
    console.error("❌ Order error:", err.response?.data || err);
    toast.error(err.response?.data?.message || "Order failed. Please try again.");
  }
};
  const makeEsewaPayment = (order, signature, totalAmountForPayment) => {
    const path = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";

    const esewaFields = {
      "amount": String(order.itemsPrice),
      "tax_amount": String(order.taxPrice),
      "total_amount": totalAmountForPayment,
      "transaction_uuid": String(order._id),
      "product_code": "EPAYTEST",
      "product_service_charge": "0",
      "product_delivery_charge": String(order.shippingPrice),
      "success_url": "http://localhost:5173/payment-success",
      "failure_url": "http://localhost:5173/payment-failure",
      "signed_field_names": "total_amount,transaction_uuid,product_code",
      "signature": signature
    };

    console.log("\n========================================");
    console.log("📤 SUBMITTING TO eSewa");
    console.log("========================================");
    console.log("URL:", path);
    console.log("Fields:", JSON.stringify(esewaFields, null, 2));
    console.log("========================================\n");

    const form = document.createElement("form");
    form.setAttribute("method", "POST");
    form.setAttribute("action", path);

    for (const key in esewaFields) {
      const hiddenField = document.createElement("input");
      hiddenField.setAttribute("type", "hidden");
      hiddenField.setAttribute("name", key);
      hiddenField.setAttribute("value", esewaFields[key]);
      form.appendChild(hiddenField);
    }

    document.body.appendChild(form);
    form.submit();
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-20">
      <form onSubmit={handlePlaceOrder} className="flex flex-col lg:flex-row justify-between gap-20">
        
        {/* Billing Details */}
        <div className="flex flex-col gap-8 w-full">
          <h1 className="text-4xl font-medium mb-12">Billing Details</h1>
          
          <input
            name="fullName"
            placeholder="Full Name"
            required
            onChange={handleInputChange}
            value={formData.fullName}
            className="p-4 border rounded focus:outline-none focus:ring-2 focus:ring-[#DB4444]"
          />
          
          <input
            name="street"
            placeholder="Street Address"
            required
            onChange={handleInputChange}
            value={formData.street}
            className="p-4 border rounded focus:outline-none focus:ring-2 focus:ring-[#DB4444]"
          />
          
          <input
            name="city"
            placeholder="City"
            required
            onChange={handleInputChange}
            value={formData.city}
            className="p-4 border rounded focus:outline-none focus:ring-2 focus:ring-[#DB4444]"
          />
          
          <input
            name="phone"
            placeholder="Phone Number"
            required
            onChange={handleInputChange}
            value={formData.phone}
            className="p-4 border rounded focus:outline-none focus:ring-2 focus:ring-[#DB4444]"
          />
          
          <input
            name="email"
            type="email"
            placeholder="Email Address"
            required
            onChange={handleInputChange}
            value={formData.email}
            className="p-4 border rounded focus:outline-none focus:ring-2 focus:ring-[#DB4444]"
          />
        </div>

        {/* Order Summary & Payment */}
        <div className="w-full lg:max-w-[530px]">
          <div className="p-8 border rounded-lg bg-gray-50">
            <h2 className="text-2xl font-medium mb-6">Order Summary</h2>
            
            {/* Cart Items */}
            <div className="mb-6 space-y-3">
              {cartItems.map(item => (
                <div key={item._id} className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <img 
                      src={item.images[0]?.url || '/placeholder.png'} 
                      alt={item.name} 
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-medium">
                    Rs. {((item.discountedPrice || item.originalPrice) * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Price Breakdown */}
            <div className="border-t pt-4 mb-6 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>Rs. {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (13%):</span>
                <span>Rs. {taxPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>Rs. {shippingPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
                <span>Total:</span>
                <span>Rs. {totalPrice.toLocaleString()}</span>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="mb-6">
              <h3 className="font-medium mb-4">Payment Method</h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-100 transition">
                  <input
                    type="radio"
                    name="payment"
                    value="eSewa"
                    checked={paymentMethod === 'eSewa'}
                    onChange={() => setPaymentMethod('eSewa')}
                    className="h-5 w-5 text-[#DB4444]"
                  />
                  <span className="flex items-center gap-2">
                    Pay with eSewa 
                    <img src={esewaLogo} alt="eSewa" className="h-6" />
                  </span>
                </label>
                
                <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-100 transition">
                  <input
                    type="radio"
                    name="payment"
                    value="COD"
                    checked={paymentMethod === 'COD'}
                    onChange={() => setPaymentMethod('COD')}
                    className="h-5 w-5 text-[#DB4444]"
                  />
                  <span>Cash on Delivery</span>
                </label>
              </div>
            </div>
            
            <button 
              type="submit" 
              className="w-full bg-[#DB4444] py-4 text-white rounded font-medium hover:bg-[#c23d3d] transition-colors"
            >
              {paymentMethod === 'eSewa' ? 'Proceed to eSewa' : 'Place Order'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;