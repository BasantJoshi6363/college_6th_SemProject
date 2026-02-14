import React, { useContext } from 'react';
import { AdminContext } from '../context/AdminContext';
import OrderRow from "../components/OrderRow"

const OrdersTab = () => {
  const { orders, markAsDelivered, deleteOrder } = useContext(AdminContext);
  console.log(orders)

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold">Order Management ({orders.length})</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-[#F5F5F5] text-xs uppercase text-gray-600 font-bold">
            <tr>
              <th className="p-4">Order ID</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Total</th>
              <th className="p-4">Payment</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-8 text-gray-500">
                  No orders found
                </td>
              </tr>
            ) : (
              orders.map(order => (
                <OrderRow
                  key={order._id}
                  order={order}
                  onMarkDelivered={markAsDelivered}
                  onDelete={deleteOrder}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersTab;
