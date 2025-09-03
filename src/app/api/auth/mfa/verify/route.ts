import { NextResponse } from 'next/server';
import speakeasy from 'speakeasy';
import { findUserById } from '@/lib/users';

export async function POST(req: Request) {
  const { userId, token } = await req.json();
  const user = findUserById(userId);
  if (!user || !user.totpSecret) return NextResponse.json({ error: 'MFA not setup' }, { status: 400 });

  const verified = speakeasy.totp.verify({
    secret: user.totpSecret,
    encoding: 'base32',
    token,
    window: 1,
  });

  return NextResponse.json({ verified });
}
