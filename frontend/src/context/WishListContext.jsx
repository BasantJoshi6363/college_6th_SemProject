import { createContext, useState, useEffect, useCallback, useMemo } from "react";
import toast from "react-hot-toast";

export const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
    const [wishlistItems, setWishlistItems] = useState(() => {
        const saved = localStorage.getItem('wishlistItems');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('wishlistItems', JSON.stringify(wishlistItems));
    }, [wishlistItems]);

   const addToWishlist = useCallback((product) => {
    // 1. Check if it's already there BEFORE calling state
    setWishlistItems((prev) => {
        const isExisting = prev.find(item => item._id === product._id);


        if (isExisting) {
            toast("Already in wishlist", { icon: 'ℹ️' });
            return prev;
        }

        // 2. Trigger the toast OUTSIDE the logic but inside the function scope
        toast.success(`${product.title || 'Item'} added to wishlist!`, {
            position: "bottom-center"
        });

        return [...prev, product];
    });
}, []);

    const removeFromWishlist = useCallback((productId) => {
        setWishlistItems((prev) => prev.filter(item => item._id !== productId)
);
        toast.error("Removed from wishlist");
    }, []);

    const clearWishlist = useCallback(() => {
        setWishlistItems([]);
    }, []);

    const value = useMemo(() => ({
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        clearWishlist
    }), [wishlistItems, addToWishlist, removeFromWishlist, clearWishlist]);

    return (
        <WishlistContext.Provider value={value}>
            {children}
        </WishlistContext.Provider>
    );
};