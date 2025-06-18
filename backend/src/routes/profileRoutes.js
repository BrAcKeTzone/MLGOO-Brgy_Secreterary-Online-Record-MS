const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/auth');
const profileController = require('../controllers/profileController');

// Apply authentication middleware
router.use(authenticate);

// Profile routes
router.get('/', profileController.getProfile);
router.post('/change-password', profileController.changePassword);

module.exports = router;