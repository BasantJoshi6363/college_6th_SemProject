import React, { useContext, useRef } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import ProductCard from './ProductCard';
import { CartContext } from '../context/CartContext';

const FlashSale = ({ products }) => {
  const scrollRef = useRef(null);
  const {addToCart,removeFromCart} = useContext(CartContext);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <section className="px-4 py-10 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex items-end justify-between">
        <div className="flex items-end gap-10">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="h-10 w-5 rounded bg-[#DB4444]" />
              <span className="font-semibold text-[#DB4444]">Today's</span>
            </div>
            <h2 className="text-4xl font-bold tracking-wider">Flash Sales</h2>
          </div>
          
          {/* Simple Timer Design */}
          <div className="hidden md:flex gap-4 items-center">
            {['Days', 'Hours', 'Minutes', 'Seconds'].map((label, i) => (
              <div key={label} className="flex items-center gap-4">
                <div>
                  <p className="text-xs font-bold">{label}</p>
                  <p className="text-3xl font-bold">03</p>
                </div>
                {i !== 3 && <span className="text-[#E07575] text-3xl mt-4">:</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-2">
          <button onClick={() => scroll('left')} className="rounded-full bg-[#F5F5F5] p-3 hover:bg-gray-200">
            <ArrowLeft size={24} />
          </button>
          <button onClick={() => scroll('right')} className="rounded-full bg-[#F5F5F5] p-3 hover:bg-gray-200">
            <ArrowRight size={24} />
          </button>
        </div>
      </div>

      {/* Product List */}
      <div 
        ref={scrollRef}
        className="flex gap-8 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
      >
        {products.map((product) => (
          <ProductCard key={product?.id} product={product} />
        ))}
      </div>

      <div className="mt-12 flex justify-center">
        <button className="rounded bg-[#DB4444] px-12 py-4 text-white hover:bg-red-600 transition-colors">
          View All Products
        </button>
      </div>
    </section>
  );
};

export default FlashSale;