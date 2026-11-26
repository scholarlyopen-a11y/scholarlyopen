import { notFound } from "next/navigation"
import Link from "next/link"
import { 
  Calendar, FileText, Users, ExternalLink, ArrowLeft, 
  Quote, Tag, BookOpen, Download, Check, Sparkles, Send, 
  AlertCircle, ShieldCheck, Clock, CheckCircle2, Activity
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
  return articles.map((article) => ({
    journalSlug: article.journalSlug,
    articleId: article.id,
  }))
}

export async function generateMetadata({ params }: ArticlePageProps) {
  const { journalSlug, articleId } = await params
  const article = articles.find((a) => a.id === articleId && a.journalSlug === journalSlug)
  if (!article) return {}

  const isSample = isSampleArticle(article)
  const isProof = Boolean(article.isUnpublishedProof)
  const isUnderReview = article.lifecycleStatus === "under_review" || article.lifecycleStatus === "revision_requested"

  // Format journal name nicely from slug
  const journalName = journalSlug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
    .replace("And", "&")

  const titleText = isUnderReview
    ? `[Preprint Under Review] ${article.title} | Scholarly Open: ${journalName}`
    : isProof
    ? `[Confidential Proof] ${article.title} | Scholarly Open`
    : isSample 
      ? `[Format Preview] ${article.title} | Scholarly Open` 
      : `${article.title} | Scholarly Open`
  const descText = article.abstract.slice(0, 160) + (article.abstract.length > 160 ? "..." : "")

  const pdfFullUrl = `https://www.scholarlyopen.org${article.pdfUrl || `/manuscripts/${article.id}-revised-manuscript.pdf`}`
  const articleFullUrl = `https://www.scholarlyopen.org/journals/${journalSlug}/articles/${article.id}`

  return {
    title: titleText,
    description: descText,
    robots: (isSample || isProof) ? {
      index: false,
      follow: false,
      nocache: true,
      googleBot: {
        index: false,
        follow: false,
        noimageindex: true,
        "max-video-preview": -1,
        "max-image-preview": "none",
        "max-snippet": -1,
      },
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
    // Google Scholar and Academic Search Engine Citation Tags (omitted for unreleased proofs)
    other: (!isSample && !isProof) ? {
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

export default async function ArticleDetailPage({ params }: ArticlePageProps) {
  const { journalSlug, articleId } = await params
  const article = articles.find((a) => a.id === articleId && a.journalSlug === journalSlug)

  if (!article) {
    notFound()
  }

  const isSample = isSampleArticle(article)
  const isUnderReview = article.lifecycleStatus === "under_review" || article.lifecycleStatus === "revision_requested"

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

              {isUnderReview && (
                <div className="mb-8 rounded-2xl border border-blue-200 dark:border-blue-900/50 bg-gradient-to-br from-blue-50/80 via-indigo-50/30 to-slate-50 dark:from-[#111319] dark:via-blue-950/20 dark:to-[#161820] p-6 shadow-sm space-y-6">
                  {/* Top Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-blue-100 dark:border-blue-900/40 pb-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="outline" className="bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30 text-xs font-bold flex items-center gap-1.5 py-1 px-3">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                        </span>
                        In Active Peer Review · Round 1
                      </Badge>
                      <span className="text-xs font-mono font-semibold bg-white/80 dark:bg-slate-800/80 text-blue-900 dark:text-blue-200 px-2.5 py-1 rounded-md border border-blue-200/60 dark:border-blue-800/60">
                        Track ID: {article.trackId || article.id}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                      <span>Submitted: {article.submissionDate || article.publishedDate}</span>
                    </div>
                  </div>

                  {/* Handling Editor & Review Stage */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3.5 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-blue-100 dark:border-blue-900/30 space-y-1">
                      <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">Assigned Handling Editor</span>
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        {article.handlingEditorSlug ? (
                          <Link href={`/editors/${article.handlingEditorSlug}`} className="text-sm font-bold text-foreground hover:text-primary transition-colors">
                            {article.handlingEditor}
                          </Link>
                        ) : (
                          <span className="text-sm font-bold text-foreground">{article.handlingEditor}</span>
                        )}
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-semibold border border-emerald-200 dark:border-emerald-800">
                          Active Desk
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground">Scholarly Open: Medicine · Peer Review Oversight</p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-blue-100 dark:border-blue-900/30 space-y-1">
                      <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">Publication Status</span>
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                        <span className="text-sm font-bold text-foreground">Open Access Preprint</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 font-semibold border border-blue-200 dark:border-blue-800">
                          CC BY 4.0
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground">Under active peer review · Standard publication fees apply upon formal acceptance</p>
                    </div>
                  </div>

                  {/* Visual Review Progress Tracker */}
                  <div className="space-y-2 pt-1">
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                      <Activity className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      Peer Review Progress
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                      <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300">
                        <div className="flex items-center gap-1.5 text-xs font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          <span>1. Submission</span>
                        </div>
                        <span className="text-[10px] text-muted-foreground block mt-0.5">Received Oct 26, 2026</span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300">
                        <div className="flex items-center gap-1.5 text-xs font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          <span>2. Editorial Triage</span>
                        </div>
                        <span className="text-[10px] text-muted-foreground block mt-0.5">Completed Oct 28, 2026</span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-blue-500/15 border border-blue-500/40 text-blue-800 dark:text-blue-200 shadow-xs">
                        <div className="flex items-center gap-1.5 text-xs font-bold">
                          <Clock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                          <span>3. Peer Review</span>
                        </div>
                        <span className="text-[10px] text-blue-700 dark:text-blue-300 font-semibold block mt-0.5">Under Evaluation (Round 1)</span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-100/60 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-slate-500">
                        <div className="flex items-center gap-1.5 text-xs font-semibold">
                          <span className="w-3.5 h-3.5 rounded-full border border-slate-400 shrink-0 flex items-center justify-center text-[9px]">4</span>
                          <span>4. Version of Record</span>
                        </div>
                        <span className="text-[10px] text-muted-foreground block mt-0.5">Pending Final Decision</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions & Policy Notice */}
                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-muted-foreground border-t border-blue-100 dark:border-blue-900/40">
                    <p className="max-w-xl text-[11px] leading-relaxed">
                      This manuscript is an unedited open-access preprint currently under peer evaluation. Citations should reference this work using identifier <strong>{article.trackId}</strong>.
                    </p>
                    <div className="flex items-center gap-2 shrink-0">
                      {article.pdfUrl && (
                        <Button size="sm" variant="default" asChild className="text-xs font-semibold shadow-xs">
                          <a href={article.pdfUrl} target="_blank" rel="noopener noreferrer">
                            <Download className="w-3.5 h-3.5 mr-1.5" />
                            Preprint PDF (v1)
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {article.isUnpublishedProof && (
                <div className="mb-6 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 flex items-center justify-between gap-3 shadow-xs">
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-amber-900 dark:text-amber-200">
                        Confidential Proofreading Preview · Editorial Evaluation Desk
                      </div>
                      <div className="text-[11px] text-amber-700 dark:text-amber-400">
                        This article is an unreleased proof. It is hidden from public discovery and search engines (noindex, nofollow).
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-[10px] font-semibold bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 border-amber-300 shrink-0">
                    Unreleased Proof
                  </Badge>
                </div>
              )}
              <ArticleFullTextViewer article={samLeeArticleFullText} />
            </>
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
