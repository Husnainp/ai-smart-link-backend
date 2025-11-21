import express from 'express';


import { loginUser, registerUser } from '../controllers/authController.js';
import { validateLogin, validateSignup } from '../joiValidations/authValidations.js';

const router = express.Router();

router.post('/signup', validateSignup, registerUser);
router.post('/login', validateLogin, loginUser);

export default router;
