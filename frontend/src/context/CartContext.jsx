import { createContext, useState, useEffect, useCallback, useMemo } from "react";
import toast from "react-hot-toast"; // 1. Import toast

export const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem('cartItems');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

   const addToCart = useCallback((product) => {
        // 1. Trigger the toast OUTSIDE the setter
        toast.success(`${product.name || 'Item'} added to cart!`, {
            position: "bottom-center",
            style: {
                borderRadius: '10px',
                background: '#333',
                color: '#fff',
            },
        });

        // 2. Now handle the state logic cleanly
        setCartItems((prevItems) => {
            const existingItem = prevItems.find(item => item.id === product.id);
            
            if (existingItem) {
                return prevItems.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prevItems, { ...product, quantity: 1 }];
        });
    }, []);

    const removeFromCart = useCallback((productId) => {
        setCartItems((prevItems) => prevItems.filter(item => item.id !== productId));
        toast.error("Item removed from cart");
    }, []);

    const updateQuantity = useCallback((productId, delta) => {
    setCartItems((prevItems) =>
        prevItems.map((item) => {
            if (item.id === productId) {
                const newQuantity = item.quantity + delta;
                // Don't allow quantity to go below 1
                return { ...item, quantity: newQuantity < 1 ? 1 : newQuantity };
            }
            return item;
        })
    );
}, []);

    const clearCart = useCallback(() => {
        setCartItems([]);
        toast("Cart cleared", { icon: '🗑️' });
    }, []);

    const value = useMemo(() => ({
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        updateQuantity
    }), [cartItems, addToCart, removeFromCart, clearCart,updateQuantity]);

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};