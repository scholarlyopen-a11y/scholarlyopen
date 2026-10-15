import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, BookOpen, Search, Send, Sparkles, AlertCircle } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { articles, isSampleArticle } from "@/lib/data/articles"
import { ArticleCard } from "@/components/article-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface JournalArticlesPageProps {
  params: Promise<{
    journalSlug: string
  }>
}

// Generate static params for all journals present in articles dataset
export async function generateStaticParams() {
  const uniqueSlugs = Array.from(new Set(articles.map((a) => a.journalSlug)))
  return uniqueSlugs.map((journalSlug) => ({
    journalSlug,
  }))
}

export async function generateMetadata({ params }: JournalArticlesPageProps) {
  const { journalSlug } = await params
  const journalName = journalSlug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
    .replace("And", "&")

  const journalArticles = articles.filter((a) => a.journalSlug === journalSlug)
  const isSampleSet = journalArticles.length > 0 && journalArticles.every(isSampleArticle)

  return {
    title: isSampleSet 
      ? `Articles & Format Previews - ${journalName} | Scholarly Open` 
      : `Articles - ${journalName} | Scholarly Open`,
    description: `Browse open access research articles published in ${journalName} at Scholarly Open.`,
    robots: isSampleSet ? {
      index: false,
      follow: true,
    } : {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: `https://www.scholarlyopen.org/journals/${journalSlug}/articles`,
    },
  }
}

export default async function JournalArticlesPage({ params }: JournalArticlesPageProps) {
  const { journalSlug } = await params
  const journalArticles = articles.filter((a) => a.journalSlug === journalSlug)

  if (journalArticles.length === 0) {
    // If invalid journal slug, return 404
    notFound()
  }

  const isSampleSet = journalArticles.every(isSampleArticle)

  const journalName = journalSlug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
    .replace("And", "&")

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 py-12 md:py-16">
        <div className="container max-w-5xl mx-auto px-4">
          <div className="mb-8 flex items-center justify-between">
            <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-primary pl-0">
              <Link href={`/journals/${journalSlug}`}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to {journalName} Homepage
              </Link>
            </Button>
            <Button size="sm" variant="outline" asChild className="text-xs">
              <Link href={`/submit?journal=${journalSlug}`}>
                <Send className="h-3.5 w-3.5 mr-1.5" />
                Submit Manuscript
              </Link>
            </Button>
          </div>

          {/* Option A Banner */}
          {isSampleSet && (
            <div className="mb-8 rounded-2xl border border-amber-500/30 bg-amber-500/10 dark:bg-amber-500/5 p-5 sm:p-6 shadow-sm">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
                <div className="space-y-2 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className="bg-amber-500/20 text-amber-800 dark:text-amber-300 border-amber-500/40 text-[11px] font-bold uppercase tracking-wider">
                      <AlertCircle className="h-3 w-3 mr-1 inline" />
                      Inaugural Volume · Call for Papers
                    </Badge>
                  </div>
                  <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed">
                    The items below represent demonstration layout previews illustrating article formatting and citation attribution for <strong>Scholarly Open: {journalName}</strong>. Peer-reviewed submissions are actively open for Volume 1.
                  </p>
                  <p className="text-xs text-muted-foreground font-medium flex items-center gap-1.5 pt-0.5">
                    <Sparkles className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span>Inaugural APC waivers and priority double-blind peer review are active for founding manuscripts.</span>
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0 w-full md:w-auto">
                  <Button asChild size="sm" className="w-full font-semibold shadow-sm">
                    <Link href={`/submit?journal=${journalSlug}`}>
                      <Send className="h-3.5 w-3.5 mr-1.5" />
                      Submit to Volume 1
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

          <div className="space-y-4 mb-10">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              {isSampleSet ? "Articles & Publication Previews" : "Published Articles"}
            </h1>
            <p className="text-muted-foreground text-base max-w-2xl">
              {isSampleSet 
                ? `Explore open access layout previews for ${journalName}. All accepted research manuscripts are permanently published under CC BY 4.0 with registered Crossref DOIs.`
                : `Explore peer-reviewed open access articles published in ${journalName}. All articles are permanently available to readers worldwide under CC BY 4.0.`}
            </p>
          </div>

          <div className="space-y-6">
            {journalArticles.map((article) => (
              <ArticleCard key={article.id} article={article} journalSlug={journalSlug} />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
