// components/GhibliFooter.js
import Link from 'next/link';

export function GhibliFooter({ locale }) {
  // 服务器组件，使用硬编码文本
  const t = (key) => {
    const translations = {
      en: {
        about: 'About GenerateGhibli',
        aboutText: 'GenerateGhibli is your ultimate resource center for creating Studio Ghibli inspired AI art. Discover curated tools, models, and inspiration to generate magical worlds and characters in the beloved Miyazaki style.',
        quickLinks: 'Quick Links',
        home: 'Home',
        resources: 'AI Tools',
        posts: 'Inspiration',
        connect: 'Connect',
        allRightsReserved: 'All rights reserved.',
        aiTools: 'AI Generation Tools',
        modelGuides: 'AI Models',
        inspirationGallery: 'Inspiration Gallery'
      },
      zh: {
        about: '关于GenerateGhibli',
        aboutText: 'GenerateGhibli是您创建吉卜力工作室风格AI艺术的终极资源中心。探索精选AI工具、模型和灵感，以宫崎骏标志性风格生成魔幻世界和角色。',
        quickLinks: '快速链接',
        home: '首页',
        resources: 'AI工具',
        posts: '创作灵感',
        connect: '联系我们',
        allRightsReserved: '版权所有。',
        aiTools: 'AI生成工具',
        modelGuides: 'AI模型',
        inspirationGallery: '灵感画廊'
      }
    };
    
    return translations[locale]?.[key] || translations['en'][key];
  };

  return (
    <footer className="border-t border-border bg-gradient-to-t from-secondary/30 to-background pt-8">
      <div className="container mx-auto px-4 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <h3 className="text-base font-serif font-semibold tracking-wide text-primary ghibli-title">
              {t('about')}
            </h3>
            <p className="text-base text-muted-foreground leading-relaxed">
              {t('aboutText')}
            </p>
            <div className="pt-4">
              <div className="flex items-center space-x-2">
                <div className="relative w-8 h-8 bg-ghibli-blue rounded-full overflow-hidden shadow-md">
                  <div className="relative w-full h-full bg-gradient-to-br from-ghibli-blue to-ghibli-green opacity-80"></div>
                  <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-white font-serif text-sm">G</div>
                </div>
                <span className="font-serif text-lg font-bold tracking-wide ghibli-title">GenerateGhibli</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-base font-serif font-semibold tracking-wide text-primary ghibli-title">
              {t('quickLinks')}
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href={`/${locale}`} className="text-base text-muted-foreground hover:text-primary transition-colors duration-300 ghibli-nav-link inline-block">
                  {t('home')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/resources`} className="text-base text-muted-foreground hover:text-primary transition-colors duration-300 ghibli-nav-link inline-block">
                  {t('resources')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/posts`} className="text-base text-muted-foreground hover:text-primary transition-colors duration-300 ghibli-nav-link inline-block">
                  {t('posts')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/resources/tools`} className="text-base text-muted-foreground hover:text-primary transition-colors duration-300 ghibli-nav-link inline-block">
                  {t('aiTools')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/resources/models`} className="text-base text-muted-foreground hover:text-primary transition-colors duration-300 ghibli-nav-link inline-block">
                  {t('modelGuides')}
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-base font-serif font-semibold tracking-wide text-primary ghibli-title">
              {t('connect')}
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="https://github.com/GenerateGhibli/GenerateGhibli" target="_blank" rel="noopener noreferrer" className="text-base text-muted-foreground hover:text-primary transition-colors duration-300 ghibli-nav-link inline-block">
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-6 border-t border-border/50">
          <p className="text-sm text-muted-foreground text-center">
            &copy; {new Date().getFullYear()} GenerateGhibli. {t('allRightsReserved')}
          </p>
        </div>
      </div>
    </footer>
  );
}
