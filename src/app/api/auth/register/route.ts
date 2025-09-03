// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { users, hashPassword } from '@/model/user';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
  const { name, email, password } = await req.json();

  if (!name || !email || !password) return NextResponse.json({ message: 'Missing fields' }, { status: 400 });

  if (users.find(u => u.email === email)) return NextResponse.json({ message: 'User exists' }, { status: 400 });

  const newUser = { id: uuidv4(), name, email, password: hashPassword(password) };
  users.push(newUser);
  console.log("new users: ", users)

  return NextResponse.json({ message: 'User registered', user: { id: newUser.id, name, email } }, { status: 201 });
}
