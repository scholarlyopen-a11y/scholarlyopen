"use client"

import Link from "next/link"
import { useState, useEffect, type ReactNode } from "react"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ArticleList, type Article } from "@/components/article-card"
import { JournalEditorialBoard, type EditorMember } from "@/components/journal-editorial-board"
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

  const [currentEiC, setCurrentEiC] = useState<EditorMember>(editorInChief || placeholderEditorInChief)
  const [currentAssociateEditors, setCurrentAssociateEditors] = useState<EditorMember[]>(
    associateEditors && associateEditors.length > 0 ? associateEditors : placeholderAssociateEditors
  )
  const [currentEditorialBoard, setCurrentEditorialBoard] = useState<EditorMember[]>(
    editorialBoard && editorialBoard.length > 0 ? editorialBoard : placeholderEditorialBoard
  )

  useEffect(() => {
    setCurrentEiC(editorInChief || placeholderEditorInChief)
  }, [editorInChief])

  useEffect(() => {
    setCurrentAssociateEditors(
      associateEditors && associateEditors.length > 0 ? associateEditors : placeholderAssociateEditors
    )
  }, [associateEditors])

  useEffect(() => {
    setCurrentEditorialBoard(
      editorialBoard && editorialBoard.length > 0 ? editorialBoard : placeholderEditorialBoard
    )
  }, [editorialBoard])

  // Real-time synchronization: Fetch approved editorial board members from live API
  useEffect(() => {
    let isMounted = true
    async function syncLiveApprovedEditors() {
      try {
        const res = await fetch(`/api/editorial360/editors?journal=${encodeURIComponent(journalSlug)}&t=${Date.now()}`)
        if (!res.ok) return
        const data = await res.json()
        if (!isMounted || !data.success || !Array.isArray(data.editors)) return

        const approved = data.editors.filter((e: any) => e.jmApproved === true)
        if (approved.length === 0) return

        // 1. Live Editor-in-Chief
        const liveEiC = approved.find((e: any) => e.role?.toLowerCase().includes("chief"))
        if (liveEiC) {
          const cleanSlug = (liveEiC.name || "editor")
            .toLowerCase()
            .replace(/^prof\.\s*|^dr\.\s*|^assoc\.\s*prof\.\s*/i, "")
            .replace(/,\s*(ph\.?d\.?|m\.?d\.?|d\.?sc\.?|eng\.?d\.?)/i, "")
            .trim()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "")
          const defaultPhoto = cleanSlug.includes("verpoort") ? "/images/editors/francis-verpoort.png" : (liveEiC.photoUrl || undefined)
          const officialEmail = (journalSlug === "chemistry" || cleanSlug.includes("verpoort")) 
            ? "editor.chem@scholarlyopen.org" 
            : (liveEiC.email?.endsWith("@scholarlyopen.org") ? liveEiC.email : `editor.${journalSlug}@scholarlyopen.org`)

          setCurrentEiC({
            slug: cleanSlug,
            name: liveEiC.name,
            role: liveEiC.role || "Editor-in-Chief",
            affiliation: liveEiC.affiliation || "Academic Institution",
            specialization: liveEiC.specialization || (Array.isArray(liveEiC.researchInterests) ? liveEiC.researchInterests.join(", ") : "Academic Research & Peer Review"),
            imageUrl: defaultPhoto,
            email: officialEmail,
            orcid: liveEiC.orcid,
            scopusId: liveEiC.scopusId || (cleanSlug.includes("verpoort") ? "7004225244" : undefined),
            googleScholar: liveEiC.googleScholar || liveEiC.scholarUrl,
            linkedin: liveEiC.linkedin,
            researchGate: liveEiC.researchGate,
            biography: liveEiC.biography,
            editorialRoles: liveEiC.editorialRoles || (cleanSlug.includes("verpoort") ? [
              "Editor-in-Chief, Chemistry Africa (Springer-Nature)",
              "Editor-in-Chief, Nanocatalysis (Frontiers)",
              "Editor, Applied Organometallic Chemistry (Wiley)",
              "Editor, Frontiers in Chemistry",
              "Editorial Board, Inorganics (MDPI)",
              "Editorial Board, Catalysts (MDPI)",
              "Editorial Board, Molecules (MDPI)",
              "Editorial Board, Applied Sciences (MDPI)",
              "Editorial Board, Advances in Materials Research"
            ] : undefined),
            honors: liveEiC.honors || (cleanSlug.includes("verpoort") ? [
              "Academician of the European Academy of Sciences and Arts (EASA)",
              "Academician of the Russian Academy of Natural Sciences (RNAS)",
              "Academician of the Mexican Academy of Sciences (AMC)",
              "National Distinguished Expert, PR China",
              "Officer of the Order of Leopold II by King Albert II of Belgium",
              "Fellow of the Royal Society of Chemistry (FRSC)",
              "Fellow of the Indian Chemical Society (FICS)",
              "Fellow of the Royal Society of Arts (FRSA)",
              "Dr. Basudev Banerjee Memorial Award (Indian Chemical Society)",
              "\"Chime\" Award from Hubei Province, China",
              "Director General, World Industrial Technology Organization (WITO)",
              "Jury Chair, International Expert Council of the Palladium Global Science Award (2025)",
              "Top 2% Scientist, Stanford University (5 consecutive years)",
              "Elsevier China Highly Cited Researcher (2024)"
            ] : undefined),
            expertise: Array.isArray(liveEiC.researchInterests) ? liveEiC.researchInterests : []
          })
        }

        // 2. Live Associate Editors
        const liveAEs = approved.filter((e: any) => e.role?.toLowerCase().includes("associate"))
        if (liveAEs.length > 0) {
          const mappedAEs: EditorMember[] = liveAEs.map((e: any) => ({
            name: e.name,
            role: e.role || "Associate Editor",
            affiliation: e.affiliation || "Academic Institution",
            specialization: e.specialization || (Array.isArray(e.researchInterests) ? e.researchInterests.join(", ") : "Academic Research & Peer Review"),
            imageUrl: liveEiC && liveEiC.email === e.email ? liveEiC.photoUrl : e.photoUrl,
            email: e.email,
            orcid: e.orcid,
            googleScholar: e.googleScholar || e.scholarUrl,
            linkedin: e.linkedin,
            researchGate: e.researchGate,
            biography: e.biography,
            expertise: Array.isArray(e.researchInterests) ? e.researchInterests : []
          }))
          setCurrentAssociateEditors(prev => {
            const combined = [...mappedAEs]
            for (const existing of prev) {
              if (existing.name !== "Position open" && !combined.some(c => c.name.toLowerCase() === existing.name.toLowerCase())) {
                combined.push(existing)
              }
            }
            return combined
          })
        }

        // 3. Live Editorial Board Members
        const liveBoard = approved.filter((e: any) => !e.role?.toLowerCase().includes("chief") && !e.role?.toLowerCase().includes("associate"))
        if (liveBoard.length > 0) {
          const mappedBoard: EditorMember[] = liveBoard.map((e: any) => ({
            name: e.name,
            role: e.role || "Editorial Board Member",
            affiliation: e.affiliation || "Academic Institution",
            specialization: e.specialization || (Array.isArray(e.researchInterests) ? e.researchInterests.join(", ") : "Academic Research & Peer Review"),
            imageUrl: e.photoUrl,
            email: e.email,
            orcid: e.orcid,
            googleScholar: e.googleScholar || e.scholarUrl,
            linkedin: e.linkedin,
            researchGate: e.researchGate,
            biography: e.biography,
            expertise: Array.isArray(e.researchInterests) ? e.researchInterests : []
          }))
          setCurrentEditorialBoard(prev => {
            const combined = [...mappedBoard]
            for (const existing of prev) {
              if (existing.name !== "Position open" && !combined.some(c => c.name.toLowerCase() === existing.name.toLowerCase())) {
                combined.push(existing)
              }
            }
            return combined
          })
        }
      } catch (err) {
        console.warn("Could not sync live approved editors:", err)
      }
    }

    syncLiveApprovedEditors()
    return () => { isMounted = false }
  }, [journalSlug])

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
    "clinical-ai-digital-health": {
      bgColor: "#EEF2FF", // very light indigo
      border: "border-[#C7D2FE]",
      text: "text-indigo-950",
      subtext: "text-indigo-900/80",
      buttonOutline: "border-indigo-300 bg-indigo-100/30 text-indigo-900 hover:bg-indigo-100/60",
      iconBg: "bg-indigo-500/10 text-indigo-600",
      badge: "bg-indigo-900/10 text-indigo-900 border-indigo-900/25 shadow-none hover:bg-indigo-900/20"
    },
    "ai-safety-governance": {
      bgColor: "#F5F3FF", // very light purple
      border: "border-[#DDD6FE]",
      text: "text-purple-950",
      subtext: "text-purple-900/80",
      buttonOutline: "border-purple-300 bg-purple-100/30 text-purple-900 hover:bg-purple-100/60",
      iconBg: "bg-purple-500/10 text-purple-600",
      badge: "bg-purple-900/10 text-purple-900 border-purple-900/25 shadow-none hover:bg-purple-900/20"
    },
    "decarbonization-carbon-tech": {
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
    "synthetic-biology-bio-design": {
      bgColor: "#F0FDF4", // very light emerald
      border: "border-[#DCFCE7]",
      text: "text-emerald-950",
      subtext: "text-emerald-900/80",
      buttonOutline: "border-emerald-300 bg-emerald-100/30 text-emerald-900 hover:bg-emerald-100/60",
      iconBg: "bg-emerald-500/10 text-emerald-600",
      badge: "bg-emerald-900/10 text-emerald-900 border-emerald-900/25 shadow-none hover:bg-emerald-900/20"
    },
    "space-resources-orbital-economy": {
      bgColor: "#F0F9FF", // very light sky blue
      border: "border-[#E0F2FE]",
      text: "text-sky-950",
      subtext: "text-sky-900/80",
      buttonOutline: "border-sky-300 bg-sky-100/30 text-sky-900 hover:bg-sky-100/60",
      iconBg: "bg-sky-500/10 text-sky-600",
      badge: "bg-sky-900/10 text-sky-900 border-sky-900/25 shadow-none hover:bg-sky-900/20"
    },
  }

  // Universal authentic pista green theme for all Scholarly Open journals
  const pistaTheme = {
    bgColor: "#D0DEC0", // authentic pista green shade
    border: "border-[#BDCEAA]",
    text: "text-emerald-950",
    subtext: "text-emerald-900/80",
    buttonOutline: "border-emerald-300 bg-emerald-100/30 text-emerald-900 hover:bg-emerald-100/60",
    iconBg: "bg-green-500/10 text-green-600",
    badge: "bg-emerald-900/10 text-emerald-900 border-emerald-900/25 shadow-none hover:bg-emerald-900/20"
  }

  const currentBrandTheme = pistaTheme

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
        {/* Dynamic Branded Header - Styled in correct custom brand colors */}
        <section 
          className={`relative overflow-hidden ${currentBrandTheme.text} border-b ${currentBrandTheme.border}`}
          style={{ backgroundColor: currentBrandTheme.bgColor }}
        >
          <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8 lg:py-24">
            <div className="mb-6 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-4xl flex flex-col gap-1">
                {subtitle && (
                  <span className={`text-xs font-bold uppercase tracking-widest ${currentBrandTheme.subtext} opacity-85`}>
                    {subtitle}
                  </span>
                )}
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl text-balance leading-tight">
                  {mainTitle}
                </h1>
              </div>
              <div className="flex w-fit shrink-0 items-center gap-3 rounded-2xl bg-black/5 px-4 py-3 ring-1 ring-black/10 backdrop-blur-sm">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                  {heroIcon}
                </div>
                <div className="min-w-0">
                  <Badge className="bg-accent text-accent-foreground border-0 font-bold shadow-none">Gold OA</Badge>
                  <div className={`mt-2 whitespace-nowrap text-sm ${currentBrandTheme.subtext}`}>ISSN: requested</div>
                </div>
              </div>
            </div>
            <p className={`mt-2 text-base sm:text-lg max-w-3xl leading-relaxed ${currentBrandTheme.subtext}`}>{heroDescription}</p>
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

        {/* Main Content Layout - Scrollable Sections */}
        <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8 space-y-24">
          
          {/* Section 1: Aims & Scope */}
          <section className="space-y-12 animate-in fade-in duration-300">
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
                <Card key={highlight.title} className="border-border hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{highlight.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{highlight.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Scope Areas & Sections Topics */}
            <div className="pt-12 border-t border-border space-y-10">
              <div className="grid gap-12 lg:grid-cols-2">
                <div>
                  <h3 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-6">{t("journal.scope")}</h3>
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
          </section>

          {/* Section 2: Editorial Board */}
          <section className="pt-16 border-t border-border space-y-10 animate-in fade-in duration-300">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-2">{t("nav.editorialBoard")}</h2>
              <p className="text-muted-foreground">Our distinguished editorial board members are leading experts in their fields, overseeing our rigorous peer review and ensuring high publication standards.</p>
            </div>
            <JournalEditorialBoard
              editorInChief={currentEiC}
              associateEditors={currentAssociateEditors}
              editorialBoard={currentEditorialBoard}
            />

            <div className="mt-8 rounded-xl border border-primary/20 bg-primary/5 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">{t("editorial.joinTeam")}</h3>
                <p className="text-muted-foreground max-w-2xl text-sm leading-relaxed">
                  {t("editorial.joinTeamSubtitle")}
                </p>
              </div>
              <Button size="lg" asChild className="shrink-0 font-semibold w-full sm:w-auto">
                <Link href={`/join-editorial-board?journal=${journalSlug}`}>
                  {t("editorial.expressInterest")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </section>

          {/* Section 3: Latest Articles */}
          <section className="pt-16 border-t border-border space-y-10 animate-in fade-in duration-300">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-2">{t("articles.title")}</h2>
              <p className="text-muted-foreground">Explore the latest high-impact peer-reviewed research articles published open-access in this journal.</p>
            </div>
            <ArticleList articles={sampleArticles} journalSlug={journalSlug} />
          </section>

          {/* Section 4: Manuscript Submission CTA */}
          <section className="pt-16 border-t border-border animate-in fade-in duration-300">
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
          </section>

        </div>
      </main>
      <Footer />
    </div>
  )
}
