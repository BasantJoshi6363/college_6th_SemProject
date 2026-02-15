import React, { useState, useContext, useEffect } from 'react';
import { Plus, X, Loader2, Search } from 'lucide-react';
import ProductContext from '../context/ProductContext';
import ProductForm from "../components/ProductForm";
import ProductRow from "../components/ProductRow";

const ProductsTab = () => {
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // ✅ Frontend Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;

  const {
    products,
    loading,
    deleteProduct,
    createProduct,
    updateProduct,
  } = useContext(ProductContext);

  useEffect(() => {
    if (editingProduct) {
      setShowProductForm(true);
    }
  }, [editingProduct]);

  const handleCancel = () => {
    setShowProductForm(false);
    setEditingProduct(null);
  };

  // ✅ Search & Filter Logic (Frontend only)
  const filteredProducts = products.filter(product => {
    if (!searchQuery.trim()) return true;
    
    const query = searchQuery.toLowerCase();
    
    // Search across multiple fields
    return (
      product.name?.toLowerCase().includes(query) ||
      product.category?.toLowerCase().includes(query) ||
      product.sku?.toLowerCase().includes(query) ||
      product.description?.toLowerCase().includes(query) ||
      product.price?.toString().includes(query)
    );
  });

  // ✅ Reset to page 1 when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // ✅ Pagination Logic (on filtered results)
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          Product Inventory ({filteredProducts.length}
          {searchQuery && ` of ${products.length}`})
        </h2>
        <button
          onClick={() => {
            if (showProductForm) {
              handleCancel();
            } else {
              setEditingProduct(null);
              setShowProductForm(true);
            }
          }}
          className="bg-[#DB4444] text-white px-5 py-2 rounded flex items-center gap-2 hover:bg-red-600 transition"
        >
          {showProductForm ? <X size={20} /> : <Plus size={20} />}
          {showProductForm ? 'Cancel' : 'Add Product'}
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6 relative">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search by name, category, SKU, description, or price..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DB4444] focus:border-transparent"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Product Form */}
      {showProductForm && (
        <ProductForm
          editingProduct={editingProduct}
          onCancel={handleCancel}
          createProduct={createProduct}
          updateProduct={updateProduct}
        />
      )}

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left p-4 font-semibold">Product Info</th>
              <th className="text-left p-4 font-semibold">Price</th>
              <th className="text-left p-4 font-semibold">Stock</th>
              <th className="text-left p-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="text-center py-8">
                  <Loader2 className="animate-spin mx-auto" size={32} />
                  <p className="mt-2 text-gray-500">Loading products...</p>
                </td>
              </tr>
            ) : currentProducts.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-8 text-gray-500">
                  {searchQuery 
                    ? `No products found matching "${searchQuery}"`
                    : 'No products found'}
                </td>
              </tr>
            ) : (
              currentProducts.map(product => (
                <ProductRow
                  key={product._id}
                  product={product}
                  onEdit={setEditingProduct}
                  onDelete={deleteProduct}
                />
              ))
            )}
          </tbody>
        </table>

        {/* Frontend Pagination */}
        {totalPages > 1 && (
          <div className="border-t p-4 flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Showing {indexOfFirstProduct + 1} to{' '}
              {Math.min(indexOfLastProduct, filteredProducts.length)} of{' '}
              {filteredProducts.length} products
            </p>
            <div className="flex items-center gap-2">
              {/* Prev */}
              <button
                onClick={() => setCurrentPage(prev => prev - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Prev
              </button>

              {/* Page Numbers */}
              {[...Array(totalPages)].map((_, index) => {
                const pageNumber = index + 1;
                return (
                  <button
                    key={pageNumber}
                    onClick={() => setCurrentPage(pageNumber)}
                    className={`px-3 py-1 border rounded ${
                      currentPage === pageNumber
                        ? 'bg-[#DB4444] text-white'
                        : ''
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}

              {/* Next */}
              <button
                onClick={() => setCurrentPage(prev => prev + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsTab;