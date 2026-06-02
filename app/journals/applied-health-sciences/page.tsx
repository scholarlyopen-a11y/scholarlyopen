"use client"

import Link from "next/link"
import { ArrowRight, BookOpen, Users, Shield, Beaker, FileText, Award, CheckCircle2, Heart, Activity } from "lucide-react"
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
  "Data Science & Analytics",
  "Statistical Methods & Inference",
  "Machine Learning & Algorithms",
  "Big Data Technologies",
  "Data Visualization",
  "Computational Data Science",
  "Data Mining & Pattern Discovery",
  "Data Ethics & Privacy",
  "Applied Data Science",
  "Data Science in Practice",
]

const stats = [
  { label: "Average Review Time", value: "4-6 weeks" },
  { label: "Acceptance Rate", value: "~30%" },
  { label: "OA Article Charge", value: "€1,500" },
  { label: "OA License", value: "CC BY 4.0" },
]

// Sample Articles
const sampleArticles: Article[] = [
  {
    id: "ds-2024-001",
    title: "Advanced Time Series Forecasting Using Hybrid LSTM-XGBoost Models: A Comparative Study Across Domains",
    authors: ["Dr. Alex Kumar", "Prof. Dr. Sarah Mitchell", "Dr. Priya Sinha"],
    abstract: "This study presents a hybrid approach combining LSTM and XGBoost for time series forecasting across multiple domains. Our method achieves superior performance in financial, weather, and traffic datasets, with interpretability improvements.",
    keywords: ["Time series", "Deep learning", "XGBoost", "Forecasting", "Machine learning"],
    doi: "10.12345/ds.2024.001",
    publishedDate: "2024-03-10",
    articleType: "research",
    pdfUrl: "#",
    isOpenAccess: true,
  },
  {
    id: "ds-2024-002",
    title: "Responsible Data Science: A Framework for Ethical Analysis and Bias Detection in Machine Learning Pipelines",
    authors: ["Dr. Emma Johnson", "Prof. Dr. Mark Richardson"],
    abstract: "We present a comprehensive framework for implementing responsible data science practices, including bias detection, fairness assessment, and ethical analysis throughout ML pipelines. Our framework addresses practical challenges in enterprise implementations.",
    keywords: ["Data ethics", "Bias detection", "Responsible AI", "Fairness", "Machine learning"],
    doi: "10.12345/ds.2024.002",
    publishedDate: "2024-02-15",
    articleType: "methodology",
    pdfUrl: "#",
    isOpenAccess: true,
  },
  {
    id: "ds-2024-003",
    title: "Privacy-Preserving Data Analytics: Differential Privacy Techniques for Large-Scale Datasets",
    authors: ["Dr. Robert Chang", "Prof. Dr. Natalie Foster"],
    abstract: "This study demonstrates practical implementation of differential privacy techniques for large-scale data analytics. Our approach maintains utility while providing formal privacy guarantees, with evaluation on real-world healthcare and financial datasets.",
    keywords: ["Privacy", "Differential privacy", "Data protection", "Big data", "Privacy-preserving"],
    doi: "10.12345/ds.2024.003",
    publishedDate: "2024-01-25",
    articleType: "research",
    pdfUrl: "#",
    isOpenAccess: false,
  },
]

// Editorial Board
const editorInChief: EditorMember = {
  name: "Prof. Dr. Sarah Mitchell",
  role: "Editor-in-Chief",
  affiliation: "Stanford University, USA",
  specialization: "Machine Learning & Data Science",
  email: "abbas.qurasani+data-science-journal-scholarisch@gmail.com",
  orcid: "0000-0001-5678-9012",
}

const associateEditors: EditorMember[] = [
  {
    name: "Prof. Dr. Mark Richardson",
    role: "Associate Editor",
    affiliation: "University of California, USA",
    specialization: "Statistical Learning & ML",
    orcid: "0000-0002-6789-0123",
  },
  {
    name: "Prof. Dr. Emma Johnson",
    role: "Associate Editor",
    affiliation: "Oxford University, UK",
    specialization: "Data Ethics & Fairness",
    orcid: "0000-0003-7890-1234",
  },
  {
    name: "Prof. Dr. Natalie Foster",
    role: "Associate Editor",
    affiliation: "MIT, USA",
    specialization: "Privacy-Preserving Analytics",
    orcid: "0000-0004-8901-2345",
  },
]

const editorialBoard: EditorMember[] = [
  {
    name: "Dr. Alex Kumar",
    role: "Board Member",
    affiliation: "Bangalore Institute of Technology, India",
    specialization: "Deep Learning",
  },
  {
    name: "Dr. Priya Sinha",
    role: "Board Member",
    affiliation: "Delhi Technological University, India",
    specialization: "Time Series Analysis",
  },
  {
    name: "Dr. Robert Chang",
    role: "Board Member",
    affiliation: "Carnegie Mellon University, USA",
    specialization: "Privacy & Security",
  },
  {
    name: "Prof. Dr. Hiroshi Tanaka",
    role: "Board Member",
    affiliation: "University of Tokyo, Japan",
    specialization: "Big Data Systems",
  },
  {
    name: "Dr. Sophia Martinez",
    role: "Board Member",
    affiliation: "University of Madrid, Spain",
    specialization: "Data Visualization",
  },
  {
    name: "Prof. Dr. Laurent Dupont",
    role: "Board Member",
    affiliation: "Université Paris Cité, France",
    specialization: "Statistical Methods",
  },
]

export default function AppliedHealthSciencesPage() {
  const { t } = useLanguage()

  const keyFeatures = [
    {
      icon: Shield,
      title: "Hybrid Open Access",
      description: "Flexible publication options: subscription or open access with APC.",
    },
    {
      icon: Users,
      title: "Interdisciplinary Scope",
      description: "Bridging nursing, allied health, and public health research communities.",
    },
    {
      icon: Heart,
      title: "Practice-Oriented",
      description: "Emphasis on research with direct implications for healthcare practice.",
    },
    {
      icon: Activity,
      title: "Evidence Synthesis",
      description: "Strong support for systematic reviews and implementation research.",
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
                Scholarly Open Communications: Data Science
              </h1>
              <div className="flex w-fit shrink-0 items-center gap-3 rounded-2xl bg-background/10 px-4 py-3 ring-1 ring-background/15">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-secondary">
                  <Beaker className="h-8 w-8 text-secondary-foreground" />
                </div>
                <div className="min-w-0">
                  <Badge className="bg-secondary text-secondary-foreground border-0">{t("nav.goldOA")}</Badge>
                  <div className="mt-2 whitespace-nowrap text-sm text-background/75">ISSN: requested</div>
                </div>
              </div>
            </div>
            <p className="mt-6 text-xl text-background/80 max-w-3xl leading-relaxed">
              A gold open-access journal dedicated to advancing data science through rigorous peer review of cutting-edge research, methods, and practical applications across all domains.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild className="bg-primary hover:bg-primary/90">
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
              <TabsList className="flex w-full overflow-x-auto whitespace-nowrap lg:inline-flex lg:w-auto bg-muted p-1 h-auto select-none scrollbar-none">
                <TabsTrigger value="about" className="flex-1 lg:flex-none text-xs sm:text-sm px-3 py-1.5">About</TabsTrigger>
                <TabsTrigger value="articles" className="flex-1 lg:flex-none text-xs sm:text-sm px-3 py-1.5">{t("articles.title")}</TabsTrigger>
                <TabsTrigger value="editorial" className="flex-1 lg:flex-none text-xs sm:text-sm px-3 py-1.5">{t("nav.editorialBoard")}</TabsTrigger>
                <TabsTrigger value="submit" className="flex-1 lg:flex-none text-xs sm:text-sm px-3 py-1.5">Submit</TabsTrigger>
              </TabsList>
              
              {/* About Tab */}
              <TabsContent value="about" className="space-y-12">
                <div className="grid gap-12 lg:grid-cols-2">
                  <div>
                    <h2 className="text-3xl font-bold tracking-tight mb-6">About the Journal</h2>
                    <div className="prose prose-lg text-muted-foreground">
                      <p>
                        Scholarly Open Communications: Data Science is a fully Gold Open Access journal published by Scholarly Open. We are committed to advancing data science through publication of high-quality research with practical impact.
                      </p>
                      <p>
                        We publish original research, methodological papers, and practical applications across all areas of data science including machine learning, statistical methods, big data, and data analytics.
                      </p>
                      <p>
                        All submissions undergo rigorous double-blind peer review by data science experts. We emphasize reproducibility, code availability, and clear communication of methods.
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
                            APC: €1,500
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
                <ArticleList articles={sampleArticles} journalSlug="applied-health-sciences" />
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
                      We welcome submissions from health researchers and practitioners worldwide. All submissions undergo rigorous double-blind peer review.
                    </p>
                  </div>
                </div>
                
                <div className="grid gap-6 md:grid-cols-3">
                  <Card className="border-border">
                    <CardHeader>
                      <FileText className="h-8 w-8 text-primary mb-2" />
                      <CardTitle>Original Research</CardTitle>
                      <CardDescription>
                        Quantitative, qualitative, or mixed-methods studies advancing health sciences knowledge and practice.
                      </CardDescription>
                    </CardHeader>
                  </Card>
                  <Card className="border-border">
                    <CardHeader>
                      <BookOpen className="h-8 w-8 text-primary mb-2" />
                      <CardTitle>Systematic Reviews</CardTitle>
                      <CardDescription>
                        Evidence syntheses including systematic reviews, scoping reviews, and meta-analyses.
                      </CardDescription>
                    </CardHeader>
                  </Card>
                  <Card className="border-border">
                    <CardHeader>
                      <Award className="h-8 w-8 text-primary mb-2" />
                      <CardTitle>Implementation Science</CardTitle>
                      <CardDescription>
                        Studies examining the implementation of evidence-based practices in healthcare settings.
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
                Advance data science by sharing your research with the global data community through gold open access.
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
