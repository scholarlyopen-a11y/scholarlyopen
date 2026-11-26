"use client"

import { useState } from "react"
import Link from "next/link"
import { Calendar, ExternalLink, FileText, Users, Clock, ShieldCheck, Sparkles, Activity, FileCheck, ArrowRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/language-context"
import { slugify } from "@/lib/utils"
import { type Article, isSampleArticle } from "@/lib/data/articles"

export type { Article }
export { isSampleArticle }

interface ArticleCardProps {
  article: Article
  journalSlug: string
}

export function ArticleCard({ article, journalSlug }: ArticleCardProps) {
  const { t } = useLanguage()
  const isSample = isSampleArticle(article)
  const isUnderReview = article.lifecycleStatus === "under_review" || article.lifecycleStatus === "revision_requested"

  const articleTypeLabels: Record<string, string> = {
    research: "Research Article",
    review: "Review Article",
    methodology: "Methodology Paper",
    editorial: "Editorial",
    perspective: "Perspective Article",
  }

  return (
    <Card className={`transition-all duration-200 ${
      isUnderReview 
        ? "border-blue-200 dark:border-blue-900/50 bg-gradient-to-br from-white via-blue-50/20 to-slate-50 dark:from-[#111216] dark:via-blue-950/10 dark:to-[#16181d] hover:border-blue-400 dark:hover:border-blue-700/60 shadow-xs" 
        : "border-border hover:border-primary/30"
    }`}>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="shrink-0">
              {articleTypeLabels[article.articleType] || "Research Article"}
            </Badge>

            {isUnderReview ? (
              <Badge variant="outline" className="bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30 text-[11px] font-semibold flex items-center gap-1.5 py-0.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                {article.reviewStatusText || "Under Peer Review · Round 1"}
              </Badge>
            ) : isSample ? (
              <Badge variant="outline" className="bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30 text-[10px] font-semibold">
                Format Preview
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 text-[10px] font-semibold">
                Version of Record (VoR)
              </Badge>
            )}

            {isUnderReview && (
              <span className="text-[11px] font-mono font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                Track: {article.trackId || article.id}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            <span>
              {isUnderReview 
                ? `Submitted ${article.submissionDate || article.publishedDate}`
                : isSample 
                ? "Inaugural Volume" 
                : article.publishedDate}
            </span>
          </div>
        </div>

        {isUnderReview && article.handlingEditor && (
          <div className="mt-2 text-xs flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="text-muted-foreground">Handling Editor:</span>
            {article.handlingEditorSlug ? (
              <Link href={`/editors/${article.handlingEditorSlug}`} className="font-semibold text-primary hover:underline">
                {article.handlingEditor}
              </Link>
            ) : (
              <span className="font-semibold">{article.handlingEditor}</span>
            )}
          </div>
        )}

        <CardTitle className="text-lg leading-tight mt-2.5 hover:text-primary transition-colors">
          <Link href={`/journals/${journalSlug}/articles/${article.id}`}>
            {article.title}
          </Link>
        </CardTitle>

        <CardDescription className="flex items-center gap-1.5 pt-1">
          <Users className="h-3.5 w-3.5" />
          <span>{article.authors.join(", ")}</span>
        </CardDescription>
      </CardHeader>

      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-3 mb-4 leading-relaxed">
          {article.abstract}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {article.keywords.slice(0, 5).map((keyword) => (
            <Link href={`/topics/${slugify(keyword)}`} key={keyword}>
              <Badge variant="secondary" className="text-xs hover:bg-secondary/70 transition-colors cursor-pointer">
                {keyword}
              </Badge>
            </Link>
          ))}
        </div>

        {isUnderReview && (
          <div className="mb-4 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
            <span className="inline-flex items-center gap-1 font-medium text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded border border-blue-200/60 dark:border-blue-900/40">
              <Activity className="h-3 w-3 text-blue-600 dark:text-blue-400" />
              Preprint (CC BY 4.0)
            </span>
            <span className="inline-flex items-center gap-1 font-medium bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-700 dark:text-slate-300">
              Double-Blind Peer Review
            </span>
            {article.openScienceBadges?.openData && (
              <span className="inline-flex items-center gap-1 font-medium bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-700 dark:text-slate-300">
                Data Repository Available
              </span>
            )}
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-border">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="font-medium">
              {isUnderReview ? "Preprint Identifier:" : "DOI:"}
            </span>
            {isUnderReview ? (
              <span className="font-mono text-[11px] text-blue-700 dark:text-blue-300 font-semibold">
                {article.openScienceBadges?.preprintDoi || article.trackId || article.id}
              </span>
            ) : isSample || article.doi?.includes("Pending") ? (
              <span className="font-mono text-[11px] text-muted-foreground/80 flex items-center gap-1" title="Official Crossref DOI assignment upon inaugural volume publication">
                {article.doi || "Deposit Pending"}
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

          <div className="flex flex-wrap items-center gap-2">
            {article.pdfUrl && (
              <Button variant="outline" size="sm" asChild className="text-xs">
                <a href={article.pdfUrl} target="_blank" rel="noopener noreferrer">
                  <FileText className="h-3.5 w-3.5 mr-1" />
                  {isUnderReview ? "Preprint PDF (v1)" : "PDF"}
                </a>
              </Button>
            )}

            <Button variant={isUnderReview ? "default" : "ghost"} size="sm" asChild className="text-xs font-semibold">
              <Link href={`/journals/${journalSlug}/articles/${article.id}`}>
                {isUnderReview 
                  ? "Track Review & Read" 
                  : isSample 
                  ? "View Preview" 
                  : (t("articles.readMore") || "Read Article")}
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
  const publishedArticles = articles.filter(a => a.lifecycleStatus === "published" || (!a.lifecycleStatus && !a.isUnpublishedProof))
  const underReviewArticles = articles.filter(a => a.lifecycleStatus === "under_review" || a.lifecycleStatus === "revision_requested")

  // Default active tab to "under_review" if no published articles exist yet, otherwise "published"
  const defaultTab = publishedArticles.length > 0 ? "published" : underReviewArticles.length > 0 ? "under_review" : "published"
  const [activeTab, setActiveTab] = useState<"published" | "under_review">(defaultTab)

  return (
    <div className="space-y-6">
      {/* Header and Dual-Stream Filter Tabs */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Articles & Preprints
            </h3>
            <Badge variant="outline" className="text-[10px] font-medium text-muted-foreground border-border">
              Open Access
            </Badge>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
            Peer-reviewed research articles and manuscripts currently under editorial evaluation.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button variant="default" size="sm" asChild className="font-semibold text-xs shadow-xs">
            <Link href={`/submit?journal=${journalSlug}`}>
              Submit a Manuscript
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild className="text-xs">
            <Link href={`/journals/${journalSlug}/articles`}>
              All Archives
              <ExternalLink className="h-3.5 w-3.5 ml-1" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 border-b border-border pb-3">
        <button
          type="button"
          onClick={() => setActiveTab("under_review")}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "under_review"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Under Review</span>
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
            activeTab === "under_review" ? "bg-white/20 text-white" : "bg-muted-foreground/20 text-foreground"
          }`}>
            {underReviewArticles.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("published")}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "published"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          <FileCheck className="w-3.5 h-3.5" />
          <span>Published Articles</span>
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
            activeTab === "published" ? "bg-white/20 text-white" : "bg-muted-foreground/20 text-foreground"
          }`}>
            {publishedArticles.length}
          </span>
        </button>
      </div>

      {/* Active Tab View */}
      {activeTab === "under_review" ? (
        <div className="space-y-4">
          {/* Open Research Policy Callout Box */}
          <div className="p-4 sm:p-5 rounded-2xl bg-muted/40 border border-border flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1 max-w-2xl">
              <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                <Sparkles className="w-3.5 h-3.5 text-primary shrink-0" />
                <span>Open Research & Pre-Publication Review</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                To foster rapid scientific communication, submitted manuscripts are made accessible as open-access preprints during peer review under CC BY 4.0. Article processing charges (APCs) apply only after formal editorial acceptance of the final Version of Record.
              </p>
            </div>
            <Button size="sm" variant="outline" asChild className="shrink-0 text-xs">
              <Link href="/author-guidelines">
                Review Guidelines <ArrowRight className="w-3 h-3 ml-1" />
              </Link>
            </Button>
          </div>

          {underReviewArticles.length > 0 ? (
            <div className="grid gap-6">
              {underReviewArticles.map((article) => (
                <ArticleCard key={article.id} article={article} journalSlug={journalSlug} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 px-6 bg-muted/20 rounded-2xl border border-dashed border-border max-w-xl mx-auto space-y-3">
              <Clock className="w-8 h-8 text-muted-foreground/60 mx-auto" />
              <h4 className="text-base font-bold text-foreground">No Submissions Currently Under Review</h4>
              <p className="text-xs text-muted-foreground">
                Be the first to submit your manuscript for rapid editorial triage and open preprint indexing.
              </p>
              <Button asChild size="sm" className="text-xs font-semibold">
                <Link href={`/submit?journal=${journalSlug}`}>Submit Manuscript</Link>
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {publishedArticles.length > 0 ? (
            <div className="grid gap-6">
              {publishedArticles.map((article) => (
                <ArticleCard key={article.id} article={article} journalSlug={journalSlug} />
              ))}
            </div>
          ) : (
            <div className="space-y-4 text-center py-12 px-6 bg-muted/20 rounded-2xl border border-dashed border-border max-w-2xl mx-auto">
              <h3 className="text-xl font-bold tracking-tight text-foreground">Inaugural Volume in Formation</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Peer-reviewed research and scholarly perspectives are currently progressing through peer review. Check the <strong>Under Active Review</strong> tab to inspect live submissions currently undergoing evaluation.
              </p>
              <div className="flex items-center justify-center gap-3 pt-2">
                <Button onClick={() => setActiveTab("under_review")} size="sm" variant="outline" className="font-semibold text-xs">
                  View Active Preprints ({underReviewArticles.length})
                </Button>
                <Button asChild size="sm" className="font-semibold text-xs">
                  <Link href={`/submit?journal=${journalSlug}`}>Submit Your Manuscript</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
