// components/GhibliFooter.tsx
import React from 'react';
import Link from 'next/link';
import { getNamespaceTranslations, TranslationNamespace } from '@/lib/translations';

interface GhibliFooterProps {
  locale: string;
}

export function GhibliFooter({ locale }: GhibliFooterProps) {
  // 获取翻译
  const commonText = getNamespaceTranslations(locale, 'common' as TranslationNamespace) as Record<string, string>;

  return (
    <footer className="border-t border-border bg-gradient-to-t from-secondary/30 to-background pt-8">
      <div className="container mx-auto px-4 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <h3 className="text-base font-serif font-semibold tracking-wide text-primary ghibli-title">
              {commonText.about}
            </h3>
            <p className="text-base text-muted-foreground leading-relaxed">
              {commonText.aboutText}
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
              {commonText.quickLinks}
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href={`/${locale}`} className="text-base text-muted-foreground hover:text-primary transition-colors duration-300 ghibli-nav-link inline-block">
                  {commonText.home}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/resources`} className="text-base text-muted-foreground hover:text-primary transition-colors duration-300 ghibli-nav-link inline-block">
                  {commonText.resources}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/posts`} className="text-base text-muted-foreground hover:text-primary transition-colors duration-300 ghibli-nav-link inline-block">
                  {commonText.tutorials}
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-base font-serif font-semibold tracking-wide text-primary ghibli-title">
              {commonText.connect}
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
            &copy; {new Date().getFullYear()} GenerateGhibli. {commonText.allRightsReserved}
          </p>
        </div>
      </div>
    </footer>
  );
}
