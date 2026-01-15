import React, { useState } from 'react';
import { Minus, Plus, Heart, Truck, RefreshCcw } from 'lucide-react';

// Reusable Size Button
const SizeButton = ({ size, isSelected, onClick }) => (
  <button
    onClick={onClick}
    className={`h-8 w-8 rounded border text-sm font-medium transition-all ${
      isSelected 
      ? 'bg-[#DB4444] border-[#DB4444] text-white' 
      : 'border-black/50 text-black hover:border-black'
    }`}
  >
    {size}
  </button>
);

// Delivery Info Card
const DeliveryInfo = ({ icon: Icon, title, linkText, description }) => (
  <div className="flex items-center gap-4 border border-black/30 p-4 first:rounded-t last:rounded-b last:border-t-0">
    <Icon size={32} />
    <div>
      <h4 className="text-base font-medium">{title}</h4>
      <p className="text-xs font-medium underline cursor-pointer">{linkText}</p>
      {description && <p className="text-xs mt-1">{description}</p>}
    </div>
  </div>
);

const ProductDetailsPage = () => {
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(2);

  return (
    <div className="mx-auto max-w-7xl px-4 py-20">
      {/* Breadcrumb */}
      <div className="mb-20 text-sm text-gray-500">
        <span>Account</span> <span className="mx-2">/</span>
        <span>Gaming</span> <span className="mx-2">/</span>
        <span className="text-black font-medium">Havic HV G-92 Gamepad</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-16">
        {/* Left: Thumbnail Gallery */}
        <div className="flex flex-col gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-[138px] w-[170px] bg-[#F5F5F5] rounded flex items-center justify-center p-4 cursor-pointer">
              <img src="/gamepad-angle.png" alt="angle" className="max-h-full object-contain" />
            </div>
          ))}
        </div>

        {/* Center: Main Product Image */}
        <div className="flex-1 bg-[#F5F5F5] rounded flex items-center justify-center p-10 min-h-[600px]">
          <img src="/main-gamepad.png" alt="Havic Gamepad" className="w-full object-contain" />
        </div>

        {/* Right: Product Selection Panel */}
        <div className="w-full lg:w-[400px]">
          <h1 className="text-2xl font-semibold mb-4 text-black">Havic HV G-92 Gamepad</h1>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="flex text-yellow-400">
              {[...Array(4)].map((_, i) => <span key={i}>★</span>)}
              <span className="text-gray-300">★</span>
            </div>
            <span className="text-sm text-gray-500 border-r border-black/50 pr-4">(150 Reviews)</span>
            <span className="text-sm text-[#00FF66]">In Stock</span>
          </div>

          <p className="text-2xl font-normal mb-6">$192.00</p>
          <p className="text-sm leading-6 mb-6 border-b border-black/50 pb-6">
            PlayStation 5 Controller Skin High quality vinyl with air channel adhesive for easy bubble free install & mess free removal Pressure sensitive.
          </p>

          {/* Configuration Options */}
          <div className="flex flex-col gap-6 mb-10">
            <div className="flex items-center gap-6">
              <span className="text-xl">Colours:</span>
              <div className="flex gap-2">
                <button className="h-5 w-5 rounded-full bg-[#A0BCE0] border-2 border-black" />
                <button className="h-5 w-5 rounded-full bg-[#DB4444]" />
              </div>
            </div>

            <div className="flex items-center gap-6">
              <span className="text-xl">Size:</span>
              <div className="flex gap-2">
                {['XS', 'S', 'M', 'L', 'XL'].map((s) => (
                  <SizeButton key={s} size={s} isSelected={selectedSize === s} onClick={() => setSelectedSize(s)} />
                ))}
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex gap-4 mb-10">
            <div className="flex items-center border border-black/50 rounded overflow-hidden">
              <button onClick={() => setQuantity(q => Math.max(1, q-1))} className="p-2 px-4 hover:bg-gray-100 border-r border-black/50"><Minus size={16}/></button>
              <span className="px-8 font-medium">{quantity}</span>
              <button onClick={() => setQuantity(q => q+1)} className="p-2 px-4 bg-[#DB4444] text-white"><Plus size={16}/></button>
            </div>
            <button className="flex-1 bg-[#DB4444] text-white rounded font-medium hover:bg-red-600">Buy Now</button>
            <button className="p-2 border border-black/50 rounded hover:bg-gray-50"><Heart size={24}/></button>
          </div>

          {/* Delivery Services */}
          <div className="flex flex-col">
            <DeliveryInfo 
              icon={Truck} 
              title="Free Delivery" 
              linkText="Enter your postal code for Delivery Availability" 
            />
            <DeliveryInfo 
              icon={RefreshCcw} 
              title="Return Delivery" 
              linkText="Free 30 Days Delivery Returns. Details" 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;



