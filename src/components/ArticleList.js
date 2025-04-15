// components/ArticleList.js
import Link from 'next/link'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from "@/components/ui/card"

export default function ArticleList({ articles, showMoreLink = true }) {
  return (
    <section>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-serif font-semibold tracking-wide ghibli-title">Articles</h2>
        {showMoreLink && (
          <Link href="/posts" className="text-primary hover:text-primary/80 transition-colors duration-300 ghibli-nav-link">
            More articles →
          </Link>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {articles.map(({ id, title, description, date }) => (
          <Card key={id} className="overflow-hidden group hover:translate-y-[-5px] transition-all duration-300">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent via-ghibli-blue to-ghibli-green"></div>
            <CardHeader className="pb-4">
              <Link 
                href={`/posts/${id}`}
                className="group-hover:text-primary transition-colors duration-300"
              >
                <CardTitle className="text-2xl font-serif tracking-wide ghibli-title group-hover:translate-x-1 transition-transform duration-300">
                  {title}
                </CardTitle>
              </Link>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base text-muted-foreground line-clamp-3">
                {description}
              </CardDescription>
            </CardContent>
            <CardFooter className="pt-4 border-t border-border/30">
              <div className="flex justify-between items-center w-full">
                <span className="text-sm text-muted-foreground">
                  {date ? new Date(date).toLocaleDateString() : ''}
                </span>
                <Link 
                  href={`/posts/${id}`}
                  className="text-primary hover:text-primary/80 transition-colors duration-300 text-sm flex items-center gap-1 group-hover:translate-x-1 transition-transform duration-300"
                >
                  Read more →
                </Link>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  )
}