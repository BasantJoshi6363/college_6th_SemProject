import jwt from "jsonwebtoken";

const generateToken = (payload) => {
  return jwt.sign({ payload }, "secretkey", { expiresIn: "30d" });
};

export default generateToken;
