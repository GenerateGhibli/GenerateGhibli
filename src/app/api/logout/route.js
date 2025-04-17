import { NextResponse } from 'next/server';

export const runtime = 'nodejs'; // 指定为Node.js运行时
export const dynamic = 'force-dynamic'; // 强制动态渲染此路由

export async function POST() {
  const response = NextResponse.json({ message: 'Logged out successfully' }, { status: 200 });

  /* eslint-disable no-undef */
  response.cookies.set({
    name: 'auth_token',
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0,
    path: '/',
  });
  /* eslint-enable no-undef */

  return response;
}