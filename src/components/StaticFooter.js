// components/StaticFooter.js
import Link from 'next/link';

export function StaticFooter({ locale }) {
  // 根据当前语言选择页脚文本
  const getFooterText = () => {
    if (locale === 'zh') {
      return {
        about: '关于',
        aboutText: 'GitBase是一个无需传统数据库的开源动态网站解决方案，使用Next.js构建并由GitHub提供支持。',
        quickLinks: '快速链接',
        home: '首页',
        resources: '资源',
        articles: '文章',
        connect: '联系',
        rights: '版权所有'
      }
    }
    return {
      about: 'About',
      aboutText: 'GitBase is an open-source dynamic website solution without a traditional database, built with Next.js and powered by GitHub.',
      quickLinks: 'Quick Links',
      home: 'Home',
      resources: 'Resources',
      articles: 'Articles',
      connect: 'Connect',
      rights: 'All rights reserved'
    }
  }
  
  const text = getFooterText()

  return (
    <footer className="bg-gray-100 border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-sm font-semibold text-gray-600 tracking-wider uppercase">{text.about}</h3>
            <p className="mt-4 text-base text-gray-500">
              {text.aboutText}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-600 tracking-wider uppercase">{text.quickLinks}</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link href={`/${locale}`} className="text-base text-gray-500 hover:text-gray-900">
                  {text.home}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/resources`} className="text-base text-gray-500 hover:text-gray-900">
                  {text.resources}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/posts`} className="text-base text-gray-500 hover:text-gray-900">
                  {text.articles}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-600 tracking-wider uppercase">{text.connect}</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <a href="https://gitbase.app/" target="_blank" className="text-base text-gray-500 hover:text-gray-900">
                  GitBase
                </a>
              </li>
              <li>
                <a href="https://github.com/qiayue/gitbase" target="_blank" className="text-base text-gray-500 hover:text-gray-900">
                  GitHub
                </a>
              </li>
              <li>
                <a href="https://twitter.com/gefei55" target="_blank" className="text-base text-gray-500 hover:text-gray-900">
                  Twitter
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-8">
          <p className="text-base text-gray-400 text-center">
            &copy; {new Date().getFullYear()} GitBase. {text.rights}.
          </p>
        </div>
      </div>
    </footer>
  );
}
