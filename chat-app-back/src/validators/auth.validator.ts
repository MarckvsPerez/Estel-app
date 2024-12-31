import { check } from 'express-validator';
import { validateResult } from '@/middlewares/validate.middleware';

export const validateSignup = [
  check('email')
    .exists()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Must be a valid email')
    .normalizeEmail(),

  check('password')
    .exists()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/\d/)
    .withMessage('Password must contain at least one number'),

  check('fullName')
    .exists()
    .withMessage('Full name is required')
    .isLength({ min: 3 })
    .withMessage('Full name must be at least 3 characters long')
    .trim(),

  validateResult
];

export const validateLogin = [
  check('email')
    .exists()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Must be a valid email')
    .normalizeEmail(),

  check('password')
    .exists()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),

  validateResult
];

export const validateUpdateProfile = [
  check('profilePicture')
    .exists()
    .withMessage('Profile picture is required')
    .isString()
    .withMessage('Profile picture must be a string'),
  validateResult
];

