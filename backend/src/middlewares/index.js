const { authenticate } = require('./auth');
const roleMiddleware = require('./roleMiddleware');
const checkAccountStatus = require('./checkAccountStatus');
const validate = require('./validate');

// Middleware logging for sensitive operations
const logSensitiveOperation = (req, res, next) => {
  console.log(`SENSITIVE OPERATION: ${req.method} ${req.originalUrl} by user ID ${req.user.id}`);
  next();
};

// Predefined role combinations
const roles = {
  mlgooStaff: roleMiddleware(['MLGOO_STAFF']),
  barangaySecretary: roleMiddleware(['BARANGAY_SECRETARY']),
  bothRoles: roleMiddleware(['MLGOO_STAFF', 'BARANGAY_SECRETARY']),
  adminAccess: roleMiddleware(['ADMIN', 'MLGOO_STAFF'])
};

// Create authentication chains
const auth = {
  basic: [authenticate],
  standard: [authenticate, checkAccountStatus],
  mlgoo: [authenticate, checkAccountStatus, roles.mlgooStaff],
  secretary: [authenticate, checkAccountStatus, roles.barangaySecretary],
  bothRoles: [authenticate, checkAccountStatus, roles.bothRoles],
  admin: [authenticate, checkAccountStatus, roles.adminAccess],
  sensitive: [authenticate, checkAccountStatus, logSensitiveOperation]
};

module.exports = {
  authenticate,
  roleMiddleware,
  checkAccountStatus,
  validate,
  logSensitiveOperation,
  roles,
  auth
};