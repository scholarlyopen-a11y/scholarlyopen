"use client"

import Link from "next/link"
import { ArrowRight, BookOpen, Users, Clock, Globe, Landmark, FileText, Award, CheckCircle2, Map, Compass } from "lucide-react"
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
  "Clinical Medicine & Patient Care",
  "Diagnostic Methods & Imaging",
  "Pharmacology & Drug Development",
  "Surgical Innovation",
  "Medical Genetics & Genomics",
  "Evidence-Based Medicine",
  "Medical Education & Training",
  "Healthcare Quality & Safety",
  "Translational Research",
  "Clinical Decision Support Systems",
]

const stats = [
  { label: "Average Review Time", value: "5-7 weeks" },
  { label: "Acceptance Rate", value: "~32%" },
  { label: "Article Processing Charge", value: "€1,800" },
  { label: "License", value: "CC BY 4.0" },
]

const keyFeatures = [
  {
    icon: Award,
    title: "Rigorous Peer Review",
    description: "Double-blind review by clinical medicine experts ensuring research quality."
  },
  {
    icon: FileText,
    title: "Multimedia Support",
    description: "Publish supplementary materials, videos, and interactive content with your research."
  },
  {
    icon: Globe,
    title: "Clinical Impact",
    description: "Direct relevance to clinical practice and patient care outcomes."
  },
  {
    icon: Users,
    title: "Expert Review",
    description: "Evaluated by practicing clinicians and biomedical researchers worldwide."
  }
]

// Sample Articles
const sampleArticles: Article[] = [
  {
    id: "jcm-2024-001",
    title: "Novel Biomarkers for Early Detection of Sepsis in Emergency Department Patients: A Multicenter Prospective Study",
    authors: ["Prof. Dr. Sophie Martin", "Dr. Christopher Lee", "Dr. Amira Patel"],
    abstract: "This multicenter study identifies and validates novel biomarkers for early sepsis detection in ED patients. Our panel demonstrates superior sensitivity and specificity compared to conventional markers, enabling earlier intervention and improved patient outcomes.",
    keywords: ["Sepsis", "Biomarkers", "Emergency medicine", "Early detection", "Clinical outcomes"],
    doi: "10.12345/jcm.2024.001",
    publishedDate: "2024-03-20",
    articleType: "research",
    pdfUrl: "#",
  },
  {
    id: "jcm-2024-002",
    title: "Minimally Invasive Techniques in Cardiothoracic Surgery: A Systematic Review and Meta-Analysis of Long-Term Outcomes",
    authors: ["Dr. Marco Gallo", "Prof. Dr. Ingrid Fischer"],
    abstract: "This systematic review and meta-analysis of 89 studies examines long-term outcomes of minimally invasive versus open cardiothoracic procedures. Results show comparable efficacy with reduced morbidity, supporting wider adoption of minimally invasive techniques.",
    keywords: ["Cardiothoracic surgery", "Minimally invasive", "Meta-analysis", "Surgical outcomes", "Innovation"],
    doi: "10.12345/jcm.2024.002",
    publishedDate: "2024-02-15",
    articleType: "review",
    pdfUrl: "#",
  },
  {
    id: "jcm-2024-003",
    title: "Precision Medicine Approach to Type 2 Diabetes Management: Integrating Genomic and Clinical Data",
    authors: ["Dr. Lisa Wang", "Prof. Dr. Henrik Johansson"],
    abstract: "This study presents a precision medicine framework integrating genomic profiling, biomarker analysis, and clinical data for personalized T2D management. Our approach identifies patient subgroups with distinct responses to interventions.",
    keywords: ["Precision medicine", "Diabetes", "Genomics", "Personalized treatment", "Clinical integration"],
    doi: "10.12345/jcm.2024.003",
    publishedDate: "2024-01-10",
    articleType: "research",
    pdfUrl: "#",
  },
]

// Editorial Board
const editorInChief: EditorMember = {
  name: "Prof. Dr. Sophie Martin",
  role: "Editor-in-Chief",
  affiliation: "Charité - University Medicine Berlin, Germany",
  specialization: "Internal Medicine & Clinical Pharmacology",
  email: "abbas.qurasani+clinical-medicine-journal-scholarisch@gmail.com",
  orcid: "0000-0001-3456-7890",
}

const associateEditors: EditorMember[] = [
  {
    name: "Prof. Dr. Christopher Lee",
    role: "Associate Editor",
    affiliation: "Johns Hopkins University, USA",
    specialization: "Emergency Medicine & Critical Care",
    orcid: "0000-0002-4567-8901",
  },
  {
    name: "Prof. Dr. Ingrid Fischer",
    role: "Associate Editor",
    affiliation: "University of Zurich, Switzerland",
    specialization: "Cardiothoracic Surgery",
    orcid: "0000-0003-5678-9012",
  },
  {
    name: "Prof. Dr. Henrik Johansson",
    role: "Associate Editor",
    affiliation: "Karolinska Institute, Sweden",
    specialization: "Endocrinology & Metabolic Medicine",
    orcid: "0000-0004-6789-0123",
  },
]

const editorialBoard: EditorMember[] = [
  {
    name: "Dr. Marco Gallo",
    role: "Board Member",
    affiliation: "University of Milan, Italy",
    specialization: "Surgical Innovation",
  },
  {
    name: "Prof. Dr. Lisa Wang",
    role: "Board Member",
    affiliation: "Tsinghua University, China",
    specialization: "Precision Medicine",
  },
  {
    name: "Dr. Amira Patel",
    role: "Board Member",
    affiliation: "AIIMS New Delhi, India",
    specialization: "Clinical Infectious Diseases",
  },
  {
    name: "Prof. Dr. James Wilson",
    role: "Board Member",
    affiliation: "Stanford University, USA",
    specialization: "Medical Genomics",
  },
  {
    name: "Dr. Kenji Yamamoto",
    role: "Board Member",
    affiliation: "University of Tokyo, Japan",
    specialization: "Medical Education",
  },
  {
    name: "Prof. Dr. Catherine Leclerc",
    role: "Board Member",
    affiliation: "Université Paris Cité, France",
    specialization: "Healthcare Quality & Safety",
  },
]

export default function ArchaeologicalFrontiersPage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-accent text-accent-foreground">
          <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8 lg:py-24">
            <div className="mb-6 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <h1 className="max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl text-balance">
                Scholarly Open Journal of Clinical Medicine
              </h1>
              <div className="flex w-fit shrink-0 items-center gap-3 rounded-2xl bg-accent-foreground/10 px-4 py-3 ring-1 ring-accent-foreground/15">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-accent-foreground/20">
                  <Landmark className="h-8 w-8" />
                </div>
                <div className="min-w-0">
                  <Badge className="bg-accent-foreground/20 text-accent-foreground border-0">{t("nav.goldOA")}</Badge>
                  <div className="mt-2 whitespace-nowrap text-sm text-accent-foreground/75">ISSN: requested</div>
                </div>
              </div>
            </div>
            <p className="mt-6 text-xl text-accent-foreground/80 max-w-3xl leading-relaxed">
              A gold open-access journal dedicated to advancing clinical medicine through rigorous peer review of cutting-edge research, innovations, and evidence-based practice improvements.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/submit">
                  Submit Manuscript
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-accent-foreground/30 bg-accent-foreground/5 text-accent-foreground hover:bg-accent-foreground/10 hover:text-accent-foreground">
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
                  <div className="text-2xl font-bold text-accent lg:text-3xl">{stat.value}</div>
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
                        Scholarly Open Journal of Clinical Medicine is a fully Gold Open Access journal published by Scholarly Open. We are dedicated to advancing clinical practice through publication of high-quality research with direct patient care implications.
                      </p>
                      <p>
                        We publish original research, systematic reviews, case reports, and clinical innovations across all areas of medicine. The journal bridges basic science discoveries with clinical applications.
                      </p>
                      <p>
                        All submissions undergo rigorous double-blind peer review by clinical experts. Our editorial team adheres to ICMJE recommendations and evidence-based evaluation standards.
                      </p>
                    </div>
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold tracking-tight mb-6">Scope & Coverage</h2>
                    <ul className="grid gap-3">
                      {scopeAreas.map((area) => (
                        <li key={area} className="flex items-center gap-3">
                          <CheckCircle2 className="h-5 w-5 text-accent shrink-0" />
                          <span className="text-muted-foreground">{area}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Features */}
                <div className="bg-muted/30 rounded-2xl p-8">
                  <h2 className="text-2xl font-bold tracking-tight text-center mb-8">Why Publish Here</h2>
                  <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    {keyFeatures.map((feature) => (
                      <Card key={feature.title} className="text-center border-border">
                        <CardHeader>
                          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent/10">
                            <feature.icon className="h-7 w-7 text-accent" />
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
                <ArticleList articles={sampleArticles} journalSlug="archaeological-frontiers" />
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
                      We welcome submissions from archaeologists worldwide. All submissions undergo rigorous double-blind peer review by international experts.
                    </p>
                  </div>
                </div>
                
                <div className="grid gap-6 md:grid-cols-3">
                  <Card className="border-border">
                    <CardHeader>
                      <FileText className="h-8 w-8 text-accent mb-2" />
                      <CardTitle>Research Articles</CardTitle>
                      <CardDescription>
                        Original excavation reports, survey findings, and analytical studies presenting new data.
                      </CardDescription>
                    </CardHeader>
                  </Card>
                  <Card className="border-border">
                    <CardHeader>
                      <BookOpen className="h-8 w-8 text-accent mb-2" />
                      <CardTitle>Synthesis Papers</CardTitle>
                      <CardDescription>
                        Comprehensive reviews synthesizing regional or thematic archaeological knowledge.
                      </CardDescription>
                    </CardHeader>
                  </Card>
                  <Card className="border-border">
                    <CardHeader>
                      <Award className="h-8 w-8 text-accent mb-2" />
                      <CardTitle>Methods & Data Papers</CardTitle>
                      <CardDescription>
                        Papers presenting new methods, techniques, or significant datasets for reuse.
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
        <section className="bg-foreground text-background">
          <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold tracking-tight">{t("cta.title")}</h2>
              <p className="mt-4 text-background/70">
                Share your clinical research with healthcare professionals worldwide through gold open access.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
                  <Link href="/submit">
                    {t("nav.submitManuscript")}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="border-background/30 bg-background/5 text-background hover:bg-background/10 hover:text-background">
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
