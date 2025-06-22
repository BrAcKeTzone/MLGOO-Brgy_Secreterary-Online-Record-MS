const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

/**
 * Upload file to Cloudinary with specified folder destination
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Determine the upload folder based on the request type
    // Default to valid_ids if not specified
    const uploadType = req.query.type || 'id';
    let folder = 'tabina_oms/valid_ids';
    let resourceType = 'image';
    
    // Set the appropriate folder based on upload type
    if (uploadType === 'report') {
      folder = 'tabina_oms/reports';
      // Auto-detect resource type for reports (could be PDF, images, etc.)
      resourceType = 'auto';
    }
    
    console.log(`Uploading file to ${folder} as ${resourceType}`);

    // Upload file buffer to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const cloudinaryStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: resourceType,
          flags: 'attachment'
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
      
      streamifier.createReadStream(req.file.buffer).pipe(cloudinaryStream);
    });

    res.status(200).json({
      message: 'File uploaded successfully',
      url: result.secure_url,
      public_id: result.public_id,
      originalname: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype,
      uploadType,
      folder
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      message: 'Upload failed',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Upload error'
    });
  }
};

/**
 * NEW: Upload multiple files to Cloudinary
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
exports.uploadMultipleFiles = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    // Determine the upload folder based on the request type
    const uploadType = req.query.type || 'report';
    let folder = 'tabina_oms/reports';
    let resourceType = 'auto';
    
    console.log(`Uploading ${req.files.length} files to ${folder} as ${resourceType}`);

    // Upload all files to Cloudinary
    const uploadPromises = req.files.map(file => {
      return new Promise((resolve, reject) => {
        const cloudinaryStream = cloudinary.uploader.upload_stream(
          {
            folder,
            resource_type: resourceType,
            flags: 'attachment'
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              // Include original file metadata with the cloudinary result
              resolve({
                ...result,
                originalname: file.originalname,
                size: file.size,
                mimetype: file.mimetype
              });
            }
          }
        );
        
        streamifier.createReadStream(file.buffer).pipe(cloudinaryStream);
      });
    });

    // Wait for all uploads to complete
    const results = await Promise.all(uploadPromises);

    // Format the response with file details
    const uploadedFiles = results.map(result => ({
      url: result.secure_url,
      public_id: result.public_id,
      originalname: result.originalname,
      size: result.size,
      mimetype: result.mimetype
    }));

    res.status(200).json({
      message: `${uploadedFiles.length} files uploaded successfully`,
      files: uploadedFiles,
      uploadType,
      folder
    });
  } catch (error) {
    console.error('Multiple file upload error:', error);
    res.status(500).json({
      message: 'Upload failed',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Upload error'
    });
  }
};

/**
 * Upload base64 encoded image to Cloudinary with specified folder destination
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
exports.uploadBase64 = async (req, res) => {
  try {
    const { image } = req.body;
    
    if (!image) {
      return res.status(400).json({ message: 'No image data provided' });
    }

    // Determine the upload folder based on the request type
    const uploadType = req.query.type || 'id';
    let folder = 'tabina_oms/valid_ids';
    
    if (uploadType === 'report') {
      folder = 'tabina_oms/reports';
    }

    const result = await cloudinary.uploader.upload(image, {
      folder,
      resource_type: 'image',
      flags: 'attachment'
    });

    res.status(200).json({
      message: 'Image uploaded successfully',
      url: result.secure_url,
      public_id: result.public_id,
      uploadType,
      folder
    });
  } catch (error) {
    console.error('Base64 upload error:', error);
    res.status(500).json({
      message: 'Upload failed',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Upload error'
    });
  }
};

/**
 * Delete file from Cloudinary
 */
exports.deleteFile = async (req, res) => {
  try {
    const { publicId } = req.params;
    
    if (!publicId) {
      return res.status(400).json({ message: 'No public ID provided' });
    }

    const result = await cloudinary.uploader.destroy(publicId);
    
    if (result.result === 'ok') {
      res.status(200).json({
        message: 'File deleted successfully',
        result
      });
    } else {
      res.status(400).json({
        message: 'Failed to delete file',
        result
      });
    }
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({
      message: 'Delete failed',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Delete error'
    });
  }
};