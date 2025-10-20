import prisma from '../config/database';
import { hashPassword, comparePassword } from '../utils/hash';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { AppError } from '../middleware/errorHandler';
import redisClient from '../config/redis';

export class AuthService {
  async login(email: string, password: string) {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      include: { role: true, staff: true },
    });

    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    // Check if user is active
    if (!user.isActive) {
      throw new AppError('Account is inactive', 403);
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new AppError('Invalid credentials', 401);
    }

    // Generate tokens
    const tokenPayload = {
      userId: user.id,
      email: user.email,
      roleId: user.roleId,
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    // Store refresh token in Redis (7 days)
    await redisClient.setEx(
      `refresh_token:${user.id}`,
      7 * 24 * 60 * 60,
      refreshToken
    );

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'LOGIN',
        entityType: 'user',
        entityId: user.id,
      },
    });

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role.name,
        staff: user.staff
          ? {
              id: user.staff.id,
              firstName: user.staff.firstName,
              lastName: user.staff.lastName,
              specialization: user.staff.specialization,
            }
          : null,
      },
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      // Verify refresh token
      const decoded = verifyRefreshToken(refreshToken);

      // Check if token exists in Redis
      const storedToken = await redisClient.get(`refresh_token:${decoded.userId}`);

      if (!storedToken || storedToken !== refreshToken) {
        throw new AppError('Invalid refresh token', 401);
      }

      // Generate new access token
      const newAccessToken = generateAccessToken({
        userId: decoded.userId,
        email: decoded.email,
        roleId: decoded.roleId,
      });

      return { accessToken: newAccessToken };
    } catch (error) {
      throw new AppError('Invalid refresh token', 401);
    }
  }

  async logout(userId: number) {
    // Remove refresh token from Redis
    await redisClient.del(`refresh_token:${userId}`);

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId,
        action: 'LOGOUT',
        entityType: 'user',
        entityId: userId,
      },
    });

    return { message: 'Logged out successfully' };
  }

  async changePassword(userId: number, oldPassword: string, newPassword: string) {
    // Get user
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Verify old password
    const isPasswordValid = await comparePassword(oldPassword, user.passwordHash);

    if (!isPasswordValid) {
      throw new AppError('Current password is incorrect', 400);
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash: hashedPassword },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId,
        action: 'PASSWORD_CHANGE',
        entityType: 'user',
        entityId: userId,
      },
    });

    return { message: 'Password changed successfully' };
  }

  async getProfile(userId: number) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        role: true,
        staff: {
          include: {
            department: true,
          },
        },
      },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role.name,
      isActive: user.isActive,
      lastLogin: user.lastLogin,
      staff: user.staff
        ? {
            id: user.staff.id,
            firstName: user.staff.firstName,
            lastName: user.staff.lastName,
            gender: user.staff.gender,
            phone: user.staff.phone,
            department: user.staff.department?.name,
            specialization: user.staff.specialization,
            licenseNumber: user.staff.licenseNumber,
          }
        : null,
    };
  }
}

export default new AuthService();
