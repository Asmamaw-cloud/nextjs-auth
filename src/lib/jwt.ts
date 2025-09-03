import jwt from 'jsonwebtoken';

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET || 'access-secret';
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET || 'refresh-secret';

export const signAccessToken = (userId: string) => jwt.sign({ userId }, ACCESS_SECRET, { expiresIn: '15m' });
export const signRefreshToken = (userId: string) => jwt.sign({ userId }, REFRESH_SECRET, { expiresIn: '7d' });

export const verifyAccessToken = (token: string) => jwt.verify(token, ACCESS_SECRET);
export const verifyRefreshToken = (token: string) => jwt.verify(token, REFRESH_SECRET);
