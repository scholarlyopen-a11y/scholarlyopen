"use client"

import Link from "next/link"
import { type ReactNode } from "react"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ArticleList, type Article } from "@/components/article-card"
import { JournalEditorialBoard, type EditorMember } from "@/components/journal-editorial-board"
import { useLanguage } from "@/lib/language-context"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

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
  editorInChief?: EditorMember
  associateEditors?: EditorMember[]
  editorialBoard?: EditorMember[]
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
  editorInChief = placeholderEditorInChief,
  associateEditors = placeholderAssociateEditors,
  editorialBoard = placeholderEditorialBoard,
}: JournalPageProps) {
  const { t } = useLanguage()

  const brandThemes: Record<string, { bgColor: string; border: string; text: string; subtext: string; buttonOutline: string; iconBg: string; badge: string }> = {
    "biology": {
      bgColor: "#D0DEC0", // pale green (olive shade)
      border: "border-[#BDCEAA]",
      text: "text-emerald-950",
      subtext: "text-emerald-900/80",
      buttonOutline: "border-emerald-300 bg-emerald-100/30 text-emerald-900 hover:bg-emerald-100/60",
      iconBg: "bg-green-500/10 text-green-600",
      badge: "bg-emerald-900/10 text-emerald-900 border-emerald-900/25 shadow-none hover:bg-emerald-900/20"
    },
    "chemistry": {
      bgColor: "#FFF7C2", // gorgeous light banana/mango pastel yellow
      border: "border-[#F5DE88]",
      text: "text-amber-950",
      subtext: "text-amber-900/80",
      buttonOutline: "border-amber-400 bg-amber-100/30 text-amber-950 hover:bg-amber-100/60",
      iconBg: "bg-yellow-500/10 text-yellow-600",
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
    "social-sciences-humanities": {
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
    "clinical-ai": {
      bgColor: "#EEF2FF", // very light indigo
      border: "border-[#C7D2FE]",
      text: "text-indigo-950",
      subtext: "text-indigo-900/80",
      buttonOutline: "border-indigo-300 bg-indigo-100/30 text-indigo-900 hover:bg-indigo-100/60",
      iconBg: "bg-indigo-500/10 text-indigo-600",
      badge: "bg-indigo-900/10 text-indigo-900 border-indigo-900/25 shadow-none hover:bg-indigo-900/20"
    },
    "ai-safety": {
      bgColor: "#F5F3FF", // very light purple
      border: "border-[#DDD6FE]",
      text: "text-purple-950",
      subtext: "text-purple-900/80",
      buttonOutline: "border-purple-300 bg-purple-100/30 text-purple-900 hover:bg-purple-100/60",
      iconBg: "bg-purple-500/10 text-purple-600",
      badge: "bg-purple-900/10 text-purple-900 border-purple-900/25 shadow-none hover:bg-purple-900/20"
    },
    "decarbonization": {
      bgColor: "#F0FDFA", // very light teal
      border: "border-[#CCFBF1]",
      text: "text-teal-950",
      subtext: "text-teal-900/80",
      buttonOutline: "border-teal-300 bg-teal-100/30 text-teal-900 hover:bg-teal-100/60",
      iconBg: "bg-teal-500/10 text-teal-600",
      badge: "bg-teal-900/10 text-teal-900 border-teal-900/25 shadow-none hover:bg-teal-900/20"
    },
    "quantum-engineering": {
      bgColor: "#ECFEFF", // very light cyan
      border: "border-[#CFFAFE]",
      text: "text-cyan-950",
      subtext: "text-cyan-900/80",
      buttonOutline: "border-cyan-300 bg-cyan-100/30 text-cyan-900 hover:bg-cyan-100/60",
      iconBg: "bg-cyan-500/10 text-cyan-600",
      badge: "bg-cyan-900/10 text-cyan-900 border-cyan-900/25 shadow-none hover:bg-cyan-900/20"
    },
    "synthetic-biology": {
      bgColor: "#F0FDF4", // very light emerald
      border: "border-[#DCFCE7]",
      text: "text-emerald-950",
      subtext: "text-emerald-900/80",
      buttonOutline: "border-emerald-300 bg-emerald-100/30 text-emerald-900 hover:bg-emerald-100/60",
      iconBg: "bg-emerald-500/10 text-emerald-600",
      badge: "bg-emerald-900/10 text-emerald-900 border-emerald-900/25 shadow-none hover:bg-emerald-900/20"
    },
    "space-resources": {
      bgColor: "#F0F9FF", // very light sky blue
      border: "border-[#E0F2FE]",
      text: "text-sky-950",
      subtext: "text-sky-900/80",
      buttonOutline: "border-sky-300 bg-sky-100/30 text-sky-900 hover:bg-sky-100/60",
      iconBg: "bg-sky-500/10 text-sky-600",
      badge: "bg-sky-900/10 text-sky-900 border-sky-900/25 shadow-none hover:bg-sky-900/20"
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

  const currentBrandTheme = brandThemes[journalSlug] || defaultTheme

  const stats = [
    { label: "Average Review Time", value: "4-8 weeks" },
    { label: "Acceptance Rate", value: "~30%" },
    { label: "Publishing Model", value: "Gold OA" },
    { label: "License", value: "CC BY 4.0" },
  ]

  // Parse title to extract prefix and actual journal name for cleaner rendering
  let subtitle = "Scholarly Open"
  let mainTitle = title

  if (title.startsWith("Scholarly Open: ")) {
    mainTitle = title.substring("Scholarly Open: ".length)
  } else if (title.startsWith("Scholarly Open Journal of ")) {
    mainTitle = "Journal of " + title.substring("Scholarly Open Journal of ".length)
  } else if (title.startsWith("Scholarly Open ")) {
    mainTitle = title.substring("Scholarly Open ".length)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Dynamic Branded Header - Styled in Pista Green (Biology Theme) */}
        <section 
          className={`relative overflow-hidden ${brandThemes['biology'].text} border-b ${brandThemes['biology'].border}`}
          style={{ backgroundColor: brandThemes['biology'].bgColor }}
        >
          <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8 lg:py-24">
            <div className="mb-6 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-4xl flex flex-col gap-1">
                {subtitle && (
                  <span className={`text-xs font-bold uppercase tracking-widest ${brandThemes['biology'].subtext} opacity-85`}>
                    {subtitle}
                  </span>
                )}
                <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl text-balance leading-tight">
                  {mainTitle}
                </h1>
              </div>
              <div className="flex w-fit shrink-0 items-center gap-3 rounded-2xl bg-black/5 px-4 py-3 ring-1 ring-black/10 backdrop-blur-sm">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                  {heroIcon}
                </div>
                <div className="min-w-0">
                  <Badge className="bg-accent text-accent-foreground border-0 font-bold shadow-none">Gold OA</Badge>
                  <div className={`mt-2 whitespace-nowrap text-sm ${brandThemes['biology'].subtext}`}>ISSN: requested</div>
                </div>
              </div>
            </div>
            <p className={`mt-6 text-xl max-w-3xl leading-relaxed ${brandThemes['biology'].subtext}`}>{heroDescription}</p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Button size="lg" variant="accent" asChild className="font-semibold shadow-md shadow-accent/15">
                <Link href="/submit">
                  {t("cta.submit")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300">
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

        {/* Tabbed Layout Container */}
        <section className="py-12 lg:py-16">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <Tabs defaultValue="about" className="w-full">
              <div className="flex justify-center border-b border-border pb-6 mb-8">
                <TabsList className="grid grid-cols-2 md:grid-cols-4 bg-muted/80 p-1.5 rounded-xl gap-2 h-auto w-full max-w-3xl">
                  <TabsTrigger 
                    value="about" 
                    className="h-11 md:h-9 py-2 px-1 rounded-lg text-xs sm:text-sm font-semibold transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md hover:bg-muted-foreground/5 text-center leading-tight whitespace-normal md:whitespace-nowrap"
                  >
                    {t("nav.aimsScope")}
                  </TabsTrigger>
                  <TabsTrigger 
                    value="articles" 
                    className="h-11 md:h-9 py-2 px-1 rounded-lg text-xs sm:text-sm font-semibold transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md hover:bg-muted-foreground/5 text-center leading-tight whitespace-normal md:whitespace-nowrap"
                  >
                    {t("articles.title")}
                  </TabsTrigger>
                  <TabsTrigger 
                    value="editorial" 
                    className="h-11 md:h-9 py-2 px-1 rounded-lg text-xs sm:text-sm font-semibold transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md hover:bg-muted-foreground/5 text-center leading-tight whitespace-normal md:whitespace-nowrap"
                  >
                    {t("nav.editorialBoard")}
                  </TabsTrigger>
                  <TabsTrigger 
                    value="submit" 
                    className="h-11 md:h-9 py-2 px-1 rounded-lg text-xs sm:text-sm font-semibold transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md hover:bg-muted-foreground/5 text-center leading-tight whitespace-normal md:whitespace-nowrap"
                  >
                    {t("nav.submitManuscript")}
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* About & Scope Content */}
              <TabsContent value="about" className="space-y-16 focus-visible:outline-none animate-in fade-in duration-300">
                {/* About Section */}
                <div className="space-y-8">
                  <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-6">{t("journal.about")}</h2>
                    <div className="prose prose-lg text-muted-foreground max-w-none space-y-4">
                      <p>{description}</p>
                      <p>{t("journal.aboutText")}</p>
                    </div>
                  </div>
                  
                  {/* Highlights Grid */}
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
                </div>

                {/* Scope & Sections */}
                <div className="pt-12 border-t border-border space-y-10">
                  <div className="grid gap-12 lg:grid-cols-2">
                    <div>
                      <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-6">{t("journal.scope")}</h2>
                      <ul className="grid gap-3">
                        {scopeAreas.map((area) => (
                          <li key={area} className="flex items-center gap-3">
                            <span className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-semibold shrink-0">•</span>
                            <span className="text-muted-foreground">{area}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-6">{t("journal.sections")}</h3>
                      <div className="flex flex-wrap gap-2.5">
                        {sectionTopics.map((topic) => (
                          <Badge 
                            key={topic} 
                            variant="secondary" 
                            className="bg-slate-100/80 hover:bg-slate-200/80 dark:bg-slate-800/80 dark:hover:bg-slate-700/80 text-slate-800 dark:text-slate-200 text-sm font-medium px-4 py-2 rounded-full border border-slate-200/50 dark:border-slate-700/50 shadow-sm transition-all duration-300 hover:scale-[1.02] cursor-default"
                          >
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Articles Content */}
              <TabsContent value="articles" className="focus-visible:outline-none animate-in fade-in duration-300">
                <div className="space-y-8">
                  <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-2">{t("articles.title")}</h2>
                    <p className="text-muted-foreground mb-6">Explore the latest high-impact peer-reviewed research articles published open-access in this journal.</p>
                  </div>
                  <ArticleList articles={sampleArticles} journalSlug={journalSlug} />
                </div>
              </TabsContent>

              {/* Editorial Board Content */}
              <TabsContent value="editorial" className="focus-visible:outline-none animate-in fade-in duration-300">
                <div className="space-y-8">
                  <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-2">{t("nav.editorialBoard")}</h2>
                    <p className="text-muted-foreground mb-6">Our distinguished editorial board members are leading experts in their fields, overseeing our rigorous peer review and ensuring high publication standards.</p>
                  </div>
                  <JournalEditorialBoard
                    editorInChief={editorInChief}
                    associateEditors={associateEditors}
                    editorialBoard={editorialBoard}
                  />
                </div>
              </TabsContent>

              {/* Submit Content */}
              <TabsContent value="submit" className="focus-visible:outline-none animate-in fade-in duration-300">
                <div className="rounded-3xl border border-border bg-muted/40 p-8 lg:p-12">
                  <h2 className="text-3xl font-bold tracking-tight mb-4">{t("journal.submitTo")} {mainTitle}</h2>
                  <p className="text-muted-foreground text-lg mb-8 max-w-2xl">
                    {t("journal.submitText")}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button size="lg" variant="accent" asChild className="font-semibold shadow-md shadow-accent/15">
                      <Link href="/submit">{t("journal.startSubmission")}</Link>
                    </Button>
                    <Button size="lg" variant="outline" asChild className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300">
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
