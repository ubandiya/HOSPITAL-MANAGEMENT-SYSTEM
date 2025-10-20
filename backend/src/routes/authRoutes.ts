import { Router } from 'express';
import authController from '../controllers/authController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Public routes
router.post('/login', authController.login.bind(authController));
router.post('/refresh-token', authController.refreshToken.bind(authController));

// Protected routes
router.post('/logout', authenticate, authController.logout.bind(authController));
router.post('/change-password', authenticate, authController.changePassword.bind(authController));
router.get('/profile', authenticate, authController.getProfile.bind(authController));

export default router;
