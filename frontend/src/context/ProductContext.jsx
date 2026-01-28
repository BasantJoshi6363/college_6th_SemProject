import { createContext, useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export const ProductContext = createContext(null);

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [dummyProducts, setDummyProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const API_URL = "http://localhost:5000/api/products";

  // 1. STABLE FETCH FUNCTION
  // We remove 'loading' from dependencies to prevent re-triggering when loading toggles
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const [localRes, dummyRes] = await Promise.allSettled([
        axios.get(API_URL),
        axios.get("https://dummyjson.com/products?limit=8")
      ]);

      if (localRes.status === "fulfilled") {
        setProducts(localRes.value.data.products);
      }
      if (dummyRes.status === "fulfilled") {
        setDummyProducts(dummyRes.value.data.products);
      }
    } catch (error) {
      toast.error("Error connecting to server");
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array makes this function constant

  // 2. RUN ONCE ON MOUNT
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // 3. CRUD OPERATIONS (Optimized to use functional updates)
  const addProduct = useCallback(async (formData) => {
    const tId = toast.loading("Adding product...");
    try {
      const { data } = await axios.post(`${API_URL}/create`, formData);
      setProducts(prev => [data.product, ...prev]);
      toast.success("Product added!", { id: tId });
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || "Error adding product", { id: tId });
    }
  }, []);

  const editProduct = useCallback(async (id, formData) => {
    const tId = toast.loading("Updating product...");
    try {
      const { data } = await axios.put(`${API_URL}/update/${id}`, formData);
      setProducts(prev => prev.map(p => p._id === id ? data.product : p));
      toast.success("Updated successfully", { id: tId });
      return true;
    } catch (err) {
      toast.error("Update failed", { id: tId });
    }
  }, []);

  const removeProduct = useCallback(async (id) => {
    if (!window.confirm("Are you sure?")) return;
    const tId = toast.loading("Deleting...");
    try {
      await axios.delete(`${API_URL}/delete/${id}`);
      setProducts(prev => prev.filter(p => p._id !== id));
      toast.success("Deleted", { id: tId });
    } catch (err) {
      toast.error("Delete failed", { id: tId });
    }
  }, []);

  const value = useMemo(() => ({
    products, 
    dummyProducts, 
    loading, 
    addProduct, 
    editProduct, 
    removeProduct, 
    refresh: fetchProducts
  }), [products, dummyProducts, loading, addProduct, editProduct, removeProduct, fetchProducts]);

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
};