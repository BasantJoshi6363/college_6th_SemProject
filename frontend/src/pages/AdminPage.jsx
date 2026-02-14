import React, { useState, useContext, useEffect, useCallback } from 'react';
import { Loader2, Package, ShoppingCart, User } from 'lucide-react';
import ProductContext from '../context/ProductContext';
import { AdminContext } from '../context/AdminContext';
import toast from 'react-hot-toast';
import ProductsTab from '../components/ProductTab';
import OrdersTab from '../components/OrdersTab';
import UsersTab from '../components/UsersTab';


const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('products');
  const { products, loading: pLoading } = useContext(ProductContext);
  const { users, orders, adminLoading, fetchUsers, fetchOrders } = useContext(AdminContext);

  // Get current user
  const currentUserEmail = localStorage.getItem('user-email');
  const currentUser = users.find(u => u.email === currentUserEmail);

  // Fetch data when tabs change
  useEffect(() => {
    if (activeTab === 'users') fetchUsers();
    if (activeTab === 'orders') fetchOrders();
  }, [activeTab, fetchUsers, fetchOrders]);

  const isLoading = pLoading || adminLoading;

  return (
    <div className="min-h-screen bg-white pb-20">
      <section className="px-4 py-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-10 w-5 rounded bg-[#DB4444]" />
            <span className="font-semibold text-[#DB4444]">Management</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <h2 className="text-4xl font-bold tracking-wider text-black">Admin Dashboard</h2>
            <div className="flex bg-[#F5F5F5] p-1 rounded-lg">
              <button
                onClick={() => setActiveTab('products')}
                className={`flex items-center gap-2 px-6 py-2 rounded-md transition-all ${activeTab === 'products' ? 'bg-white shadow-sm text-[#DB4444]' : 'text-gray-500'}`}
              >
                <Package size={18} /> Products
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`flex items-center gap-2 px-6 py-2 rounded-md transition-all ${activeTab === 'users' ? 'bg-white shadow-sm text-[#DB4444]' : 'text-gray-500'}`}
              >
                <User size={18} /> Users
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`flex items-center gap-2 px-6 py-2 rounded-md transition-all ${activeTab === 'orders' ? 'bg-white shadow-sm text-[#DB4444]' : 'text-gray-500'}`}
              >
                <ShoppingCart size={18} /> Orders
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
          {isLoading ? (
            <div className="flex items-center justify-center p-20">
              <Loader2 className="animate-spin text-[#DB4444]" size={40} />
            </div>
          ) : activeTab === 'products' ? (
            <ProductsTab />
          ) : activeTab === 'users' ? (
            <UsersTab currentUser={currentUser} />
          ) : (
            <OrdersTab />
          )}
        </div>
      </section>
    </div>
  );
};

export default AdminPage;
