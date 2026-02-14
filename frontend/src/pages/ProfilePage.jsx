import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Loader2, Package, ChevronRight, Clock, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

// --- SUB-COMPONENT: MY ORDERS ---
const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('google-token'); 
        const { data } = await axios.get('http://localhost:5000/api/orders/myorders', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(data);
      } catch (error) {
        toast.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <Loader2 className="animate-spin text-[#DB4444]" size={40} />
    </div>
  );

  if (orders.length === 0) return (
    <div className="text-center py-20 bg-gray-50 rounded-lg">
      <Package className="mx-auto mb-4 text-gray-300" size={48} />
      <p className="text-gray-500">You haven't placed any orders yet.</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-medium text-[#DB4444] mb-6">My Orders</h2>
      {orders.map((order) => (
        <div key={order._id} className="border border-gray-200 rounded-lg overflow-hidden hover:border-[#DB4444] transition-colors">
          <div className="bg-gray-50 p-4 flex flex-wrap justify-between items-center gap-4 border-b">
            <div>
              <p className="text-[10px] text-gray-500 uppercase font-bold">Order ID</p>
              <p className="text-sm font-mono">#{order._id.slice(-10).toUpperCase()}</p>
            </div>
            <div className="flex gap-4">
              <div className="text-center">
                <p className="text-[10px] text-gray-500 uppercase font-bold">Payment</p>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${order.isPaid ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {order.isPaid ? 'PAID' : 'PENDING'}
                </span>
              </div>
              <div className="text-center">
                <p className="text-[10px] text-gray-500 uppercase font-bold">Status</p>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${order.isDelivered ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                  {order.isDelivered ? 'DELIVERED' : 'PROCESSING'}
                </span>
              </div>
            </div>
          </div>

          <div className="p-4 space-y-4">
            {order.orderItems.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center text-gray-400">
                    <Package size={16} />
                  </div>
                  <span>{item.name} <span className="text-gray-400">x{item.quantity}</span></span>
                </div>
                <span className="font-medium">Rs. {item.price * item.quantity}</span>
              </div>
            ))}
          </div>

          <div className="p-4 bg-white border-t flex justify-between items-center">
            <p className="text-xs text-gray-500">Ordered on: {new Date(order.createdAt).toLocaleDateString()}</p>
            <p className="font-bold text-lg">Total: <span className="text-[#DB4444]">Rs. {order.totalPrice}</span></p>
          </div>
        </div>
      ))}
    </div>
  );
};

// --- MAIN PROFILE PAGE ---
const ProfilePage = () => {
  const { user, updateProfile } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' or 'orders'

  const nameParts = user?.name?.split(" ") || ["", ""];
  
  const [formData, setFormData] = useState({
    firstName: nameParts[0],
    lastName: nameParts[1] || "",
    email: user?.email || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      return toast.error("New passwords do not match!");
    }

    const payload = {};
    const newFullName = `${formData.firstName} ${formData.lastName}`.trim();

    if (newFullName !== user.name) payload.name = newFullName;
    if (formData.email && formData.email !== user.email) payload.email = formData.email;

    if (formData.currentPassword) {
      if (!formData.newPassword) return toast.error("Please enter a new password");
      payload.currentPassword = formData.currentPassword;
      payload.password = formData.newPassword;
    }

    if (Object.keys(payload).length === 0) return toast.error("No changes detected");

    const success = await updateProfile(payload);
    if (success) {
      setFormData(prev => ({ ...prev, currentPassword: "", newPassword: "", confirmPassword: "" }));
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:py-20">
      {/* Breadcrumb & Welcome */}
      <div className="flex justify-between items-center mb-10 md:mb-20">
        <div className="text-sm text-gray-500">
          <span>Home</span> <span className="mx-2">/</span> <span className="text-black font-medium">My Account</span>
        </div>
        <div className="text-sm">
          Welcome! <span className="text-[#DB4444] font-medium ml-1">{user?.name}</span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-10">
        {/* Sidebar */}
        <aside className="w-full md:w-64 space-y-8">
          <div>
            <h3 className="font-bold text-base mb-4 text-black">Manage My Account</h3>
            <ul className="flex flex-col gap-3 ml-4">
              <li 
                onClick={() => setActiveTab('profile')}
                className={`cursor-pointer text-sm transition-colors hover:text-[#DB4444] ${activeTab === 'profile' ? 'text-[#DB4444] font-medium' : 'text-gray-500'}`}
              >
                My Profile
              </li>
              <li 
                onClick={() => setActiveTab('orders')}
                className={`cursor-pointer text-sm transition-colors hover:text-[#DB4444] ${activeTab === 'orders' ? 'text-[#DB4444] font-medium' : 'text-gray-500'}`}
              >
                My Orders
              </li>
            </ul>
          </div>
          <h3 className="font-bold text-base text-black cursor-pointer hover:text-[#DB4444]">My WishList</h3>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 bg-white shadow-sm rounded-lg p-6 md:p-14 border border-gray-100">
          {activeTab === 'profile' ? (
            <>
              <h2 className="text-xl font-medium text-[#DB4444] mb-8">Edit Your Profile</h2>
              <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">First Name</label>
                    <input name="firstName" value={formData.firstName} onChange={handleChange} className="bg-[#F5F5F5] p-3 rounded focus:ring-1 ring-[#DB4444] outline-none" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Last Name</label>
                    <input name="lastName" value={formData.lastName} onChange={handleChange} className="bg-[#F5F5F5] p-3 rounded focus:ring-1 ring-[#DB4444] outline-none" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Email</label>
                    <input name="email" type="email" value={formData.email} onChange={handleChange} className="bg-[#F5F5F5] p-3 rounded focus:ring-1 ring-[#DB4444] outline-none" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Address</label>
                    <input placeholder="Kathmandu, Nepal" className="bg-[#F5F5F5] p-3 rounded focus:ring-1 ring-[#DB4444] outline-none" />
                  </div>
                </div>

                <div className="space-y-4 mt-4">
                  <label className="text-base font-medium">Password Changes</label>
                  <input name="currentPassword" type="password" placeholder="Current Password" value={formData.currentPassword} onChange={handleChange} className="bg-[#F5F5F5] rounded py-3 px-4 w-full focus:ring-1 ring-[#DB4444] outline-none" />
                  <input name="newPassword" type="password" placeholder="New Password" value={formData.newPassword} onChange={handleChange} className="bg-[#F5F5F5] rounded py-3 px-4 w-full focus:ring-1 ring-[#DB4444] outline-none" />
                  <input name="confirmPassword" type="password" placeholder="Confirm New Password" value={formData.confirmPassword} onChange={handleChange} className="bg-[#F5F5F5] rounded py-3 px-4 w-full focus:ring-1 ring-[#DB4444] outline-none" />
                </div>

                <div className="flex justify-end items-center gap-8 mt-6">
                  <button type="button" onClick={() => window.location.reload()} className="text-black hover:underline">Cancel</button>
                  <button type="submit" className="bg-[#DB4444] text-white px-10 py-3 rounded hover:bg-red-600 transition-colors font-medium">Save Changes</button>
                </div>
              </form>
            </>
          ) : (
            <MyOrders />
          )}
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;