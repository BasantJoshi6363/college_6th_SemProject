import React, { useContext } from 'react';
import { ChevronDown, Search, Heart, ShoppingCart, LogOut, User as UserIcon } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishListContext';
// import { WishlistContext } from '../context/WishlistContext';

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

  return (
    <nav className="w-full border-b border-gray-200 bg-white py-4 sticky top-0 z-50">
      <div className="mx-auto max-w-7xl flex items-center justify-between px-4">
        
        <Link to="/" className="flex-shrink-0">
          <h1 className="text-2xl font-bold tracking-wider">EasyMart</h1>
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
          <div className="relative hidden lg:block">
            <input 
              type="text" 
              placeholder="What are you looking for?" 
              className="w-[240px] rounded bg-[#F5F5F5] py-2 pl-3 pr-10 text-sm focus:ring-1 focus:ring-gray-300 outline-none transition-all"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
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
              
                {isAuthenticated&&( <Link to="/profile" className="flex items-center gap-1 group">
                  <UserIcon size={24} className="group-hover:text-blue-600 transition-colors" />
                  <span className="hidden sm:inline text-sm font-medium">{user?.name?.split(' ')[0]}</span>
                </Link>)}
               
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
      <TopHeader />
      <MainNavbar />
    </header>
  );
};

export default Header;