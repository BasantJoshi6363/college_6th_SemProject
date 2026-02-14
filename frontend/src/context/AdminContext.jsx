import React, { createContext, useState, useCallback, useMemo } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

export const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminError, setAdminError] = useState(null);

  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const token = localStorage.getItem("google-token");

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  // ==================== USER MANAGEMENT ====================

  // Fetch All Users
  const fetchUsers = useCallback(async () => {
    setAdminLoading(true);
    setAdminError(null);

    try {
      const { data } = await axios.get(`${baseUrl}/auth/all`, { headers });
      setUsers(data?.users || []);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to fetch users";
      setAdminError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setAdminLoading(false);
    }
  }, [baseUrl, token]);

  // Update User Details
  const updateUser = useCallback(async (id, userData) => {
    setAdminLoading(true);
    try {
      const { data } = await axios.put(
        `${baseUrl}/auth/${id}`, 
        userData, 
        { headers }
      );
      
      setUsers((prev) => 
        prev.map((user) => (user._id === id ? data.user : user))
      );
      
      toast.success(data.message || 'User updated successfully');
      return data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Update failed";
      setAdminError(errorMsg);
      toast.error(errorMsg);
      throw err;
    } finally {
      setAdminLoading(false);
    }
  }, [baseUrl, token]);

  // Update User Role
  const updateUserRole = useCallback(async (id, isAdmin) => {
    setAdminLoading(true);
    try {
      const { data } = await axios.put(
        `${baseUrl}/auth/${id}/role`, 
        { isAdmin }, 
        { headers }
      );
      
      setUsers((prev) => 
        prev.map((user) => (user._id === id ? { ...user, isAdmin: data.isAdmin } : user))
      );
      
      toast.success(data.message);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Role update failed";
      setAdminError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setAdminLoading(false);
    }
  }, [baseUrl, token]);

  // Delete User
  const deleteUser = useCallback(async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    
    setAdminLoading(true);
    try {
      const { data } = await axios.delete(`${baseUrl}/auth/${id}`, { headers });
      setUsers((prev) => prev.filter((user) => user._id !== id));
      toast.success(data.message || 'User deleted successfully');
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Delete failed";
      setAdminError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setAdminLoading(false);
    }
  }, [baseUrl, token]);

  // ==================== ORDER MANAGEMENT ====================

  // Fetch All Orders
  const fetchOrders = useCallback(async () => {
    setAdminLoading(true);
    try {
      const { data } = await axios.get(`${baseUrl}/orders`, { headers });
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to fetch orders";
      setAdminError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setAdminLoading(false);
    }
  }, [baseUrl, token]);

  // Update Order to Delivered
  const markAsDelivered = useCallback(async (orderId) => {
    setAdminLoading(true);
    try {
      const { data } = await axios.put(
        `${baseUrl}/orders/${orderId}/deliver`,
        {},
        { headers }
      );
      
      setOrders((prev) =>
        prev.map((order) => (order._id === orderId ? data : order))
      );
      
      toast.success('Order marked as delivered');
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to update order";
      setAdminError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setAdminLoading(false);
    }
  }, [baseUrl, token]);

  // Delete Order
  const deleteOrder = useCallback(async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    
    setAdminLoading(true);
    try {
      const { data } = await axios.delete(`${baseUrl}/orders/${orderId}`, { headers });
      setOrders((prev) => prev.filter((order) => order._id !== orderId));
      toast.success(data.message || 'Order deleted successfully');
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to delete order";
      setAdminError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setAdminLoading(false);
    }
  }, [baseUrl, token]);

  // Context Value
  const value = useMemo(() => ({
    users,
    orders,
    adminLoading,
    adminError,
    fetchUsers,
    updateUser,
    updateUserRole,
    deleteUser,
    fetchOrders,
    markAsDelivered,
    deleteOrder,
  }), [
    users, 
    orders, 
    adminLoading, 
    adminError, 
    fetchUsers, 
    updateUser,
    updateUserRole, 
    deleteUser, 
    fetchOrders,
    markAsDelivered,
    deleteOrder
  ]);

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};