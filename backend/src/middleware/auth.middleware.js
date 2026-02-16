import jwt from "jsonwebtoken";
import User from "../model/user.model.js";

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const token = authHeader.split(" ")[1];
    
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    // console.log(decoded)

    // optional but recommended: pull fresh user from DB
    const user = await User.findById(decoded.payload).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};

export default protect;
export const isAdmin = (req, res, next) => {
  
  if (!req.user) {
    return res.status(401).json({ message: "Not authorized" });
  }

  if (req.user.isAdmin !== true) {
    return res.status(403).json({ message: "Admin access only" });
  }

  next();
};
