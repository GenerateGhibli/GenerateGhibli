import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';

export const runtime = 'nodejs'; // 指定为Node.js运行时以便使用环境变量

export async function POST(request) {
  try {
    const { password } = await request.json();
    console.log('Received login request with password:', password);
    
    // 从环境变量获取密码，如果不存在则使用默认值
    const accessPassword = process.env.ACCESS_PASSWORD || 'admin123';
    console.log('Expected password:', accessPassword);
    
    if (password === accessPassword) {
      console.log('Password matched, creating token');
      
      const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_for_development';
      console.log('Using JWT_SECRET:', JWT_SECRET ? 'Secret exists' : 'No secret found');
      
      // 使用jose库创建JWT
      const secret = new TextEncoder().encode(JWT_SECRET);
      
      // 从请求获取当前域名，或者使用默认值
      const host = request.headers.get('host') || 'localhost';
      const domain = host.split(':')[0]; // 移除端口号
      
      const token = await new SignJWT({ 
        authenticated: true,
        domain: domain
      })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('1d')
        .sign(secret);
      
      console.log('Token created:', token.substring(0, 20) + '...');
      
      // 创建响应
      const response = NextResponse.json({ 
        success: true, 
        message: 'Login successful',
        redirectTo: '/zh/admin'
      });
      
      // 设置cookie
      response.cookies.set({
        name: 'auth_token',
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax', // 改为lax以允许跨站点导航
        maxAge: 60 * 60 * 24, // 1天
        path: '/',
      });
      
      console.log('Cookie set, returning response');
      return response;
    } else {
      console.log('Password mismatch');
      return NextResponse.json(
        { success: false, message: '密码错误' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: '服务器错误' },
      { status: 500 }
    );
  }
}
