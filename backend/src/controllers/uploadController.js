const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');
const path = require('path');

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
    let resourceType = uploadType === 'report' ? 'raw' : 'image';
    
    // Set the appropriate folder based on upload type
    if (uploadType === 'report') {
      folder = 'tabina_oms/reports';
    }
    
    console.log(`Uploading file to ${folder} as ${resourceType}`);

    // Get file extension
    const fileExt = path.extname(req.file.originalname);
    
    // Format filename for reports
    let fileName = req.file.originalname;
    if (uploadType === 'report') {
      // Extract report type from query params if available
      const reportType = req.query.reportType || 'general';
      const dateStr = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
      const baseName = path.basename(req.file.originalname, fileExt);
      fileName = `${dateStr}_${reportType}_${baseName}${fileExt}`;
    }

    // Upload file buffer to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const cloudinaryStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: resourceType,
          flags: 'attachment',
          use_filename: true,
          unique_filename: false,
          public_id: path.basename(fileName, fileExt) // Save without extension as Cloudinary adds it for raw files
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
      fileName: fileName, // Return the formatted filename
      size: req.file.size,
      mimetype: req.file.mimetype,
      uploadType,
      folder,
      fileExt: fileExt
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
 * Upload multiple files to Cloudinary
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
    let resourceType = 'raw'; // Using raw for better file handling
    
    // Extract report type from query params if available
    const reportType = req.query.reportType || 'general';
    const dateStr = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    
    console.log(`Uploading ${req.files.length} files to ${folder} as ${resourceType}`);

    // Upload all files to Cloudinary
    const uploadPromises = req.files.map(file => {
      return new Promise((resolve, reject) => {
        // Get file extension
        const fileExt = path.extname(file.originalname);
        const baseName = path.basename(file.originalname, fileExt);
        
        // Format filename with correct report type
        const fileName = `${dateStr}_${reportType}_${baseName}${fileExt}`;
        
        // IMPORTANT CHANGE: Include the extension in the public_id
        const publicIdWithExt = `${folder}/${dateStr}_${reportType}_${baseName}${fileExt}`;
        
        const cloudinaryStream = cloudinary.uploader.upload_stream(
          {
            folder: '', // We'll include the folder in the public_id
            resource_type: resourceType,
            use_filename: false,
            public_id: publicIdWithExt, // Use the full path with extension
            flags: 'attachment', // Force as attachment for downloads
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              // Include original file metadata with the cloudinary result
              resolve({
                ...result,
                originalname: file.originalname,
                fileName: fileName, // Store formatted filename
                size: file.size,
                fileSize: file.size,
                mimetype: file.mimetype,
                contentType: file.mimetype,
                fileExt: fileExt
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
      fileName: result.fileName, // Include formatted filename
      size: result.size,
      fileSize: result.size,
      mimetype: result.mimetype,
      contentType: result.mimetype,
      fileExt: result.fileExt
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