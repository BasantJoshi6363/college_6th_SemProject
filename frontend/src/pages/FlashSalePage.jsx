import React, { useContext, useEffect, useMemo } from 'react';
import ProductContext from '../context/ProductContext';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishListContext';
import ProductCard from '../components/ProductCard';
import { Loader2 } from 'lucide-react';
import RecommendedProduct from '../components/ReccomendedProduct';

const FlashSalePage = () => {
  const { products, loading: productsLoading, fetchProducts } = useContext(ProductContext);
  const { addToCart } = useContext(CartContext);
  const { wishlistItems, addToWishlist, removeFromWishlist } = useContext(WishlistContext);

  // Filter only flash sale items
  const flashSaleProducts = useMemo(() => products.filter(p => p.isFlash), [products]);

  // Fetch products on mount if empty
  useEffect(() => {
    if (products.length === 0) fetchProducts({}, 1, true);
    window.scrollTo(0, 0);
  }, [fetchProducts, products.length]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-20">
      {/* Flash Sale Header */}
      <div className="mb-10">
        <div className="flex items-center gap-4 mb-4">
          <div className="h-10 w-5 rounded bg-[#DB4444]" />
          <span className="font-semibold text-[#DB4444]">Today's</span>
        </div>
        <h2 className="text-4xl font-bold tracking-wider">Flash Sales</h2>
      </div>

      <hr className="mb-12 border-gray-200" />

      {/* Flash Sale Products Grid */}
      {productsLoading && products.length === 0 ? (
        <div className="flex h-60 items-center justify-center">
          <Loader2 size={42} className="animate-spin text-[#DB4444]" />
        </div>
      ) : flashSaleProducts.length === 0 ? (
        <div className="py-20 text-center col-span-full">
          <h3 className="text-xl text-gray-500 font-medium">No active Flash Sales.</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
          {flashSaleProducts.map(product => (
            <ProductCard
              key={product._id}
              product={product}
              addToCart={addToCart}
              addToWishlist={addToWishlist}
              removeFromWishlist={removeFromWishlist}
              wishlistItems={wishlistItems}
            />
          ))}
        </div>
      )}

      {/* Recommended Products Section */}
      <div className="mt-32">
        <div className="flex items-center gap-4 mb-10">
          <div className="h-10 w-5 rounded bg-[#DB4444]" />
          <h2 className="text-3xl font-bold">Recommended For You</h2>
        </div>

        {/* RecommendedProduct now handles fetching, loading & empty states internally */}
        <RecommendedProduct excludeIds={flashSaleProducts.map(p => p._id)} limit={4} />
      </div>
    </div>
  );
};

export default FlashSalePage;
