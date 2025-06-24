const createRouter = require('../utils/routerFactory');
const { auth, logSensitiveOperation } = require('../middlewares');
const reportController = require('../controllers/reportController');

// Create a router with standard auth middleware
const router = createRouter(auth.standard);

// Reports routes
router.get('/', auth.bothRoles, reportController.getAllReports);
router.get('/:id', auth.bothRoles, reportController.getReportById);
router.post('/', auth.secretary, reportController.createReport);
router.patch('/:id/status', auth.mlgoo, reportController.updateReportStatus);
router.delete('/:id', [...auth.bothRoles, logSensitiveOperation], reportController.deleteReport);
router.get('/barangay/:barangayId', auth.bothRoles, reportController.getReportsByBarangay);
router.put('/:id', auth.secretary, reportController.updateReport);

module.exports = router;