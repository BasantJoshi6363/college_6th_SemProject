import React, { useContext, useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, X, Filter, Loader2 } from 'lucide-react';
import ProductContext from '../context/ProductContext';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishListContext';
import { memo } from 'react';

const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Get products from context
  const productContext = useContext(ProductContext);
  console.log('Product Context:', productContext); // Debug log
  
  const { products = [], loading = false } = productContext || {};
  const { addToCart } = useContext(CartContext);
  const { addToWishlist, removeFromWishlist, wishlistItems = [] } = useContext(WishlistContext);

  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('default');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });

  // Debug: Log everything
  useEffect(() => {
    console.log('=== SHOP PAGE DEBUG ===');
    console.log('Products:', products);
    console.log('Products length:', products?.length);
    console.log('Loading:', loading);
    console.log('Search Query:', searchQuery);
    console.log('Product Context:', productContext);
  }, [products, loading, searchQuery, productContext]);

  // Update search query when URL parameter changes
  useEffect(() => {
    const urlSearch = searchParams.get('search');
    console.log('URL Search param:', urlSearch);
    if (urlSearch) {
      setSearchQuery(urlSearch);
    }
  }, [searchParams]);

  // Get unique categories
  const categories = ['All', ...new Set(products.map(p => p?.category).filter(Boolean))];
  console.log('Categories:', categories);

  // Filter products based on search, category, and price
  const filteredProducts = products.filter(product => {
    if (!product) return false;

    const matchesSearch = !searchQuery.trim() || 
      product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    
    const matchesPrice = product.price >= priceRange.min && product.price <= priceRange.max;

    return matchesSearch && matchesCategory && matchesPrice;
  });

  console.log('Filtered Products:', filteredProducts);
  console.log('Filtered Products length:', filteredProducts.length);

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return (a.price || 0) - (b.price || 0);
      case 'price-high':
        return (b.price || 0) - (a.price || 0);
      case 'name-az':
        return (a.name || '').localeCompare(b.name || '');
      case 'name-za':
        return (b.name || '').localeCompare(a.name || '');
      case 'newest':
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      default:
        return 0;
    }
  });

  // Handle search
  const handleSearch = (value) => {
    setSearchQuery(value);
    if (value.trim()) {
      setSearchParams({ search: value });
    } else {
      setSearchParams({});
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchParams({});
  };

  // Check if product is in wishlist
  const isInWishlist = (productId) => {
    return wishlistItems.some(item => item._id === productId);
  };

  const toggleWishlist = (product) => {
    if (isInWishlist(product._id)) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold mb-4">Shop</h1>
          
          {/* Debug Info - Remove this in production */}
          <div className="mb-4 p-3 bg-yellow-100 rounded text-xs">
            <p><strong>Debug Info:</strong></p>
            <p>Total Products: {products?.length || 0}</p>
            <p>Filtered Products: {filteredProducts?.length || 0}</p>
            <p>Loading: {loading ? 'Yes' : 'No'}</p>
            <p>Search Query: {searchQuery || 'None'}</p>
          </div>
          
          {/* Search Bar */}
          <div className="relative max-w-2xl">
            <input
              type="text"
              placeholder="Search products by name, category, or brand..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full px-4 py-3 pl-12 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DB4444] focus:border-transparent"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            )}
          </div>

          {searchQuery && (
            <p className="mt-3 text-gray-600">
              Showing results for: <span className="font-semibold">"{searchQuery}"</span>
            </p>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow p-6 sticky top-24">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Filter size={20} />
                Filters
              </h2>

              {/* Category Filter */}
              <div className="mb-6">
                <h3 className="font-medium mb-3">Category</h3>
                <div className="space-y-2">
                  {categories.map(category => (
                    <label key={category} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        checked={selectedCategory === category}
                        onChange={() => setSelectedCategory(category)}
                        className="w-4 h-4 text-[#DB4444] focus:ring-[#DB4444]"
                      />
                      <span className="text-sm">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h3 className="font-medium mb-3">Price Range</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-gray-600">Min Price</label>
                    <input
                      type="number"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                      className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-[#DB4444] outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600">Max Price</label>
                    <input
                      type="number"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                      className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-[#DB4444] outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Reset Filters */}
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setPriceRange({ min: 0, max: 10000 });
                  clearSearch();
                }}
                className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition"
              >
                Reset Filters
              </button>
            </div>
          </aside>

          {/* Products Grid */}
          <main className="flex-1">
            {/* Sort and Results Count */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <p className="text-gray-600">
                <span className="font-semibold">{sortedProducts.length}</span> products found
              </p>
              
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DB4444]"
                >
                  <option value="default">Default</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name-az">Name: A-Z</option>
                  <option value="name-za">Name: Z-A</option>
                  <option value="newest">Newest First</option>
                </select>
              </div>
            </div>

            {/* Loading State */}
            {loading ? (
              <div className="flex flex-col justify-center items-center h-64">
                <Loader2 className="animate-spin h-12 w-12 text-[#DB4444]" />
                <p className="mt-4 text-gray-500">Loading products...</p>
              </div>
            ) : products.length === 0 ? (
              /* No Products in Database */
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <div className="text-gray-400 mb-4">
                  <Search size={64} className="mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No products in store</h3>
                <p className="text-gray-500">There are no products available at the moment.</p>
                <p className="text-sm text-gray-400 mt-2">Check your Product Context or API</p>
              </div>
            ) : sortedProducts.length === 0 ? (
              /* No Search Results */
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <div className="text-gray-400 mb-4">
                  <Search size={64} className="mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No products found</h3>
                <p className="text-gray-500 mb-4">
                  {searchQuery 
                    ? `No products match "${searchQuery}". Try a different search term.`
                    : "Try adjusting your filters"}
                </p>
                <button
                  onClick={() => {
                    clearSearch();
                    setSelectedCategory('All');
                    setPriceRange({ min: 0, max: 10000 });
                  }}
                  className="px-6 py-2 bg-[#DB4444] text-white rounded-lg hover:bg-red-600 transition"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              /* Products Grid */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {sortedProducts.map(product => (
                  <div key={product._id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden group">
                    <Link to={`/product/${product._id}`} className="block">
                      <div className="relative aspect-square overflow-hidden bg-gray-100">
                        <img
                          src={product.image || '/placeholder-product.png'}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {product.stock === 0 && (
                          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                            <span className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold">
                              Out of Stock
                            </span>
                          </div>
                        )}
                      </div>
                    </Link>

                    <div className="p-4">
                      <Link to={`/product/${product._id}`}>
                        <h3 className="font-semibold text-gray-800 mb-1 hover:text-[#DB4444] transition line-clamp-2">
                          {product.name}
                        </h3>
                      </Link>
                      <p className="text-sm text-gray-500 mb-2">{product.category}</p>
                      
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-lg font-bold text-[#DB4444]">
                          ${product.price?.toFixed(2)}
                        </span>
                        {product.stock > 0 && (
                          <span className="text-xs text-gray-500">
                            {product.stock} in stock
                          </span>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => addToCart(product)}
                          disabled={product.stock === 0}
                          className="flex-1 bg-[#DB4444] text-white py-2 rounded-lg hover:bg-red-600 transition disabled:bg-gray-300 disabled:cursor-not-allowed text-sm font-medium"
                        >
                          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                        </button>
                        <button
                          onClick={() => toggleWishlist(product)}
                          className={`p-2 rounded-lg border transition ${
                            isInWishlist(product._id)
                              ? 'bg-red-50 border-[#DB4444] text-[#DB4444]'
                              : 'border-gray-300 hover:border-[#DB4444] hover:text-[#DB4444]'
                          }`}
                        >
                          <svg
                            className="w-5 h-5"
                            fill={isInWishlist(product._id) ? 'currentColor' : 'none'}
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default memo(ShopPage);