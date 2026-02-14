import React, { useState, useContext, useEffect } from 'react';
import { Plus, X, Package, Loader2 } from 'lucide-react';
import ProductContext from '../context/ProductContext';
import ProductForm from "../components/ProductForm";
import ProductRow from "../components/ProductRow";

const ProductsTab = () => {
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const { products, loading, deleteProduct, createProduct, updateProduct } = useContext(ProductContext);

  // Show form when editingProduct is set
  useEffect(() => {
    if (editingProduct) {
      setShowProductForm(true);
    }
  }, [editingProduct]);

  const handleCancel = () => {
    setShowProductForm(false);
    setEditingProduct(null);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold">Product Inventory ({products.length})</h3>
        <button
          onClick={() => {
            setEditingProduct(null);
            setShowProductForm(!showProductForm);
          }}
          className="bg-[#DB4444] text-white px-5 py-2 rounded flex items-center gap-2 hover:bg-red-600 transition"
        >
          {showProductForm ? <X size={18} /> : <Plus size={18} />}
          {showProductForm ? 'Cancel' : 'Add Product'}
        </button>
      </div>

      {showProductForm && (
        <ProductForm
          editingProduct={editingProduct}
          setEditingProduct={setEditingProduct}
          setShowProductForm={setShowProductForm}
          createProduct={createProduct}
          updateProduct={updateProduct}
        />
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-[#F5F5F5] text-xs uppercase text-gray-600 font-bold">
            <tr>
              <th className="p-4">Product Info</th>
              <th className="p-4">Price</th>
              <th className="p-4">Stock</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-8 text-gray-500">
                  No products found
                </td>
              </tr>
            ) : (
              products.map(p => (
                <ProductRow
                  key={p._id}
                  product={p}
                  onDelete={deleteProduct}
                  onEdit={setEditingProduct}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductsTab;
