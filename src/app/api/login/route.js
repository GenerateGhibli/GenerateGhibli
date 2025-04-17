import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';

/* eslint-disable no-undef */
export const runtime = 'nodejs'; // 指定为Node.js运行时以便使用环境变量
export const dynamic = 'force-dynamic'; // 强制动态渲染此路由

// 使用环境变量
const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
const jwtSecret = process.env.JWT_SECRET || 'default_jwt_secret_for_development';
/* eslint-enable no-undef */

export async function POST(request) {
  try {
    const { password } = await request.json();
    
    // 从URL中提取语言代码
    const url = new URL(request.url);
    const locale = url.pathname.split('/')[1] || 'en'; // 如果未能提取，默认为'en'
    
    // 验证密码
    if (password !== adminPassword) {
      return NextResponse.json(
        { message: 'Login failed', success: false },
        { status: 401 }
      );
    }

    // 创建 JWT token
    const secret = new TextEncoder().encode(jwtSecret);
    const token = await new SignJWT({ isAdmin: true })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('1d')
      .sign(secret);

    // 创建响应并设置cookie
    const response = NextResponse.json({
      success: true, 
      message: 'Login successful',
      redirectTo: `/${locale}/admin`
    });
    
    response.cookies.set({
      name: 'auth-token',
      value: token,
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24, // 1 day
      sameSite: 'strict',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Server error', success: false },
      { status: 500 }
    );
  }
}
