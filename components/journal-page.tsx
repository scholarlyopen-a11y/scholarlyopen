"use client"

import Link from "next/link"
import { type ReactNode } from "react"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ArticleList, type Article } from "@/components/article-card"
import { JournalEditorialBoard } from "@/components/journal-editorial-board"
import { useLanguage } from "@/lib/language-context"

interface JournalPageProps {
  title: string
  description: string
  heroDescription: string
  heroIcon: ReactNode
  scopeAreas: string[]
  sectionTopics: string[]
  sampleArticles: Article[]
  journalSlug: string
  mainHighlights: { title: string; description: string }[]
}

const placeholderEditorInChief = {
  name: "To be recruited",
  role: "Editor-in-Chief",
  affiliation: "Under formation",
  specialization: "Editorial leadership",
}

const placeholderAssociateEditors = [
  {
    name: "To be recruited",
    role: "Associate Editor",
    affiliation: "Under formation",
    specialization: "Editorial development",
  },
  {
    name: "To be recruited",
    role: "Associate Editor",
    affiliation: "Under formation",
    specialization: "Editorial development",
  },
  {
    name: "To be recruited",
    role: "Associate Editor",
    affiliation: "Under formation",
    specialization: "Editorial development",
  },
]

const placeholderEditorialBoard = [
  {
    name: "Under formation",
    role: "Board Member",
    affiliation: "Under formation",
    specialization: "To be recruited",
  },
  {
    name: "Under formation",
    role: "Board Member",
    affiliation: "Under formation",
    specialization: "To be recruited",
  },
  {
    name: "Under formation",
    role: "Board Member",
    affiliation: "Under formation",
    specialization: "To be recruited",
  },
]

export function JournalPage({
  title,
  description,
  heroDescription,
  heroIcon,
  scopeAreas,
  sectionTopics,
  sampleArticles,
  journalSlug,
  mainHighlights,
}: JournalPageProps) {
  const { t } = useLanguage()

  const stats = [
    { label: "Average Review Time", value: "4-8 weeks" },
    { label: "Acceptance Rate", value: "~30%" },
    { label: "Publishing Model", value: "Gold OA" },
    { label: "License", value: "CC BY 4.0" },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-secondary text-secondary-foreground">
          <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8 lg:py-24">
            <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary-foreground/15">
                {heroIcon}
              </div>
              <div>
                <Badge className="bg-accent text-accent-foreground border-0">Gold OA</Badge>
                <div className="mt-2 text-sm text-muted-foreground">ISSN: requested</div>
              </div>
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-balance">{title}</h1>
            <p className="mt-6 text-xl text-secondary-foreground/80 max-w-3xl leading-relaxed">{heroDescription}</p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <Link href="/submit">
                  Submit Manuscript
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-primary/20 bg-background text-foreground hover:bg-primary/10 hover:text-foreground">
                <Link href="/author-guidelines">Author Guidelines</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="border-b border-border bg-muted/50">
          <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl font-bold text-primary lg:text-3xl">{stat.value}</div>
                  <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <Tabs defaultValue="about" className="space-y-8">
              <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="articles">{t("articles.title")}</TabsTrigger>
                <TabsTrigger value="editorial">{t("nav.editorialBoard")}</TabsTrigger>
                <TabsTrigger value="submit">Submit</TabsTrigger>
              </TabsList>

              <TabsContent value="about" className="space-y-12">
                <div className="grid gap-12 lg:grid-cols-2">
                  <div>
                    <h2 className="text-3xl font-bold tracking-tight mb-6">About the Journal</h2>
                    <div className="prose prose-lg text-muted-foreground">
                      <p>{description}</p>
                      <p>
                        Scholarly Open publishes highly relevant and FAIR-aligned research across our journals. We focus on transparent processes, rapid dissemination, and strong author support.
                      </p>
                    </div>
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold tracking-tight mb-6">Scope & Coverage</h2>
                    <ul className="grid gap-3">
                      {scopeAreas.map((area) => (
                        <li key={area} className="flex items-center gap-3">
                          <span className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-semibold">•</span>
                          <span className="text-muted-foreground">{area}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-12">
                  <h3 className="text-xl font-semibold mb-6">Journal Sections</h3>
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {sectionTopics.map((topic) => (
                      <Card key={topic} className="border-border">
                        <CardContent className="text-sm text-muted-foreground">{topic}</CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {mainHighlights.map((highlight) => (
                    <Card key={highlight.title} className="border-border">
                      <CardHeader>
                        <CardTitle className="text-lg">{highlight.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription>{highlight.description}</CardDescription>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="articles" className="space-y-12">
                <ArticleList articles={sampleArticles} journalSlug={journalSlug} />
              </TabsContent>

              <TabsContent value="editorial" className="space-y-12">
                <JournalEditorialBoard
                  editorInChief={placeholderEditorInChief}
                  associateEditors={placeholderAssociateEditors}
                  editorialBoard={placeholderEditorialBoard}
                />
              </TabsContent>

              <TabsContent value="submit" className="space-y-12">
                <div className="rounded-3xl border border-border bg-muted/50 p-8">
                  <h2 className="text-3xl font-bold tracking-tight mb-4">Submit to {title}</h2>
                  <p className="text-muted-foreground mb-6">
                    Please review our author guidelines and prepare your manuscript according to our submission requirements. We welcome original research, reviews, and methodological contributions that support FAIR scholarship.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button size="lg" asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
                      <Link href="/submit">Start Submission</Link>
                    </Button>
                    <Button size="lg" variant="outline" asChild className="border-primary/20 bg-background text-foreground hover:bg-primary/10 hover:text-foreground">
                      <Link href="/author-guidelines">Author Guidelines</Link>
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
