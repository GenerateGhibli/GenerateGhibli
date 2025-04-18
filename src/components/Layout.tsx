// components/Layout.tsx
import React from 'react';
import { StaticGhibliNavigation } from './StaticGhibliNavigation'
import { GhibliFooter } from './GhibliFooter'

interface LayoutProps {
  children: React.ReactNode;
  locale: string;
}

export function Layout({ children, locale }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <StaticGhibliNavigation locale={locale} />
      <main className="flex-1 pt-6">{children}</main>
      <GhibliFooter locale={locale} />
    </div>
  )
}
