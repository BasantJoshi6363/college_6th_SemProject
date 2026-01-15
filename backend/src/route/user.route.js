import express from "express";
import {
  registerUser,
  loginUser,
  updateUser,
  googleLogin,
  getAllUser
} from "../controller/user.controller.js";
import protect from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/google",googleLogin)
router.post("/login", loginUser);
router.put("/update", protect, updateUser);
router.put("/user", protect, getAllUser);




export default router;
