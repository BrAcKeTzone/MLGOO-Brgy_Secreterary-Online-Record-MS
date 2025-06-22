const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/auth');
const roleMiddleware = require('../middlewares/roleMiddleware');
const checkAccountStatus = require('../middlewares/checkAccountStatus');
const userListController = require('../controllers/userListController');

// Apply authentication middleware to all routes
router.use(authenticate);
router.use(checkAccountStatus);

// Only admin or MLGOO_STAFF can manage users
const adminAccess = roleMiddleware(['ADMIN', 'MLGOO_STAFF']);

// Request logging middleware for sensitive operations
const logSensitiveOperation = (req, res, next) => {
  console.log(`SENSITIVE OPERATION: ${req.method} ${req.originalUrl} by user ID ${req.user.id}`);
  next();
};

// User management routes
router.get('/', adminAccess, userListController.getUsers);
router.patch('/:id/status', adminAccess, userListController.updateUserStatus);

// Add extra logging for delete operation
router.delete('/:id', adminAccess, logSensitiveOperation, userListController.deleteUser);
router.put('/:id', adminAccess, userListController.updateUser);

module.exports = router;