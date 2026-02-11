import express from 'express';
import upload from '../utils/multer.js';
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getCategories,
  getBrands,
} from '../controller/product.controller.js';

import protect, { isAdmin } from '../middleware/auth.middleware.js';

const productRouter = express.Router();

// Get categories and brands (must be before /:id route)
productRouter.get('/categories/list', getCategories);
productRouter.get('/brands/list', getBrands);

// CRUD routes
// productRouter.post('/', upload.array('images', 10), createProduct);
productRouter.get('/', getProducts);
productRouter.get('/:id', getProductById);
// productRouter.put('/:id', upload.array('images', 10), updateProduct);
// productRouter.delete('/:id', deleteProduct);


productRouter.post('/', protect, isAdmin, upload.array('images', 10), createProduct);
productRouter.put('/:id', protect, isAdmin, upload.array('images', 10), updateProduct);
productRouter.delete('/:id', protect, isAdmin, deleteProduct);

export default productRouter;