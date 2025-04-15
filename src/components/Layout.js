// components/Layout.js
import { StaticGhibliNavigation } from './StaticGhibliNavigation'
import { GhibliFooter } from './GhibliFooter'

export function Layout({ children, locale }) {
  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <StaticGhibliNavigation locale={locale} />
      <main className="flex-1 pt-6">{children}</main>
      <GhibliFooter locale={locale} />
    </div>
  )
}
