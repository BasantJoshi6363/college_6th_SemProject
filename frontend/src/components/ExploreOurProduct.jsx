import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import ProductCard from './ProductCard';
import { Link } from 'react-router-dom';

// 1. Add the missing props here
const ExploreProducts = ({ 
  products, 
  title = "Explore Our Products", 
  subtitle = "Our Products",
  wishlistItems, 
  addToWishlist, 
  removeFromWishlist, 
  addToCart, 
  trackInteraction 
}) => {
  console.log("Rendering ExploreProducts with products:", products);
  return (
    <section className="mx-auto max-w-7xl px-4 py-20">
      {/* Section Header */}
      <div className="mb-14 flex items-end justify-between">
        <div>
          <div className="mb-4 flex items-center gap-4">
            <div className="h-10 w-5 rounded bg-[#DB4444]" />
            <span className="font-semibold text-[#DB4444]">{subtitle}</span>
          </div>
          <h2 className="text-4xl font-bold tracking-wider">{title}</h2>
        </div>

        <div className="flex gap-2">
          <button className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F5F5F5] hover:bg-gray-200">
            <ArrowLeft size={24} />
          </button>
          <button className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F5F5F5] hover:bg-gray-200">
            <ArrowRight size={24} />
          </button>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
        {
          products.length === 0 ? (
            <p className="text-gray-500 col-span-full text-center">No products available.</p>
          ) : (
            products.map((product) => (
              <ProductCard 
                key={product._id} 
                product={product}
                // 2. Pass these through to the individual cards
                wishlistItems={wishlistItems}
                addToWishlist={addToWishlist}
                removeFromWishlist={removeFromWishlist}
                addToCart={addToCart}
                trackInteraction={trackInteraction}
              />
            ))
          ) 
        }
      </div>

      <div className="mt-16 flex justify-center">
        <Link to="/products" className="rounded bg-[#DB4444] px-12 py-4 text-white hover:bg-red-600 transition-colors font-medium">
          View All Products
        </Link>
      </div>
    </section>
  );
};

export default ExploreProducts;