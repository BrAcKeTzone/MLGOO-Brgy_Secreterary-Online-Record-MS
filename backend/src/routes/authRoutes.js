const express = require('express');
const router = express.Router();
const validate = require('../middlewares/validate');
const { registerSchema, loginSchema } = require('../validations/authValidation');
const authController = require('../controllers/authController');

// Email verification and signup flow
router.post('/check-email', authController.checkEmail);
router.post('/verify-email-otp', authController.verifyEmailOtp);
router.post('/signup', validate(registerSchema), authController.signup);

// Login and session
router.post('/login', validate(loginSchema), authController.login);
router.get('/me', authController.getCurrentUser);


// Password reset flow
router.post('/request-password-reset', authController.requestPasswordReset);
router.post('/verify-password-reset-otp', authController.verifyPasswordResetOtp);
router.post('/reset-password', authController.resetPassword);

module.exports = router;
