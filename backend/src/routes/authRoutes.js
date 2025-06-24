const express = require('express');
const router = express.Router();
const multer = require('multer');
const validate = require('../middlewares/validate');
const { registerSchema, loginSchema } = require('../validations/authValidation');
const authController = require('../controllers/authController');

// Configure multer for file uploads with increased limits
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // Increase to 10MB max file size for ID documents
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

// Helper middleware to handle file uploads for IDs during signup if needed
const handleIdUploads = (req, res, next) => {
  // Process the files if they exist and add them to the request body
  if (req.files) {
    if (req.files.nationalIdFront) {
      // Instead of doing cloudinary upload here, we'll just mark that we have a file
      // The actual upload will be handled in the controller
      req.body.hasNationalIdFront = true;
    }
    if (req.files.nationalIdBack) {
      req.body.hasNationalIdBack = true;
    }
  }
  next();
};

// Email verification and signup flow
router.post('/check-email', authController.checkEmail);
router.post('/verify-email-otp', authController.verifyEmailOtp);

// Handle multipart form signup (with direct file uploads)
router.post('/signup-with-files',
  upload.fields([
    { name: 'nationalIdFront', maxCount: 1 },
    { name: 'nationalIdBack', maxCount: 1 }
  ]),
  handleMulterError,
  handleIdUploads,
  validate(registerSchema),
  authController.signup
);

// Standard JSON signup (with URLs or base64)
router.post('/signup', 
  express.json({ limit: '15mb' }), // Increase JSON size limit for base64 images
  validate(registerSchema), 
  authController.signup
);

// Login and session
router.post('/login', validate(loginSchema), authController.login);
router.get('/me', authController.getCurrentUser);

// Password reset flow
router.post('/request-password-reset', authController.requestPasswordReset);
router.post('/verify-password-reset-otp', authController.verifyPasswordResetOtp);
router.post('/reset-password', authController.resetPassword);

module.exports = router;
