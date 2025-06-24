const createRouter = require('../utils/routerFactory');
const { auth } = require('../middlewares');
const settingController = require('../controllers/settingController');

// Create router with admin authentication for all setting routes
const router = createRouter(auth.admin);

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
router.post('/privacy-policy', settingController.createPrivacyPolicySection);
router.put('/privacy-policy/:id', settingController.updatePrivacyPolicySection);
router.delete('/privacy-policy/:id', settingController.deletePrivacyPolicySection);
router.post('/privacy-policy/reorder', settingController.reorderPrivacyPolicySections);

// --- Terms of Service ---
router.get('/terms-of-service', settingController.getTermsOfService);
router.post('/terms-of-service', settingController.createTermsOfServiceSection);
router.put('/terms-of-service/:id', settingController.updateTermsOfServiceSection);
router.delete('/terms-of-service/:id', settingController.deleteTermsOfServiceSection);
router.post('/terms-of-service/reorder', settingController.reorderTermsOfServiceSections);

// --- Valid ID Types ---
router.get('/valid-id-types', settingController.getValidIDTypes);
router.get('/valid-id-types/active', settingController.getActiveValidIDTypes);
router.post('/valid-id-types', settingController.createValidIDType);
router.put('/valid-id-types/:id', settingController.updateValidIDType);
router.delete('/valid-id-types/:id', settingController.deleteValidIDType);
router.patch('/valid-id-types/:id/toggle', settingController.toggleValidIDTypeStatus);

module.exports = router;