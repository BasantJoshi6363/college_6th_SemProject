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

const fetchProducts = useCallback(
  async (customFilters = {}, customPage = 1, fetchAll = false) => {
    setLoading(true);
    setError(null);

    try {
      const params = {
        ...filters,
        ...customFilters,
        page: customPage,
        limit: fetchAll ? 0 : pagination.limit, // 👈 KEY CHANGE
      };

      const queryParams = new URLSearchParams();

      Object.keys(params).forEach(key => {
        if (
          params[key] !== '' &&
          params[key] !== null &&
          params[key] !== undefined
        ) {
          queryParams.append(key, params[key]);
        }
      });

      const { data } = await axios.get(
        `${baseUrl}/products?${queryParams.toString()}`
      );

      setProducts(data.data);

      if (!fetchAll) {
        setPagination({
          page: data.page,
          limit: pagination.limit,
          total: data.total,
          pages: data.pages,
        });
      }
    } catch (err) {
      const message =
        err.response?.data?.message || 'Failed to fetch products';
      setError(message);
    } finally {
      setLoading(false);
    }
  },
  [filters, pagination.limit, baseUrl]
);

  useEffect(() => {
    fetchProducts({}, 1, true);

  }, [fetchProducts]);

  const createProduct = useCallback(async (productData) => {
    setLoading(true);
    setError(null);
    
    try {
      let finalData;

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

      for (let pair of finalData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }

      const { data } = await axios.post(`${baseUrl}/products`, finalData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem("google-token")}`,
        },
      });
      
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

  const updateProduct = useCallback(async (id, productData) => {
  setLoading(true);
  try {
    let finalData;
    if (productData instanceof FormData) {
      finalData = productData;
    } else {
    }

    const { data } = await axios.put(`${baseUrl}/products/${id}`, finalData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${localStorage.getItem("google-token")}`,
      },
    });
    
    fetchProducts();
    return data;
  } catch (err) {
  }
}, [baseUrl, fetchProducts]);

  const deleteProduct = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      await axios.delete(`${baseUrl}/products/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("google-token")}`,
        },
      });
      
      setProducts(prevProducts =>
        prevProducts.filter(product => product._id !== id)
      );
      
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

  const updateFilters = useCallback((newFilters) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      ...newFilters,
    }));
  }, []);

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

  const searchProducts = useCallback(async (searchTerm) => {
    updateFilters({ search: searchTerm });
    await fetchProducts({ search: searchTerm }, 1);
  }, [updateFilters, fetchProducts]);

  const changePage = useCallback(async (newPage) => {
    await fetchProducts({}, newPage);
  }, [fetchProducts]);

  const value = useMemo(
    () => ({
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


export default ProductContext;