import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, BookOpen, User, ExternalLink, ArrowRight } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { articles } from "@/lib/data/articles"
import { editors } from "@/lib/data/editors"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { slugify } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface TopicPageProps {
  params: Promise<{
    slug: string
  }>
}

// Generate all possible topic slugs dynamically at build time
export async function generateStaticParams() {
  const articleKeywords = articles.flatMap((a) => a.keywords)
  const editorExpertise = editors.flatMap((e) => e.expertise || [])
  const uniqueKeywords = Array.from(new Set([...articleKeywords, ...editorExpertise]))
  
  return uniqueKeywords.map((kw) => ({
    slug: slugify(kw),
  }))
}

export async function generateMetadata({ params }: TopicPageProps) {
  const { slug } = await params
  const articleKeywords = articles.flatMap((a) => a.keywords)
  const editorExpertise = editors.flatMap((e) => e.expertise || [])
  
  const originalKeyword = 
    articleKeywords.find(kw => slugify(kw) === slug) ||
    editorExpertise.find(exp => slugify(exp) === slug) ||
    slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")

  return {
    title: `Articles and Editors in ${originalKeyword} | Scholarly Open`,
    description: `Browse peer-reviewed open-access articles and meet academic editors specialized in ${originalKeyword} at Scholarly Open.`,
  }
}

export default async function TopicPage({ params }: TopicPageProps) {
  const { slug } = await params

  // Find matching articles and editors by slugified keywords
  const matchedArticles = articles.filter(a => 
    a.keywords.some(kw => slugify(kw) === slug)
  )

  const matchedEditors = editors.filter(e => 
    e.expertise?.some(exp => slugify(exp) === slug)
  )

  // 404 if no articles and no editors are found
  if (matchedArticles.length === 0 && matchedEditors.length === 0) {
    notFound()
  }

  // Get the properly formatted topic name from data
  const originalKeyword = 
    matchedArticles.flatMap(a => a.keywords).find(kw => slugify(kw) === slug) ||
    matchedEditors.flatMap(e => e.expertise || []).find(exp => slugify(exp) === slug) ||
    slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      
      <main className="flex-1 pb-16">
        {/* Breadcrumb banner */}
        <div className="border-b border-border bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
            <Link 
              href="/journals" 
              className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Explore Journals
            </Link>
          </div>
        </div>

        {/* Hero Section */}
        <section className="bg-primary/5 border-b border-border py-12 lg:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">Topic Hub</span>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl mt-2">
              {originalKeyword}
            </h1>
            <p className="text-muted-foreground mt-4 text-base max-w-3xl leading-relaxed">
              Discover academic publications, recent research articles, and specialized editorial board members associated with the study of <span className="font-semibold text-foreground">{originalKeyword}</span>.
            </p>
          </div>
        </section>

        {/* Hub Content */}
        <section className="py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Tabs defaultValue="articles" className="w-full">
              
              <TabsList className="bg-muted p-1 rounded-lg w-fit mb-8 gap-1">
                <TabsTrigger value="articles" className="font-medium text-sm px-4 py-2 rounded-md">
                  Articles ({matchedArticles.length})
                </TabsTrigger>
                <TabsTrigger value="editors" className="font-medium text-sm px-4 py-2 rounded-md">
                  Editorial Experts ({matchedEditors.length})
                </TabsTrigger>
              </TabsList>

              {/* Articles Tab */}
              <TabsContent value="articles" className="space-y-6 focus-visible:outline-none animate-in fade-in duration-300">
                {matchedArticles.length > 0 ? (
                  <div className="grid gap-6 md:grid-cols-2">
                    {matchedArticles.map((article) => (
                      <Card key={article.id} className="border-border hover:border-primary/30 transition-all flex flex-col justify-between">
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-start gap-4">
                            <Badge className="bg-accent text-accent-foreground border-0 text-[10px] uppercase font-bold tracking-wider">
                              {article.articleType}
                            </Badge>
                            <span className="text-xs text-muted-foreground font-semibold">{article.publishedDate}</span>
                          </div>
                          <CardTitle className="text-lg font-bold mt-3 leading-snug">
                            {article.title}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground mt-1.5 font-medium">
                            By {article.authors.join(", ")}
                          </p>
                        </CardHeader>
                        <CardContent className="pt-0 space-y-4">
                          <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                            {article.abstract}
                          </p>
                          <div className="flex flex-wrap gap-1.5 pt-2">
                            {article.keywords.map(kw => (
                              <Link href={`/topics/${slugify(kw)}`} key={kw}>
                                <Badge variant="outline" className={`text-[10px] font-medium border-border transition-colors hover:bg-primary/5 cursor-pointer ${
                                  slugify(kw) === params.slug ? "bg-primary/10 text-primary border-primary/20" : ""
                                }`}>
                                  {kw}
                                </Badge>
                              </Link>
                            ))}
                          </div>
                          <hr className="border-border mt-4" />
                          <div className="flex justify-between items-center pt-2">
                            <span className="text-xs text-muted-foreground font-medium">DOI: {article.doi}</span>
                            <Button variant="link" size="sm" asChild className="p-0 text-primary h-auto font-semibold">
                              <Link href={`/journals/${article.journalSlug}`}>
                                View Journal
                                <ArrowRight className="h-3.5 w-3.5 ml-1.5 inline" />
                              </Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 border border-dashed border-border rounded-3xl bg-muted/10">
                    <BookOpen className="h-10 w-10 mx-auto text-muted-foreground opacity-60 mb-3" />
                    <p className="text-muted-foreground text-sm font-semibold">No articles published under this topic yet.</p>
                  </div>
                )}
              </TabsContent>

              {/* Editors Tab */}
              <TabsContent value="editors" className="focus-visible:outline-none animate-in fade-in duration-300">
                {matchedEditors.length > 0 ? (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {matchedEditors.map((editor) => {
                      const initials = editor.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
                      return (
                        <Card key={editor.slug} className="border-border hover:border-primary/30 transition-all flex flex-col justify-between">
                          <CardHeader className="pb-3">
                            <div className="flex items-start gap-4">
                              {editor.imageUrl ? (
                                <img 
                                  src={editor.imageUrl} 
                                  alt={editor.name} 
                                  className="h-12 w-12 rounded-full object-cover object-top border border-border shrink-0"
                                />
                              ) : (
                                <div className="h-12 w-12 rounded-full bg-secondary text-secondary-foreground font-bold flex items-center justify-center shrink-0">
                                  {initials}
                                </div>
                              )}
                              <div className="min-w-0">
                                <CardTitle className="text-base font-bold leading-tight">{editor.name}</CardTitle>
                                <CardDescription className="text-xs font-semibold text-muted-foreground uppercase mt-0.5 tracking-wider">
                                  {editor.role}
                                </CardDescription>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="pt-0 space-y-4">
                            <div>
                              <p className="text-sm text-muted-foreground leading-snug">{editor.affiliation}</p>
                              <p className="text-xs text-primary font-medium mt-1 italic">{editor.specialization}</p>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {editor.expertise?.slice(0, 3).map(exp => (
                                <Badge key={exp} variant="outline" className={`text-[9px] px-1.5 py-0 ${
                                  slugify(exp) === params.slug ? "bg-primary/10 text-primary border-primary/20" : ""
                                }`}>
                                  {exp}
                                </Badge>
                              ))}
                            </div>
                            <Button variant="outline" size="sm" asChild className="w-full text-xs font-semibold border-border text-foreground hover:bg-primary hover:text-primary-foreground transition-all">
                              <Link href={`/editors/${editor.slug}`}>
                                View Editorial Profile
                              </Link>
                            </Button>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-16 border border-dashed border-border rounded-3xl bg-muted/10">
                    <User className="h-10 w-10 mx-auto text-muted-foreground opacity-60 mb-3" />
                    <p className="text-muted-foreground text-sm font-semibold">No editorial board members specializing in this topic yet.</p>
                  </div>
                )}
              </TabsContent>

            </Tabs>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  )
}
