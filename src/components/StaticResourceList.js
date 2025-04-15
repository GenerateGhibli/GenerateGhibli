// components/StaticResourceList.js
import Link from 'next/link'
import { ExternalLink } from 'lucide-react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"

export function StaticResourceList({ resources, showMoreLink = true, locale }) {
  return (
    <section className="ai-tools-section">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-serif font-semibold tracking-wide ghibli-title">
          {locale === 'zh' ? '吉卜力风格AI生成工具' : 'Ghibli Style AI Generation Tools'}
        </h2>
        {showMoreLink && (
          <Link href={`/${locale}/resources`} className="text-primary hover:text-primary/80 transition-colors duration-300 ghibli-nav-link">
            {locale === 'zh' ? '更多AI工具 →' : 'More AI Tools →'}
          </Link>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {resources.map((resource, index) => (
          <Card key={index} className="overflow-hidden group hover:translate-y-[-5px] transition-all duration-300">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-ghibli-blue via-ghibli-green to-accent"></div>
            <CardHeader>
              <a 
                href={resource.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 transition-colors duration-300 inline-flex items-center gap-2 group-hover:translate-x-1 transition-transform"
                aria-label={`访问${resource.name} - ${resource.description}`}
              >
                {resource.icon && (
                  <div className="w-6 h-6 relative">
                    <div className="w-6 h-6 bg-primary/10 rounded-full"></div>
                  </div>
                )}
                <CardTitle className="text-xl font-serif">{resource.name}</CardTitle>
                <ExternalLink size={16} className="opacity-70 group-hover:opacity-100" />
              </a>
              <CardDescription className="mt-2 text-muted-foreground">{resource.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  )
}
