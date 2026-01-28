import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Minus, Plus, Heart, Truck, RefreshCcw, Star } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishListContext';

// Reusable Components (Keep these as they are great for UI)
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
  const { id } = useParams(); // Get ID from URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState('');
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);

  // Contexts
  const { addToCart } = useContext(CartContext);
  const { wishlistItems, addToWishlist, removeFromWishlist } = useContext(WishlistContext);

  useEffect(() => {
    const getProduct = async () => {
      try {
        const res = await fetch(`https://dummyjson.com/products/${id}`);
        const data = await res.json();
        setProduct(data);
        setMainImage(data.images[0]); // Set first image as default
      } catch (err) {
        console.error("Failed to fetch product", err);
      } finally {
        setLoading(false);
      }
    };
    getProduct();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return <div className="h-screen flex items-center justify-center font-bold">Loading Product...</div>;
  if (!product) return <div className="h-screen flex items-center justify-center">Product not found.</div>;

  const isInWishlist = wishlistItems.some(item => item.id === product.id);

  const handleBuyNow = () => {
    // We add to cart 'quantity' times
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-20">
      {/* Dynamic Breadcrumb */}
      <div className="mb-20 text-sm text-gray-500 capitalize">
        <span>Account</span> <span className="mx-2">/</span>
        <span>{product.category}</span> <span className="mx-2">/</span>
        <span className="text-black font-medium">{product.title}</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-16">
        {/* Left: Thumbnail Gallery */}
        <div className="flex flex-col gap-4">
          {product.images.slice(0, 4).map((img, i) => (
            <div 
              key={i} 
              onMouseEnter={() => setMainImage(img)}
              className={`h-[138px] w-[170px] bg-[#F5F5F5] rounded flex items-center justify-center p-4 cursor-pointer border-2 transition-all ${mainImage === img ? 'border-[#DB4444]' : 'border-transparent'}`}
            >
              <img src={img} alt="thumbnail" className="max-h-full object-contain" />
            </div>
          ))}
        </div>

        {/* Center: Main Product Image */}
        <div className="flex-1 bg-[#F5F5F5] rounded flex items-center justify-center p-10 min-h-[600px]">
          <img src={mainImage} alt={product.title} className="w-full max-h-[500px] object-contain" />
        </div>

        {/* Right: Product Selection Panel */}
        <div className="w-full lg:w-[400px]">
          <h1 className="text-2xl font-semibold mb-4 text-black">{product.title}</h1>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="flex text-yellow-400">
               {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} fill={i < Math.floor(product.rating) ? "currentColor" : "none"} />
              ))}
            </div>
            <span className="text-sm text-gray-500 border-r border-black/50 pr-4">({product.stock} reviews)</span>
            <span className="text-sm text-[#00FF66]">In Stock</span>
          </div>

          <p className="text-2xl font-normal mb-6">${product.price.toFixed(2)}</p>
          <p className="text-sm leading-6 mb-6 border-b border-black/50 pb-6 text-gray-700">
            {product.description}
          </p>

          <div className="flex flex-col gap-6 mb-10">
            {/* Colors (Dynamic placeholder since DummyJSON doesn't always have colors) */}
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
              <button 
                onClick={() => setQuantity(q => Math.max(1, q - 1))} 
                className="p-2 px-4 hover:bg-gray-100 border-r border-black/50 cursor-pointer"
              >
                <Minus size={16}/>
              </button>
              <span className="px-8 font-medium">{quantity}</span>
              <button 
                onClick={() => setQuantity(q => q + 1)} 
                className="p-2 px-4 bg-[#DB4444] text-white cursor-pointer"
              >
                <Plus size={16}/>
              </button>
            </div>
            <button 
              onClick={handleBuyNow}
              className="flex-1 bg-[#DB4444] text-white rounded font-medium hover:bg-red-600 transition-colors"
            >
              Buy Now
            </button>
            <button 
              onClick={() => isInWishlist ? removeFromWishlist(product.id) : addToWishlist(product)}
              className={`p-2 border border-black/50 rounded hover:bg-gray-50 transition-colors ${isInWishlist ? 'bg-[#DB4444] text-white border-[#DB4444]' : ''}`}
            >
              <Heart size={24} fill={isInWishlist ? "white" : "none"}/>
            </button>
          </div>

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