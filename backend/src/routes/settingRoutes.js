const express = require('express');
const router = express.Router();
const { auth } = require('../middlewares');
const settingController = require('../controllers/settingController');

// --- Barangays ---
// GET routes accessible by all authenticated users
router.get('/barangays', auth.readSettings, settingController.getBarangays);
router.get('/report-types', auth.readSettings, settingController.getReportTypes);
router.get('/privacy-policy', auth.readSettings, settingController.getPrivacyPolicy);
router.get('/terms-of-service', auth.readSettings, settingController.getTermsOfService);
router.get('/valid-id-types', auth.readSettings, settingController.getValidIDTypes);
router.get('/valid-id-types/active', auth.readSettings, settingController.getActiveValidIDTypes);

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