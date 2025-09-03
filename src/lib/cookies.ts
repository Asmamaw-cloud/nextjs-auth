import { serialize } from 'cookie';

export const setTokenCookie = (name: string, token: string, maxAge: number) => {
  return serialize(name, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge,
  });
};
