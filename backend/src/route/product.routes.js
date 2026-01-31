import express from "express";
import multer from "multer";
import { createProduct, getAllProducts, updateProduct, deleteProduct } from "../controllers/product.controller.js";

const router = express.Router();

// Multer Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

router.get("/", getAllProducts);
router.post("/create", upload.array("images", 5), createProduct);
router.put("/update/:id", upload.array("images", 5), updateProduct);
router.delete("/delete/:id", deleteProduct);

export default router;