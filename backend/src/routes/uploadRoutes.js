const express = require('express');
const router = express.Router();
const multer = require('multer');
const { authenticate } = require('../middlewares/auth');
const roleMiddleware = require('../middlewares/roleMiddleware');
const uploadController = require('../controllers/uploadController');

// Set up multer for memory storage with increased limits
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size
    fieldSize: 15 * 1024 * 1024, // 15MB max field size for better base64 handling
  },
  // Add error handling for multer
  fileFilter: (req, file, cb) => {
    // Check if file is too large before upload starts
    if (file.size && file.size > 10 * 1024 * 1024) {
      return cb(new Error('File is too large. Maximum size is 10MB.'), false);
    }
    return cb(null, true);
  }
});

// Error handler for multer file size limits
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({ 
        message: 'File too large. Maximum size is 10MB.'
      });
    }
    return res.status(400).json({ 
      message: `Upload error: ${err.message}` 
    });
  }
  next(err);
};

// Upload routes with type parameter:
// /api/upload?type=id (default) - For ID documents 
// /api/upload?type=report - For report documents

// Public route for file upload (used during signup)
router.post('/', upload.single('file'), handleMulterError, uploadController.uploadFile);

// Route for base64 image upload
router.post('/base64', express.json({ limit: '15mb' }), uploadController.uploadBase64);

// Protected routes for file management (require authentication)
router.use(authenticate);

// Routes for report uploads - only available to authenticated users
// Limited by role to prevent unauthorized users from uploading reports
// The reportType query param is used to format the filename
router.post('/report', 
  roleMiddleware(['ADMIN', 'MLGOO_STAFF', 'BARANGAY_SECRETARY']),
  upload.array('files', 5), // Allow up to 5 files with field name "files"
  handleMulterError,
  (req, res, next) => {
    // Force type to be 'report'
    req.query.type = 'report';
    
    // Make sure we have the reportType query parameter
    if (!req.query.reportType && req.body.reportType) {
      req.query.reportType = req.body.reportType;
    }
    
    next();
  },
  uploadController.uploadMultipleFiles
);

// Only authenticated admin/staff can delete files
router.delete('/:publicId', 
  roleMiddleware(['ADMIN', 'MLGOO_STAFF']), 
  uploadController.deleteFile
);

module.exports = router;