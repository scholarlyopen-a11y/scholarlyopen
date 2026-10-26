import { notFound } from "next/navigation"
import Link from "next/link"
import { 
  Calendar, FileText, Users, ExternalLink, ArrowLeft, 
  Quote, Tag, BookOpen, Download, Check, Sparkles, Send, 
  AlertCircle, ShieldCheck
} from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { articles, isSampleArticle } from "@/lib/data/articles"
import { samLeeArticleFullText } from "@/lib/data/fulltext/somed-26-rw01"
import { ArticleFullTextViewer } from "@/components/article-fulltext-viewer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { slugify } from "@/lib/utils"

interface ArticlePageProps {
  params: Promise<{
    journalSlug: string
    articleId: string
  }>
  searchParams?: Promise<{
    preview?: string
  }>
}

export async function generateStaticParams() {
  return articles
    .filter((article) => !article.isUnpublishedProof)
    .map((article) => ({
      journalSlug: article.journalSlug,
      articleId: article.id,
    }))
}

export async function generateMetadata({ params }: ArticlePageProps) {
  const { journalSlug, articleId } = await params
  const article = articles.find((a) => a.id === articleId && a.journalSlug === journalSlug)
  if (!article) return {}

  const isSample = isSampleArticle(article)
  const titleText = isSample 
    ? `[Format Preview] ${article.title} | Scholarly Open` 
    : `${article.title} | Scholarly Open`
  const descText = article.abstract.slice(0, 160) + (article.abstract.length > 160 ? "..." : "")

  // Format journal name nicely from slug
  const journalName = journalSlug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
    .replace("And", "&")

  const pdfFullUrl = `https://www.scholarlyopen.org${article.pdfUrl || `/manuscripts/${article.id}-revised-manuscript.pdf`}`
  const articleFullUrl = `https://www.scholarlyopen.org/journals/${journalSlug}/articles/${article.id}`

  return {
    title: titleText,
    description: descText,
    robots: (isSample || article.isUnpublishedProof) ? {
      index: false,
      follow: false,
    } : {
      index: true,
      follow: true,
    },
    openGraph: {
      title: titleText,
      description: descText,
      type: "article",
      url: articleFullUrl,
      publishedTime: article.publishedDate,
      authors: article.authors,
    },
    twitter: {
      card: "summary_large_image",
      title: titleText,
      description: descText,
    },
    alternates: {
      canonical: articleFullUrl,
    },
    // Google Scholar and Academic Search Engine Citation Tags
    other: !isSample ? {
      "citation_title": article.title,
      "citation_author": article.authors.join("; "),
      "citation_publication_date": article.publishedDate.replace(/-/g, "/"),
      "citation_journal_title": `Scholarly Open: ${journalName}`,
      "citation_volume": "1",
      "citation_issue": "1",
      "citation_pdf_url": pdfFullUrl,
      "citation_fulltext_html_url": articleFullUrl,
      "citation_language": "en",
      "DC.title": article.title,
      "DC.creator": article.authors.join("; "),
      "DC.date": article.publishedDate,
      "DC.type": "Text.Serial.Article",
      "DC.format": "text/html",
      "DC.language": "eng",
    } : {},
  }
}

export default async function ArticleDetailPage({ params, searchParams }: ArticlePageProps) {
  const { journalSlug, articleId } = await params
  const sp = searchParams ? await searchParams : {}
  const article = articles.find((a) => a.id === articleId && a.journalSlug === journalSlug)

  if (!article) {
    notFound()
  }

  // If this article is an unreleased proof, hide it completely on production (unless authorized preview token is provided)
  if (article.isUnpublishedProof && process.env.NODE_ENV === "production" && sp.preview !== "somed26_review_access") {
    notFound()
  }

  const isSample = isSampleArticle(article)

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

  const citationString = isSample
    ? `${article.authors.join(", ")} (${article.publishedDate.split("-")[0]}). ${article.title}. Scholarly Open: ${journalName} [Demonstration Layout Preview · Inaugural Volume in Formation].`
    : `${article.authors.join(", ")} (${article.publishedDate.split("-")[0]}). ${article.title}. Scholarly Open: ${journalName}, DOI: ${article.doi}.`

  // Only emit ScholarlyArticle JSON-LD for real publications to prevent Google Scholar indexing mock entries
  const jsonLd = !isSample ? {
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
  } : null

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}

      <main className="flex-1 py-10 md:py-14">
        <div className="container max-w-5xl mx-auto px-4">
          {article.id === "SOMED-26-RW01" ? (
            <ArticleFullTextViewer article={samLeeArticleFullText} />
          ) : (
            <>
              {/* Navigation link back to Journal */}
              <div className="mb-6 flex items-center justify-between">
                <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-primary pl-0">
                  <Link href={`/journals/${journalSlug}`}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to {journalName} Journal
                  </Link>
                </Button>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" asChild className="text-xs">
                    <Link href={`/submit?journal=${journalSlug}`}>
                      <Send className="h-3.5 w-3.5 mr-1.5" />
                      Submit to this Journal
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Option A: Demonstration Layout Preview & Call for Papers Banner */}
              {isSample && (
                <div className="mb-8 rounded-2xl border border-amber-500/30 bg-amber-500/10 dark:bg-amber-500/5 p-5 sm:p-6 shadow-sm">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
                <div className="space-y-2 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className="bg-amber-500/20 text-amber-800 dark:text-amber-300 border-amber-500/40 text-[11px] font-bold uppercase tracking-wider">
                      <AlertCircle className="h-3 w-3 mr-1 inline" />
                      Demonstration Format Preview · Call for Papers
                    </Badge>
                    <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">
                      Inaugural Volume In Formation
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed">
                    This entry is an illustrative sample showcasing the open-access publication layout, typography, and citation metadata for <strong>Scholarly Open: {journalName}</strong>. Peer-reviewed research submissions are actively invited for the inaugural issue.
                  </p>
                  <p className="text-xs text-muted-foreground font-medium flex items-center gap-1.5 pt-0.5">
                    <Sparkles className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span>Inaugural APC fee waivers and priority editorial evaluation are currently active for founding submissions.</span>
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0 w-full md:w-auto">
                  <Button asChild size="sm" className="w-full font-semibold shadow-sm">
                    <Link href={`/submit?journal=${journalSlug}`}>
                      <Send className="h-3.5 w-3.5 mr-1.5" />
                      Submit Your Manuscript
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="sm" className="w-full text-xs">
                    <Link href="/author-guidelines">
                      Author Guidelines
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content (Left Column) */}
            <div className="lg:col-span-2 space-y-8">
              {/* Header Card */}
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 text-xs font-semibold px-3 py-1">
                    {articleTypeLabels[article.articleType] || "Research Article"}
                  </Badge>
                  {isSample ? (
                    <Badge variant="outline" className="bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30 text-xs font-semibold">
                      Layout Preview
                    </Badge>
                  ) : (
                    <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      Published: {article.publishedDate}
                    </span>
                  )}
                  <Badge variant="secondary" className="text-xs">
                    Open Access (CC BY 4.0)
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
                      {isSample ? (
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs sm:text-sm text-muted-foreground font-medium">
                            DOI: Assigned via Crossref upon acceptance
                          </span>
                          <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                            Crossref Deposit Active Upon Publication
                          </span>
                        </div>
                      ) : (
                        <a 
                          href={`https://doi.org/${article.doi}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline font-mono text-sm sm:text-base font-semibold flex items-center gap-1"
                        >
                          https://doi.org/{article.doi}
                          <ExternalLink className="h-3.5 w-3.5 inline" />
                        </a>
                      )}
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
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/submit?journal=${journalSlug}`}>
                          <Send className="h-4 w-4 mr-2" />
                          Submit to Volume 1
                        </Link>
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
                    How to Cite {isSample ? "(Demonstration Format)" : ""}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="p-4 bg-muted/50 rounded-xl font-mono text-xs text-foreground select-all break-words leading-relaxed border border-border">
                    {citationString}
                  </div>
                  {isSample && (
                    <p className="text-[11px] text-muted-foreground">
                      *Illustrative citation format demonstrating how accepted articles in this journal are attributed and archived.
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar (Right Column) */}
            <div className="space-y-6">
              {/* Call for Papers Card */}
              {isSample && (
                <Card className="border-primary/20 bg-primary/5 shadow-sm">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-primary" />
                      <CardTitle className="text-sm font-bold text-foreground">Call for Papers: Volume 1</CardTitle>
                    </div>
                    <CardDescription className="text-xs">
                      Scholarly Open: {journalName} is currently accepting submissions for its inaugural volume.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 text-xs text-muted-foreground">
                    <ul className="space-y-1.5 text-[11px]">
                      <li className="flex items-center gap-1.5">
                        <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                        <span>Rigorous double-blind peer review</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                        <span>Official Crossref DOI assignment</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                        <span>Inaugural APC fee waivers available</span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                        <span>Global open-access distribution (CC BY 4.0)</span>
                      </li>
                    </ul>
                    <Button asChild size="sm" className="w-full text-xs font-semibold mt-2">
                      <Link href={`/submit?journal=${journalSlug}`}>
                        <Send className="h-3.5 w-3.5 mr-1.5" />
                        Submit to this Journal
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )}

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
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
