import { NextResponse } from 'next/server';
import { verifyRefreshToken, signAccessToken, signRefreshToken } from '@/lib/jwt';
import { setTokenCookie } from '@/lib/cookies';

export async function POST(req: Request) {
  const cookie = req.headers.get('cookie');
  if (!cookie) return NextResponse.json({ error: 'No cookie' }, { status: 401 });

  const refreshToken = cookie.split('refreshToken=')[1]?.split(';')[0];
  console.log("refresh token: ", refreshToken)
  if (!refreshToken) return NextResponse.json({ error: 'No refresh token' }, { status: 401 });

  try {
    const payload: any = verifyRefreshToken(refreshToken);
    const accessToken = signAccessToken(payload.userId);
    const newRefreshToken = signRefreshToken(payload.userId);

    const res = NextResponse.json({ accessToken });
    res.headers.set('Set-Cookie', setTokenCookie('refreshToken', newRefreshToken, 7 * 24 * 60 * 60));
    return res;
  } catch {
    return NextResponse.json({ error: 'Invalid refresh token' }, { status: 401 });
  }
}
