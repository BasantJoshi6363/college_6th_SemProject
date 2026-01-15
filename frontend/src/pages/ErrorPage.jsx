import React from 'react';
import { Link } from 'react-router-dom'; 
const ErrorPage = () => {
  return (
    <div className="mx-auto max-w-7xl px-4 py-20 min-h-[600px] flex flex-col">
      {/* Breadcrumb Navigation */}
      <div className="mb-24 text-sm text-gray-500">
        <span className="hover:text-black cursor-pointer">Home</span> 
        <span className="mx-2">/</span> 
        <span className="text-black font-medium">404 Error</span>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col items-center justify-center flex-1 text-center">
        <h1 className="text-[110px] font-medium tracking-widest leading-none mb-10 text-black">
          404 Not Found
        </h1>
        
        <p className="text-base font-normal mb-20 text-black">
          Your visited page not found. You may go home page.
        </p>

        {/* Home Button */}
        <Link to="/">
          <button className="rounded bg-[#DB4444] px-12 py-4 text-white hover:bg-red-600 transition-colors font-medium">
            Back to home page
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;