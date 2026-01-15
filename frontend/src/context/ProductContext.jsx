import { createContext, useState, useEffect, useCallback, useMemo } from "react";


export const ProductContext = createContext(null);

export const ProductProvider = ({ children }) => {
    
  return (
    <ProductContext.Provider value={null}>
      {children}
    </ProductContext.Provider>
  );
};