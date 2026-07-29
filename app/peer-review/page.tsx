import { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, FileText, Users, CheckCircle, Clock, Shield, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "Peer Review Process | Scholarly Open",
  description: "Learn about our rigorous double-blind peer review process that ensures the quality and integrity of published research.",
}

const steps = [
  {
    number: 1,
    title: "Submission",
    description: "Authors submit their manuscript through our online submission system. The editorial office performs an initial check for completeness and scope.",
    icon: FileText,
  },
  {
    number: 2,
    title: "Editorial Assessment",
    description: "The Editor-in-Chief or handling editor evaluates the manuscript for scientific merit and fit with journal scope. Manuscripts may be desk-rejected at this stage.",
    icon: Users,
  },
  {
    number: 3,
    title: "Peer Review",
    description: "Manuscripts passing initial assessment are sent to at least two independent expert reviewers for double-blind evaluation.",
    icon: Shield,
  },
  {
    number: 4,
    title: "Editorial Decision",
    description: "Based on reviewer recommendations, the editor makes a decision: accept, minor revisions, major revisions, or reject.",
    icon: CheckCircle,
  },
  {
    number: 5,
    title: "Revision",
    description: "If revisions are requested, authors respond to reviewer comments and submit a revised manuscript with a detailed response letter.",
    icon: MessageSquare,
  },
  {
    number: 6,
    title: "Publication",
    description: "Accepted manuscripts undergo copyediting, typesetting, and proofreading before being published open access.",
    icon: Clock,
  },
]

const principles = [
  {
    title: "Double-Blind Review",
    description: "Both authors and reviewers remain anonymous throughout the review process, ensuring objective evaluation free from bias.",
  },
  {
    title: "Expert Reviewers",
    description: "We select reviewers based on their expertise in the manuscript&apos;s specific subject area, ensuring competent evaluation.",
  },
  {
    title: "Timely Process",
    description: "We aim to complete the initial review within 4-6 weeks, with clear communication about timelines throughout.",
  },
  {
    title: "Constructive Feedback",
    description: "Reviewers are expected to provide constructive, actionable feedback that helps authors improve their work.",
  },
  {
    title: "Conflict of Interest",
    description: "We require disclosure of any potential conflicts of interest and ensure reviewers have no competing interests.",
  },
  {
    title: "Appeals Process",
    description: "Authors may appeal editorial decisions with substantive justification, which will be reviewed by the editorial team.",
  },
]

export default function PeerReviewPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-muted/30 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8 lg:py-24">
            <div className="max-w-3xl">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-balance">
                Peer Review Process
              </h1>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                Our rigorous double-blind peer review process ensures that all published research meets the highest standards of scientific quality and integrity.
              </p>
            </div>
          </div>
        </section>

        {/* Process Steps */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="max-w-2xl mb-12">
              <h2 className="text-3xl font-bold tracking-tight">The Review Process</h2>
              <p className="mt-4 text-muted-foreground">
                From submission to publication, your manuscript goes through these carefully managed stages.
              </p>
            </div>
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-6 top-0 bottom-0 w-px bg-border hidden md:block" />
              
              <div className="space-y-8">
                {steps.map((step, index) => (
                  <div key={step.number} className="relative flex gap-6">
                    {/* Step indicator */}
                    <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-4 border-background bg-primary/10 text-primary">
                      <span className="text-primary font-bold text-lg">{step.number}</span>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 pb-8">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary shrink-0">
                          <step.icon className="h-4 w-4 text-primary" />
                        </div>
                        <h3 className="text-xl font-semibold">{step.title}</h3>
                      </div>
                      <p className="text-base text-muted-foreground leading-relaxed">{step.description}</p>
                      
                      {/* Connector arrow for non-last items */}
                      {index < steps.length - 1 && (
                        <div className="hidden md:block absolute left-6 top-12 h-8 w-px">
                          <div className="h-full w-full bg-border" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Principles */}
        <section className="py-16 lg:py-24 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="max-w-2xl mb-12">
              <h2 className="text-3xl font-bold tracking-tight">Review Principles</h2>
              <p className="mt-4 text-muted-foreground">
                Our peer review process is guided by these fundamental principles.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {principles.map((principle) => (
                <div key={principle.title} className="bg-background rounded-lg border border-border p-6">
                  <h3 className="font-semibold text-lg">{principle.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{principle.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">Expected Timelines</h2>
                <p className="mt-4 text-muted-foreground">
                  We are committed to providing timely decisions to help you advance your research.
                </p>
                <div className="mt-8 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                      <span className="text-sm font-bold text-primary">1-2</span>
                    </div>
                    <div>
                      <h4 className="font-medium">Initial Decision</h4>
                      <p className="text-sm text-muted-foreground">Days to determine if the manuscript proceeds to peer review</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                      <span className="text-sm font-bold text-primary">4-6</span>
                    </div>
                    <div>
                      <h4 className="font-medium">Peer Review</h4>
                      <p className="text-sm text-muted-foreground">Weeks for reviewers to complete their evaluation</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                      <span className="text-sm font-bold text-primary">1-2</span>
                    </div>
                    <div>
                      <h4 className="font-medium">Final Decision</h4>
                      <p className="text-sm text-muted-foreground">Weeks from revision submission to final decision</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                      <span className="text-sm font-bold text-primary">2-5</span>
                    </div>
                    <div>
                      <h4 className="font-medium">Production</h4>
                      <p className="text-sm text-muted-foreground">Days from acceptance to online publication</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-muted/50 rounded-lg p-8 border border-border">
                <h3 className="text-xl font-semibold mb-4">Reviewer Guidelines</h3>
                <p className="text-muted-foreground mb-6">
                  Are you interested in reviewing for our journals? We welcome expert reviewers in our focus disciplines.
                </p>
                <ul className="space-y-3 text-sm text-muted-foreground mb-6">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    Provide constructive and timely feedback
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    Maintain confidentiality of manuscripts
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    Disclose any conflicts of interest
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    Follow COPE ethical guidelines
                  </li>
                </ul>
                <Button asChild variant="outline">
                  <Link href="/contact">Register as Reviewer</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-secondary text-secondary-foreground">
          <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8 lg:py-20">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Submit Your Manuscript
              </h2>
              <p className="mt-4 text-lg text-secondary-foreground/80">
                Ready to share your research with the world? Start the submission process today.
              </p>
              <div className="mt-8">
                <Button size="lg" asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
                  <Link href="/submit">
                    Submit Now
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
