// models/interaction.model.js
import mongoose from "mongoose";

const interactionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    type: { 
      type: String, 
      enum: ["view", "purchase", "cart", "wishlist"],
      required: true 
    },
    weight: { type: Number, default: 1 }, // Different actions have different weights
  },
  { timestamps: true }
);

interactionSchema.index({ user: 1, product: 1, type: 1 });

export default mongoose.model("Interaction", interactionSchema);