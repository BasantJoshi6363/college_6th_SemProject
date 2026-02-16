import React, { useContext, useState } from 'react';
import { ChevronDown, Search, Heart, ShoppingCart, LogOut, User as UserIcon, X } from 'lucide-react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishListContext';
import ProductContext from '../context/ProductContext';

const TopHeader = () => {
  return (
    <div className="w-full bg-black py-2 text-white text-sm">
      <div className="mx-auto max-w-7xl flex items-center justify-between px-4">
        <div className="hidden md:block w-20"></div>
        <p className="text-center font-light tracking-wide">
          Summer Sale For All Swim Suits - OFF 50%! 
          <Link to="/shop" className="ml-2 font-semibold underline hover:text-gray-300">Shop Now</Link>
        </p>
        <div className="flex items-center gap-1 cursor-pointer hover:text-gray-300 transition-colors">
          <span>English</span>
          <ChevronDown size={16} />
        </div>
      </div>
    </div>
  );
};

const MainNavbar = () => {
  const { isAuthenticated, logout, user } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const { wishlistItems } = useContext(WishlistContext);
  const { products } = useContext(ProductContext);
  
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // Calculate dynamic counts
  const cartCount = cartItems?.reduce((acc, item) => acc + item.quantity, 0) || 0;
  const wishlistCount = wishlistItems?.length || 0;

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Contact', href: '/contact' },
    { name: 'About', href: '/about' },
    user?.isAdmin && { name: 'Admin', href: '/admin' },
    !isAuthenticated && { name: 'Sign Up', href: '/signup' },
  ].filter(Boolean);

  // Search handler
  const handleSearch = (query) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    // Using filter() for multiple results
    const filtered = products.filter(product => {
      const searchTerm = query.toLowerCase();
      return (
        product.name?.toLowerCase().includes(searchTerm) ||
        product.category?.toLowerCase().includes(searchTerm) ||
        product.description?.toLowerCase().includes(searchTerm)
      );
    });

    setSearchResults(filtered.slice(0, 5)); // Show top 5 results
    setShowDropdown(filtered.length > 0);
  };

  // Handle selecting a product from dropdown
  const handleSelectProduct = (productId) => {
    navigate(`/products/${productId}`);
    setSearchQuery('');
    setSearchResults([]);
    setShowDropdown(false);
  };

  // Handle "View all results" button click
  const handleViewAllResults = () => {
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setSearchResults([]);
      setShowDropdown(false);
    }
  };

  // Close dropdown when clicking outside
  const handleBlur = () => {
    setTimeout(() => setShowDropdown(false), 200);
  };

  return (
    <nav className="w-full border-b border-gray-200 bg-white py-4 sticky top-0 z-50">
      <div className="mx-auto max-w-7xl flex items-center justify-between px-4">
        
        <Link to="/" className="flex-shrink-0">
          <h1 className="text-2xl font-bold tracking-wider">TechVerse</h1>
        </Link>

        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.name}>
              <NavLink 
                to={link.href} 
                className={({ isActive }) => 
                  `text-base transition-colors hover:text-gray-600 ${
                    isActive ? 'border-b-2 border-black pb-1 font-medium' : ''
                  }`
                }
              >
                {link.name}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3 md:gap-6">
          {/* Search Bar with Dropdown */}
          <div className="relative hidden lg:block">
            <div>
              <input 
                type="text" 
                placeholder="What are you looking for?" 
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => searchResults.length > 0 && setShowDropdown(true)}
                onBlur={handleBlur}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleViewAllResults();
                  }
                }}
                className="w-[240px] rounded bg-[#F5F5F5] py-2 pl-3 pr-10 text-sm focus:ring-1 focus:ring-gray-300 outline-none transition-all"
              />
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSearchResults([]);
                    setShowDropdown(false);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  <X size={18} />
                </button>
              ) : (
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              )}
            </div>

            {/* Search Results Dropdown */}
            {showDropdown && searchResults.length > 0 && (
              <div className="absolute top-full mt-2 w-[320px] bg-white border border-gray-200 rounded-lg shadow-lg max-h-[400px] overflow-y-auto z-50">
                {searchResults.map((product) => (
                  <div
                    key={product._id}
                    onClick={() => handleSelectProduct(product._id)}
                    className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                  >
                    <img 
                      src={product?.images[0].url || '/placeholder-product.png'} 
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {product.name}
                      </h4>
                      <p className="text-xs text-gray-500 truncate">
                        {product.category}
                      </p>
                      <p className="text-sm font-semibold text-[#DB4444] mt-1">
                        Rs {product.discountedPrice}
                      </p>
                    </div>
                  </div>
                ))}
                {/* <div className="p-2 bg-gray-50 text-center border-t">
                  <button
                    onMouseDown={(e) => {
                      e.preventDefault(); // Prevent blur from happening
                      handleViewAllResults();
                    }}
                    className="text-sm text-[#DB4444] hover:underline font-medium"
                  >
                    View all results for "{searchQuery}"
                  </button>
                </div> */}
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            {/* Wishlist Icon with Badge */}
            <Link to="/wishlist" className="relative group">
              <Heart size={24} className="group-hover:text-[#DB4444] transition-colors" />
              {wishlistCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#DB4444] text-[10px] text-white">
                  {wishlistCount}
                </span>
              )}
            </Link>
            
            {/* Cart Icon with Badge */}
            {user && (
              <Link to="/cart" className="relative group">
                <ShoppingCart size={24} className="group-hover:text-[#DB4444] transition-colors" />
                {cartCount > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#DB4444] text-[10px] text-white">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}

            {isAuthenticated ? (
              <div className="flex items-center gap-4 border-l pl-4 ml-2">
                {isAuthenticated && (
                  <Link to="/profile" className="flex items-center gap-1 group">
                    <UserIcon size={24} className="group-hover:text-blue-600 transition-colors" />
                    <span className="hidden sm:inline text-sm font-medium">{user?.name?.split(' ')[0]}</span>
                  </Link>
                )}
               
                <button 
                  onClick={logout}
                  className="p-1 hover:bg-gray-100 rounded-full text-gray-600 hover:text-red-600 transition-all"
                >
                  <LogOut size={22} />
                </button>
              </div>
            ) : (
              <Link to="/login">
                <UserIcon size={24} className="hover:text-gray-600 transition-colors" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

const Header = () => {
  return (
    <header>
      {/* <TopHeader /> */}
      <MainNavbar />
    </header>
  );
};

export default Header;