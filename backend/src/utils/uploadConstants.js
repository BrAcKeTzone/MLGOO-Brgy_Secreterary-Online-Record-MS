/**
 * Constants for upload destinations and configurations
 */
exports.UPLOAD_FOLDERS = {
  VALID_IDS: 'tabina_oms/valid_ids',
  REPORTS: 'tabina_oms/reports',
  PROFILE_PICS: 'tabina_oms/profiles',  // For future use
  ATTACHMENTS: 'tabina_oms/attachments' // For future use
};

exports.RESOURCE_TYPES = {
  IMAGE: 'image',
  AUTO: 'auto',
  VIDEO: 'video',
  RAW: 'raw'
};

exports.FILE_SIZES = {
  SMALL: 1 * 1024 * 1024,  // 1MB
  MEDIUM: 5 * 1024 * 1024, // 5MB
  LARGE: 10 * 1024 * 1024  // 10MB
};