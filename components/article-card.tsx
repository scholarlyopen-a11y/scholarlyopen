"use client"

import Link from "next/link"
import { Calendar, ExternalLink, FileText, Users } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/language-context"

export interface Article {
  id: string
  title: string
  authors: string[]
  abstract: string
  keywords: string[]
  doi: string
  publishedDate: string
  articleType: "research" | "review" | "methodology"
  pdfUrl?: string
}

interface ArticleCardProps {
  article: Article
  journalSlug: string
}

export function ArticleCard({ article, journalSlug }: ArticleCardProps) {
  const { t } = useLanguage()
  
  const articleTypeLabels = {
    research: "Research Article",
    review: "Review Article",
    methodology: "Methodology Paper",
  }

  return (
    <Card className="border-border hover:border-primary/30 transition-colors">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <Badge variant="outline" className="shrink-0">
            {articleTypeLabels[article.articleType]}
          </Badge>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            {article.publishedDate}
          </div>
        </div>
        <CardTitle className="text-lg leading-tight mt-2 hover:text-primary transition-colors">
          <Link href={`/journals/${journalSlug}/articles/${article.id}`}>
            {article.title}
          </Link>
        </CardTitle>
        <CardDescription className="flex items-center gap-1.5">
          <Users className="h-3.5 w-3.5" />
          {article.authors.join(", ")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
          {article.abstract}
        </p>
        
        <div className="flex flex-wrap gap-1.5 mb-4">
          {article.keywords.slice(0, 4).map((keyword) => (
            <Badge key={keyword} variant="secondary" className="text-xs">
              {keyword}
            </Badge>
          ))}
        </div>
        
        <div className="flex items-center justify-between pt-3 border-t border-border">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <span className="font-medium">DOI:</span>
            <a 
              href={`https://doi.org/${article.doi}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              {article.doi}
            </a>
          </div>
          <div className="flex gap-2">
            {article.pdfUrl && (
              <Button variant="ghost" size="sm" asChild>
                <a href={article.pdfUrl} target="_blank" rel="noopener noreferrer">
                  <FileText className="h-4 w-4 mr-1" />
                  PDF
                </a>
              </Button>
            )}
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/journals/${journalSlug}/articles/${article.id}`}>
                {t("articles.readMore")}
                <ExternalLink className="h-3.5 w-3.5 ml-1" />
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function ArticleList({ articles, journalSlug }: { articles: Article[]; journalSlug: string }) {
  const { t } = useLanguage()
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">{t("articles.latest")}</h2>
        <Button variant="outline" size="sm" asChild>
          <Link href={`/journals/${journalSlug}/articles`}>
            {t("articles.viewAll")}
            <ExternalLink className="h-3.5 w-3.5 ml-1" />
          </Link>
        </Button>
      </div>
      <div className="grid gap-6">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} journalSlug={journalSlug} />
        ))}
      </div>
    </div>
  )
}
