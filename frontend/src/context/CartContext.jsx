import { createContext, useState, useEffect, useCallback, useMemo } from "react";

export const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};