import Joi from 'joi';
import { joiValidate } from '../utils/joiValidater.js';

const createCategorySchema = Joi.object({
  name: Joi.string().min(1).required(),
  description: Joi.string().optional().allow(null, ''),
});

const validateCreateCategory = joiValidate(createCategorySchema);

export { validateCreateCategory };
