import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.js');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 添加其他必要的配置
  output: 'standalone',
  
  // Cloudflare Pages 配置
  experimental: {
    serverComponentsExternalPackages: ['sharp'],
  },
  
  // 针对Cloudflare环境的文件系统限制进行优化
  webpack: (config, { isServer }) => {
    if (isServer) {
      // 在服务端构建时，对fs模块进行处理
      if (!config.resolve) config.resolve = {};
      if (!config.resolve.fallback) config.resolve.fallback = {};
      
      // 禁用文件系统模块
      config.resolve.fallback.fs = false;
      config.resolve.fallback.path = false;
    }
    
    // 添加对.md文件的支持
    config.module.rules.push({
      test: /\.md$/,
      oneOf: [
        {
          resourceQuery: /raw/,
          type: 'asset/source',
        },
        {
          // 默认处理md文件的规则
          use: 'raw-loader',
        },
      ],
    });
    
    return config;
  },
};

export default withNextIntl(nextConfig);
