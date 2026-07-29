import { notFound } from "next/navigation"
import Link from "next/link"
import { 
  Calendar, FileText, Users, ExternalLink, ArrowLeft, 
  Quote, Tag, BookOpen, Share2, Download, Check
} from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { articles } from "@/lib/data/articles"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { slugify } from "@/lib/utils"

interface ArticlePageProps {
  params: Promise<{
    journalSlug: string
    articleId: string
  }>
}

export async function generateStaticParams() {
  return articles.map((article) => ({
    journalSlug: article.journalSlug,
    articleId: article.id,
  }))
}

export async function generateMetadata({ params }: ArticlePageProps) {
  const { journalSlug, articleId } = await params
  const article = articles.find((a) => a.id === articleId && a.journalSlug === journalSlug)
  if (!article) return {}

  const titleText = `${article.title} | Scholarly Open`
  const descText = article.abstract.slice(0, 160) + (article.abstract.length > 160 ? "..." : "")

  return {
    title: titleText,
    description: descText,
    openGraph: {
      title: titleText,
      description: descText,
      type: "article",
      url: `https://www.scholarlyopen.org/journals/${journalSlug}/articles/${article.id}`,
      publishedTime: article.publishedDate,
      authors: article.authors,
    },
    twitter: {
      card: "summary_large_image",
      title: titleText,
      description: descText,
    },
    alternates: {
      canonical: `https://www.scholarlyopen.org/journals/${journalSlug}/articles/${article.id}`,
    },
  }
}

export default async function ArticleDetailPage({ params }: ArticlePageProps) {
  const { journalSlug, articleId } = await params
  const article = articles.find((a) => a.id === articleId && a.journalSlug === journalSlug)

  if (!article) {
    notFound()
  }

  const articleTypeLabels: Record<string, string> = {
    research: "Research Article",
    review: "Review Article",
    methodology: "Methodology Paper",
    editorial: "Editorial",
  }

  // Format journal name nicely from slug
  const journalName = journalSlug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
    .replace("And", "&")

  const citationString = `${article.authors.join(", ")} (${article.publishedDate.split("-")[0]}). ${article.title}. Journal of ${journalName}, DOI: ${article.doi}.`

  // ScholarlyArticle JSON-LD for Google Scholar & Search Engine indexing
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ScholarlyArticle",
    "headline": article.title,
    "abstract": article.abstract,
    "datePublished": article.publishedDate,
    "author": article.authors.map((name) => ({
      "@type": "Person",
      "name": name,
    })),
    "publisher": {
      "@type": "Organization",
      "name": "Scholarly Open",
      "url": "https://www.scholarlyopen.org",
    },
    "identifier": [
      {
        "@type": "PropertyValue",
        "propertyID": "doi",
        "value": article.doi,
      },
    ],
    "keywords": article.keywords.join(", "),
    "mainEntityOfPage": `https://www.scholarlyopen.org/journals/${journalSlug}/articles/${article.id}`,
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="flex-1 py-12 md:py-16">
        <div className="container max-w-5xl mx-auto px-4">
          {/* Navigation link back to Journal */}
          <div className="mb-8">
            <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-primary pl-0">
              <Link href={`/journals/${journalSlug}`}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to {journalName} Journal
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content (Left Column) */}
            <div className="lg:col-span-2 space-y-8">
              {/* Header Card */}
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 text-xs font-semibold px-3 py-1">
                    {articleTypeLabels[article.articleType] || "Research Article"}
                  </Badge>
                  <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    Published: {article.publishedDate}
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    Open Access
                  </Badge>
                </div>

                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground leading-tight">
                  {article.title}
                </h1>

                <div className="flex items-center gap-2 pt-2 text-sm md:text-base font-medium text-muted-foreground">
                  <Users className="h-4 w-4 shrink-0 text-primary" />
                  <span>{article.authors.join(" • ")}</span>
                </div>
              </div>

              {/* DOI and Quick links */}
              <Card className="bg-muted/30 border-border">
                <CardContent className="p-4 sm:p-6 flex flex-wrap items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Digital Object Identifier</span>
                    <div className="flex items-center gap-2">
                      <a 
                        href={`https://doi.org/${article.doi}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline font-mono text-sm sm:text-base font-semibold flex items-center gap-1"
                      >
                        https://doi.org/{article.doi}
                        <ExternalLink className="h-3.5 w-3.5 inline" />
                      </a>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {article.pdfUrl ? (
                      <Button asChild variant="default" size="sm">
                        <a href={article.pdfUrl} target="_blank" rel="noopener noreferrer">
                          <Download className="h-4 w-4 mr-2" />
                          Download PDF
                        </a>
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm" disabled title="PDF available upon publication">
                        <FileText className="h-4 w-4 mr-2" />
                        PDF Preview
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Abstract Section */}
              <div className="space-y-3 pt-2">
                <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Abstract
                </h2>
                <div className="prose dark:prose-invert max-w-none text-muted-foreground leading-relaxed text-base bg-card p-6 rounded-2xl border border-border">
                  <p>{article.abstract}</p>
                </div>
              </div>

              {/* Keywords */}
              <div className="space-y-3 pt-2">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <Tag className="h-4 w-4 text-primary" />
                  Subject Keywords
                </h3>
                <div className="flex flex-wrap gap-2">
                  {article.keywords.map((kw) => (
                    <Link href={`/topics/${slugify(kw)}`} key={kw}>
                      <Badge 
                        variant="outline" 
                        className="px-3 py-1 text-xs hover:bg-primary/10 hover:border-primary/30 transition-all cursor-pointer"
                      >
                        {kw}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Citation Box */}
              <Card className="border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <Quote className="h-4 w-4 text-primary" />
                    How to Cite
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="p-4 bg-muted/50 rounded-xl font-mono text-xs text-foreground select-all break-words leading-relaxed border border-border">
                    {citationString}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar (Right Column) */}
            <div className="space-y-6">
              {/* Journal Info Card */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-base font-bold">Published In</CardTitle>
                  <CardDescription className="text-sm">{journalName}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  <p className="text-xs text-muted-foreground">
                    A peer-reviewed open access journal published by Scholarly Open.
                  </p>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href={`/journals/${journalSlug}`}>
                      Visit Journal Homepage
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Article Rights */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-base font-bold">Licensing & Rights</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-xs text-muted-foreground">
                  <p>
                    <strong className="text-foreground">Creative Commons Attribution (CC BY 4.0):</strong> Anyone may read, download, copy, distribute, print, or link to this article.
                  </p>
                  <p>
                    Copyright remains with the authors under open access policy.
                  </p>
                  <Button variant="link" size="sm" asChild className="p-0 text-primary h-auto">
                    <Link href="/open-access">Learn about Open Access Policy</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
