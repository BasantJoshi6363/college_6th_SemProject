import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      index: true
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      index: true
    },
    originalPrice: {
      type: Number,
      required: [true, "Original price is required"],
      min: [0, "Price cannot be negative"]
    },
    discountedPrice: {
      type: Number,
      validate: {
        validator: function (value) {
          return !value || value <= this.originalPrice;
        },
        message: "Discounted price must be less than or equal to original price"
      }
    },
    discountedPercent: {
      type: Number,
      min: [0, "Discount cannot be negative"],
      max: [100, "Discount cannot exceed 100%"]
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      index: true
    },
    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String, required: true },
      }
    ],
    stock: {
      type: Number,
      default: 0,
      min: [0, "Stock cannot be negative"]
    },
    brand: {
      type: String,
      index: true
    },
    isActive: {
      type: Boolean,
      default: true
    },
    sizes: {
      type: [String],
      default: []
    },
     // ✅ FLASH SALE FIELD
    isFlash: {
      type: Boolean,
      default: false,
      index: true
    },

  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Index for text search
productSchema.index({ name: 'text', description: 'text', brand: 'text', category: 'text' });

// Pre-save middleware to calculate discount
productSchema.pre('save', async function () {
  if (this.discountedPrice && this.originalPrice) {
    this.discountedPercent = Math.round(
      ((this.originalPrice - this.discountedPrice) / this.originalPrice) * 100
    );
  }
});

export default mongoose.model("Product", productSchema);