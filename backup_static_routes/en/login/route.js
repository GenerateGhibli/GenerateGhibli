import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { SignJWT } from 'jose';

export async function GET() {
  return new NextResponse(
    `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Login | GenerateGhibli</title>
      <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
      <style>
        .ghibli-button {
          background: linear-gradient(135deg, #4ade80 0%, #3b82f6 100%);
          color: white;
          border-radius: 0.75rem;
          padding: 0.75rem 1.5rem;
          font-weight: 600;
          transition: all 0.3s ease;
          box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.2), 0 2px 4px -1px rgba(59, 130, 246, 0.1);
        }
        .ghibli-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.3), 0 4px 6px -2px rgba(59, 130, 246, 0.1);
        }
      </style>
    </head>
    <body class="bg-gray-50">
      <div class="container mx-auto py-16 flex justify-center">
        <div class="w-full max-w-md">
          <div class="bg-white rounded-3xl border border-gray-200 shadow-lg p-8">
            <h1 class="text-3xl font-bold text-center mb-8">Login</h1>
            
            <form id="loginForm" class="space-y-6">
              <div>
                <label for="password" class="block text-base font-medium mb-2">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  class="w-full px-4 py-3 border border-gray-300 bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300"
                  required
                />
              </div>
              
              <button
                type="submit"
                class="w-full ghibli-button text-base py-3"
              >
                Login
              </button>
            </form>
            <div id="error" class="mt-4 text-red-500 text-center hidden"></div>
          </div>
        </div>
      </div>
      
      <script>
        document.getElementById('loginForm').addEventListener('submit', async (e) => {
          e.preventDefault();
          const password = document.getElementById('password').value;
          const errorDiv = document.getElementById('error');
          
          try {
            console.log('Submitting login form with password:', password);
            const response = await fetch('/api/login', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ password }),
            });
            
            console.log('Login response status:', response.status);
            const data = await response.json();
            console.log('Login response data:', data);
            
            if (response.ok) {
              console.log('Login successful, redirecting to admin page');
              // Add delay to ensure cookie is set
              setTimeout(() => {
                window.location.href = '/en/admin';
              }, 500);
            } else {
              errorDiv.textContent = data.message || 'Login failed, please try again';
              errorDiv.classList.remove('hidden');
            }
          } catch (error) {
            console.error('Login error:', error);
            errorDiv.textContent = 'An error occurred, please try again';
            errorDiv.classList.remove('hidden');
          }
        });
      </script>
    </body>
    </html>
    `,
    {
      headers: {
        'Content-Type': 'text/html',
      },
    }
  );
}

export async function POST(request) {
  try {
    const { password } = await request.json();
    const accessPassword = process.env.ACCESS_PASSWORD || 'admin123';
    
    if (password === accessPassword) {
      // 创建密钥
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key');
      
      // 使用jose库创建JWT
      const token = await new SignJWT({ authorized: true })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('1d')
        .sign(secret);
      
      cookies().set('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24, // 1 day
        path: '/',
      });
      
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { success: false, message: 'Incorrect password' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}
