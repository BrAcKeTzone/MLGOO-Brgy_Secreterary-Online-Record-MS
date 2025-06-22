const express = require('express');
const router = express.Router();
const multer = require('multer');
const { authenticate } = require('../middlewares/auth');
const roleMiddleware = require('../middlewares/roleMiddleware');
const uploadController = require('../controllers/uploadController');

// Set up multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size for reports (increased from 5MB)
  }
});

// Upload routes with type parameter:
// /api/upload?type=id (default) - For ID documents 
// /api/upload?type=report - For report documents

// Public route for file upload (used during signup)
router.post('/', upload.single('file'), uploadController.uploadFile);

// Route for base64 image upload
router.post('/base64', uploadController.uploadBase64);

// Protected routes for file management (require authentication)
router.use(authenticate);

// Routes for report uploads - only available to authenticated users
// Limited by role to prevent unauthorized users from uploading reports
// UPDATED: Changed from single file to array of files with field name "files"
router.post('/report', 
  roleMiddleware(['ADMIN', 'MLGOO_STAFF', 'BARANGAY_SECRETARY']),
  upload.array('files', 5), // Allow up to 5 files with field name "files"
  (req, res, next) => {
    // Force type to be 'report'
    req.query.type = 'report';
    next();
  },
  uploadController.uploadMultipleFiles // Changed to use a new controller method
);

// Only authenticated admin/staff can delete files
router.delete('/:publicId', 
  roleMiddleware(['ADMIN', 'MLGOO_STAFF']), 
  uploadController.deleteFile
);

module.exports = router;