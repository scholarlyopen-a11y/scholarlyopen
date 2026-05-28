"use client"

import Link from "next/link"
import { ArrowRight, BookOpen, Users, Shield, Microscope, FileText, Award, CheckCircle2, Stethoscope, FlaskRound } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/lib/language-context"
import { ArticleList, type Article } from "@/components/article-card"
import { JournalEditorialBoard, type EditorMember } from "@/components/journal-editorial-board"

const scopeAreas = [
  "Environmental Sustainability",
  "Green Technology & Innovation",
  "Renewable Energy Systems",
  "Climate Change & Mitigation",
  "Sustainable Agriculture",
  "Circular Economy",
  "Environmental Monitoring",
  "Conservation & Biodiversity",
  "Sustainable Urban Development",
  "Social & Economic Sustainability",
]

const stats = [
  { label: "Average Review Time", value: "5-7 weeks" },
  { label: "Acceptance Rate", value: "~30%" },
  { label: "Article Processing Charge", value: "€1,600" },
  { label: "License", value: "CC BY 4.0" },
]

// Sample Articles
const sampleArticles: Article[] = [
  {
    id: "as-2024-001",
    title: "Solar Panel Efficiency Optimization Using Machine Learning: A Field Study across European Latitudes",
    authors: ["Prof. Dr. Klaus Wagner", "Dr. Eva Johansson", "Dr. Raj Patel"],
    abstract: "This field study evaluates ML-based optimization algorithms for solar panel efficiency across 12 European locations with varying climate conditions. Results demonstrate 15-22% efficiency improvements through real-time angle and cleaning adjustments.",
    keywords: ["Solar energy", "Machine learning", "Renewable energy", "Field study", "Optimization"],
    doi: "10.12345/as.2024.001",
    publishedDate: "2024-03-15",
    articleType: "research",
    pdfUrl: "#",
    isOpenAccess: true,
  },
  {
    id: "as-2024-002",
    title: "Circular Economy Principles in Manufacturing: A Systematic Review of Implementation Barriers and Solutions",
    authors: ["Dr. Maria Santos", "Prof. Dr. Thomas Green"],
    abstract: "We systematically reviewed 78 studies on circular economy implementation in manufacturing. Our analysis identifies key barriers including supply chain complexity, regulation, and consumer behavior, with evidence-based solutions from leading organizations.",
    keywords: ["Circular economy", "Manufacturing", "Sustainability", "Systematic review", "Implementation"],
    doi: "10.12345/as.2024.002",
    publishedDate: "2024-02-28",
    articleType: "review",
    pdfUrl: "#",
    isOpenAccess: true,
  },
  {
    id: "as-2024-003",
    title: "Biodiversity Conservation in Urban Landscapes: Integration of Green Infrastructure with Ecosystem Services",
    authors: ["Dr. Chen Liu", "Prof. Dr. Anna Bergström"],
    abstract: "This study demonstrates how strategic placement of green infrastructure enhances biodiversity while providing ecosystem services in urban areas. Analysis of 15 cities reveals optimal designs for maximizing conservation impact.",
    keywords: ["Biodiversity", "Urban sustainability", "Green infrastructure", "Ecosystem services", "City planning"],
    doi: "10.12345/as.2024.003",
    publishedDate: "2024-01-20",
    articleType: "research",
    pdfUrl: "#",
    isOpenAccess: false,
  },
]

// Editorial Board
const editorInChief: EditorMember = {
  name: "Prof. Dr. Klaus Wagner",
  role: "Editor-in-Chief",
  affiliation: "ETH Zurich, Switzerland",
  specialization: "Renewable Energy & Sustainability",
  email: "abbas.qurasani+sustainability-journal-scholarisch@gmail.com",
  orcid: "0000-0001-2345-6789",
}

const associateEditors: EditorMember[] = [
  {
    name: "Prof. Dr. Eva Johansson",
    role: "Associate Editor",
    affiliation: "University of Uppsala, Sweden",
    specialization: "Environmental Science",
    orcid: "0000-0002-3456-7890",
  },
  {
    name: "Prof. Dr. Thomas Green",
    role: "Associate Editor",
    affiliation: "University of Cambridge, UK",
    specialization: "Circular Economy & Industrial Ecology",
    orcid: "0000-0003-4567-8901",
  },
  {
    name: "Prof. Dr. Raj Patel",
    role: "Associate Editor",
    affiliation: "IIT Delhi, India",
    specialization: "Green Technology & Innovation",
    orcid: "0000-0004-5678-9012",
  },
]

const editorialBoard: EditorMember[] = [
  {
    name: "Dr. Maria Santos",
    role: "Board Member",
    affiliation: "University of Lisbon, Portugal",
    specialization: "Sustainable Development",
  },
  {
    name: "Prof. Dr. Chen Liu",
    role: "Board Member",
    affiliation: "Tsinghua University, China",
    specialization: "Urban Sustainability",
  },
  {
    name: "Dr. Anna Bergström",
    role: "Board Member",
    affiliation: "University of Stockholm, Sweden",
    specialization: "Biodiversity & Conservation",
  },
  {
    name: "Prof. Dr. Carlos Morales",
    role: "Board Member",
    affiliation: "UNAM, Mexico",
    specialization: "Climate Change",
  },
  {
    name: "Dr. Kenji Tanaka",
    role: "Board Member",
    affiliation: "University of Tokyo, Japan",
    specialization: "Renewable Energy",
  },
  {
    name: "Prof. Dr. Catherine Martin",
    role: "Board Member",
    affiliation: "Université Paris Saclay, France",
    specialization: "Environmental Policy",
  },
]

export default function MedicalResearchReviewPage() {
  const { t } = useLanguage()

  const keyFeatures = [
    {
      icon: Shield,
      title: "Hybrid Open Access",
      description: "Choose subscription or open access publication with APC for immediate free access.",
    },
    {
      icon: Users,
      title: t("features.peerReview.title"),
      description: "Double-blind review by clinical and research experts with medical credentials.",
    },
    {
      icon: Stethoscope,
      title: "Clinical Focus",
      description: "Strong emphasis on clinically relevant research with patient impact.",
    },
    {
      icon: FlaskRound,
      title: "Translational Bridge",
      description: "Connecting basic science discoveries with clinical applications.",
    },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-foreground text-background">
          <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8 lg:py-24">
            <div className="mb-6 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <h1 className="max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl text-balance">
                Scholarly Open Advances in Sustainability
              </h1>
              <div className="flex w-fit shrink-0 items-center gap-3 rounded-2xl bg-background/10 px-4 py-3 ring-1 ring-background/15">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-secondary">
                  <Microscope className="h-8 w-8 text-secondary-foreground" />
                </div>
                <div className="min-w-0">
                  <Badge className="bg-secondary text-secondary-foreground border-0">Gold OA</Badge>
                  <div className="mt-2 whitespace-nowrap text-sm text-background/75">ISSN: requested</div>
                </div>
              </div>
            </div>
            <p className="mt-6 text-xl text-background/80 max-w-3xl leading-relaxed">
              A peer-reviewed journal dedicated to advancing sustainable development, environmental solutions, and climate action. All articles published with Gold open access.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                <Link href="/submit">
                  Submit Manuscript
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-background/30 bg-background/10 text-background hover:bg-background/20 hover:text-background">
                <Link href="/author-guidelines">Author Guidelines</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Stats */}
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

        {/* Main Content with Tabs */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <Tabs defaultValue="about" className="space-y-8">
              <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="articles">{t("articles.title")}</TabsTrigger>
                <TabsTrigger value="editorial">{t("nav.editorialBoard")}</TabsTrigger>
                <TabsTrigger value="submit">Submit</TabsTrigger>
              </TabsList>
              
              {/* About Tab */}
              <TabsContent value="about" className="space-y-12">
                <div className="grid gap-12 lg:grid-cols-2">
                  <div>
                    <h2 className="text-3xl font-bold tracking-tight mb-6">About the Journal</h2>
                    <div className="prose prose-lg text-muted-foreground">
                      <p>
                        Scholarly Open Advances in Sustainability is a fully Gold Open Access journal published by Scholarly Open. We are committed to advancing environmental sustainability, climate solutions, and sustainable development globally.
                      </p>
                      <p>
                        The journal welcomes original research articles, review articles, and methodological papers across all areas of sustainability including environmental science, renewable energy, circular economy, and sustainable development.
                      </p>
                      <p>
                        All submissions undergo rigorous double-blind peer review by international sustainability experts. Our editorial decisions are based solely on scientific merit and contribution to advancing sustainability goals.
                      </p>
                    </div>
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold tracking-tight mb-6">Scope & Coverage</h2>
                    <ul className="grid gap-3">
                      {scopeAreas.map((area) => (
                        <li key={area} className="flex items-center gap-3">
                          <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                          <span className="text-muted-foreground">{area}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Hybrid OA Explanation */}
                <div className="bg-secondary/20 rounded-2xl p-8">
                  <h2 className="text-2xl font-bold tracking-tight text-center mb-8">Gold Open Access Model</h2>
                  <div className="grid gap-8 max-w-2xl mx-auto">
                    <Card className="border-primary bg-primary/5">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Shield className="h-5 w-5 text-primary" />
                          Open Access
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-muted-foreground">
                          All articles are immediately and permanently free to access under a Creative Commons license.
                        </p>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-primary" />
                            APC: €1,600
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-primary" />
                            Immediate global access
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Features */}
                <div className="bg-muted/30 rounded-2xl p-8">
                  <h2 className="text-2xl font-bold tracking-tight text-center mb-8">Why Publish Here</h2>
                  <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    {keyFeatures.map((feature) => (
                      <Card key={feature.title} className="text-center border-border">
                        <CardHeader>
                          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                            <feature.icon className="h-7 w-7 text-primary" />
                          </div>
                          <CardTitle className="mt-4 text-base">{feature.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <CardDescription>{feature.description}</CardDescription>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* Articles Tab */}
              <TabsContent value="articles">
                <ArticleList articles={sampleArticles} journalSlug="medical-research-review" />
              </TabsContent>

              {/* Editorial Board Tab */}
              <TabsContent value="editorial">
                <JournalEditorialBoard 
                  editorInChief={editorInChief}
                  associateEditors={associateEditors}
                  editorialBoard={editorialBoard}
                />
              </TabsContent>

              {/* Submit Tab */}
              <TabsContent value="submit" className="space-y-8">
                <div className="max-w-2xl">
                  <h2 className="text-3xl font-bold tracking-tight mb-6">Submit Your Manuscript</h2>
                  <div className="prose prose-lg text-muted-foreground">
                    <p>
                      We welcome submissions from clinical researchers and biomedical scientists worldwide. All submissions undergo rigorous double-blind peer review.
                    </p>
                  </div>
                </div>
                
                <div className="grid gap-6 md:grid-cols-3">
                  <Card className="border-border">
                    <CardHeader>
                      <FileText className="h-8 w-8 text-primary mb-2" />
                      <CardTitle>Original Research</CardTitle>
                      <CardDescription>
                        Clinical trials, observational studies, laboratory research, and translational studies with novel findings.
                      </CardDescription>
                    </CardHeader>
                  </Card>
                  <Card className="border-border">
                    <CardHeader>
                      <BookOpen className="h-8 w-8 text-primary mb-2" />
                      <CardTitle>Systematic Reviews</CardTitle>
                      <CardDescription>
                        Systematic reviews and meta-analyses following PRISMA guidelines, synthesizing clinical evidence.
                      </CardDescription>
                    </CardHeader>
                  </Card>
                  <Card className="border-border">
                    <CardHeader>
                      <Award className="h-8 w-8 text-primary mb-2" />
                      <CardTitle>Case Reports</CardTitle>
                      <CardDescription>
                        Instructive case reports and case series highlighting unusual presentations or novel treatments.
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" asChild>
                    <Link href="/submit">
                      {t("nav.submitManuscript")}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="/author-guidelines">{t("nav.authorGuidelines")}</Link>
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-primary text-primary-foreground">
          <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold tracking-tight">{t("cta.title")}</h2>
              <p className="mt-4 text-primary-foreground/80">
                Advance medical knowledge by sharing your research with our global readership.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/submit">
                    {t("nav.submitManuscript")}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="border-primary-foreground/30 bg-primary-foreground/5 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
                  <Link href="/apc-fees">{t("nav.apcFees")}</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
