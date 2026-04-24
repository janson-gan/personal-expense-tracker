import { Request, Response } from 'express';
import asyncHandler from '../utils/asyncHandler';
import { User } from '../models';
import ApiError from '../utils/ApiError';
import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import { JWTPayloadType, LoginType, RegisterType } from '../types/auth.types';
import { BCRYPT, HTTP_STATUS } from '../config/constants';

// Register new user
export const register = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { name, email, password, role }: RegisterType = req.body;
    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) {
      throw new ApiError({
        statusCode: HTTP_STATUS.CONFLICT,
        message: 'An account with this email already exists.',
      });
    }

    // Encrypt user password
    const hashPassword = await bcrypt.hash(password, BCRYPT.SALT_ROUNDS);

    const newUser = await User.create({
      name,
      email,
      password: hashPassword,
      role,
    });

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: 'Registered successfully.',
      data: { name: newUser.name, email: newUser.email },
    });
  },
);

// User login
export const login = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { email, password }: LoginType = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new ApiError({
        statusCode: HTTP_STATUS.UNAUTHORISED,
        message: 'Invalid email or password',
      });
    }

    // Validate user password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new ApiError({
        statusCode: HTTP_STATUS.UNAUTHORISED,
        message: 'Invalid email or password',
      });
    }

    // Generate jwt token to login user
    const payload: JWTPayloadType = {
      userId: user.user_id,
      email: user.email,
      role: user.role as 'student' | 'trainer' | 'admin'
    };

    // Assign a token to user after login
    const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
      // Token last for one hour
      expiresIn: process.env.JWT_EXPIRES_DURATION as SignOptions['expiresIn'],
    });

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Login successfully',
      data: {
        user_id: user.user_id,
        name: user.name,
        role: user.role,
        token,
      },
    });
  },
);

// Get the current user
export const getMe = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    // Get the request user id from authenticate controller
    const userId = req.user?.userId;
    const user = await User.findOne({
      where: { user_id: userId },
      attributes: ['name', 'email', 'role'],
    });
    if (!user) {
      throw new ApiError({
        statusCode: HTTP_STATUS.NOT_FOUND,
        message: 'User not found.',
      });
    }
    res.status(200).json({
      success: true,
      message: `Welcome ${user.name}`,
      data: user,
    });
  },
);
