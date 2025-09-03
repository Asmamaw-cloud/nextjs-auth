import { NextResponse } from 'next/server';
import { findUserById } from '@/lib/users';

export async function POST(req: Request) {
  const { userId } = await req.json();
  const user = findUserById(userId);
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  return NextResponse.json({ mfaEnabled: !!user.totpSecret });
}
