import { SignJWT, jwtVerify } from 'jose';

// 使用与login API相同的默认密钥
/* eslint-disable no-undef */
const JWT_SECRET = process.env.JWT_SECRET || 'default_jwt_secret_for_development';
/* eslint-enable no-undef */

export async function verifyToken(token) {
  try {
    console.log('Verifying token with secret:', JWT_SECRET ? 'Secret exists' : 'No secret found');
    
    // 创建密钥
    const secret = new TextEncoder().encode(JWT_SECRET);
    
    // 验证令牌
    const { payload } = await jwtVerify(token, secret);
    console.log('Token verified, decoded content:', payload);
    
    // 添加对isAdmin字段的支持，这是login API使用的字段
    const isAuthorized = payload.isAdmin || payload.authorized || payload.authenticated;
    
    // 简化验证逻辑
    console.log('Authorization status:', isAuthorized);
    return isAuthorized;
  } catch (error) {
    console.error('Token verification failed:', error);
    return false;
  }
}

export async function createToken() {
  // 创建密钥
  const secret = new TextEncoder().encode(JWT_SECRET);
  
  // 创建与login API一致的令牌
  return new SignJWT({ isAdmin: true })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1d')
    .sign(secret);
}