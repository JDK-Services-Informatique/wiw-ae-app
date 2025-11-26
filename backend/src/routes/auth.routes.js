import express from 'express';
import { register, login } from '../controllers/auth.controller.js';
import { forgotPassword, resetPassword } from '../controllers/passwordReset.controller.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;