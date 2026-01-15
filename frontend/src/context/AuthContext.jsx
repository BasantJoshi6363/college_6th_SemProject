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

  useEffect(() => {
    const storedToken = localStorage.getItem("google-token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user data");
      }
    }
    setLoading(false);
  }, []);

  // Helper to sanitize user data before saving
  const saveAuthData = (userData, tokenData) => {
    const sanitizedUser = {
      _id: userData._id,
      name: userData.name,
      email: userData.email,
      picture: userData.picture || ""
    };

    setUser(sanitizedUser);
    setToken(tokenData);

    localStorage.setItem("google-token", tokenData);
    localStorage.setItem("user", JSON.stringify(sanitizedUser));
  };

  // LOGIN
  const login = useCallback(async (email, password) => {
    const toastId = toast.loading("Logging in...");
    try {
      const { data } = await axios.post(`${baseUrl}/login`, { email, password });

      // Only save specific fields, ignoring password
      saveAuthData(data.user, data.token);

      toast.success(`Welcome back, ${data.user.name}!`, { id: toastId });
      navigate("/");
      return data;
    } catch (error) {
      const message = error.response?.data?.message || "Invalid credentials";
      toast.error(message, { id: toastId });
      return null;
    }
  }, [navigate]);

  // REGISTER
  const register = useCallback(async (name, email, password) => {
    const toastId = toast.loading("Creating account...");
    try {
      const { data } = await axios.post(`${baseUrl}/register`, {
        name,
        email,
        password,
      });

      // Only save specific fields, ignoring password
      saveAuthData(data.user, data.token);

      toast.success("Account created successfully!", { id: toastId });
      navigate("/");
      return data;
    } catch (error) {
      const message = error.response?.data?.message || "Registration failed";
      toast.error(message, { id: toastId });
      return null;
    }
  }, [navigate]);

  // LOGOUT
  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("google-token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    navigate("/signup");
  }, [navigate]);

  // Inside AuthProvider ...

  const updateProfile = useCallback(async (updateData) => {
    const toastId = toast.loading("Updating profile...");
    try {
      const { data } = await axios.put(`${baseUrl}/update`, updateData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log(data)
      // Update state and localStorage with new user data (excluding sensitive info)
      const sanitizedUser = {
        _id: data.user._id,
        name: data.user.name,
        email: data.user.email,
        picture: data.picture || ""
      };

      setUser(sanitizedUser);
      localStorage.setItem("user", JSON.stringify(sanitizedUser));

      toast.success("Profile updated successfully!", { id: toastId });
      return true;
    } catch (error) {
      const message = error.response?.data?.message || "Update failed";
      toast.error(message, { id: toastId });
      return false;
    }
  }, [token, baseUrl]);

  const isAuthenticated = !!token;



  const value = useMemo(() => ({
    user, token, loading, isAuthenticated, login, register, logout, updateProfile
  }), [user, token, loading, isAuthenticated, login, register, logout, updateProfile]);




  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};