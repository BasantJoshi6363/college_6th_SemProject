import mongoose from 'mongoose';
import Product from "../model/product.model.js"
import dotenv from "dotenv"
dotenv.config();
console.log(process.env.MONGO_URI);
const addTags = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');
  
  const products = await Product.find();
  console.log(`Found ${products.length} products`);
  
  for (const product of products) {
    const tags = Product.generateTags({
      name: product.name,
      category: product.category,
      brand: product.brand,
      originalPrice: product.originalPrice,
      discountedPrice: product.discountedPrice,
      discountedPercent: product.discountedPercent,
      sizes: product.sizes,
    });
    
    product.tags = tags;
    await product.save();
    
    console.log(`✅ ${product.name} → [${tags.join(', ')}]`);
  }
  
  console.log('🎉 Done!');
  process.exit(0);
};

addTags();