import { SignJWT, jwtVerify } from 'jose';

// 在Edge Runtime中使用的默认值
// 注意：这些值应该被服务器端API路由中的环境变量覆盖
// Edge Runtime可能无法直接访问process.env
const JWT_SECRET = 'your_jwt_secret_key_for_development'; 
const DOMAIN = 'localhost';
const IS_DEV = true;

export async function verifyToken(token) {
  try {
    console.log('Verifying token with secret:', JWT_SECRET ? 'Secret exists' : 'No secret found');
    console.log('Expected domain:', DOMAIN);
    
    // 创建密钥
    const secret = new TextEncoder().encode(JWT_SECRET);
    
    // 验证令牌
    const { payload } = await jwtVerify(token, secret);
    console.log('Token verified, decoded content:', payload);
    
    // 检查令牌中的属性
    // 注意：login route.js 使用 authorized 属性，而 auth.js 使用 authenticated 属性
    const isAuthorized = payload.authorized || payload.authenticated;
    
    // 检查我们是否在开发环境中
    if (IS_DEV) {
      // 在开发环境中，我们接受 'localhost' 或 '127.0.0.1'
      const domainValid = payload.domain === 'localhost' || payload.domain === '127.0.0.1';
      console.log('Development environment, domain valid:', domainValid);
      return isAuthorized && domainValid;
    } else {
      // 在生产环境中，严格检查域名
      const domainValid = payload.domain === DOMAIN;
      console.log('Production environment, domain valid:', domainValid);
      return isAuthorized && domainValid;
    }
  } catch (error) {
    console.error('Token verification failed:', error);
    return false;
  }
}

export async function createToken() {
  // 创建密钥
  const secret = new TextEncoder().encode(JWT_SECRET);
  
  // 创建JWT
  return new SignJWT({ authenticated: true, domain: DOMAIN })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1h')
    .sign(secret);
}