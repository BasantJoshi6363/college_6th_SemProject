import React, { useState, useEffect, memo } from 'react';
import { Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';

const ProductForm = ({
  editingProduct,
  setEditingProduct,
  setShowProductForm,
  createProduct,
  updateProduct
}) => {
  const categories = ["phone", "computer", "smartwatch", "camera", "HeadPhone", "Gaming"];
  const sizeOptions = ["XS", "S", "M", "L", "XL", "XXL"];

  const initialProductState = {
    name: '',
    description: '',
    originalPrice: '',
    discountedPrice: '',
    category: 'phone',
    stock: 0,
    brand: '',
    sizes: [],
    isFlash: false,
    isActive: true
  };

  const [productData, setProductData] = useState(initialProductState);
  const [previews, setPreviews] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);

  // Populate form when editingProduct changes
  useEffect(() => {
    if (editingProduct) {
      setProductData({
        name: editingProduct.name || '',
        description: editingProduct.description || '',
        originalPrice: editingProduct.originalPrice || '',
        discountedPrice: editingProduct.discountedPrice || '',
        category: editingProduct.category || 'phone',
        stock: editingProduct.stock || 0,
        brand: editingProduct.brand || '',
        sizes: editingProduct.sizes || [],
        isFlash: editingProduct.isFlash || false,
        isActive: editingProduct.isActive !== undefined ? editingProduct.isActive : true
      });
      setPreviews(editingProduct.images?.map(img => img.url) || []);
    } else {
      setProductData(initialProductState);
      setPreviews([]);
      setImageFiles([]);
    }
  }, [editingProduct]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProductData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSizeChange = (size) => {
    setProductData((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size]
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews(prev => [...prev, reader.result]);
        setImageFiles(prev => [...prev, file]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setPreviews(prev => prev.filter((_, i) => i !== index));
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(productData).forEach(([key, value]) => {
      if (key === 'sizes') {
        value.forEach(size => data.append('sizes', size));
      } else {
        data.append(key, String(value));
      }
    });
    imageFiles.forEach(file => data.append('images', file));

    try {
      if (editingProduct) {
        await updateProduct(editingProduct._id, data);
        toast.success('Product updated successfully');
      } else {
        if (imageFiles.length === 0 && !editingProduct) {
          toast.error("Please upload at least one image");
          return;
        }
        await createProduct(data);
        toast.success('Product created successfully');
      }
      setShowProductForm(false);
      setEditingProduct(null);
    } catch (error) {
      console.error("Submit error:", error);
      toast.error(editingProduct ? 'Failed to update' : 'Failed to create');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 p-6 bg-gray-50 rounded-xl border border-dashed border-gray-300">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-1">Product Name <span className="text-red-500">*</span></label>
          <input
            name="name"
            type="text"
            placeholder="Enter product name"
            className="w-full p-2 border rounded bg-white"
            required
            value={productData.name}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Category <span className="text-red-500">*</span></label>
          <select
            name="category"
            className="w-full p-2 border rounded bg-white"
            value={productData.category}
            onChange={handleInputChange}
          >
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Original Price <span className="text-red-500">*</span></label>
          <input
            name="originalPrice"
            type="number"
            placeholder="Enter original price"
            className="w-full p-2 border rounded bg-white"
            required
            value={productData.originalPrice}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Discount Price</label>
          <input
            name="discountedPrice"
            type="number"
            placeholder="Enter discount price"
            className="w-full p-2 border rounded bg-white"
            value={productData.discountedPrice}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Brand</label>
          <input
            name="brand"
            type="text"
            placeholder="Enter brand name"
            className="w-full p-2 border rounded bg-white"
            value={productData.brand}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Stock <span className="text-red-500">*</span></label>
          <input
            name="stock"
            type="number"
            placeholder="Enter stock quantity"
            className="w-full p-2 border rounded bg-white"
            value={productData.stock}
            onChange={handleInputChange}
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Description <span className="text-red-500">*</span></label>
          <textarea
            name="description"
            placeholder="Enter product description"
            className="w-full p-2 border rounded bg-white"
            required
            value={productData.description}
            onChange={handleInputChange}
            rows="3"
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isFlash"
            checked={productData.isFlash}
            onChange={(e) =>
              setProductData({
                ...productData,
                isFlash: e.target.checked,
              })
            }
            className="accent-black"
          />
          <label className="text-sm font-medium text-gray-700">
            Flash Sale Product
          </label>
        </div>
        <div className="md:col-span-2">
          <label className="block mb-2 font-medium text-sm text-gray-700">
            Available Sizes (Optional)
          </label>
          <div className="flex flex-wrap gap-3">
            {sizeOptions.map((size) => (
              <label key={size} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={productData.sizes.includes(size)}
                  onChange={() => handleSizeChange(size)}
                  className="accent-black"
                />
                <span>{size}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Product Images <span className="text-red-500">*</span></label>
        <div className="grid grid-cols-4 md:grid-cols-6 gap-4">
          <label className="h-24 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 bg-white">
            <Plus className="text-gray-400" />
            <span className="text-xs text-gray-500 mt-1">Add Image</span>
            <input
              type="file"
              multiple
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
            />
          </label>
          {previews.map((src, i) => (
            <div key={`preview-${i}`} className="relative h-24 group">
              <img
                src={src}
                className="w-full h-full object-cover rounded-lg border"
                alt="preview"
              />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute -top-2 -right-2 bg-[#DB4444] text-white rounded-full p-1 hover:bg-red-700"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <button
        type="submit"
        className="bg-black text-white px-8 py-2 rounded hover:bg-gray-800 transition"
      >
        {editingProduct ? 'Update Product' : 'Save Product'}
      </button>
    </form>
  );
};

export default memo(ProductForm);
