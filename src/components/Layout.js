// components/Layout.js
import { StaticNavigation } from './StaticNavigation'
import { GhibliFooter } from './GhibliFooter'

export function Layout({ children, locale }) {
  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <StaticNavigation locale={locale} />
      <main className="flex-1 pt-6">{children}</main>
      <GhibliFooter locale={locale} />
    </div>
  )
}