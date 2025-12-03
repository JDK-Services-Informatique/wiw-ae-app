import express from 'express';
import { register, login, logout } from '../controllers/auth.controller.js';
import { forgotPassword, resetPassword } from '../controllers/passwordReset.controller.js';
import { authLimiter, loginLimiter, passwordResetLimiter } from '../middlewares/rateLimit.middleware.js';
import {
  validateRegister,
  validateLogin,
  validateForgotPassword,
  validateResetPassword
} from '../middlewares/validators.middleware.js';

const router = express.Router();

// Appliquer le rate limiting et la validation sur toutes les routes d'authentification
router.post('/register', authLimiter, validateRegister, register);
router.post('/login', loginLimiter, validateLogin, login);
router.post('/logout', logout);
router.post('/forgot-password', passwordResetLimiter, validateForgotPassword, forgotPassword);
router.post('/reset-password', authLimiter, validateResetPassword, resetPassword);

export default router;