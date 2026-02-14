import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import axios from 'axios';
import { useEffect } from 'react';

 const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    brand: '',
    minPrice: '',
    maxPrice: '',
    inStock: false,
  });

  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  // Memoized fetch products function
  const fetchProducts = useCallback(async (customFilters = {}, customPage = 1) => {
    setLoading(true);
    setError(null);
    
    try {
      const params = {
        ...filters,
        ...customFilters,
        page: customPage,
        limit: pagination.limit,
      };

      // Build query string
      const queryParams = new URLSearchParams();
      Object.keys(params).forEach(key => {
        if (params[key] !== '' && params[key] !== null && params[key] !== undefined) {
          queryParams.append(key, params[key]);
        }
      });

      const { data } = await axios.get(`${baseUrl}/products?${queryParams.toString()}`);
      
      setProducts(data.data);
      setPagination({
        page: data.page,
        limit: pagination.limit,
        total: data.total,
        pages: data.pages,
      });
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to fetch products';
      setError(message);
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.limit, baseUrl]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Memoized create product function
  const createProduct = useCallback(async (productData) => {
    setLoading(true);
    setError(null);
    
    try {
      let finalData;

      // FIX: If it's already FormData (from AdminPage), use it directly.
      // If it's a regular object, then convert it.
      if (productData instanceof FormData) {
        finalData = productData;
      } else {
        finalData = new FormData();
        Object.keys(productData).forEach(key => {
          if (key !== 'images' && productData[key] !== null && productData[key] !== undefined) {
            finalData.append(key, productData[key]);
          }
        });
        
        if (productData.images && productData.images.length > 0) {
          productData.images.forEach(image => {
            finalData.append('images', image);
          });
        }
      }

      // Debug: Check what's actually inside before sending
      for (let pair of finalData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }

      const { data } = await axios.post(`${baseUrl}/products`, finalData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem("google-token")}`,
        },
      });
      
      // Refresh products list
      await fetchProducts();
      
      return data;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to create product';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, [fetchProducts, baseUrl]);

  // Memoized get single product function
  const getProduct = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data } = await axios.get(`${baseUrl}/products/${id}`);
      return data.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to fetch product';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, [baseUrl]);

  // Memoized update product function
  const updateProduct = useCallback(async (id, productData) => {
  setLoading(true);
  try {
    let finalData;
    if (productData instanceof FormData) {
      finalData = productData;
    } else {
      // ... keep your existing object-to-formdata logic here ...
    }

    const { data } = await axios.put(`${baseUrl}/products/${id}`, finalData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${localStorage.getItem("google-token")}`,
      },
    });
    
    // Refresh the list to show updated data
    fetchProducts();
    return data;
  } catch (err) {
    // ... error handling ...
  }
}, [baseUrl, fetchProducts]);

  // Memoized delete product function
  const deleteProduct = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      await axios.delete(`${baseUrl}/products/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("google-token")}`,
        },
      });
      
      // Remove product from state
      setProducts(prevProducts =>
        prevProducts.filter(product => product._id !== id)
      );
      
      // Refresh if current page is empty
      if (products.length === 1 && pagination.page > 1) {
        await fetchProducts({}, pagination.page - 1);
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to delete product';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, [products.length, pagination.page, fetchProducts, baseUrl]);

  // Memoized update filters function
  const updateFilters = useCallback((newFilters) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      ...newFilters,
    }));
  }, []);

  // Memoized reset filters function
  const resetFilters = useCallback(() => {
    setFilters({
      search: '',
      category: '',
      brand: '',
      minPrice: '',
      maxPrice: '',
      inStock: false,
    });
  }, []);

  // Memoized search function
  const searchProducts = useCallback(async (searchTerm) => {
    updateFilters({ search: searchTerm });
    await fetchProducts({ search: searchTerm }, 1);
  }, [updateFilters, fetchProducts]);

  // Memoized change page function
  const changePage = useCallback(async (newPage) => {
    await fetchProducts({}, newPage);
  }, [fetchProducts]);

  // Memoized context value
  const value = useMemo(
    () => ({
      // State
      products,
      loading,
      error,
      pagination,
      filters,
      
      // Actions
      fetchProducts,
      createProduct,
      getProduct,
      updateProduct,
      deleteProduct,
      updateFilters,
      resetFilters,
      searchProducts,
      changePage,
    }),
    [
      products,
      loading,
      error,
      pagination,
      filters,
      fetchProducts,
      createProduct,
      getProduct,
      updateProduct,
      deleteProduct,
      updateFilters,
      resetFilters,
      searchProducts,
      changePage,
    ]
  );

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};

// Custom hook to use Product Context


export default ProductContext;