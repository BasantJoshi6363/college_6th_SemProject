import { createContext, useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const baseUrl = "http://localhost:5000/api/auth";

  const navigate = useNavigate();

  // Load auth state from localStorage once on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("google-token");
    const storedUser = localStorage.getItem("user");
   

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user data", e);
        localStorage.clear(); // Clear corrupt data
      }
    }
    setLoading(false);
  }, []);

  // Helper to sanitize and save data
  const saveAuthData = useCallback((userData, tokenData) => {
    const sanitizedUser = {
      _id: userData._id,
      name: userData.name,
      email: userData.email,
      picture: userData.picture || "",
      isAdmin: userData.isAdmin || false
    };

    setUser(sanitizedUser);
    if (tokenData) {
        setToken(tokenData);
        localStorage.setItem("google-token", tokenData);
    }
    localStorage.setItem("user", JSON.stringify(sanitizedUser));
  }, []);

  // LOGIN
  const login = useCallback(async (email, password) => {
    const toastId = toast.loading("Logging in...");
    try {
      const { data } = await axios.post(`${baseUrl}/login`, { email, password });
      saveAuthData(data.user, data.token);
      toast.success(`Welcome back, ${data.user.name}!`, { id: toastId });
      navigate("/");
      return data;
    } catch (error) {
      const message = error.response?.data?.message || "Invalid credentials";
      toast.error(message, { id: toastId });
      return null;
    }
  }, [navigate, saveAuthData]);

  // REGISTER
  const register = useCallback(async (name, email, password) => {
    const toastId = toast.loading("Creating account...");
    try {
      const { data } = await axios.post(`${baseUrl}/register`, { name, email, password });
      saveAuthData(data.user, data.token);
      toast.success("Account created successfully!", { id: toastId });
      navigate("/");
      return data;
    } catch (error) {
      const message = error.response?.data?.message || "Registration failed";
      toast.error(message, { id: toastId });
      return null;
    }
  }, [navigate, saveAuthData]);

  // UPDATE PROFILE
  const updateProfile = useCallback(async (updateData) => {
    const toastId = toast.loading("Updating profile...");
    try {
      const { data } = await axios.put(`${baseUrl}/update`, updateData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Update state and local storage
      saveAuthData(data.user); // reuse the helper, keep current token
      
      toast.success("Profile updated successfully!", { id: toastId });
      return true;
    } catch (error) {
      const message = error.response?.data?.message || "Update failed";
      toast.error(message, { id: toastId });
      return false;
    }
  }, [token, saveAuthData]);

  // LOGOUT
  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("google-token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    navigate("/signup");
  }, [navigate]);

  const isAuthenticated = !!token;

  const value = useMemo(() => ({
    user, 
    token, 
    loading, 
    isAuthenticated, 
    login, 
    register, 
    logout, 
    updateProfile
  }), [user, token, loading, isAuthenticated, login, register, logout, updateProfile]);

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};