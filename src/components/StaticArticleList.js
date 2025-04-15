// components/StaticArticleList.js
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function StaticArticleList({ articles, locale }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(locale === 'zh' ? 'zh-CN' : 'en-US', options);
  };
  
  return (
    <section>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-serif font-semibold tracking-wide ghibli-title">
          {locale === 'zh' ? '吉卜力灵感' : 'Ghibli Inspiration'}
        </h2>
        <Link href={`/${locale}/posts`} className="text-primary hover:text-primary/80 transition-colors duration-300 ghibli-nav-link">
          {locale === 'zh' ? '更多灵感 →' : 'More Inspiration →'}
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <Card key={article.id} className="overflow-hidden group hover:shadow-lg transition-all duration-300 flex flex-col">
            <div className="relative h-48 w-full overflow-hidden">
              {article.coverImage ? (
                <div 
                  className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  style={{ backgroundImage: `url(${article.coverImage})` }}
                  role="img"
                  aria-label={article.title}
                ></div>
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-ghibli-blue/30 to-ghibli-green/30 flex items-center justify-center">
                  <span className="text-4xl font-serif text-primary/50">吉卜力</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            
            <CardHeader>
              <CardTitle className="text-xl font-serif line-clamp-2 group-hover:text-primary transition-colors duration-300">
                {article.title}
              </CardTitle>
              <CardDescription className="text-sm">
                {formatDate(article.date)}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="flex-grow">
              <p className="text-muted-foreground line-clamp-3">{article.excerpt || article.description}</p>
            </CardContent>
            
            <CardFooter>
              <Link href={`/${locale}/posts/${article.id}`} className="w-full">
                <Button variant="outline" className="w-full ghibli-button bg-transparent border-primary text-primary hover:bg-primary/10">
                  {locale === 'zh' ? '查看灵感' : 'View Inspiration'}
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  )
}
