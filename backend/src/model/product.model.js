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

    // ✅ RECOMMENDATION SYSTEM FIELDS
    tags: {
      type: [String],
      default: [],
      index: true
    },
    viewCount: {
      type: Number,
      default: 0,
      index: true
    },
    purchaseCount: {
      type: Number,
      default: 0,
      index: true
    },
    cartAddCount: {
      type: Number,
      default: 0
    },
    wishlistCount: {
      type: Number,
      default: 0
    },
    // Popularity score for quick sorting (calculated automatically)
    popularityScore: {
      type: Number,
      default: 0,
      index: true
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Index for text search
productSchema.index({ name: 'text', description: 'text', brand: 'text', category: 'text' });

// Compound indexes for recommendation queries
productSchema.index({ tags: 1, popularityScore: -1 });
productSchema.index({ category: 1, brand: 1, popularityScore: -1 });
productSchema.index({ isActive: 1, stock: 1, popularityScore: -1 });

// Pre-save middleware to calculate discount
productSchema.pre('save', async function () {
  if (this.discountedPrice && this.originalPrice) {
    this.discountedPercent = Math.round(
      ((this.originalPrice - this.discountedPrice) / this.originalPrice) * 100
    );
  }

  // Calculate popularity score based on interactions
  // Formula: (purchases * 5) + (cart adds * 3) + (wishlist * 2) + (views * 1)
  this.popularityScore = 
    (this.purchaseCount * 5) + 
    (this.cartAddCount * 3) + 
    (this.wishlistCount * 2) + 
    (this.viewCount * 1);
});

// Method to increment interaction counts
productSchema.methods.incrementInteraction = async function(type) {
  const increments = {
    view: { viewCount: 1 },
    purchase: { purchaseCount: 1 },
    cart: { cartAddCount: 1 },
    wishlist: { wishlistCount: 1 }
  };

  if (increments[type]) {
    Object.keys(increments[type]).forEach(key => {
      this[key] += increments[type][key];
    });
    
    // Recalculate popularity score
    this.popularityScore = 
      (this.purchaseCount * 5) + 
      (this.cartAddCount * 3) + 
      (this.wishlistCount * 2) + 
      (this.viewCount * 1);
    
    await this.save();
  }
};

// Static method to auto-generate tags from product data
productSchema.statics.generateTags = function(productData) {
  const tags = new Set();
  
  // Add category
  if (productData.category) {
    tags.add(productData.category.toLowerCase());
  }
  
  // Add brand
  if (productData.brand) {
    tags.add(productData.brand.toLowerCase());
  }
  
  // Extract keywords from name
  if (productData.name) {
    const nameWords = productData.name.toLowerCase()
      .split(/\s+/)
      .filter(word => word.length > 3); // Only words longer than 3 chars
    nameWords.forEach(word => tags.add(word));
  }
  
  // Add price range tag
  if (productData.discountedPrice || productData.originalPrice) {
    const price = productData.discountedPrice || productData.originalPrice;
    if (price < 500) tags.add('budget');
    else if (price < 2000) tags.add('mid-range');
    else tags.add('premium');
  }
  
  // Add discount tag if significant discount
  if (productData.discountedPercent > 20) {
    tags.add('sale');
  }
  
  // Add size tags if available
  if (productData.sizes && productData.sizes.length > 0) {
    productData.sizes.forEach(size => tags.add(`size-${size.toLowerCase()}`));
  }
  
  return Array.from(tags);
};

export default mongoose.model("Product", productSchema);