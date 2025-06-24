const { authenticate } = require('./auth');
const roleMiddleware = require('./roleMiddleware');
const checkAccountStatus = require('./checkAccountStatus');
const validate = require('./validate');

// Middleware logging for sensitive operations
const logSensitiveOperation = (req, res, next) => {
  console.log(`SENSITIVE OPERATION: ${req.method} ${req.originalUrl} by user ID ${req.user.id}`);
  next();
};

// Public access middleware - allows any request through
const publicAccess = (req, res, next) => {
  next();
};

// Predefined role combinations
const roles = {
  mlgooStaff: roleMiddleware(['MLGOO_STAFF']),
  barangaySecretary: roleMiddleware(['BARANGAY_SECRETARY']),
  bothRoles: roleMiddleware(['MLGOO_STAFF', 'BARANGAY_SECRETARY']),
  adminAccess: roleMiddleware(['ADMIN', 'MLGOO_STAFF']),
  anyAuthenticated: (req, res, next) => next() // Allows any authenticated user
};

// Create authentication chains
const auth = {
  basic: [authenticate],
  standard: [authenticate, checkAccountStatus],
  mlgoo: [authenticate, checkAccountStatus, roles.mlgooStaff],
  secretary: [authenticate, checkAccountStatus, roles.barangaySecretary],
  bothRoles: [authenticate, checkAccountStatus, roles.bothRoles],
  admin: [authenticate, checkAccountStatus, roles.adminAccess],
  sensitive: [authenticate, checkAccountStatus, logSensitiveOperation],
  // Read-only access to settings for authenticated users
  readSettings: [authenticate, checkAccountStatus, roles.anyAuthenticated],
  // Public access to settings with no authentication required
  public: [publicAccess]
};

module.exports = {
  authenticate,
  roleMiddleware,
  checkAccountStatus,
  validate,
  logSensitiveOperation,
  publicAccess,
  roles,
  auth
};