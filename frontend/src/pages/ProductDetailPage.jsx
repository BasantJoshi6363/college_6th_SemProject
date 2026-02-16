import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Minus, Plus, Heart, Truck, RefreshCcw, Star, Loader2 } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishListContext';
import { RecommendationContext } from '../context/ReccomendationContext';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const { trackInteraction } = useContext(RecommendationContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState('');
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const { addToCart } = useContext(CartContext);
  const { wishlistItems, addToWishlist, removeFromWishlist } = useContext(WishlistContext);

  useEffect(() => {
    const getProduct = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/products/${id}`);
        const result = await res.json();

        if (result.success) {
          setProduct(result.data);
          setMainImage(result.data.images[0]?.url || '');

          if (result.data.sizes && result.data.sizes.length > 0) {
            setSelectedSize(result.data.sizes[0]);
          }
          
          // ✅ Track view interaction
          trackInteraction(id, 'view');
        }
      } catch (err) {
        console.error("Failed to fetch product", err);
      } finally {
        setLoading(false);
      }
    };

    getProduct();
    window.scrollTo(0, 0);
  }, [id, trackInteraction]);

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-[#DB4444]" size={48} />
        <span className="font-bold text-gray-400">Loading Product...</span>
      </div>
    );
  }

  if (!product) {
    return <div className="h-screen flex items-center justify-center">Product not found.</div>;
  }

  const isInWishlist = wishlistItems.some(item => item._id === product._id);

  const handleAddToCart = () => {
    const cartItem = { ...product, quantity };

    if (product.sizes && product.sizes.length > 0) {
      cartItem.selectedSize = selectedSize;
    }

    addToCart(cartItem);
    
    // ✅ Track cart interaction
    trackInteraction(product._id, 'cart');
  };

  const handleWishlistToggle = () => {
    if (isInWishlist) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product);
      trackInteraction(product._id, 'wishlist');
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-20">
      {/* Breadcrumb */}
      <div className="mb-20 text-sm text-gray-500">
        <span>Account</span> <span className="mx-2">/</span>
        <span className="capitalize">{product.category}</span> <span className="mx-2">/</span>
        <span className="text-black font-medium">{product.name}</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-16">

        {/* Thumbnail List */}
        <div className="flex flex-row lg:flex-col gap-4 order-2 lg:order-1">
          {product.images.map((img, i) => (
            <div
              key={i}
              onMouseEnter={() => setMainImage(img.url)}
              className={`h-[100px] w-[120px] lg:h-[138px] lg:w-[170px] bg-[#F5F5F5] rounded flex items-center justify-center p-4 cursor-pointer border-2 transition-all ${
                mainImage === img.url ? 'border-[#DB4444]' : 'border-transparent'
              }`}
            >
              <img src={img.url} alt={`view-${i}`} className="max-h-full object-contain" />
            </div>
          ))}
        </div>

        {/* Main Image */}
        <div className="flex-1 bg-[#F5F5F5] rounded flex items-center justify-center p-10 min-h-[400px] lg:min-h-[600px] order-1 lg:order-2">
          <img src={mainImage} alt={product.name} className="w-full max-h-[500px] object-contain" />
        </div>

        {/* Product Details */}
        <div className="w-full lg:w-[400px] order-3">
          <h1 className="text-3xl font-bold mb-4 text-black">{product.name}</h1>

          <div className="flex items-center gap-4 mb-4">
            <div className="flex text-[#FFAD33]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={18} fill={i < 4 ? "currentColor" : "none"} />
              ))}
            </div>

            <span className="text-sm text-gray-400 border-r border-black/50 pr-4 font-medium uppercase">
              {product.brand || 'No Brand'}
            </span>

            <span className={`text-sm font-medium ${product.stock > 0 ? 'text-[#00FF66]' : 'text-[#DB4444]'}`}>
              {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-4 mb-6">
            <p className="text-2xl font-medium">
              Rs{(product.discountedPrice || product.originalPrice).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            </p>
            {product.discountedPrice && (
              <p className="text-xl text-gray-500 line-through">
                Rs{product.originalPrice.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              </p>
            )}
          </div>

          <p className="text-sm leading-7 mb-8 border-b border-black/30 pb-8 text-gray-600">
            {product.description}
          </p>

          {/* Sizes */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="flex items-center gap-6 mb-10">
              <span className="text-xl font-medium">Size:</span>
              <div className="flex gap-3 flex-wrap">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`h-8 w-10 rounded border text-sm font-medium transition-all ${
                      selectedSize === s
                        ? 'bg-[#DB4444] border-[#DB4444] text-white'
                        : 'border-black/50 text-black hover:border-[#DB4444]'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Purchase Actions */}
          <div className="flex flex-wrap gap-4 mb-10">
            <div className="flex items-center border border-black/50 rounded-md overflow-hidden">
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="px-4 py-2 hover:bg-gray-100 border-r border-black/50"
              >
                <Minus size={20} />
              </button>
              <span className="px-8 text-xl font-bold">{quantity}</span>
              <button
                onClick={() => setQuantity(q => q + 1)}
                className="px-4 py-2 bg-[#DB4444] text-white hover:bg-red-600"
              >
                <Plus size={20} />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="flex-1 bg-[#DB4444] text-white rounded-md font-bold px-8 py-2 hover:bg-red-600 disabled:bg-gray-300"
            >
              Add to Cart
            </button>

            <button
              onClick={handleWishlistToggle}
              className={`p-2 border border-black/50 rounded-md ${
                isInWishlist ? 'bg-[#DB4444] text-white border-[#DB4444]' : ''
              }`}
            >
              <Heart size={28} fill={isInWishlist ? "white" : "none"} />
            </button>
          </div>

          {/* Logistics */}
          <div className="flex flex-col rounded-md">
            <div className="flex items-center gap-4 border border-black/30 p-4 first:rounded-t">
              <Truck size={32} />
              <div>
                <h4 className="text-base font-medium">Free Delivery</h4>
                <p className="text-xs font-medium underline cursor-pointer">Check your location</p>
                <p className="text-xs mt-1 text-gray-500">Enter your postal code for delivery availability</p>
              </div>
            </div>
            <div className="flex items-center gap-4 border border-black/30 p-4 last:rounded-b last:border-t-0">
              <RefreshCcw size={32} />
              <div>
                <h4 className="text-base font-medium">Return Delivery</h4>
                <p className="text-xs font-medium underline cursor-pointer">Details</p>
                <p className="text-xs mt-1 text-gray-500">Free 30 Days Delivery Returns. Check details</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;