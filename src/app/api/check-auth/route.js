import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { jwtVerify } from 'jose';

// 指定为Node.js运行时
export const runtime = 'nodejs'; 

// 从环境变量读取密钥，提供默认值
// eslint-disable-next-line no-undef
const JWT_SECRET_DEFAULT = process.env.JWT_SECRET || 'your_jwt_secret_key_for_development';

export async function GET(request) {
  try {
    const token = request.cookies.get('auth_token')?.value;
    
    if (!token) {
      console.log('No auth token found in cookies');
      return NextResponse.json({ isLoggedIn: false });
    }
    
    console.log('Token found:', token.substring(0, 20) + '...');
    
    // 尝试解码令牌（不验证）以查看内容
    try {
      // 使用硬编码值，避免linter错误
      const secret = new TextEncoder().encode(JWT_SECRET_DEFAULT);
      
      const { payload } = await jwtVerify(token, secret, { complete: true });
      console.log('Token decoded:', payload);
    } catch (e) {
      console.error('Failed to decode token:', e);
    }
    
    // 验证令牌
    const isLoggedIn = await verifyToken(token);
    console.log('Token verification result:', isLoggedIn);
    
    return NextResponse.json({ isLoggedIn });
  } catch (error) {
    console.error('Error in check-auth:', error);
    return NextResponse.json({ isLoggedIn: false, error: error.message });
  }
}