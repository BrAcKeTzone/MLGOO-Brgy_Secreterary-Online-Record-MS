const multer = require('multer');

// Set up multer for memory storage
const storage = multer.memoryStorage();

// Create multer instances with different configurations
const uploadConfigs = {
  idDocument: multer({
    storage,
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB for ID documents
    }
  }),

  reportDocument: multer({
    storage,
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB for reports
    }
  })
};

module.exports = uploadConfigs;