import Joi from 'joi';

// ✅ User validation (Updated → departmentName)
export function validateUserRegistration(data) {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('student', 'admin', 'department').required(),
    departmentName: Joi.string().optional()
  });

  return schema.validate(data);
}

// ✅ Query validation
export function validateQuery(data) {
  const schema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    priority: Joi.string().valid('low', 'medium', 'high').required(),
    departmentName: Joi.string().required() // Ensure department name is provided
  });

  return schema.validate(data);
}

// ✅ Department validation
export function validateDepartment(data) {
  const schema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    contactEmail: Joi.string().email().optional(),
    contactPhone: Joi.string().optional()
  });

  return schema.validate(data);
}

// ✅ Feedback validation
export function validateFeedback(data) {
  const schema = Joi.object({
    rating:Joi.string().valid('satisfied', 'notsatisfied').required(),
    comment: Joi.string().allow('').optional()
  });

  return schema.validate(data);
}
