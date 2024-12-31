import jwt, { type JwtPayload } from 'jsonwebtoken';
import { type Response } from 'express';

import { type AccessTokenPayload, type UserPayload } from '@/interfaces/auth';
import { EnvironmentConfig } from '@/class/EnviromentConfig';

const env = new EnvironmentConfig();


export function createAccesToken(user: UserPayload, res: Response): string {
	if (env.jwtSecretKey !== undefined) {
		const expToken = new Date();
		expToken.setHours(expToken.getHours() + Number(env.jwtAccesHour));

		const payload: AccessTokenPayload = {
			token_type: 'access',
			_id: user._id,
			email: user.email,
			iat: Date.now(),
			exp: expToken.getTime(),
		};
		const token = jwt.sign(payload, env.jwtSecretKey);

		res.cookie('accessToken', token, {
			maxAge: Number(env.jwtAccesHour) * 60 * 60 * 1000,
			httpOnly: true,
			sameSite: 'strict',
			secure: env.nodeEnv === 'production',
		});
		
        return token;

	} else {
		throw new Error('No JWT key available');
	}
}

export function decodeToken(token: string): string | JwtPayload {
	try {
		if (env.jwtSecretKey !== undefined) {
			return jwt.verify(token, env.jwtSecretKey);
		} else {
			throw new Error('No JWT key available');
		}
	} catch (error: unknown) {
		if (error instanceof Error) {
			throw new Error('Error decoding token: ' + error.message);
		} else {
			throw new Error('Unknown error decoding token');
		}
	}
}