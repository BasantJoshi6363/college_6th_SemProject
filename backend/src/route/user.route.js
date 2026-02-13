import express from "express";
import {
  registerUser,
  loginUser,
  updateUser,
  googleLogin,
  getAllUser,
  getUserById,
  updateUserById,
  updateUserRole,
  deleteUser
} from "../controller/user.controller.js";
import protect, { isAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

// ==================== PUBLIC ROUTES ====================
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google", googleLogin);

// ==================== PROTECTED ROUTES (User) ====================
router.put("/update", protect, updateUser); // Update own profile

// ==================== ADMIN ROUTES ====================
router.get("/all", protect, isAdmin, getAllUser); // Get all users
router.get("/:id", protect, isAdmin, getUserById); // Get user by ID
router.put("/:id", protect, isAdmin, updateUserById); // Update user details
router.put("/:id/role", protect, isAdmin, updateUserRole); // Update user role
router.delete("/:id", protect, isAdmin, deleteUser); // Delete user

export default router;