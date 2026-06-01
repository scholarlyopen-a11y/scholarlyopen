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
  name: "Position open",
  role: "Editor-in-Chief",
  affiliation: "Under formation",
  specialization: "Currently appointing",
}

const placeholderAssociateEditors = [
  {
    name: "Position open",
    role: "Associate Editor",
    affiliation: "Under formation",
    specialization: "Currently appointing",
  },
  {
    name: "Position open",
    role: "Associate Editor",
    affiliation: "Under formation",
    specialization: "Currently appointing",
  },
  {
    name: "Position open",
    role: "Associate Editor",
    affiliation: "Under formation",
    specialization: "Currently appointing",
  },
]

const placeholderEditorialBoard = [
  {
    name: "Position open",
    role: "Board Member",
    affiliation: "Under formation",
    specialization: "Currently appointing",
  },
  {
    name: "Position open",
    role: "Board Member",
    affiliation: "Under formation",
    specialization: "Currently appointing",
  },
  {
    name: "Position open",
    role: "Board Member",
    affiliation: "Under formation",
    specialization: "Currently appointing",
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

  const brandThemes: Record<string, { bgColor: string; border: string; text: string; subtext: string; buttonOutline: string; iconBg: string; badge: string }> = {
    "biology": {
      bgColor: "#D0DEC0", // pale green (olive shade)
      border: "border-[#BDCEAA]",
      text: "text-emerald-950",
      subtext: "text-emerald-900/80",
      buttonOutline: "border-emerald-300 bg-emerald-100/30 text-emerald-900 hover:bg-emerald-100/60",
      iconBg: "bg-emerald-950/10 text-emerald-900",
      badge: "bg-emerald-900/10 text-emerald-900 border-emerald-900/25 shadow-none hover:bg-emerald-900/20"
    },
    "chemistry": {
      bgColor: "#FFF7C2", // gorgeous light banana/mango pastel yellow
      border: "border-[#F5DE88]",
      text: "text-amber-950",
      subtext: "text-amber-900/80",
      buttonOutline: "border-amber-400 bg-amber-100/30 text-amber-950 hover:bg-amber-100/60",
      iconBg: "bg-amber-950/10 text-amber-900",
      badge: "bg-amber-900/10 text-amber-900 border-amber-950/20 shadow-none hover:bg-amber-900/20"
    },
    "medicine": {
      bgColor: "#FFEBEB", // very light red
      border: "border-[#FAD2D2]",
      text: "text-rose-950",
      subtext: "text-rose-900/80",
      buttonOutline: "border-rose-300 bg-rose-100/30 text-rose-900 hover:bg-rose-100/60",
      iconBg: "bg-rose-900/10 text-rose-800",
      badge: "bg-rose-900/10 text-rose-900 border-rose-900/25 shadow-none hover:bg-rose-900/20"
    },
    "applied-health-sciences": {
      bgColor: "#FFEBEB",
      border: "border-[#FAD2D2]",
      text: "text-rose-950",
      subtext: "text-rose-900/80",
      buttonOutline: "border-rose-300 bg-rose-100/30 text-rose-900 hover:bg-rose-100/60",
      iconBg: "bg-rose-900/10 text-rose-800",
      badge: "bg-rose-900/10 text-rose-900 border-rose-900/25 shadow-none hover:bg-rose-900/20"
    },
    "medical-research-review": {
      bgColor: "#FFEBEB",
      border: "border-[#FAD2D2]",
      text: "text-rose-950",
      subtext: "text-rose-900/80",
      buttonOutline: "border-rose-300 bg-rose-100/30 text-rose-900 hover:bg-rose-100/60",
      iconBg: "bg-rose-900/10 text-rose-800",
      badge: "bg-rose-900/10 text-rose-900 border-rose-900/25 shadow-none hover:bg-rose-900/20"
    },
    "data-science": {
      bgColor: "#E0F2FE", // stunning light sky or sea blue
      border: "border-[#BAE6FD]",
      text: "text-blue-950",
      subtext: "text-blue-900/80",
      buttonOutline: "border-blue-300 bg-blue-100/30 text-blue-900 hover:bg-blue-100/60",
      iconBg: "bg-blue-950/10 text-blue-900",
      badge: "bg-blue-900/10 text-blue-900 border-blue-900/25 shadow-none hover:bg-blue-900/20"
    },
    "engineering": {
      bgColor: "#F3F4F6", // very light grey
      border: "border-slate-200",
      text: "text-slate-900",
      subtext: "text-slate-600",
      buttonOutline: "border-slate-300 bg-slate-100/50 text-slate-700 hover:bg-slate-100 hover:text-slate-900",
      iconBg: "bg-slate-900/10 text-slate-800",
      badge: "bg-slate-950/10 text-slate-950 border-slate-900/15 shadow-none hover:bg-slate-950/20"
    },
    "environmental-science": {
      bgColor: "#F5FCD2", // distinct lime-greenish yellow
      border: "border-[#E1ECA9]",
      text: "text-lime-950",
      subtext: "text-lime-900/80",
      buttonOutline: "border-lime-300 bg-lime-100/30 text-lime-900 hover:bg-lime-100/60",
      iconBg: "bg-lime-950/10 text-lime-900",
      badge: "bg-lime-900/10 text-lime-900 border-[#C5D37E]/25 shadow-none hover:bg-lime-900/20"
    },
    "social-sciences": {
      bgColor: "#F5E6CC", // light brown (caramel)
      border: "border-[#EEDCB8]",
      text: "text-amber-950",
      subtext: "text-amber-900/80",
      buttonOutline: "border-amber-300 bg-amber-100/30 text-amber-900 hover:bg-amber-100/60",
      iconBg: "bg-amber-900/10 text-amber-800",
      badge: "bg-amber-900/10 text-amber-900 border-amber-900/25 shadow-none hover:bg-amber-900/20"
    },
    "social-sciences-open": {
      bgColor: "#F5E6CC",
      border: "border-[#EEDCB8]",
      text: "text-amber-950",
      subtext: "text-amber-900/80",
      buttonOutline: "border-amber-300 bg-amber-100/30 text-amber-900 hover:bg-amber-100/60",
      iconBg: "bg-amber-900/10 text-amber-800",
      badge: "bg-amber-900/10 text-amber-900 border-amber-900/25 shadow-none hover:bg-amber-900/20"
    },
    "archaeological-frontiers": {
      bgColor: "#F5E6CC",
      border: "border-[#EEDCB8]",
      text: "text-amber-950",
      subtext: "text-amber-900/80",
      buttonOutline: "border-amber-300 bg-amber-100/30 text-amber-900 hover:bg-amber-100/60",
      iconBg: "bg-amber-900/10 text-amber-800",
      badge: "bg-amber-900/10 text-amber-900 border-amber-900/25 shadow-none hover:bg-amber-900/20"
    },
  }

  const defaultTheme = {
    bgColor: "#F8FAFC",
    border: "border-slate-200",
    text: "text-slate-900",
    subtext: "text-slate-600",
    buttonOutline: "border-slate-300 bg-slate-100/50 text-slate-700 hover:bg-slate-100 hover:text-slate-900",
    iconBg: "bg-slate-900/10 text-slate-800",
    badge: "bg-slate-950/10 text-slate-950 border-slate-900/15 shadow-none hover:bg-slate-950/20"
  }

  const theme = brandThemes["biology"]
  const currentBrandTheme = brandThemes[journalSlug] || defaultTheme

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
        {/* Dynamic Branded Header */}
        <section 
          className={`relative overflow-hidden ${theme.text} border-b ${theme.border}`}
          style={{ backgroundColor: theme.bgColor }}
        >
          <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8 lg:py-24">
            <div className="mb-6 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <h1 className="max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl text-balance">{title}</h1>
              <div className="flex w-fit shrink-0 items-center gap-3 rounded-2xl bg-black/5 px-4 py-3 ring-1 ring-black/10 backdrop-blur-sm">
                <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${currentBrandTheme.iconBg}`}>
                  {heroIcon}
                </div>
                <div className="min-w-0">
                  <Badge className="bg-accent text-accent-foreground border-0 font-bold shadow-none">Gold OA</Badge>
                  <div className={`mt-2 whitespace-nowrap text-sm ${theme.subtext}`}>ISSN: requested</div>
                </div>
              </div>
            </div>
            <p className={`mt-6 text-xl max-w-3xl leading-relaxed ${theme.subtext}`}>{heroDescription}</p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold shadow-md shadow-accent/15">
                <Link href="/submit">
                  {t("cta.submit")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className={`transition-all duration-300 ${theme.buttonOutline}`}>
                <Link href="/author-guidelines">{t("cta.guidelines")}</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Stats Section */}
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

        {/* Content Section with Tabs */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <Tabs defaultValue="about" className="space-y-8">
              <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
                <TabsTrigger value="about">{t("nav.about")}</TabsTrigger>
                <TabsTrigger value="articles">{t("articles.title")}</TabsTrigger>
                <TabsTrigger value="editorial">{t("nav.editorialBoard")}</TabsTrigger>
                <TabsTrigger value="submit">{t("nav.submitManuscript")}</TabsTrigger>
              </TabsList>

              <TabsContent value="about" className="space-y-12">
                <div className="grid gap-12 lg:grid-cols-2">
                  <div>
                    <h2 className="text-3xl font-bold tracking-tight mb-6">{t("journal.about")}</h2>
                    <div className="prose prose-lg text-muted-foreground">
                      <p>{description}</p>
                      <p>
                        {t("journal.aboutText")}
                      </p>
                    </div>
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold tracking-tight mb-6">{t("journal.scope")}</h2>
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
                  <h3 className="text-xl font-semibold mb-6">{t("journal.sections")}</h3>
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
                  <h2 className="text-3xl font-bold tracking-tight mb-4">{t("journal.submitTo")} {title}</h2>
                  <p className="text-muted-foreground mb-6">
                    {t("journal.submitText")}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button size="lg" asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
                      <Link href="/submit">{t("journal.startSubmission")}</Link>
                    </Button>
                    <Button size="lg" variant="outline" asChild className="border-primary/20 bg-background text-foreground hover:bg-primary/10 hover:text-foreground">
                      <Link href="/author-guidelines">{t("cta.guidelines")}</Link>
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
