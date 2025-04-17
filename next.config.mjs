import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.js');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 添加其他必要的配置
  output: 'standalone',
};

export default withNextIntl(nextConfig);
