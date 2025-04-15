// components/GhibliFooter.js
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export function GhibliFooter({ locale }) {
  // 如果在服务器组件中使用，直接传入locale
  // 如果在客户端组件中使用，则使用useTranslations
  let t;
  let isClient = false;
  
  try {
    t = useTranslations('common');
    isClient = true;
  } catch (error) {
    // 服务器组件，使用硬编码文本
    t = (key) => {
      const translations = {
        en: {
          about: 'About GhibliHub',
          aboutText: 'GhibliHub is your ultimate resource center for creating Studio Ghibli inspired AI art. Discover curated prompts, models, and tutorials to generate magical worlds and characters in the beloved Miyazaki style.',
          quickLinks: 'Quick Links',
          home: 'Home',
          resources: 'AI Resources',
          posts: 'Tutorials',
          connect: 'Connect',
          allRightsReserved: 'All rights reserved.',
          aiArtPrompts: 'AI Art Prompts',
          modelGuides: 'Model Guides',
          communityGallery: 'Community Gallery'
        },
        zh: {
          about: '关于GhibliHub',
          aboutText: 'GhibliHub是您创建吉卜力工作室风格AI艺术的终极资源中心。探索精选提示词、模型和教程，以宫崎骏标志性风格生成魔幻世界和角色。',
          quickLinks: '快速链接',
          home: '首页',
          resources: 'AI资源',
          posts: '教程指南',
          connect: '联系我们',
          allRightsReserved: '版权所有。',
          aiArtPrompts: 'AI艺术提示词',
          modelGuides: '模型指南',
          communityGallery: '社区作品'
        }
      };
      
      return translations[locale]?.[key] || translations['en'][key];
    };
  }

  return (
    <footer className="border-t border-border bg-gradient-to-t from-secondary/30 to-background pt-8">
      <div className="container mx-auto px-4 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <h3 className="text-base font-serif font-semibold tracking-wide text-primary ghibli-title">
              {isClient ? t('about') : t('about')}
            </h3>
            <p className="text-base text-muted-foreground leading-relaxed">
              {isClient ? t('aboutText') : t('aboutText')}
            </p>
            <div className="pt-4">
              <div className="flex items-center space-x-2">
                <div className="relative w-8 h-8 bg-ghibli-blue rounded-full overflow-hidden shadow-md">
                  {/* 修复绝对定位问题，将absolute改为relative并限制在父容器内 */}
                  <div className="relative w-full h-full bg-gradient-to-br from-ghibli-blue to-ghibli-green opacity-80"></div>
                  <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-white font-serif text-sm">G</div>
                </div>
                <span className="font-serif text-lg font-bold tracking-wide ghibli-title">GhibliHub</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-base font-serif font-semibold tracking-wide text-primary ghibli-title">
              {isClient ? t('quickLinks') : t('quickLinks')}
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-base text-muted-foreground hover:text-primary transition-colors duration-300 ghibli-nav-link inline-block">
                  {isClient ? t('home') : t('home')}
                </Link>
              </li>
              <li>
                <Link href="/resources" className="text-base text-muted-foreground hover:text-primary transition-colors duration-300 ghibli-nav-link inline-block">
                  {isClient ? t('resources') : t('resources')}
                </Link>
              </li>
              <li>
                <Link href="/posts" className="text-base text-muted-foreground hover:text-primary transition-colors duration-300 ghibli-nav-link inline-block">
                  {isClient ? t('posts') : t('posts')}
                </Link>
              </li>
              <li>
                <Link href="/resources/prompts" className="text-base text-muted-foreground hover:text-primary transition-colors duration-300 ghibli-nav-link inline-block">
                  {isClient ? t('aiArtPrompts') : t('aiArtPrompts')}
                </Link>
              </li>
              <li>
                <Link href="/resources/models" className="text-base text-muted-foreground hover:text-primary transition-colors duration-300 ghibli-nav-link inline-block">
                  {isClient ? t('modelGuides') : t('modelGuides')}
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-base font-serif font-semibold tracking-wide text-primary ghibli-title">
              {isClient ? t('connect') : t('connect')}
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="https://discord.gg/ghiblihub" target="_blank" className="text-base text-muted-foreground hover:text-primary transition-colors duration-300 ghibli-nav-link inline-block">
                  Discord
                </a>
              </li>
              <li>
                <a href="https://github.com/qiayue/ghiblihub" target="_blank" className="text-base text-muted-foreground hover:text-primary transition-colors duration-300 ghibli-nav-link inline-block">
                  GitHub
                </a>
              </li>
              <li>
                <a href="https://twitter.com/ghiblihub" target="_blank" className="text-base text-muted-foreground hover:text-primary transition-colors duration-300 ghibli-nav-link inline-block">
                  Twitter
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-6 border-t border-border/50">
          <p className="text-sm text-muted-foreground text-center">
            &copy; {new Date().getFullYear()} GhibliHub. {isClient ? t('allRightsReserved') : t('allRightsReserved')}
          </p>
        </div>
      </div>
    </footer>
  );
}
