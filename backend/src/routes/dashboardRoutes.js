const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/auth');
const roleMiddleware = require('../middlewares/roleMiddleware');
const checkAccountStatus = require('../middlewares/checkAccountStatus');
const dashboardController = require('../controllers/dashboardController');

// Apply authentication to all routes
router.use(authenticate);
router.use(checkAccountStatus);

// MLGOO Staff dashboard metrics
router.get(
  '/mlgoo-metrics',
  roleMiddleware(['MLGOO_STAFF']),
  dashboardController.getMlgooDashboardMetrics
);

// Barangay Secretary dashboard metrics
router.get(
  '/barangay-metrics',
  roleMiddleware(['BARANGAY_SECRETARY']),
  dashboardController.getBarangaySecretaryDashboardMetrics
);

// Dashboard analytics - accessible to both roles
router.get(
  '/analytics',
  dashboardController.getDashboardAnalytics
);

// MLGOO-specific analytics
router.get(
  '/mlgoo-analytics',
  roleMiddleware(['MLGOO_STAFF']),
  dashboardController.getMlgooAnalytics
);

module.exports = router;