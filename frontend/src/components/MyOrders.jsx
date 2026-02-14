import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Loader2, Package } from 'lucide-react';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token'); // or however you store your token
        const { data } = await axios.get('http://localhost:5000/api/orders/myorders', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-[#DB4444]" /></div>;

  if (orders.length === 0) return (
    <div className="text-center py-10">
      <Package className="mx-auto mb-4 text-gray-300" size={48} />
      <p className="text-gray-500">You haven't placed any orders yet.</p>
    </div>
  );

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-xl font-medium text-[#DB4444] mb-4">My Orders</h2>
      {orders.map((order) => (
        <div key={order._id} className="border border-gray-100 rounded-lg p-6 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-center mb-4 border-b pb-4">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider">Order ID</p>
              <p className="font-mono text-sm">{order._id.slice(-10).toUpperCase()}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 uppercase">Status</p>
              <span className={`text-xs font-bold px-2 py-1 rounded ${
                order.isDelivered ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
              }`}>
                {order.isDelivered ? 'DELIVERED' : 'PROCESSING'}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {order.orderItems.map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <div className="flex gap-4 items-center">
                  <div className="w-12 h-12 bg-gray-50 rounded flex items-center justify-center text-[10px] text-gray-400">IMG</div>
                  <div>
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  </div>
                </div>
                <p className="text-sm font-semibold">Rs. {item.price}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t flex justify-between items-center">
            <p className="text-sm">Paid via: <span className="font-medium">{order.paymentMethod}</span></p>
            <p className="text-lg font-bold text-[#DB4444]">Total: Rs. {order.totalPrice}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default React.memo(MyOrders);