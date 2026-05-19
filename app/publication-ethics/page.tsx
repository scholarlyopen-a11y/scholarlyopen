import { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Shield, Users, FileText, AlertTriangle, Scale, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "Publication Ethics | Scholarly Open",
  description: "Our commitment to publication ethics, research integrity, and COPE guidelines.",
}

const principles = [
  {
    icon: Shield,
    title: "Research Integrity",
    description: "All published research must be conducted ethically and in accordance with established standards. Data must be accurately reported without fabrication or falsification.",
  },
  {
    icon: Users,
    title: "Authorship",
    description: "All listed authors must have made substantial contributions to the work. Ghost authorship and gift authorship are not acceptable.",
  },
  {
    icon: FileText,
    title: "Originality",
    description: "Submissions must be original work not previously published or under consideration elsewhere. Plagiarism in any form is unacceptable.",
  },
  {
    icon: AlertTriangle,
    title: "Conflicts of Interest",
    description: "All potential conflicts of interest must be disclosed, including financial, personal, or professional relationships that could influence the work.",
  },
  {
    icon: Scale,
    title: "Fair Review",
    description: "Peer review is conducted objectively and confidentially. Reviewers must disclose conflicts and recuse themselves when appropriate.",
  },
  {
    icon: Eye,
    title: "Transparency",
    description: "Editorial processes are transparent and decisions are based on scientific merit. We maintain clear policies on corrections and retractions.",
  },
]

const responsibilities = {
  authors: [
    "Ensure the work is original and properly attributes sources",
    "Obtain necessary permissions for copyrighted material",
    "Declare all funding sources and potential conflicts of interest",
    "Obtain ethics approval for research involving humans or animals",
    "Ensure all listed authors meet authorship criteria",
    "Respond promptly to editorial queries and revisions",
    "Notify the editor of any errors discovered after publication",
  ],
  reviewers: [
    "Provide objective, constructive, and timely reviews",
    "Maintain confidentiality of the manuscript",
    "Disclose any conflicts of interest",
    "Not use unpublished information from manuscripts",
    "Decline reviews outside their area of expertise",
    "Alert editors to any ethical concerns",
  ],
  editors: [
    "Make decisions based solely on academic merit",
    "Ensure fair and unbiased peer review",
    "Maintain confidentiality of submissions",
    "Handle conflicts of interest appropriately",
    "Investigate and respond to ethical complaints",
    "Issue corrections or retractions when warranted",
    "Follow COPE guidelines in handling misconduct",
  ],
}

export default function PublicationEthicsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-muted/30 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8 lg:py-24">
            <div className="max-w-3xl">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-balance">
                Publication Ethics
              </h1>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                Scholarly Open is committed to upholding the highest standards of publication ethics. We follow the guidelines of the Committee on Publication Ethics (COPE) in all our editorial processes.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <div>
                <span className="text-sm font-medium text-primary uppercase tracking-wider">Our Commitment</span>
                <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                  COPE Best Practices
                </h2>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  We align our editorial and ethical policies with the Committee on Publication Ethics (COPE) core practices. These best practices help us handle research integrity issues consistently and transparently.
                </p>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  We use COPE flowcharts and guidance when addressing suspected misconduct, ensuring fair treatment of authors, reviewers, and readers.
                </p>
                <div className="mt-8">
                  <Button variant="outline" asChild>
                    <a href="https://publicationethics.org" target="_blank" rel="noopener noreferrer">
                      Learn About COPE
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>
              <div className="bg-muted/50 rounded-lg p-8 border border-border">
                <h3 className="text-xl font-semibold mb-6">COPE Core Practices</h3>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary shrink-0 mt-2" />
                    Allegations of misconduct
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary shrink-0 mt-2" />
                    Authorship and contributorship
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary shrink-0 mt-2" />
                    Complaints and appeals
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary shrink-0 mt-2" />
                    Conflicts of interest
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary shrink-0 mt-2" />
                    Data and reproducibility
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary shrink-0 mt-2" />
                    Ethical oversight
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary shrink-0 mt-2" />
                    Post-publication discussions and corrections
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Core Principles */}
        <section className="py-16 lg:py-24 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="max-w-2xl mb-12">
              <h2 className="text-3xl font-bold tracking-tight">Core Principles</h2>
              <p className="mt-4 text-muted-foreground">
                These fundamental principles guide all aspects of our publishing activities.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {principles.map((principle) => (
                <Card key={principle.title}>
                  <CardHeader>
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <principle.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>{principle.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{principle.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Responsibilities */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="max-w-2xl mb-12">
              <h2 className="text-3xl font-bold tracking-tight">Responsibilities</h2>
              <p className="mt-4 text-muted-foreground">
                Ethical publishing is a shared responsibility among all parties involved in the publication process.
              </p>
            </div>
            <div className="grid gap-8 lg:grid-cols-3">
              <div className="p-6 rounded-lg border border-border">
                <h3 className="text-xl font-semibold mb-4">Authors</h3>
                <ul className="space-y-3">
                  {responsibilities.authors.map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary shrink-0 mt-2" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-6 rounded-lg border border-border">
                <h3 className="text-xl font-semibold mb-4">Reviewers</h3>
                <ul className="space-y-3">
                  {responsibilities.reviewers.map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <div className="h-1.5 w-1.5 rounded-full bg-accent shrink-0 mt-2" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-6 rounded-lg border border-border">
                <h3 className="text-xl font-semibold mb-4">Editors</h3>
                <ul className="space-y-3">
                  {responsibilities.editors.map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <div className="h-1.5 w-1.5 rounded-full bg-chart-3 shrink-0 mt-2" />
                      {item}
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
                <h2 className="text-3xl font-bold tracking-tight">Handling Misconduct</h2>
                <p className="mt-4 text-muted-foreground mb-6">
                  We take all allegations of misconduct seriously and investigate them thoroughly following COPE guidelines.
                </p>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-background border border-border">
                    <h4 className="font-medium">Investigation Process</h4>
                    <p className="text-sm text-muted-foreground mt-2">
                      All allegations are investigated confidentially. We contact all parties involved and gather relevant evidence before making determinations.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-background border border-border">
                    <h4 className="font-medium">Possible Outcomes</h4>
                    <p className="text-sm text-muted-foreground mt-2">
                      Depending on severity, outcomes may include rejection, correction, expression of concern, retraction, or notification to institutions.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-background border border-border">
                    <h4 className="font-medium">Appeals</h4>
                    <p className="text-sm text-muted-foreground mt-2">
                      Parties may appeal decisions by providing additional evidence or explanations. Appeals are reviewed by senior editorial staff.
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <h2 className="text-3xl font-bold tracking-tight">Corrections & Retractions</h2>
                <p className="mt-4 text-muted-foreground mb-6">
                  We are committed to maintaining the integrity of the scholarly record through appropriate corrections when needed.
                </p>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-background border border-border">
                    <h4 className="font-medium">Erratum</h4>
                    <p className="text-sm text-muted-foreground mt-2">
                      Published to correct errors introduced during production that affect the understanding but not the scientific integrity of the work.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-background border border-border">
                    <h4 className="font-medium">Corrigendum</h4>
                    <p className="text-sm text-muted-foreground mt-2">
                      Published to correct author errors that affect the scientific record but do not invalidate the main findings.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-background border border-border">
                    <h4 className="font-medium">Retraction</h4>
                    <p className="text-sm text-muted-foreground mt-2">
                      Reserved for cases where findings are unreliable due to misconduct or honest error, or where ethical violations occurred.
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
              <p className="mt-4 text-lg text-secondary-foreground/80">
                If you have concerns about the ethical conduct of any work published by or submitted to our journals, please contact us. All reports are treated confidentially.
              </p>
              <div className="mt-8">
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/contact">
                    Contact Ethics Team
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
