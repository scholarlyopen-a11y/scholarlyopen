import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, BookOpen, Search } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { articles } from "@/lib/data/articles"
import { ArticleCard } from "@/components/article-card"
import { Button } from "@/components/ui/button"

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

  return {
    title: `Articles - ${journalName} | Scholarly Open`,
    description: `Browse all open access research articles published in ${journalName} at Scholarly Open.`,
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
          <div className="mb-8">
            <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-primary pl-0">
              <Link href={`/journals/${journalSlug}`}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to {journalName} Homepage
              </Link>
            </Button>
          </div>

          <div className="space-y-4 mb-10">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Published Articles
            </h1>
            <p className="text-muted-foreground text-base max-w-2xl">
              Explore peer-reviewed open access articles published in <strong className="text-foreground">{journalName}</strong>. All articles are permanently available to readers worldwide under CC BY 4.0.
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
