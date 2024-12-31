import { Request } from 'express';

export interface AuthRequest extends Request {
    user?: {
        _id: string;
        fullName: string;
        email: string;
        profilePicture: string;
        createdAt: Date;
        updatedAt: Date;
    };
}