const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/auth');
const roleMiddleware = require('../middlewares/roleMiddleware');
const notificationController = require('../controllers/notificationController');

// Routes accessible by both MLGOO_STAFF and BARANGAY_SECRETARY
router.get('/user-notifications', 
  authenticate, 
  notificationController.getUserNotifications
);

router.patch('/mark-read/:notificationId', 
  authenticate, 
  notificationController.markNotificationRead
);

// Routes accessible by MLGOO_STAFF only
router.post('/', 
  authenticate, 
  roleMiddleware(['MLGOO_STAFF']), 
  notificationController.createNotification
);

router.delete('/:notificationId', 
  authenticate, 
  roleMiddleware(['MLGOO_STAFF']), 
  notificationController.deleteNotification
);

router.get('/barangay-secretaries', 
  authenticate, 
  roleMiddleware(['MLGOO_STAFF']), 
  notificationController.getBarangaySecretaries
);

module.exports = router;