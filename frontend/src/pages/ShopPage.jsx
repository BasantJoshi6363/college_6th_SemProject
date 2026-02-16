import React, { useContext, useEffect } from 'react';
import ProductContext from '../context/ProductContext';
import { CartContext } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import { Loader2, SlidersHorizontal } from 'lucide-react';

const ShopPage = () => {
  const { 
    products, 
    loading, 
    fetchProducts, 
    pagination, 
    changePage 
  } = useContext(ProductContext);
  
  const { addToCart, removeFromCart } = useContext(CartContext);

  useEffect(() => {
    // Fetch products with current filters/page on mount
    fetchProducts();
    window.scrollTo(0, 0);
  }, [fetchProducts]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">All Products</h1>
          <p className="text-gray-500 mt-2">
            Showing {products.length} of {pagination.total} products
          </p>
        </div>
        
        <button className="flex items-center gap-2 border px-4 py-2 rounded hover:bg-gray-50 transition-colors">
          <SlidersHorizontal size={18} />
          <span>Filters</span>
        </button>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 size={42} className="animate-spin text-[#DB4444]" />
        </div>
      ) : (
        <>
          {products.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-lg">
              <p className="text-gray-500 text-lg">No products found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12">
              {products.map((product) => (
                <ProductCard 
                  key={product._id} 
                  product={product} 
                  addToCart={addToCart} 
                  removeFromCart={removeFromCart} 
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Pagination Controls */}
      {pagination.pages > 1 && (
        <div className="mt-16 flex justify-center gap-2">
          {[...Array(pagination.pages)].map((_, i) => (
            <button
              key={i + 1}
              onClick={() => changePage(i + 1)}
              className={`px-4 py-2 rounded border transition-colors ${
                pagination.page === i + 1
                  ? 'bg-[#DB4444] text-white border-[#DB4444]'
                  : 'bg-white text-black hover:bg-gray-100'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShopPage;