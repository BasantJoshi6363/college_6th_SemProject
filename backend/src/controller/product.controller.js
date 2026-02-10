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
    const { name, description, originalPrice, discountedPrice, category, stock, brand } = req.body;
// console.log(req.body)
// console.log(req.files)
    // Validate required fields
    if (!name || !description || !originalPrice || !category) {
      // Delete uploaded files if validation fails
      if (req.files) {
        deleteLocalFiles(req.files.map(file => file.path));
      }
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide all required fields' 
      });
    }

    // Upload images to Cloudinary
    let uploadedImages = [];
    if (req.files && req.files.length > 0) {
      try {
        uploadedImages = await uploadMultipleToCloudinary(req.files);
      } catch (error) {
        return res.status(500).json({ 
          success: false, 
          message: 'Image upload failed',
          error: error.message 
        });
      }
    }

    // Create product
    const product = await Product.create({
      name,
      description,
      originalPrice: Number(originalPrice),
      discountedPrice: discountedPrice ? Number(discountedPrice) : undefined,
      category,
      stock: stock ? Number(stock) : 0,
      brand,
      images: uploadedImages,
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product,
    });
  } catch (error) {
    // Clean up uploaded files in case of error
    if (req.files) {
      deleteLocalFiles(req.files.map(file => file.path));
    }
    
    res.status(500).json({
      success: false,
      message: 'Error creating product',
      error: error.message,
    });
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
      page = 1,
      limit = 10,
      sort = '-createdAt',
    } = req.query;

    // Build query
    const query = { isActive: true };

    // Text search
    if (search) {
      query.$text = { $search: search };
    }

    // Filters
    if (category) query.category = category;
    if (brand) query.brand = brand;
    if (inStock === 'true') query.stock = { $gt: 0 };

    // Price range
    if (minPrice || maxPrice) {
      query.originalPrice = {};
      if (minPrice) query.originalPrice.$gte = Number(minPrice);
      if (maxPrice) query.originalPrice.$lte = Number(maxPrice);
    }

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Execute query
    const products = await Product.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limitNum);

    const total = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message,
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
      // Delete uploaded files if product not found
      if (req.files) {
        deleteLocalFiles(req.files.map(file => file.path));
      }
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    const { name, description, originalPrice, discountedPrice, category, stock, brand, removeImages } = req.body;

    // Handle image removal
    if (removeImages) {
      try {
        const imagesToRemove = JSON.parse(removeImages);
        const publicIds = imagesToRemove.map(img => img.publicId);
        
        // Delete from Cloudinary
        await deleteMultipleFromCloudinary(publicIds);
        
        // Remove from product images array
        product.images = product.images.filter(
          img => !publicIds.includes(img.publicId)
        );
      } catch (error) {
        console.error('Error removing images:', error);
      }
    }

    // Upload new images if provided
    if (req.files && req.files.length > 0) {
      try {
        const newImages = await uploadMultipleToCloudinary(req.files);
        product.images.push(...newImages);
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: 'Image upload failed',
          error: error.message,
        });
      }
    }

    // Update fields
    if (name) product.name = name;
    if (description) product.description = description;
    if (originalPrice) product.originalPrice = Number(originalPrice);
    if (discountedPrice !== undefined) product.discountedPrice = discountedPrice ? Number(discountedPrice) : undefined;
    if (category) product.category = category;
    if (stock !== undefined) product.stock = Number(stock);
    if (brand) product.brand = brand;

    await product.save();

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: product,
    });
  } catch (error) {
    // Clean up uploaded files in case of error
    if (req.files) {
      deleteLocalFiles(req.files.map(file => file.path));
    }
    
    res.status(500).json({
      success: false,
      message: 'Error updating product',
      error: error.message,
    });
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