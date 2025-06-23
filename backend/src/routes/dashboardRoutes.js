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

// Dashboard analytics - for MLGOO (all barangays)
router.get(
  '/analytics',
  roleMiddleware(['MLGOO_STAFF']),
  dashboardController.getDashboardAnalytics
);

// Barangay-specific analytics - for Barangay Secretary (only their barangay)
router.get(
  '/barangay-analytics',
  roleMiddleware(['BARANGAY_SECRETARY']),
  dashboardController.getBarangayAnalytics
);

// MLGOO-specific analytics
router.get(
  '/mlgoo-analytics',
  roleMiddleware(['MLGOO_STAFF']),
  dashboardController.getMlgooAnalytics
);

module.exports = router;