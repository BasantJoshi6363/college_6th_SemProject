import fs from 'fs';
import cloudinary from '../config/cloudinary.js';

/**
 * Delete file from local server
 */
export const deleteLocalFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`Deleted local file: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error deleting local file ${filePath}:`, error.message);
  }
};

/**
 * Delete multiple local files
 */
export const deleteLocalFiles = (filePaths) => {
  if (Array.isArray(filePaths)) {
    filePaths.forEach(filePath => deleteLocalFile(filePath));
  }
};

/**
 * Upload image to Cloudinary and delete local file
 */
export const uploadToCloudinary = async (filePath, folder = 'products') => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: folder,
      resource_type: 'auto',
    });

    // Delete local file after successful upload
    deleteLocalFile(filePath);

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    // Delete local file even if upload fails
    deleteLocalFile(filePath);
    throw new Error(`Cloudinary upload failed: ${error.message}`);
  }
};

/**
 * Upload multiple images to Cloudinary
 */
export const uploadMultipleToCloudinary = async (files, folder = 'products') => {
  try {
    const uploadPromises = files.map(file => uploadToCloudinary(file.path, folder));
    return await Promise.all(uploadPromises);
  } catch (error) {
    throw error;
  }
};

/**
 * Delete image from Cloudinary
 */
export const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    console.log(`Deleted from Cloudinary: ${publicId}`);
    return result;
  } catch (error) {
    console.error(`Error deleting from Cloudinary ${publicId}:`, error.message);
    throw error;
  }
};

/**
 * Delete multiple images from Cloudinary
 */
export const deleteMultipleFromCloudinary = async (publicIds) => {
  try {
    const deletePromises = publicIds.map(publicId => deleteFromCloudinary(publicId));
    return await Promise.all(deletePromises);
  } catch (error) {
    throw error;
  }
};