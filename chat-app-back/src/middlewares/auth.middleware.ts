import { User } from "@/models/user.model";
import { decodeToken } from "@/utils/jwt";
import { log } from "@/utils/logs";
import { NextFunction, Response } from "express";
import { AuthRequest } from "@/interfaces/express";

export const protectRoute = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void | Response> => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = decodeToken(token);
   
    if (typeof decoded === 'string') {
      throw new Error('Invalid token');
    }

    const user = await User.findById(decoded._id).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    req.user = {
      _id: user._id.toString(),
      fullName: user.fullName,
      email: user.email,
      profilePicture: user.profilePicture,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    next();
  } catch (error) {
    log("❌ Error protecting route", 'error', __dirname);
    return res.status(401).json({ message: 'Unauthorized' });
  }
};