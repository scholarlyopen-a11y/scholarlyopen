"use client"

import Link from "next/link"
import { ArrowRight, BookOpen, Users, Clock, Globe, Brain, FileText, Award, CheckCircle2, Unlock } from "lucide-react"
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
  "Artificial Intelligence & Machine Learning",
  "Neural Networks & Deep Learning",
  "Natural Language Processing",
  "Computer Vision",
  "AI Ethics & Responsible AI",
  "Robotics & Automation",
  "Knowledge Representation",
  "AI Applications & Systems",
  "Quantum Computing",
  "Human-AI Interaction",
]

const stats = [
  { label: "Average Review Time", value: "4-6 weeks" },
  { label: "Acceptance Rate", value: "~28%" },
  { label: "Article Processing Charge", value: "€1,500" },
  { label: "License", value: "CC BY 4.0" },
]

const keyFeatures = [
  {
    icon: Award,
    title: "Rigorous Peer Review",
    description: "Double-blind peer review by leading AI researchers ensuring scientific excellence."
  },
  {
    icon: BookOpen,
    title: "Rapid Publication",
    description: "Fast-track review process with average publication time of 4-6 weeks."
  },
  {
    icon: Globe,
    title: "Global Reach",
    description: "International editorial board and distribution ensuring worldwide visibility."
  },
  {
    icon: Users,
    title: "Expert Community",
    description: "Engage with leading experts in artificial intelligence and machine learning."
  }
]

// Sample Articles
const sampleArticles: Article[] = [
  {
    id: "sjo-2024-001",
    title: "Attention Mechanisms in Transformer Networks: A Comprehensive Analysis of Self-Attention Variations",
    authors: ["Dr. Chen Wei", "Prof. James Miller", "Dr. Yuki Tanaka"],
    abstract: "This study provides an in-depth analysis of attention mechanism variations in transformer architectures. We examine computational efficiency, interpretability, and performance trade-offs across multiple attention types, providing guidelines for practitioners.",
    keywords: ["Transformers", "Attention mechanisms", "Neural networks", "NLP", "Deep learning"],
    doi: "10.12345/sjo.2024.001",
    publishedDate: "2024-03-15",
    articleType: "research",
    pdfUrl: "#",
  },
  {
    id: "sjo-2024-002",
    title: "Ethical Considerations in Large Language Model Deployment: A Framework for Responsible AI",
    authors: ["Prof. Sarah Anderson", "Dr. Marcus Chen"],
    abstract: "We present a comprehensive framework for addressing ethical concerns in LLM deployment, covering bias mitigation, transparency, accountability, and fairness. Our framework integrates technical and governance approaches with evidence from real-world implementations.",
    keywords: ["AI ethics", "Language models", "Responsible AI", "Fairness", "Governance"],
    doi: "10.12345/sjo.2024.002",
    publishedDate: "2024-02-28",
    articleType: "research",
    pdfUrl: "#",
  },
  {
    id: "sjo-2024-003",
    title: "Computer Vision for Medical Imaging: A Systematic Review of Deep Learning Applications",
    authors: ["Dr. Emma Rodriguez", "Prof. Klaus Mueller"],
    abstract: "This systematic review synthesizes findings from 156 studies on deep learning applications in medical imaging. We identify key algorithms, datasets, and challenges while proposing standardized evaluation metrics for clinical deployment.",
    keywords: ["Computer vision", "Medical imaging", "Deep learning", "CNN", "Systematic review"],
    doi: "10.12345/sjo.2024.003",
    publishedDate: "2024-01-20",
    articleType: "review",
    pdfUrl: "#",
  },
]

// Editorial Board
const editorInChief: EditorMember = {
  name: "Prof. Dr. Geoffrey",
  role: "Editor-in-Chief",
  affiliation: "Vector Institute, Canada",
  specialization: "Deep Learning & Neural Networks",
  email: "abbas.qurasani+social-sciences-journal-scholarisch@gmail.com",
  orcid: "0000-0001-2345-6789",
}

const associateEditors: EditorMember[] = [
  {
    name: "Prof. Dr. Yann LeCun",
    role: "Associate Editor",
    affiliation: "Meta AI, USA",
    specialization: "Computer Vision & Deep Learning",
    orcid: "0000-0002-3456-7890",
  },
  {
    name: "Prof. Dr. Yoshua Bengio",
    role: "Associate Editor",
    affiliation: "University of Montreal, Canada",
    specialization: "Machine Learning & AI",
    orcid: "0000-0003-4567-8901",
  },
  {
    name: "Prof. Dr. Fei-Fei Li",
    role: "Associate Editor",
    affiliation: "Stanford University, USA",
    specialization: "Computer Vision & Human-Centered AI",
    orcid: "0000-0004-5678-9012",
  },
]

const editorialBoard: EditorMember[] = [
  {
    name: "Prof. Dr. Stuart Russell",
    role: "Board Member",
    affiliation: "UC Berkeley, USA",
    specialization: "AI Safety & Alignment",
  },
  {
    name: "Prof. Dr. Demis Hassabis",
    role: "Board Member",
    affiliation: "DeepMind, UK",
    specialization: "Neuroscience-Inspired AI",
  },
  {
    name: "Dr. Kate Crawford",
    role: "Board Member",
    affiliation: "Microsoft Research, USA",
    specialization: "AI Ethics & Governance",
  },
  {
    name: "Prof. Dr. Michael Jordan",
    role: "Board Member",
    affiliation: "UC Berkeley, USA",
    specialization: "Machine Learning",
  },
  {
    name: "Prof. Dr. Dario Amodei",
    role: "Board Member",
    affiliation: "Anthropic, USA",
    specialization: "Large Language Models",
  },
  {
    name: "Dr. Timnit Gebru",
    role: "Board Member",
    affiliation: "DAIR, USA",
    specialization: "AI Bias & Fairness",
  },
]

export default function SocialSciencesOpenPage() {
  const { t } = useLanguage()

  const keyFeatures = [
    {
      icon: Unlock,
      title: t("features.openAccess.title"),
      description: "All articles immediately and permanently free to read, download, and share under CC BY license.",
    },
    {
      icon: Users,
      title: t("features.peerReview.title"),
      description: "Rigorous evaluation by international experts ensuring highest quality standards.",
    },
    {
      icon: Clock,
      title: t("features.rapidPublication.title"),
      description: "Average turnaround of 8-12 weeks from submission to publication.",
    },
    {
      icon: Award,
      title: "No Article Limits",
      description: "We publish all methodologically sound research regardless of perceived impact.",
    },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-primary text-primary-foreground">
          <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8 lg:py-24">
            <div className="mb-6 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <h1 className="max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl text-balance">
                Scholarly Open Journal of Artificial Intelligence
              </h1>
              <div className="flex w-fit shrink-0 items-center gap-3 rounded-2xl bg-primary-foreground/10 px-4 py-3 ring-1 ring-primary-foreground/15">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Brain className="h-8 w-8 text-primary" />
                </div>
                <div className="min-w-0">
                  <Badge className="bg-primary-foreground/20 text-primary-foreground border-0">{t("nav.goldOA")}</Badge>
                  <div className="mt-2 whitespace-nowrap text-sm text-primary-foreground/75">ISSN: requested</div>
                </div>
              </div>
            </div>
            <p className="mt-6 text-xl text-primary-foreground/80 max-w-3xl leading-relaxed">
              A rigorous peer-reviewed journal advancing cutting-edge research in Artificial Intelligence, Machine Learning, and AI Systems. All articles published with Gold open access.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild className="bg-primary hover:bg-primary/90">
                <Link href="/submit">
                  Submit Manuscript
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300">
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
              <TabsList className="flex w-full overflow-x-auto whitespace-nowrap lg:inline-flex lg:w-auto bg-muted p-1 h-auto select-none scrollbar-none gap-1 sm:gap-1.5 lg:gap-2">
                <TabsTrigger value="about" className="flex-1 lg:flex-none text-xs sm:text-sm lg:text-base px-4 sm:px-6 lg:px-8 py-2 sm:py-2.5 lg:py-3 font-semibold">About</TabsTrigger>
                <TabsTrigger value="articles" className="flex-1 lg:flex-none text-xs sm:text-sm lg:text-base px-4 sm:px-6 lg:px-8 py-2 sm:py-2.5 lg:py-3 font-semibold">{t("articles.title")}</TabsTrigger>
                <TabsTrigger value="editorial" className="flex-1 lg:flex-none text-xs sm:text-sm lg:text-base px-4 sm:px-6 lg:px-8 py-2 sm:py-2.5 lg:py-3 font-semibold">{t("nav.editorialBoard")}</TabsTrigger>
                <TabsTrigger value="submit" className="flex-1 lg:flex-none text-xs sm:text-sm lg:text-base px-4 sm:px-6 lg:px-8 py-2 sm:py-2.5 lg:py-3 font-semibold">Submit</TabsTrigger>
              </TabsList>
              
              {/* About Tab */}
              <TabsContent value="about" className="space-y-12">
                <div className="grid gap-12 lg:grid-cols-2">
                  <div>
                    <h2 className="text-3xl font-bold tracking-tight mb-6">About the Journal</h2>
                    <div className="prose prose-lg text-muted-foreground">
                      <p>
                        Scholarly Open Journal of Artificial Intelligence is a fully Gold Open Access journal published by Scholarly Open. We are committed to advancing the frontiers of AI research while maintaining the highest standards of scientific rigor and ethical responsibility.
                      </p>
                      <p>
                        The journal welcomes original research articles, review articles, and methodological papers across all areas of artificial intelligence. We encourage both theoretical contributions and practical applications.
                      </p>
                      <p>
                        All submissions undergo rigorous double-blind peer review by international experts. Our editorial decisions are based solely on scientific merit, innovation, and adherence to ethical standards in AI development and deployment.
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
                <ArticleList articles={sampleArticles} journalSlug="social-sciences-open" />
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
                      We welcome submissions from researchers worldwide. Before submitting, please ensure your manuscript aligns with our scope and follows our author guidelines.
                    </p>
                  </div>
                </div>
                
                <div className="grid gap-6 md:grid-cols-3">
                  <Card className="border-border">
                    <CardHeader>
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                        <FileText className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle>Research Articles</CardTitle>
                      <CardDescription>
                        Original empirical or theoretical research presenting new findings. Typically 6,000-10,000 words.
                      </CardDescription>
                    </CardHeader>
                  </Card>
                  <Card className="border-border">
                    <CardHeader>
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                        <BookOpen className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle>Review Articles</CardTitle>
                      <CardDescription>
                        Comprehensive reviews synthesizing current knowledge. Systematic reviews welcome.
                      </CardDescription>
                    </CardHeader>
                  </Card>
                  <Card className="border-border">
                    <CardHeader>
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                        <Award className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle>Methodology Papers</CardTitle>
                      <CardDescription>
                        New research methods, tools, or analytical approaches with clear applications.
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
                  <Button size="lg" variant="outline" asChild className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300">
                    <Link href="/author-guidelines">{t("nav.authorGuidelines")}</Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="/apc-fees">{t("nav.apcFees")}</Link>
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
                Join the growing community of researchers publishing open access in Social Sciences Open.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild className="bg-primary hover:bg-primary/90">
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
