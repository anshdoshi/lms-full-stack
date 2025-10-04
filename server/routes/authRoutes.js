import express from 'express';
import { register, login, logout, getMe } from '../controllers/authController.js';
import { authenticate } from '../middlewares/auth.js';

const authRouter = express.Router();

// Public routes
authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', logout);

// Protected routes
authRouter.get('/me', authenticate, getMe);

export default authRouter;
