import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  originalPrice: { type: Number, required: true },
  discountedPrice: { type: Number },
  discountedPercent: { type: Number },
  category: { type: String, required: true },
  images: [{ type: String }], // Array of URLs/Paths
  stock: { type: Number, default: 0 },
  brand: { type: String },
}, { timestamps: true });

export default mongoose.model("Product", productSchema);