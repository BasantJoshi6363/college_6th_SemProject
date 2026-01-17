import { createContext, useState, useEffect, useCallback, useMemo } from "react";

export const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    // Function to add item to cart
    const addToCart = useCallback((product) => {
        setCartItems((prevItems) => {
            const existingItem = prevItems.find(item => item.id === product.id);
            if (existingItem) {
                return prevItems.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );

            } else {
                return [...prevItems, { ...product, quantity: 1 }];
            }

        });
        // localStorage.setItem('cartItems', JSON.stringify(cartItems));

    }, []);

    // Function to remove item from cart
    const removeFromCart = useCallback((productId) => {
        setCartItems((prevItems) => prevItems.filter(item => item.id !== productId));
    }, []);

    // Function to clear the cart
    const clearCart = useCallback(() => {
        setCartItems([]);
    }, []);

    const value = useMemo(() => ({
        cartItems,
        addToCart,
        removeFromCart,
        clearCart
    }), [cartItems, addToCart, removeFromCart, clearCart]);
    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};