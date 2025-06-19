const express = require('express');
const router = express.Router();
const settingController = require('../controllers/settingController');

// --- Barangays ---
router.get('/barangays', settingController.getBarangays);
router.post('/barangays', settingController.createBarangay);
router.put('/barangays/:id', settingController.updateBarangay);
router.delete('/barangays/:id', settingController.deleteBarangay);


// --- Report Types ---
router.get('/report-types', settingController.getReportTypes);
router.post('/report-types', settingController.createReportType);
router.put('/report-types/:id', settingController.updateReportType);
router.delete('/report-types/:id', settingController.deleteReportType);

// --- Privacy Policy ---
router.get('/privacy-policy', settingController.getPrivacyPolicy);
router.put('/privacy-policy', settingController.updatePrivacyPolicy);

// --- Terms of Service ---
router.get('/terms-of-service', settingController.getTermsOfService);
router.put('/terms-of-service', settingController.updateTermsOfService);

module.exports = router;