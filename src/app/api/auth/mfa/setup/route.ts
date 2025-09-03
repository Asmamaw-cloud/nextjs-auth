import { NextResponse } from 'next/server';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import { findUserById } from '@/lib/users';

export async function POST(req: Request) {
  const { userId } = await req.json();
  const user = findUserById(userId);
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  const secret = speakeasy.generateSecret({ length: 20 });
  const qrCodeDataURL = await QRCode.toDataURL(secret.otpauth_url!);

  user.totpSecret = secret.base32;
  return NextResponse.json({ qrCodeDataURL });
}
