const express = require('express');
const router = express.Router();
const { auth } = require('../middlewares');
const settingController = require('../controllers/settingController');

// --- Barangays ---
// GET routes accessible by the public without authentication
router.get('/barangays', auth.public, settingController.getBarangays);
router.get('/report-types', auth.public, settingController.getReportTypes);
router.get('/privacy-policy', auth.public, settingController.getPrivacyPolicy);
router.get('/terms-of-service', auth.public, settingController.getTermsOfService);
router.get('/valid-id-types', auth.public, settingController.getValidIDTypes);
router.get('/valid-id-types/active', auth.public, settingController.getActiveValidIDTypes);

// Modification routes restricted to admin
router.post('/barangays', auth.admin, settingController.createBarangay);
router.put('/barangays/:id', auth.admin, settingController.updateBarangay);
router.delete('/barangays/:id', auth.admin, settingController.deleteBarangay);

// --- Report Types ---
router.post('/report-types', auth.admin, settingController.createReportType);
router.put('/report-types/:id', auth.admin, settingController.updateReportType);
router.delete('/report-types/:id', auth.admin, settingController.deleteReportType);

// --- Privacy Policy ---
router.post('/privacy-policy', auth.admin, settingController.createPrivacyPolicySection);
router.put('/privacy-policy/:id', auth.admin, settingController.updatePrivacyPolicySection);
router.delete('/privacy-policy/:id', auth.admin, settingController.deletePrivacyPolicySection);
router.post('/privacy-policy/reorder', auth.admin, settingController.reorderPrivacyPolicySections);

// --- Terms of Service ---
router.post('/terms-of-service', auth.admin, settingController.createTermsOfServiceSection);
router.put('/terms-of-service/:id', auth.admin, settingController.updateTermsOfServiceSection);
router.delete('/terms-of-service/:id', auth.admin, settingController.deleteTermsOfServiceSection);
router.post('/terms-of-service/reorder', auth.admin, settingController.reorderTermsOfServiceSections);

// --- Valid ID Types ---
router.post('/valid-id-types', auth.admin, settingController.createValidIDType);
router.put('/valid-id-types/:id', auth.admin, settingController.updateValidIDType);
router.delete('/valid-id-types/:id', auth.admin, settingController.deleteValidIDType);
router.patch('/valid-id-types/:id/toggle', auth.admin, settingController.toggleValidIDTypeStatus);

module.exports = router;