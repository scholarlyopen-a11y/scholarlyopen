import { Metadata } from "next"
import Link from "next/link"
import { 
  ArrowRight, 
  Shield, 
  Users, 
  FileText, 
  AlertTriangle, 
  Scale, 
  Eye, 
  Bot, 
  ShieldAlert, 
  ImageOff, 
  Link2Off, 
  UserX, 
  UserCheck,
  Sparkles,
  CheckCircle2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "Publication Ethics & Integrity Policies | Scholarly Open",
  description: "Our commitment to publication ethics, COPE guidelines, ICMJE authorship standards, and modern research integrity policies including AI disclosure and paper mill prevention.",
}

const principles = [
  {
    icon: Shield,
    title: "Research Integrity",
    description: "All published research must be conducted ethically and transparently in accordance with global standards. Data must be accurately recorded and presented without fabrication or falsification.",
  },
  {
    icon: Users,
    title: "ICMJE Authorship Criteria",
    description: "All listed authors must make substantial contributions to conception, data acquisition, or analysis, and approve the final manuscript. Ghost, gift, or commercial broker authorship is strictly prohibited.",
  },
  {
    icon: FileText,
    title: "Originality & Novelty",
    description: "Submissions must present original research not published or under consideration elsewhere. Textual and conceptual plagiarism in any form is unacceptable.",
  },
  {
    icon: AlertTriangle,
    title: "Competing Interests",
    description: "All financial, commercial, personal, or institutional conflicts of interest that could influence or be perceived to influence the research must be fully disclosed upon submission.",
  },
  {
    icon: Scale,
    title: "Double-Blind Peer Review",
    description: "Peer review is conducted objectively, rigorously, and confidentially by qualified experts. Reviewers must declare competing interests and recuse themselves when appropriate.",
  },
  {
    icon: Eye,
    title: "Scholarly Transparency",
    description: "Editorial decisions are based purely on academic merit and scientific quality. We maintain clear, COPE-aligned procedures for post-publication corrections, errata, and retractions.",
  },
]

const modernSafeguards = [
  {
    icon: Bot,
    title: "AI-Assisted Technologies & LLMs",
    description: "Generative AI tools (e.g. ChatGPT, Claude, Copilot) cannot meet ICMJE authorship criteria and cannot be credited as authors. Authors are welcome to use AI for language refinement, formatting, or coding provided it is declared in the manuscript. Authors remain 100% accountable for all content.",
    badge: "COPE & ICMJE Standard",
  },
  {
    icon: ShieldAlert,
    title: "Paper Mill & Systematic Misconduct Prevention",
    description: "We enforce multi-factor pre-screening using automated submission pattern analysis, metadata verification, and institutional network checks to prevent paper mill manuscripts, fake datasets, or commercialized submission fraud.",
    badge: "Zero Tolerance",
  },
  {
    icon: ImageOff,
    title: "Digital Image Forensics & Raw Data",
    description: "Figures undergo pre-publication pixel-level forensic screening to detect duplication, selective enhancement, or synthetic generation. Authors must retain and provide raw, unedited data (e.g., uncut gel scans, original microscopic fields) upon editorial request.",
    badge: "Forensic Screening",
  },
  {
    icon: Link2Off,
    title: "Bibliometric & Citation Integrity",
    description: "Citations are cross-validated against Crossref and PubMed databases to filter out hallucinated AI references. We prohibit manipulative citation practices, including forced editor/reviewer citations or journal citation cartels.",
    badge: "Automated Validation",
  },
  {
    icon: UserX,
    title: "Authorship Trading & Broker Prohibitions",
    description: "Changes to authorship lists post-acceptance are strictly controlled and require written consent from all original authors and institutional verification. Commercial authorship brokers or paid position assignments result in immediate manuscript retraction.",
    badge: "ICMJE Standard",
  },
  {
    icon: UserCheck,
    title: "Peer Reviewer Network Integrity",
    description: "To prevent compromised review rings or reciprocal reviewer pools, peer reviewers undergo institutional identity verification. Reviewers are prohibited from using unverified AI tools to write peer review reports.",
    badge: "Verified Identity",
  },
]

const responsibilities = {
  authors: [
    "Ensure all work is original and properly attributes all sources and prior literature",
    "Obtain documented ethics committee/IRB approvals for research involving human or animal subjects",
    "Declare all funding sources, commercial sponsorships, and potential competing interests",
    "Ensure all listed authors satisfy ICMJE contributorship criteria and approve the final text",
    "Provide transparent declarations regarding any AI-assisted tools used during manuscript preparation",
    "Maintain raw experimental data and make it available upon editorial or reviewer request",
    "Promptly notify the editorial office if significant errors are identified post-publication",
  ],
  reviewers: [
    "Provide objective, evidence-based, constructive, and timely peer evaluations",
    "Maintain strict confidentiality of the manuscript and submitted datasets",
    "Disclose any personal, financial, or intellectual competing interests immediately",
    "Refrain from using submitted manuscripts or data for personal or institutional gain",
    "Notify editors of potential overlap, image duplication, or ethical concerns",
    "Prepare review evaluations independently without uploading manuscript text to public AI models",
  ],
  editors: [
    "Evaluate manuscripts solely on scientific merit, originality, and validity",
    "Manage a fair, double-blind peer review process free of commercial or personal bias",
    "Verify reviewer credentials and maintain strict confidentiality of all submissions",
    "Investigate allegations of misconduct thoroughly following COPE flowcharts and guidance",
    "Publish necessary corrections, errata, expressions of concern, or retractions transparently",
    "Enforce policy compliance regarding open data, AI disclosure, and authorship integrity",
  ],
}

export default function PublicationEthicsPage() {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-muted/30 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8 lg:py-24">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
                <Shield className="h-3.5 w-3.5" /> Research Integrity Standards
              </div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-balance">
                Publication Ethics & Integrity Policies
              </h1>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                Scholarly Open is committed to maintaining the highest level of editorial integrity. Our policies follow the guidelines of the <strong>Committee on Publication Ethics (COPE)</strong> and the <strong>International Committee of Medical Journal Editors (ICMJE)</strong> to safeguard scholarly quality and protect published research.
              </p>
            </div>
          </div>
        </section>

        {/* COPE Commitment */}
        <section className="py-16 lg:py-20 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <div>
                <span className="text-sm font-medium text-primary uppercase tracking-wider">COPE & ICMJE Alignment</span>
                <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                  COPE Core Practices Framework
                </h2>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  We align our editorial workflows with the Committee on Publication Ethics (COPE) Core Practices. These guidelines ensure systematic, objective, and transparent handling of research integrity matters across our 13 Gold Open Access journals.
                </p>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  By adhering to standardized COPE flowcharts, we ensure impartial resolution of inquiries regarding authorship, data presentation, peer review, and post-publication corrections.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Button variant="outline" asChild>
                    <a href="https://publicationethics.org" target="_blank" rel="noopener noreferrer">
                      Learn About COPE Practices
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                  <Button variant="ghost" asChild>
                    <a href="https://www.icmje.org/recommendations/" target="_blank" rel="noopener noreferrer">
                      ICMJE Authorship Guidelines
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>
              <div className="bg-muted/40 rounded-xl p-8 border border-border shadow-sm">
                <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" /> Key COPE Governance Standards
                </h3>
                <ul className="space-y-3.5 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2.5">
                    <div className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1.5" />
                    <span><strong>Misconduct Handling:</strong> Systematic procedures for handling allegations fairly and confidentially.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <div className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1.5" />
                    <span><strong>Contributorship & Authorship:</strong> Clear criteria preventing guest, ghost, or broker authorship.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <div className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1.5" />
                    <span><strong>Complaints & Appeals:</strong> Transparent appeal channels for editorial decisions.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <div className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1.5" />
                    <span><strong>Conflict Disclosure:</strong> Mandatory financial and personal interest declarations.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <div className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1.5" />
                    <span><strong>Data Reproducibility:</strong> Protocols for data retention and code availability.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <div className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1.5" />
                    <span><strong>Post-Publication Integrity:</strong> Established rules for errata, corrigenda, and retractions.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Modern Integrity & Quality Safeguards */}
        <section className="py-16 lg:py-24 bg-muted/20 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="max-w-3xl mb-12">
              <h2 className="text-3xl font-bold tracking-tight">Modern Publishing Integrity Safeguards</h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                To address modern challenges in scholarly publishing, Scholarly Open implements proactive pre-publication quality safeguards to protect the credibility and citation value of accepted research.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {modernSafeguards.map((item) => (
                <Card key={item.title} className="relative flex flex-col justify-between overflow-hidden border-border hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <item.icon className="h-6 w-6 text-primary" />
                      </div>
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                        {item.badge}
                      </span>
                    </div>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* AI Statement Guidelines Box */}
        <section className="py-16 lg:py-20 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="max-w-4xl mx-auto rounded-2xl border border-primary/20 bg-primary/5 p-8 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-primary mt-1">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground">How to Declare AI Assistance in Your Manuscript</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    Scholarly Open supports the transparent use of AI tools (such as ChatGPT, Grammarly, or Claude) for language refinement, copyediting, or coding assistance. Authors should include a brief statement in the <strong>Methods</strong>, <strong>Acknowledgements</strong>, or a dedicated <strong>AI Statement</strong> section prior to publication:
                  </p>
                  <div className="mt-4 p-4 rounded-lg bg-background border border-border text-xs text-foreground font-mono leading-relaxed">
                    &quot;Statement on AI Use: During the preparation of this manuscript, the author(s) utilized [Tool Name, Version] to [describe purpose, e.g., improve manuscript readability and syntax]. The author(s) reviewed and edited all generated content and assume full responsibility for the scientific integrity and factual accuracy of the published text.&quot;
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Core Principles */}
        <section className="py-16 lg:py-24 bg-muted/30 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="max-w-2xl mb-12">
              <h2 className="text-3xl font-bold tracking-tight">Core Publishing Principles</h2>
              <p className="mt-4 text-muted-foreground">
                These foundational pillars guide all editorial evaluations and peer review workflows.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {principles.map((principle) => (
                <Card key={principle.title}>
                  <CardHeader>
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
                      <principle.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{principle.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">{principle.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Responsibilities */}
        <section className="py-16 lg:py-24 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="max-w-2xl mb-12">
              <h2 className="text-3xl font-bold tracking-tight">Stakeholder Responsibilities</h2>
              <p className="mt-4 text-muted-foreground">
                Maintaining research integrity is a collaborative responsibility across authors, peer reviewers, and editors.
              </p>
            </div>
            <div className="grid gap-8 lg:grid-cols-3">
              <div className="p-6 rounded-xl border border-border bg-background">
                <h3 className="text-xl font-semibold mb-4 text-foreground">Authors</h3>
                <ul className="space-y-3">
                  {responsibilities.authors.map((item, index) => (
                    <li key={index} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary shrink-0 mt-2" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-6 rounded-xl border border-border bg-background">
                <h3 className="text-xl font-semibold mb-4 text-foreground">Peer Reviewers</h3>
                <ul className="space-y-3">
                  {responsibilities.reviewers.map((item, index) => (
                    <li key={index} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                      <div className="h-1.5 w-1.5 rounded-full bg-accent shrink-0 mt-2" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-6 rounded-xl border border-border bg-background">
                <h3 className="text-xl font-semibold mb-4 text-foreground">Editors</h3>
                <ul className="space-y-3">
                  {responsibilities.editors.map((item, index) => (
                    <li key={index} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                      <div className="h-1.5 w-1.5 rounded-full bg-chart-3 shrink-0 mt-2" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Misconduct & Corrections */}
        <section className="py-16 lg:py-24 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-2">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">Handling Allegations of Misconduct</h2>
                <p className="mt-4 text-muted-foreground mb-6 leading-relaxed">
                  All queries or complaints regarding research integrity are investigated systematically following COPE guidelines.
                </p>
                <div className="space-y-4">
                  <div className="p-5 rounded-xl bg-background border border-border">
                    <h4 className="font-semibold text-base">1. Confidential Investigation</h4>
                    <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
                      Inquiries are handled confidentially by senior editorial personnel. Relevant evidence, original data files, and submission metadata are reviewed objectively.
                    </p>
                  </div>
                  <div className="p-5 rounded-xl bg-background border border-border">
                    <h4 className="font-semibold text-base">2. Resolution Protocols</h4>
                    <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
                      Depending on severity, outcomes include manuscript rejection, editorial warnings, requests for formal corrections, or notification to host research institutions.
                    </p>
                  </div>
                  <div className="p-5 rounded-xl bg-background border border-border">
                    <h4 className="font-semibold text-base">3. Fair Appeals Procedure</h4>
                    <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
                      Authors or reviewers may appeal editorial determinations by submitting formal written appeals accompanied by supporting documentation to the editorial office.
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <h2 className="text-3xl font-bold tracking-tight">Corrections, Errata & Retractions</h2>
                <p className="mt-4 text-muted-foreground mb-6 leading-relaxed">
                  We preserve the integrity of the permanent scholarly record through published amendments when necessary.
                </p>
                <div className="space-y-4">
                  <div className="p-5 rounded-xl bg-background border border-border">
                    <h4 className="font-semibold text-base">Erratum</h4>
                    <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
                      Issued to correct significant formatting, typesetting, or production errors introduced during publishing that affect text clarity.
                    </p>
                  </div>
                  <div className="p-5 rounded-xl bg-background border border-border">
                    <h4 className="font-semibold text-base">Corrigendum</h4>
                    <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
                      Issued to correct author errors or omissions that alter technical details without invalidating the overall scientific conclusions.
                    </p>
                  </div>
                  <div className="p-5 rounded-xl bg-background border border-border">
                    <h4 className="font-semibold text-base">Retraction</h4>
                    <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
                      Published following COPE retraction guidelines when findings are determined to be unreliable due to misconduct or honest error.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Report Concerns */}
        <section className="bg-secondary text-secondary-foreground">
          <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8 lg:py-20">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Report Ethical Concerns
              </h2>
              <p className="mt-4 text-lg text-secondary-foreground/80 leading-relaxed">
                If you have questions or wish to report ethical concerns regarding any manuscript submitted to or published by Scholarly Open, please contact our integrity team.
              </p>
              <div className="mt-8">
                <Button size="lg" variant="default" asChild>
                  <Link href="/contact?subject=ethics">
                    Contact Research Integrity Team
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
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
