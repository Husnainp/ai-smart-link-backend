import Joi from 'joi';
import { joiValidate } from '../utils/joiValidater.js';

// Schema matching the Mongoose model field names (snake_case)
const createSiteSchema = Joi.object({
  site_url: Joi.string().uri().required(),
  title: Joi.string().min(1).required(),
  cover_image: Joi.string().uri().optional().allow(null, ''),
  description: Joi.string().optional().allow(null, ''),
  // MongoDB ObjectId (24 hex chars)
  category: Joi.string().hex().length(24).required(),
});

// Update: allow partial updates but require at least one field
const updateSiteSchema = Joi.object({
  site_url: Joi.string().uri().optional(),
  title: Joi.string().min(1).optional(),
  cover_image: Joi.string().uri().optional().allow(null, ''),
  description: Joi.string().optional().allow(null, ''),
  category: Joi.string().hex().length(24).optional(),
}).min(1);

const validateCreateSite = joiValidate(createSiteSchema);
const validateUpdateSite = joiValidate(updateSiteSchema);

export { validateCreateSite, validateUpdateSite };
