import { Edit, X } from 'lucide-react';
import React from 'react';

const ProductRow = React.memo(({ product, onDelete, onEdit }) => (
  <tr className="border-b hover:bg-gray-50 text-sm">
    <td className="py-4 px-4 flex items-center gap-3">
      <img
        src={product.images?.[0]?.url || '/placeholder.png'}
        className="w-12 h-12 object-cover rounded border"
        alt={product.name}
      />
      <div>
        <p className="font-medium">{product.name}</p>
        <p className="text-xs text-gray-500">{product.category}</p>
      </div>
    </td>
    <td className="py-4 px-4">
      <div>
        <span className="font-semibold">
          Rs. {product.discountedPrice || product.originalPrice}
        </span>
        {product.discountedPrice && (
          <span className="text-xs text-gray-400 line-through ml-2">
            Rs. {product.originalPrice}
          </span>
        )}
      </div>
    </td>
    <td className="py-4 px-4">
      <span className={`px-2 py-1 rounded text-xs ${
        product.stock > 0
          ? 'bg-blue-50 text-blue-600'
          : 'bg-red-50 text-red-600'
        }`}>
        {product.stock} in stock
      </span>
    </td>
    <td className="py-4 px-4 text-right">
      <div className="flex justify-end gap-2">
        <button
          onClick={() => onEdit(product)}
          className="text-gray-400 hover:text-blue-600 transition-colors p-2"
          title="Edit product"
        >
          <Edit size={18} />
        </button>
        <button
          onClick={() => onDelete(product._id)}
          className="text-[#DB4444] hover:bg-red-50 rounded-full transition-colors p-2"
          title="Delete product"
        >
          <X size={18} />
        </button>
      </div>
    </td>
  </tr>
));

export default ProductRow;
