const Joi = require('joi');

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  dateOfBirth: Joi.date().required(),
  role: Joi.string().valid('MLGOO_STAFF', 'BARANGAY_SECRETARY').required(),
  validIDFrontUrl: Joi.string().allow(null),
  validIDFrontPublicId: Joi.string().allow(null),
  validIDBackUrl: Joi.string().allow(null),
  validIDBackPublicId: Joi.string().allow(null)
});

module.exports = {
  loginSchema,
  registerSchema
};