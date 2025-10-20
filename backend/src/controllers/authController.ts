import { Request, Response } from 'express';
import authService from '../services/authService';
import { z } from 'zod';
import { AppError } from '../middleware/errorHandler';

// Validation schemas
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

const changePasswordSchema = z.object({
  oldPassword: z.string().min(1, 'Current password is required'),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
});

export class AuthController {
  async login(req: Request, res: Response) {
    // Validate request body
    const validatedData = loginSchema.parse(req.body);

    // Perform login
    const result = await authService.login(validatedData.email, validatedData.password);

    res.json({
      success: true,
      message: 'Login successful',
      data: result,
    });
  }

  async refreshToken(req: Request, res: Response) {
    // Validate request body
    const validatedData = refreshTokenSchema.parse(req.body);

    // Refresh token
    const result = await authService.refreshToken(validatedData.refreshToken);

    res.json({
      success: true,
      message: 'Token refreshed successfully',
      data: result,
    });
  }

  async logout(req: Request, res: Response) {
    if (!req.user) {
      throw new AppError('Authentication required', 401);
    }

    // Perform logout
    const result = await authService.logout(req.user.userId);

    res.json({
      success: true,
      message: result.message,
    });
  }

  async changePassword(req: Request, res: Response) {
    if (!req.user) {
      throw new AppError('Authentication required', 401);
    }

    // Validate request body
    const validatedData = changePasswordSchema.parse(req.body);

    // Change password
    const result = await authService.changePassword(
      req.user.userId,
      validatedData.oldPassword,
      validatedData.newPassword
    );

    res.json({
      success: true,
      message: result.message,
    });
  }

  async getProfile(req: Request, res: Response) {
    if (!req.user) {
      throw new AppError('Authentication required', 401);
    }

    // Get user profile with staff info
    const user = await authService.getProfile(req.user.userId);

    res.json({
      success: true,
      data: user,
    });
  }
}

export default new AuthController();
