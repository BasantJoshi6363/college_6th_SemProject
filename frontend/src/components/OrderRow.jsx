import { X } from 'lucide-react';
import React from 'react';

const OrderRow = React.memo(({ order, onMarkDelivered, onDelete }) => (
  <tr className="border-b hover:bg-gray-50 transition-colors">
    <td className="py-4 px-4">
      <span className="font-mono text-xs text-gray-600">
        {order._id.slice(-8).toUpperCase()}
      </span>
    </td>
    <td className="py-4 px-4">
      <div className="text-sm">
        <p className="font-medium">{order.user?.name || 'N/A'}</p>
        <p className="text-gray-500 text-xs">{order.user?.email || 'N/A'}</p>
      </div>
    </td>
    <td className="py-4 px-4">
      <span className="font-semibold">Rs. {order.totalPrice?.toLocaleString()}</span>
    </td>
    <td className="py-4 px-4">
      <span className={`px-2 py-1 rounded text-xs font-medium ${
        order.isPaid
          ? 'bg-green-100 text-green-700'
          : 'bg-yellow-100 text-yellow-700'
        }`}>
        {order.isPaid ? 'Paid' : 'Pending'}
      </span>
    </td>
    <td className="py-4 px-4">
      <span className={`px-2 py-1 rounded text-xs font-medium ${
        order.isDelivered
          ? 'bg-blue-100 text-blue-700'
          : 'bg-gray-100 text-gray-700'
        }`}>
        {order.isDelivered ? 'Delivered' : 'Processing'}
      </span>
    </td>
    <td className="py-4 px-4 text-right">
      <div className="flex justify-end gap-2">
        {!order.isDelivered && (
          <button
            onClick={() => onMarkDelivered(order._id)}
            className="text-blue-600 hover:bg-blue-50 rounded-full transition-colors p-2"
            title="Mark as delivered"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 18h18v-6"></path>
              <path d="M3 6h18"></path>
              <circle cx="7" cy="18" r="2"></circle>
              <circle cx="17" cy="18" r="2"></circle>
              <path d="M8 18h1l1-4h4l1 4h1"></path>
            </svg>
          </button>
        )}
        <button
          onClick={() => onDelete(order._id)}
          className="text-[#DB4444] hover:bg-red-50 rounded-full transition-colors p-2"
          title="Delete order"
        >
          <X size={18} />
        </button>
      </div>
    </td>
  </tr>
));

export default OrderRow;
