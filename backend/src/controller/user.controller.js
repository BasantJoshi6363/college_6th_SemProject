import User from "../model/user.model.js";
import generateToken from "../utils/generateToken.js";
import { OAuth2Client } from "google-auth-library";

process.loadEnvFile();

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_SECRET_ID,
  'postmessage'
);

// --- Register User ---
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, isAdmin } = req.body;

    // 1. Basic Validation
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Please provide all fields" });
    }

    // 2. Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    // 3. Create user
    const user = await User.create({ name, email, password });

    res.status(201).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin
      },
      token: generateToken(user._id, user.isAdmin, user.name, user.email)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- Login User ---
export const loginUser = async (req, res) => {
  try {
    const { email, password,isAdmin } = req.body;

    // 1. Validation
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Please provide email and password" });
    }

    // 2. Find user and check password
    const user = await User.findOne({ email });
    
    if (user && (await user.matchPassword(password))) {
      res.json({
        success: true,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin
        },
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ success: false, message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- Update User ---
export const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user, req.body, {
      new: true,
      runValidators: true // Ensures the update follows the Schema rules
    }).select("-password"); // Don't return the password

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- Google Login ---
export const googleLogin = async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ success: false, message: "Auth code is missing" });
    }

    const { tokens } = await client.getToken(code);
    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const { email, name, picture } = ticket.getPayload();

    // Upsert returns the updated document
    const user = await User.findOneAndUpdate(
      { email }, 
      { name, picture }, 
      { upsert: true, new: true }
    );

    const token = generateToken(user._id); // Better to sign the ID than the full payload

    return res.status(200).json({
      success: true,
      message: "Google login successful",
      user,
      token
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Google authentication failed: " + error.message
    });
  }
};

// --- Get All Users ---
export const getAllUser = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    return res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      count: users.length,
      users
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
// Inside user.controller.js
export const updateUserRole = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    user.isAdmin = req.body.isAdmin ?? user.isAdmin;
    const updatedUser = await user.save();
    res.json(updatedUser);
  } else {
    res.status(404).json({ message: "User not found" });
  }
};



export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      // Prevent an admin from accidentally deleting themselves
      if (user._id.toString() === req.user._id.toString()) {
        return res.status(400).json({ message: "You cannot delete your own admin account" });
      }

      await User.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "User removed successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};