"use client"

import Link from "next/link"
import { Calendar, ExternalLink, FileText, Users } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/language-context"
import { slugify } from "@/lib/utils"

import { isSampleArticle } from "@/lib/data/articles"

export interface Article {
  id: string
  title: string
  authors: string[]
  abstract: string
  keywords: string[]
  doi: string
  publishedDate: string
  articleType: "research" | "review" | "methodology" | "editorial"
  section?: string
  pdfUrl?: string
  isOpenAccess?: boolean
}

export { isSampleArticle }

interface ArticleCardProps {
  article: Article
  journalSlug: string
}

export function ArticleCard({ article, journalSlug }: ArticleCardProps) {
  const { t } = useLanguage()
  const isSample = isSampleArticle(article)
  
  const articleTypeLabels: Record<string, string> = {
    research: "Research Article",
    review: "Review Article",
    methodology: "Methodology Paper",
    editorial: "Editorial",
  }

  return (
    <Card className="border-border hover:border-primary/30 transition-colors">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="shrink-0">
              {articleTypeLabels[article.articleType] || "Research Article"}
            </Badge>
            {isSample && (
              <Badge variant="outline" className="bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30 text-[10px] font-semibold">
                Format Preview
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            {isSample ? "Inaugural Volume" : article.publishedDate}
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
            <Link href={`/topics/${slugify(keyword)}`} key={keyword}>
              <Badge variant="secondary" className="text-xs hover:bg-secondary/70 transition-colors cursor-pointer">
                {keyword}
              </Badge>
            </Link>
          ))}
        </div>
        
        <div className="flex items-center justify-between pt-3 border-t border-border">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="font-medium">DOI:</span>
            {isSample ? (
              <span className="font-mono text-[11px] text-muted-foreground/80 flex items-center gap-1" title="Official Crossref DOI assignment upon inaugural volume publication">
                Deposit Pending (Inaugural Issue)
              </span>
            ) : (
              <a 
                href={`https://doi.org/${article.doi}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-mono text-[11px]"
              >
                {article.doi}
              </a>
            )}
          </div>
          <div className="flex gap-2">
            {article.pdfUrl ? (
              <Button variant="ghost" size="sm" asChild>
                <a href={article.pdfUrl} target="_blank" rel="noopener noreferrer">
                  <FileText className="h-4 w-4 mr-1" />
                  PDF
                </a>
              </Button>
            ) : (
              <Button variant="ghost" size="sm" asChild className="text-xs text-primary font-semibold">
                <Link href={`/submit?journal=${journalSlug}`}>
                  Submit Manuscript
                </Link>
              </Button>
            )}
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/journals/${journalSlug}/articles/${article.id}`}>
                {isSample ? "View Preview" : (t("articles.readMore") || "Read Article")}
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
  const hasOnlySamples = articles.length > 0 && articles.every(isSampleArticle)
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          {hasOnlySamples ? (
            <>
              <div className="flex items-center gap-2 mb-1.5">
                <Badge variant="outline" className="bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/25 text-xs font-semibold">
                  Call for Papers · Inaugural Issue
                </Badge>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                Inaugural Volume · Layout Previews & Submissions
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
                Illustrative publication samples showcasing manuscript presentation and citation styles. Peer-reviewed research submissions are actively invited for the founding issue.
              </p>
            </>
          ) : (
            <>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                Articles
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
                Peer-reviewed research published in this journal.
              </p>
            </>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="default" size="sm" asChild className="font-semibold text-xs">
            <Link href={`/submit?journal=${journalSlug}`}>
              Submit Paper
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild className="text-xs">
            <Link href={`/journals/${journalSlug}/articles`}>
              All Articles
              <ExternalLink className="h-3.5 w-3.5 ml-1" />
            </Link>
          </Button>
        </div>
      </div>
      <div className="grid gap-6">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} journalSlug={journalSlug} />
        ))}
      </div>
    </div>
  )
}
