import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

export async function GET() {
  // 检查认证
  const token = cookies().get('auth_token')?.value;
  const isLoggedIn = token && verifyToken(token);

  if (!isLoggedIn) {
    // 如果未登录，重定向到登录页面
    return NextResponse.redirect(new URL('/zh/login', 'http://localhost:3000'));
  }

  return new NextResponse(
    `
    <!DOCTYPE html>
    <html lang="zh">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>管理面板 | GenerateGhibli</title>
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
        .admin-card {
          border-radius: 1rem;
          background-color: white;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
        }
        .admin-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }
      </style>
    </head>
    <body class="bg-gray-50">
      <header class="bg-white shadow-sm">
        <div class="container mx-auto px-4 py-6 flex justify-between items-center">
          <h1 class="text-2xl font-bold text-gray-800">GenerateGhibli 管理面板</h1>
          <button id="logoutBtn" class="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors">
            退出登录
          </button>
        </div>
      </header>
      
      <main class="container mx-auto px-4 py-12">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <a href="/zh/admin/create-post" class="block">
            <div class="admin-card p-8 border border-gray-200">
              <h2 class="text-xl font-bold mb-4">创建文章</h2>
              <p class="text-gray-600 mb-6">撰写新的吉卜力风格AI艺术指南和教程</p>
              <div class="ghibli-button inline-block">开始创建</div>
            </div>
          </a>
          
          <a href="/zh/admin/resources" class="block">
            <div class="admin-card p-8 border border-gray-200">
              <h2 class="text-xl font-bold mb-4">管理资源</h2>
              <p class="text-gray-600 mb-6">添加、编辑或删除吉卜力风格AI工具和模型</p>
              <div class="ghibli-button inline-block">管理资源</div>
            </div>
          </a>
        </div>
      </main>
      
      <script>
        document.getElementById('logoutBtn').addEventListener('click', async () => {
          try {
            await fetch('/api/logout', { method: 'POST' });
            window.location.href = '/zh/login';
          } catch (error) {
            console.error('Logout error:', error);
            alert('退出登录失败，请重试');
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
