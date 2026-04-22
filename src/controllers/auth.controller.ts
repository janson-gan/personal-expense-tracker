import { Request, Response } from 'express';
import asyncHandler from '../utils/asyncHandler';
import { User } from '../models';
import ApiError from '../utils/ApiError';
import { registerSchema } from '../validations/validation';
import { fromZodError } from 'zod-validation-error';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { RegisterType } from '../types/auth.types';
import { BCRYPT } from '../config/constants';

// Register new user
export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password, role }: RegisterType = req.body;
  const existingEmail = await User.findOne({ where: { email } });
  if (existingEmail) {
    throw new ApiError({
      statusCode: 409,
      message: 'An account with this email already exists.',
    });
  }

  const hashPassword = await bcrypt.hash(password, BCRYPT.SALT_ROUNDS);

  const newUser = await User.create({
    name,
    email,
    password: hashPassword,
    role,
  });
  res.status(201).json({
    success: true,
    message: 'Registered successfully.',
    data: { name: newUser.name, email: newUser.email },
  });
});
