const Joi = require('joi');

exports.registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  dateOfBirth: Joi.date().required(),
  role: Joi.string().valid('MLGOO_STAFF', 'BARANGAY_SECRETARY').required(),
  assignedBrgy: Joi.number().integer().allow(null, ''),
  validIDTypeId: Joi.number().integer().required(),
  
  // For handling the ID images
  nationalIdFront: Joi.object({
    url: Joi.string().required(),
    public_id: Joi.string().required()
  }).required(),
  
  nationalIdBack: Joi.object({
    url: Joi.string().required(),
    public_id: Joi.string().required()
  }).required()
});

// Keep your other schemas as they are
exports.loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});