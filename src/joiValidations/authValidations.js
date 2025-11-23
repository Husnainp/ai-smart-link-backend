import Joi from 'joi';
import { joiValidate } from '../utils/joiValidater.js';

const signupSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const siteSchema = Joi.object({
  siteUrl: Joi.string().uri().required(),
  title: Joi.string().min(1).required(),
  coverImage: Joi.string().uri().optional().allow(null,''),
  description: Joi.string().optional().allow(null,''),
  // category as MongoDB ObjectId string
  category: Joi.string().hex().length(24).required(),
});



const validateSignup = joiValidate(signupSchema);
const validateLogin = joiValidate(loginSchema);
const validateSite = joiValidate(siteSchema);

export { validateSignup, validateLogin, validateSite };
