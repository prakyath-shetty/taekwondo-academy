import { Request, Response } from 'express';
import { body } from 'express-validator';
import crypto from 'crypto';
import {
  findUserByEmail,
  createUser,
  generateAuthToken,
  toAuthResponse,
  toProfileResponse,
  updateUserProfile,
} from '../services/authService.js';
import { memoryStore } from '../stores/MemoryStore.js';
import { isMongoDBReady } from '../stores/MemoryStore.js';
import { AuthRequest } from '../middleware/auth.js';

// Validation rules
export const signupValidation = [
  body('firstName').trim().notEmpty().withMessage('First name is required').isLength({ min: 2 }).withMessage('First name must be at least 2 characters'),
  body('lastName').trim().notEmpty().withMessage('Last name is required').isLength({ min: 2 }).withMessage('Last name must be at least 2 characters'),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/(?=.*[a-z])/).withMessage('Password must contain at least one lowercase letter')
    .matches(/(?=.*[A-Z])/).withMessage('Password must contain at least one uppercase letter')
    .matches(/(?=.*\d)/).withMessage('Password must contain at least one number'),
];

export const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

export const forgotPasswordValidation = [
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
];

export const resetPasswordValidation = [
  body('token').notEmpty().withMessage('Reset token is required'),
  body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/(?=.*[a-z])/).withMessage('Password must contain at least one lowercase letter')
    .matches(/(?=.*[A-Z])/).withMessage('Password must contain at least one uppercase letter')
    .matches(/(?=.*\d)/).withMessage('Password must contain at least one number'),
];

export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      res.status(400).json({ success: false, message: 'An account with this email already exists' });
      return;
    }

    const user = await createUser({ firstName, lastName, email, password });
    const token = generateAuthToken(user);

    // Set HttpOnly cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: req.secure || process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    const userResponse = toAuthResponse(user);
    res.status(201).json({ success: true, message: 'Account created successfully', data: { user: userResponse, token } });
  } catch (err: any) {
    const msg = err.message || 'Server error during signup';
    if (msg.includes('E11000') || msg.includes('duplicate key')) {
      res.status(400).json({ success: false, message: 'An account with this email already exists' });
      return;
    }
    // Don't leak internal errors
    res.status(500).json({ success: false, message: 'An unexpected error occurred. Please try again later.' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await findUserByEmail(email);
    if (!user) {
      // Generic message to prevent email enumeration
      res.status(401).json({ success: false, message: 'Invalid email or password' });
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
      return;
    }

    const token = generateAuthToken(user);

    res.cookie('token', token, {
      httpOnly: true,
      secure: req.secure || process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    const userResponse = toAuthResponse(user);
    res.json({ success: true, message: 'Login successful', data: { user: userResponse, token } });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'An unexpected error occurred. Please try again later.' });
  }
};

export const logout = (_req: Request, res: Response): void => {
  res.clearCookie('token');
  res.json({ success: true, message: 'Logged out successfully' });
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Not authenticated' });
    return;
  }
  try {
    const memUser = await memoryStore.findById(req.user.userId);
    if (!memUser) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }
    res.json({ success: true, data: { user: toProfileResponse(memUser) } });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'An unexpected error occurred. Please try again later.' });
  }
};

/** Get full profile */
export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Not authenticated' });
    return;
  }
  const memUser = await memoryStore.findById(req.user.userId);
  if (!memUser) {
    res.status(404).json({ success: false, message: 'User not found' });
    return;
  }
  res.json({ success: true, data: { user: toProfileResponse(memUser) } });
};

/** Update profile */
export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Not authenticated' });
    return;
  }
  const allowed = ['firstName', 'lastName', 'phone', 'belt', 'level', 'academy', 'coach'];
  const updates: Record<string, any> = {};
  for (const key of allowed) {
    if (req.body[key] !== undefined) updates[key] = req.body[key];
  }
  try {
    const updated = await updateUserProfile(req.user.userId, updates);
    if (!updated) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }
    res.json({ success: true, message: 'Profile updated', data: { user: toProfileResponse(updated) } });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'An unexpected error occurred. Please try again later.' });
  }
};

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    const user = await findUserByEmail(email);

    if (!user) {
      // Don't reveal whether the email exists
      res.json({ success: true, message: 'If an account with that email exists, a reset link has been sent.' });
      return;
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Store hashed token on user (via memory store or DB)
    if (!isMongoDBReady()) {
      // Memory store mode — update via the store directly
      await memoryStore.updateOne({ email }, { resetPasswordToken: hashedToken, resetPasswordExpires: Date.now() + 3600000 });
    } else {
      // MongoDB mode
      (user as any).resetPasswordToken = hashedToken;
      (user as any).resetPasswordExpires = Date.now() + 3600000; // 1 hour
      await (user as any).save();
    }

    // In production, this would send an email. For now, return the token for testing.
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;
    res.json({
      success: true,
      message: process.env.NODE_ENV === 'production'
        ? 'If an account with that email exists, a reset link has been sent.'
        : `Reset link: ${resetUrl}`,
      debug: { resetToken }, // Only in dev
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'An unexpected error occurred. Please try again later.' });
  }
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token, password } = req.body;
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    let user: any = null;

    if (!isMongoDBReady()) {
      // Memory store mode
      user = await memoryStore.findByResetToken(hashedToken);
      if (!user) {
        res.status(400).json({ success: false, message: 'Invalid or expired reset token' });
        return;
      }
      // Hash new password and update
      const bcrypt = await import('bcryptjs');
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(password, salt);
      await memoryStore.updatePassword(user._id, hashedPassword);
    } else {
      // MongoDB mode
      const { User } = await import('../models/User.js');
      user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpires: { $gt: Date.now() },
      });

      if (!user) {
        res.status(400).json({ success: false, message: 'Invalid or expired reset token' });
        return;
      }

      // Update password via Mongoose
      user.password = password;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
    }

    res.json({ success: true, message: 'Password has been reset successfully. You can now log in.' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'An unexpected error occurred. Please try again later.' });
  }
};
