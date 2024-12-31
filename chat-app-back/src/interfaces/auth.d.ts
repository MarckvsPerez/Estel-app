import { type JwtPayload } from 'jsonwebtoken';
import { type Request } from 'express';

export interface UserPayload {
	_id: string;
	email: Email;
	password: string;
}

export interface Tokens {
	accessToken: string;
	refreshToken: string;
}

interface AuthRequest extends Request {
	user?: JwtPayload;
}

interface AccessTokenPayload extends JwtPayload {
	token_type: 'access' | 'refresh';
	_id: string;
	email: string;
	iat: number;
	exp: number;
}