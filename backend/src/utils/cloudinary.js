const cloudinary = require('../config/cloudinary');

/**
 * Delete an image from Cloudinary by its public ID
 * @param {string} publicId - The public ID of the image to delete
 * @returns {Promise<Object>} Result of the deletion operation
 */
exports.deleteImage = async (publicId) => {
  if (!publicId) return { result: 'skipped', message: 'No public ID provided' };
  
  try {
    console.log(`Attempting to delete image with public_id: ${publicId}`);
    const result = await cloudinary.uploader.destroy(publicId);
    console.log(`Cloudinary deletion result for ${publicId}: ${result.result}`);
    return result;
  } catch (error) {
    console.error(`Error deleting image from Cloudinary: ${error.message}`);
    throw error;
  }
};

/**
 * Delete multiple images from Cloudinary by their public IDs
 * @param {string[]} publicIds - Array of public IDs to delete
 * @returns {Promise<Object[]>} Results of the deletion operations
 */
exports.deleteMultipleImages = async (publicIds) => {
  if (!publicIds || !publicIds.length) return [];
  
  try {
    const validPublicIds = publicIds.filter(id => id);
    
    if (validPublicIds.length === 0) return [];
    
    console.log(`Deleting ${validPublicIds.length} images from Cloudinary`);
    
    // Use Promise.allSettled to handle partial failures
    const results = await Promise.allSettled(
      validPublicIds.map(id => exports.deleteImage(id))
    );
    
    return results;
  } catch (error) {
    console.error(`Error deleting multiple images: ${error.message}`);
    throw error;
  }
};