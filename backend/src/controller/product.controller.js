import Product from '../model/product.model.js';
import {
  uploadMultipleToCloudinary,
  deleteMultipleFromCloudinary,
  deleteLocalFiles,
  uploadToCloudinary,
  deleteFromCloudinary,
} from '../utils/fileHelper.js';

/**
 * @desc    Create new product
 * @route   POST /api/products
 * @access  Public (add authentication as needed)
 */
export const createProduct = async (req, res) => {
  try {
    const { 
      name, description, originalPrice, discountedPrice, 
      category, stock, brand, sizes, isFlash, isActive 
    } = req.body;

    // Validate required fields
    if (!name || !description || !originalPrice || !category) {
      if (req.files) deleteLocalFiles(req.files.map(file => file.path));
      return res.status(400).json({ success: false, message: 'Required fields missing' });
    }

    // Upload images to Cloudinary
    let uploadedImages = [];
    if (req.files && req.files.length > 0) {
      uploadedImages = await uploadMultipleToCloudinary(req.files);
    }

    // ✅ Prepare product data for tag generation
    const productData = {
      name,
      description,
      originalPrice: Number(originalPrice),
      discountedPrice: discountedPrice ? Number(discountedPrice) : undefined,
      category,
      brand,
      sizes: Array.isArray(sizes) ? sizes : sizes ? [sizes] : [],
    };

    // ✅ Auto-generate tags using the static method
    const generatedTags = Product.generateTags(productData);

    // Create product with new schema fields
    const product = new Product({
      name,
      description,
      originalPrice: Number(originalPrice),
      discountedPrice: discountedPrice ? Number(discountedPrice) : undefined,
      category,
      stock: stock ? Number(stock) : 0,
      brand,
      images: uploadedImages,
      sizes: Array.isArray(sizes) ? sizes : sizes ? [sizes] : [],
      isFlash: isFlash === 'true' || isFlash === true,
      isActive: isActive === 'false' || isActive === false ? false : true,
      tags: generatedTags, // ✅ Add auto-generated tags
    });

    // .save() triggers the pre-save middleware to calculate discountedPercent
    await product.save();

    console.log('✅ Product created with tags:', generatedTags); // ✅ Debug log

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product,
    });
  } catch (error) {
    if (req.files) deleteLocalFiles(req.files.map(file => file.path));
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get all products with search and filters
 * @route   GET /api/products
 * @access  Public
 */
export const getProducts = async (req, res) => {
  try {
    const {
      search,
      category,
      brand,
      minPrice,
      maxPrice,
      inStock,
      isFlash,
      page = 1,
      limit,
      sort = '-createdAt',
    } = req.query;

    const query = { isActive: true };

    if (search) query.$text = { $search: search };
    if (category) query.category = category;
    if (brand) query.brand = brand;
    if (inStock === 'true') query.stock = { $gt: 0 };
    if (isFlash === 'true') query.isFlash = true;

    if (minPrice || maxPrice) {
      query.originalPrice = {};
      if (minPrice) query.originalPrice.$gte = Number(minPrice);
      if (maxPrice) query.originalPrice.$lte = Number(maxPrice);
    }

    const pageNum = parseInt(page);
    const limitNum = limit ? parseInt(limit) : null;

    let productsQuery = Product.find(query).sort(sort);

    let total = await Product.countDocuments(query);

    // ✅ Apply pagination ONLY if limit exists
    if (limitNum && limitNum > 0) {
      const skip = (pageNum - 1) * limitNum;
      productsQuery = productsQuery.skip(skip).limit(limitNum);
    }

    const products = await productsQuery;

    res.status(200).json({
      success: true,
      total,
      page: limitNum ? pageNum : 1,
      pages: limitNum ? Math.ceil(total / limitNum) : 1,
      data: products,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


/**
 * @desc    Get single product by ID
 * @route   GET /api/products/:id
 * @access  Public
 */
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching product',
      error: error.message,
    });
  }
};

/**
 * @desc    Update product
 * @route   PUT /api/products/:id
 * @access  Public (add authentication as needed)
 */
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      if (req.files) deleteLocalFiles(req.files.map(file => file.path));
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const { 
      name, description, originalPrice, discountedPrice, 
      category, stock, brand, sizes, isFlash, isActive, removeImages 
    } = req.body;

    // 1. Handle image removal (Expects array of publicIds as JSON string)
    if (removeImages) {
      const publicIdsToRemove = JSON.parse(removeImages);
      if (publicIdsToRemove.length > 0) {
        await deleteMultipleFromCloudinary(publicIdsToRemove);
        product.images = product.images.filter(
          img => !publicIdsToRemove.includes(img.publicId)
        );
      }
    }

    // 2. Upload new images
    if (req.files && req.files.length > 0) {
      const newImages = await uploadMultipleToCloudinary(req.files);
      product.images.push(...newImages);
    }

    // 3. Update standard fields
    if (name) product.name = name;
    if (description) product.description = description;
    if (category) product.category = category;
    if (brand) product.brand = brand;
    if (originalPrice) product.originalPrice = Number(originalPrice);
    
    // Handle sizes array
    if (sizes) product.sizes = Array.isArray(sizes) ? sizes : [sizes];

    // Handle Booleans
    if (isFlash !== undefined) product.isFlash = isFlash === 'true' || isFlash === true;
    if (isActive !== undefined) product.isActive = isActive === 'true' || isActive === true;

    // Handle numeric fields
    if (stock !== undefined) product.stock = Number(stock);
    if (discountedPrice !== undefined) {
        product.discountedPrice = discountedPrice === "" ? undefined : Number(discountedPrice);
    }

    // ✅ 4. Regenerate tags when product is updated
    const updatedProductData = {
      name: product.name,
      description: product.description,
      category: product.category,
      brand: product.brand,
      originalPrice: product.originalPrice,
      discountedPrice: product.discountedPrice,
      sizes: product.sizes,
    };

    // Generate fresh tags based on updated product data
    const regeneratedTags = Product.generateTags(updatedProductData);
    product.tags = regeneratedTags;

    console.log('✅ Product tags regenerated:', regeneratedTags); // ✅ Debug log

    // Save triggers the 'pre-save' middleware for discountedPercent
    await product.save();

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: product,
    });
  } catch (error) {
    if (req.files) deleteLocalFiles(req.files.map(file => file.path));
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Delete product
 * @route   DELETE /api/products/:id
 * @access  Public (add authentication as needed)
 */
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Delete all images from Cloudinary
    if (product.images && product.images.length > 0) {
      const publicIds = product.images.map(img => img.publicId);
      await deleteMultipleFromCloudinary(publicIds);
    }

    // Delete product from database
    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting product',
      error: error.message,
    });
  }
};

/**
 * @desc    Get product categories
 * @route   GET /api/products/categories/list
 * @access  Public
 */
export const getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    
    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching categories',
      error: error.message,
    });
  }
};

/**
 * @desc    Get product brands
 * @route   GET /api/products/brands/list
 * @access  Public
 */
export const getBrands = async (req, res) => {
  try {
    const brands = await Product.distinct('brand');
    
    res.status(200).json({
      success: true,
      data: brands.filter(Boolean), // Remove null/undefined values
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching brands',
      error: error.message,
    });
  }
};