import { createContext, useState, useEffect, useCallback, useMemo } from "react";
import toast from "react-hot-toast";

export const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
    const [wishlistItems, setWishlistItems] = useState(() => {
        const saved = localStorage.getItem("wishlistItems");
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem("wishlistItems", JSON.stringify(wishlistItems));
    }, [wishlistItems]);

   const addToWishlist = useCallback((product) => {
    const isExisting = wishlistItems.find(item => item._id === product._id);

    if (isExisting) {
        toast("Already in wishlist", { icon: "ℹ️" });
        return;
    }

    setWishlistItems((prev) => [...prev, product]);

    toast.success(`${product.title || 'Item'} added to wishlist!`, {
        position: "bottom-center"
    });

}, [wishlistItems]);

    const removeFromWishlist = useCallback((productId) => {
        setWishlistItems((prev) => {
            const updated = prev.filter(item => item._id !== productId);

            if (updated.length !== prev.length) {
                toast.error("Removed from wishlist");
            }

            return updated;
        });
    }, []);

    const clearWishlist = useCallback(() => {
        setWishlistItems([]);
        toast("Wishlist cleared");
    }, []);

    const value = useMemo(() => ({
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
    }), [wishlistItems, addToWishlist, removeFromWishlist, clearWishlist]);

    return (
        <WishlistContext.Provider value={value}>
            {children}
        </WishlistContext.Provider>
    );
};