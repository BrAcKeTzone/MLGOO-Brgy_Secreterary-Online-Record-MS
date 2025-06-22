const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/auth');
const roleMiddleware = require('../middlewares/roleMiddleware');
const checkAccountStatus = require('../middlewares/checkAccountStatus');
const reportController = require('../controllers/reportController');

// Apply authentication middleware to all routes
router.use(authenticate);
router.use(checkAccountStatus);

// Request logging middleware for sensitive operations
const logSensitiveOperation = (req, res, next) => {
  console.log(`SENSITIVE OPERATION: ${req.method} ${req.originalUrl} by user ID ${req.user.id}`);
  next();
};

// Define user role access
const mlgooStaffAccess = roleMiddleware(['MLGOO_STAFF']);
const barangaySecretaryAccess = roleMiddleware(['BARANGAY_SECRETARY']);
const bothRolesAccess = roleMiddleware(['MLGOO_STAFF', 'BARANGAY_SECRETARY']);

// Reports routes
router.get('/', bothRolesAccess, reportController.getAllReports);
router.get('/:id', bothRolesAccess, reportController.getReportById);
router.post('/', barangaySecretaryAccess, reportController.createReport);
router.patch('/:id/status', mlgooStaffAccess, reportController.updateReportStatus);
router.delete('/:id', bothRolesAccess, logSensitiveOperation, reportController.deleteReport);
router.get('/barangay/:barangayId', bothRolesAccess, reportController.getReportsByBarangay);
router.put('/:id', barangaySecretaryAccess, reportController.updateReport);

module.exports = router;