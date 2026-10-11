"use client"

import { useRef, useState } from "react"
import Link from "next/link"
import { ArrowRight, Upload, FileText, CheckCircle, AlertCircle, User, Mail, Building, Globe, BookOpen, Layers, Printer, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/lib/language-context"
import { AntiSpamFields } from "@/components/anti-spam-fields"
import { HumanVerification } from "@/components/human-verification"
import { GLOBAL_COUNTRIES } from "@/lib/data/countries"

const JOURNAL_NAMES: Record<string, string> = {
  "social-sciences-humanities": "Scholarly Open: Social Sciences & Humanities",
  "biology": "Scholarly Open: Biology",
  "chemistry": "Scholarly Open: Chemistry",
  "medicine": "Scholarly Open: Medicine",
  "data-science": "Scholarly Open: Data Science",
  "engineering": "Scholarly Open: Engineering & Applied Sciences",
  "environmental-science": "Scholarly Open: Environmental Science",
  "clinical-ai-digital-health": "Scholarly Open: Clinical AI & Digital Health",
  "ai-safety-governance": "Scholarly Open: AI Safety & Governance",
  "decarbonization-carbon-tech": "Scholarly Open: Decarbonization & Carbon Tech",
  "quantum-engineering": "Scholarly Open: Quantum Engineering",
  "synthetic-biology-bio-design": "Scholarly Open: Synthetic Biology & Bio-Design",
  "space-resources-orbital-economy": "Scholarly Open: Space Resources & Orbital Economy",
}

const checklist = [
  "The manuscript is original and has not been published elsewhere",
  "The manuscript is not currently under consideration by another journal",
  "All authors have agreed to the submission",
  "The manuscript follows the Author Guidelines formatting requirements",
  "Ethical approval has been obtained where required",
  "Conflicts of interest have been declared",
  "References are complete and in APA 7th edition format",
]

export default function SubmitPage() {
  const { t } = useLanguage()
  const [agreed, setAgreed] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null)
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [trackingId, setTrackingId] = useState<string | null>(null)
  const [submittedEmail, setSubmittedEmail] = useState<string>("")
  const [submittedName, setSubmittedName] = useState<string>("")
  const [submissionReceipt, setSubmissionReceipt] = useState<{
    trackingId: string
    title: string
    journal: string
    articleType: string
    authorName: string
    authorEmail: string
    affiliation: string
    date: string
  } | null>(null)
  const [copiedId, setCopiedId] = useState(false)

  const recipient = "info@scholarlyopen.org"

  const submitToEditorialOffice = async (formData: FormData) => {
    const response = await fetch("/api/submit", { method: "POST", body: formData })
    const json = (await response.json().catch(() => null)) as { ok?: boolean; trackingId?: string; error?: string } | null
    if (!response.ok || !json?.ok) {
      throw new Error(json?.error || "Submission failed.")
    }
    if (json.trackingId) {
      setTrackingId(json.trackingId)
    }
    return json
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {status === "success" && submissionReceipt ? (
        <main className="flex-1 py-12 lg:py-16 bg-muted/20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb / Top Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                  <CheckCircle className="h-3.5 w-3.5" />
                  Submission Received
                </span>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mt-2">
                  Manuscript Submission Receipt
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Scholarly Open Publishing Group • Editorial Office
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => window.print()} className="gap-2">
                  <Printer className="h-4 w-4" />
                  Print Receipt
                </Button>
              </div>
            </div>

            {/* Primary Receipt Card */}
            <Card className="border border-border/80 shadow-sm overflow-hidden bg-card">
              {/* Official Top Banner */}
              <div className="bg-primary/5 border-b border-border p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Official Manuscript Tracking ID</p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="font-mono text-xl sm:text-2xl font-bold text-foreground tracking-wide">
                      {submissionReceipt.trackingId}
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(submissionReceipt.trackingId)
                        setCopiedId(true)
                        setTimeout(() => setCopiedId(false), 2500)
                      }}
                      className="h-8 px-2.5 text-xs gap-1.5"
                    >
                      {copiedId ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-600" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          <span>Copy ID</span>
                        </>
                      )}
                    </Button>
                  </div>
                </div>
                <div className="text-left md:text-right">
                  <p className="text-xs text-muted-foreground">Current Workflow Stage</p>
                  <span className="inline-flex items-center gap-1.5 mt-1 text-sm font-semibold text-primary">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    Technical Screening Pending
                  </span>
                </div>
              </div>

              <CardContent className="p-6 sm:p-8 space-y-8">
                {/* Sober Editorial Confirmation Note */}
                <div className="rounded-lg border border-border/60 bg-muted/30 p-4 text-sm leading-relaxed text-muted-foreground">
                  Your manuscript has been securely lodged with the editorial office. A formal submission acknowledgement has been dispatched to{" "}
                  <strong className="text-foreground font-medium">{submissionReceipt.authorEmail}</strong>. Please cite your Tracking ID in all correspondence with the editorial office.
                </div>

                {/* Metadata Details Grid */}
                <div>
                  <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                    Manuscript Metadata & Registration Details
                  </h2>
                  <div className="grid gap-3 sm:grid-cols-2 rounded-lg border border-border/60 bg-card p-4 sm:p-6 text-sm">
                    <div className="sm:col-span-2 pb-3 border-b border-border/40">
                      <span className="text-xs text-muted-foreground block mb-1">Manuscript Title</span>
                      <span className="font-semibold text-base text-foreground leading-snug">{submissionReceipt.title}</span>
                    </div>

                    <div className="py-1">
                      <span className="text-xs text-muted-foreground block mb-1">Target Journal</span>
                      <span className="font-medium text-foreground">{submissionReceipt.journal}</span>
                    </div>

                    <div className="py-1">
                      <span className="text-xs text-muted-foreground block mb-1">Article Type</span>
                      <span className="font-medium text-foreground">{submissionReceipt.articleType}</span>
                    </div>

                    <div className="py-1">
                      <span className="text-xs text-muted-foreground block mb-1">Corresponding Author</span>
                      <span className="font-medium text-foreground">{submissionReceipt.authorName}</span>
                    </div>

                    <div className="py-1">
                      <span className="text-xs text-muted-foreground block mb-1">Institution / Affiliation</span>
                      <span className="font-medium text-foreground">{submissionReceipt.affiliation || "N/A"}</span>
                    </div>

                    <div className="py-1">
                      <span className="text-xs text-muted-foreground block mb-1">Registered Author Email</span>
                      <span className="font-medium text-foreground">{submissionReceipt.authorEmail}</span>
                    </div>

                    <div className="py-1">
                      <span className="text-xs text-muted-foreground block mb-1">Submission Date</span>
                      <span className="font-medium text-foreground">{submissionReceipt.date}</span>
                    </div>
                  </div>
                </div>

                {/* Editorial Workflow Steps */}
                <div>
                  <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                    Editorial Evaluation Process
                  </h2>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="p-4 rounded-lg border border-emerald-500/30 bg-emerald-500/5 relative">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-white text-xs font-bold">1</span>
                        <span className="font-semibold text-sm text-foreground">Screening</span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Initial verification of scope, formatting, ethical declarations, and similarity check (24–48 hours).
                      </p>
                    </div>

                    <div className="p-4 rounded-lg border border-border bg-card">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-foreground text-xs font-bold border border-border">2</span>
                        <span className="font-semibold text-sm text-foreground">Handling Editor Assignment</span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Allocation to a Handling Editor specialized in your research discipline to oversee independent peer review.
                      </p>
                    </div>

                    <div className="p-4 rounded-lg border border-border bg-card">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-foreground text-xs font-bold border border-border">3</span>
                        <span className="font-semibold text-sm text-foreground">Peer Review</span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Double-blind evaluation by qualified external referees followed by editorial decision.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-4 border-t border-border flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <Button
                      type="button"
                      size="lg"
                      onClick={() => window.print()}
                      className="gap-2 bg-emerald-700 hover:bg-emerald-800 text-white dark:bg-emerald-600 dark:hover:bg-emerald-700 cursor-pointer"
                    >
                      <Printer className="h-4 w-4" />
                      Print / Save Receipt
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      size="lg"
                      className="gap-2 cursor-pointer"
                    >
                      <a href={`mailto:info@scholarlyopen.org?subject=Manuscript%20Inquiry:%20[${encodeURIComponent(submissionReceipt.trackingId)}]%20${encodeURIComponent(submissionReceipt.title)}`}>
                        <Mail className="h-4 w-4" />
                        Contact Editorial Office
                      </a>
                    </Button>
                  </div>

                  <Button
                    variant="ghost"
                    size="lg"
                    onClick={() => {
                      setStatus("idle")
                      setSubmissionReceipt(null)
                      setSelectedFileName(null)
                      setAgreed(false)
                    }}
                    className="text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    Submit Another Manuscript
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      ) : (
        <main className="flex-1">
        {/* Hero */}
        <section className="bg-muted/30 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8 lg:py-24">
            <div className="max-w-3xl">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-balance">
                {t("nav.submitManuscript")}
              </h1>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                Submit your research to {t("brand.name")}. Our editorial team will guide your manuscript through our rigorous peer review process.
              </p>
            </div>
          </div>
        </section>

        {/* Submission Steps */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="max-w-2xl mb-12">
              <h2 className="text-3xl font-bold tracking-tight">Submission Process</h2>
              <p className="mt-4 text-muted-foreground">
                Follow these steps to submit your manuscript for consideration.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-4">
              <div className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-xl">
                  1
                </div>
                <h3 className="mt-4 font-semibold text-base sm:text-lg text-foreground">Prepare</h3>
                <p className="mt-2 text-base text-muted-foreground leading-relaxed">
                  Format your manuscript according to our Author Guidelines
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-xl">
                  2
                </div>
                <h3 className="mt-4 font-semibold text-base sm:text-lg text-foreground">Details</h3>
                <p className="mt-2 text-base text-muted-foreground leading-relaxed">
                  Provide corresponding author information and manuscript metadata
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-xl">
                  3
                </div>
                <h3 className="mt-4 font-semibold text-base sm:text-lg text-foreground">Upload</h3>
                <p className="mt-2 text-base text-muted-foreground leading-relaxed">
                  Upload your manuscript file (.docx, .doc, or .pdf)
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-xl">
                  4
                </div>
                <h3 className="mt-4 font-semibold text-base sm:text-lg text-foreground">Submit</h3>
                <p className="mt-2 text-base text-muted-foreground leading-relaxed">
                  Submit the form to send your research to our editorial office
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pre-submission Checklist */}
        <section className="py-16 lg:py-24 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-2">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">Pre-Submission Checklist</h2>
                <p className="mt-4 text-muted-foreground mb-8">
                  Before submitting, please ensure you can confirm all of the following items.
                </p>
                <div className="space-y-3">
                  {checklist.map((item, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-background border border-border">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary shrink-0 mt-0.5">
                        <CheckCircle className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary shrink-0">
                        <AlertCircle className="h-4 w-4 text-primary" />
                      </div>
                      Important Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold">Article Processing Charges</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Open access publication involves an Article Processing Charge (APC). 
                        See our <Link href="/apc-fees" className="text-primary hover:underline">{t("nav.apcFees")} page</Link> for details and waivers.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold">Review Timeline</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Initial editorial decision within 1-2 weeks. Full peer review typically 4-6 weeks.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold">Open Access License</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        All accepted articles are published under a Creative Commons CC BY 4.0 license.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold">Need Help?</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Contact our editorial office at{" "}
                        <a href="mailto:info@scholarlyopen.org" className="text-primary hover:underline">
                          info@scholarlyopen.org
                        </a>
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Submission Form */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold tracking-tight">Start Your Submission</h2>
                <p className="mt-4 text-muted-foreground">
                  Complete the manuscript and corresponding author details below to submit your paper directly to our editorial office for peer review.
                </p>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Manuscript Submission Form</CardTitle>
                  <CardDescription>
                    Please provide complete and accurate information for the corresponding author and manuscript files.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                    <AntiSpamFields />
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <label htmlFor="firstName" className="text-sm font-medium">
                          First Name *
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input id="firstName" name="firstName" placeholder="Enter first name" className="pl-10" required />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="lastName" className="text-sm font-medium">
                          Last Name *
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input id="lastName" name="lastName" placeholder="Enter last name" className="pl-10" required />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">
                        Email Address *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="email" name="email" type="email" placeholder="Enter email address" className="pl-10" required />
                      </div>
                    </div>
                    
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <label htmlFor="affiliation" className="text-sm font-medium">
                          Institution / Affiliation *
                        </label>
                        <div className="relative">
                          <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input id="affiliation" name="affiliation" placeholder="Enter your institution" className="pl-10" required />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="country" className="text-sm font-medium">
                          Country / Region *
                        </label>
                        <div className="relative">
                          <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <select
                            id="country"
                            name="country"
                            className="w-full h-10 pl-10 pr-4 rounded-md border border-input bg-background text-sm"
                            required
                          >
                            <option value="">Select country / region</option>
                            {GLOBAL_COUNTRIES.map((c) => (
                              <option key={c.code} value={c.name}>
                                {c.flag} {c.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="discipline" className="text-sm font-medium">
                        Target Journal / Discipline *
                      </label>
                      <div className="relative">
                        <BookOpen className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <select 
                          id="discipline" 
                          name="discipline"
                          className="w-full h-10 pl-10 pr-4 rounded-md border border-input bg-background text-sm"
                          required
                        >
                          <option value="">Select a discipline / journal</option>
                          <optgroup label="Core Series">
                            <option value="social-sciences-humanities">Social Sciences & Humanities</option>
                            <option value="biology">Biology</option>
                            <option value="chemistry">Chemistry</option>
                            <option value="medicine">Medicine</option>
                            <option value="data-science">Data Science</option>
                            <option value="engineering">Engineering & Applied Sciences</option>
                            <option value="environmental-science">Environmental Science</option>
                          </optgroup>
                          <optgroup label="Emerging Frontiers Series">
                            <option value="clinical-ai-digital-health">Clinical AI & Digital Health</option>
                            <option value="ai-safety-governance">AI Safety & Governance</option>
                            <option value="decarbonization-carbon-tech">Decarbonization & Carbon Tech</option>
                            <option value="quantum-engineering">Quantum Engineering</option>
                            <option value="synthetic-biology-bio-design">Synthetic Biology & Bio-Design</option>
                            <option value="space-resources-orbital-economy">Space Resources & Orbital Economy</option>
                          </optgroup>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="submissionStage" className="text-sm font-medium">
                        Submission Type / Stage *
                      </label>
                      <div className="relative">
                        <Layers className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <select
                          id="submissionStage"
                          name="submissionStage"
                          className="w-full h-10 pl-10 pr-4 rounded-md border border-input bg-background text-sm"
                          required
                        >
                          <option value="">Select submission type</option>
                          <option value="Initial Submission">Initial Submission</option>
                          <option value="Revised Submission">Revised Submission</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="articleType" className="text-sm font-medium">
                        Article Category / Type *
                      </label>
                      <div className="relative">
                        <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <select
                          id="articleType"
                          name="articleType"
                          className="w-full h-10 pl-10 pr-4 rounded-md border border-input bg-background text-sm"
                          required
                        >
                          <option value="">Select article type</option>
                          <optgroup label="Research-based Articles">
                            <option value="Original Research">Original Research</option>
                            <option value="Brief Research Report">Brief Research Report</option>
                            <option value="Research Protocols">Research Protocols</option>
                            <option value="Research Clinical Trials Protocol">Research Clinical Trials Protocol</option>
                            <option value="Research Letter">Research Letter</option>
                            <option value="Observational Study">Observational Study</option>
                            <option value="Study Protocol / Data Article">Study Protocol / Data Article</option>
                          </optgroup>
                          <optgroup label="Review-based Articles">
                            <option value="Review">Review</option>
                            <option value="Book Review">Book Review</option>
                            <option value="Mini Review">Mini Review</option>
                            <option value="Systematic Review">Systematic Review & Meta-Analysis</option>
                            <option value="Scoping Review">Scoping Review</option>
                          </optgroup>
                          <optgroup label="Case-based Articles">
                            <option value="Case Report">Case Report</option>
                            <option value="Case Series">Case Series</option>
                            <option value="Technical Report">Technical Report</option>
                            <option value="Letter to the Editor (related to case study/series)">Letter to the Editor (related to case study/series)</option>
                            <option value="Clinical Image / Video Article">Clinical Image / Video Article</option>
                          </optgroup>
                          <optgroup label="Short Type Articles & Communications">
                            <option value="Editorial">Editorial</option>
                            <option value="Letter to the Editor">Letter to the Editor</option>
                            <option value="Commentary">Commentary</option>
                            <option value="Hypothesis">Hypothesis</option>
                            <option value="Opinion">Opinion</option>
                            <option value="Perspective Article">Perspective Article</option>
                            <option value="Short Communication">Short Communication</option>
                            <option value="Illustrations">Illustrations</option>
                            <option value="Conference Proceedings">Conference Proceedings</option>
                            <option value="Announcements">Announcements</option>
                          </optgroup>
                          <optgroup label="Other Types">
                            <option value="Method / Software Article">Method / Software Article</option>
                            <option value="Erratum / Corrigendum / Reply">Erratum / Corrigendum / Reply</option>
                            <option value="Other">Other Article Type</option>
                          </optgroup>
                        </select>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="title" className="text-sm font-medium">
                        Manuscript Title *
                      </label>
                      <Input id="title" name="title" placeholder="Enter the title of your manuscript" required />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="abstract" className="text-sm font-medium">
                        Abstract *
                      </label>
                      <Textarea 
                        id="abstract" 
                        name="abstract"
                        placeholder="Paste your abstract here (max 300 words)" 
                        rows={6}
                        required 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Upload Manuscript
                      </label>
                      <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                        <Upload className="h-10 w-10 mx-auto text-muted-foreground" />
                        <p className="mt-4 text-sm text-muted-foreground">
                          Drag and drop your manuscript here, or click to browse
                        </p>
                        <p className="mt-2 text-xs text-muted-foreground">
                          Accepted formats: .docx, .doc, .pdf (max 50MB)
                        </p>
                        {selectedFileName && (
                          <p className="mt-3 text-xs text-muted-foreground">
                            Selected: <span className="font-medium text-foreground">{selectedFileName}</span>
                          </p>
                        )}
                        <input
                          ref={fileInputRef}
                          id="manuscript"
                          name="manuscript"
                          type="file"
                          accept=".doc,.docx,.pdf"
                          className="hidden"
                          onChange={(e) => setSelectedFileName(e.target.files?.[0]?.name ?? null)}
                        />
                        <Button
                          variant="outline"
                          className="mt-4"
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <FileText className="mr-2 h-4 w-4" />
                          Select File
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <input 
                        type="checkbox" 
                        id="agreement" 
                        name="agreed"
                        value="true"
                        className="mt-1"
                        checked={agreed}
                        onChange={(e) => setAgreed(e.target.checked)}
                      />
                      <label htmlFor="agreement" className="text-sm text-muted-foreground">
                        I confirm that I have read and agree to the{" "}
                        <Link href="/author-guidelines" className="text-primary hover:underline">{t("nav.authorGuidelines")}</Link>,{" "}
                        <Link href="/publication-ethics" className="text-primary hover:underline">{t("nav.publicationEthics")}</Link>,{" "}
                        <Link href="/open-access" className="text-primary hover:underline">{t("nav.openAccess")}</Link>, and{" "}
                        <Link href="/apc-fees" className="text-primary hover:underline">{t("nav.apcFees")}</Link>.
                        I confirm that all authors have agreed to this submission.
                      </label>
                    </div>

                    <HumanVerification />
                    
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full"
                      disabled={!agreed || status === "submitting"}
                      onClick={async (e) => {
                        const form = (e.currentTarget as HTMLButtonElement).form
                        if (!form) return
                        if (!form.reportValidity()) return
                        setStatus("submitting")
                        setErrorMessage(null)
                        const formData = new FormData(form)
                        const emailVal = String(formData.get("email") || "")
                        const firstVal = String(formData.get("firstName") || "")
                        const lastVal = String(formData.get("lastName") || "")
                        const titleVal = String(formData.get("title") || "")
                        const disciplineVal = String(formData.get("discipline") || "")
                        const articleTypeVal = String(formData.get("articleType") || "")
                        const affiliationVal = String(formData.get("affiliation") || "")
                        setSubmittedEmail(emailVal)
                        setSubmittedName(`${firstVal} ${lastVal}`.trim())
                        try {
                          const result = await submitToEditorialOffice(formData)
                          const officialId = result?.trackingId || trackingId || "SUB-PENDING"
                          setTrackingId(officialId)
                          setSubmissionReceipt({
                            trackingId: officialId,
                            title: titleVal,
                            journal: JOURNAL_NAMES[disciplineVal] || disciplineVal || "Scholarly Open Journal",
                            articleType: articleTypeVal,
                            authorName: `${firstVal} ${lastVal}`.trim(),
                            authorEmail: emailVal,
                            affiliation: affiliationVal,
                            date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
                          })
                          setStatus("success")
                          window.scrollTo({ top: 0, behavior: "smooth" })
                        } catch (err) {
                          setStatus("error")
                          setErrorMessage(err instanceof Error ? err.message : "Submission failed.")
                        }
                      }}
                    >
                      {status === "submitting" ? "Submitting..." : t("nav.submitManuscript")}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>

                    {status === "error" && (
                      <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm">
                        <p className="font-medium">Submission failed.</p>
                        <p className="mt-1 text-muted-foreground">{errorMessage || `Please email the editorial office at ${recipient}.`}</p>
                      </div>
                    )}
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      )}

      <Footer />
    </div>
  )
}
