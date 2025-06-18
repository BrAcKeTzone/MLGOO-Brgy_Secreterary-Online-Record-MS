const Joi = require('joi');

exports.departmentSchema = Joi.object({
  name: Joi.string().min(2).max(100).required()
});

exports.programSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  level: Joi.string().valid('College', 'Senior High').required(),
  departmentId: Joi.number().integer().required()
});

exports.courseSchema = Joi.object({
  code: Joi.string().alphanum().min(2).max(10).required(),
  title: Joi.string().min(2).max(100).required(),
  programId: Joi.number().integer().required()
});
