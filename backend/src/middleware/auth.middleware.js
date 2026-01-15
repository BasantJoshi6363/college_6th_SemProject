import jwt from "jsonwebtoken";
import User from "../model/user.model.js";

const protect = async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1]
  // let token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "No token" });

  const decoded = jwt.verify(token, "secretkey");
  console.log(decoded.payload)
  //   console.log(decoded.payload)
  req.user = decoded.payload

  next();
};

export default protect;

export const isAdmin = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1]
    if (!token) return res.status(401).json({ message: "No token" });

    const decoded = jwt.verify(token, "secretkey");
    console.log(decoded.payload)
    //   console.log(decoded.payload)
    req.user = decoded.payload
  } catch (error) {

  }
}
