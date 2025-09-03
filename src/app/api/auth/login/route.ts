import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'access-secret';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'refresh-secret';

// In-memory user store for demo
const users = [
  {
    id: '1',
    email: 'test@example.com',
    password: bcrypt.hashSync('password123', 10), // hashed password
    mfaEnabled: true,
    mfaSecret: '', // you can set up a speakeasy secret later
  },
];

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    console.log("recieved inputs: ", email, password)

    const user = users.find((u) => u.email === email);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    // Create JWT access token
    const accessToken = jwt.sign({ userId: user.id, email: user.email }, ACCESS_TOKEN_SECRET, {
      expiresIn: '15m',
    });

    // Create JWT refresh token
    const refreshToken = jwt.sign({ userId: user.id }, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

    // Store refresh token in HTTP-only cookie
    const response = NextResponse.json({ accessToken, userId: user.id });
    response.cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      path: '/',
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    });

    console.log("storing reshresh token response: ", response)


    return response;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
