"use client"

import { useRef, useState } from "react"
import Link from "next/link"
import { ArrowRight, Upload, FileText, CheckCircle, AlertCircle, User, Mail, Building, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/lib/language-context"

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

  const recipient = "scholarlyopen@gmail.com"

  const submitToEditorialOffice = async (formData: FormData) => {
    const response = await fetch("/api/submit", { method: "POST", body: formData })
    const json = (await response.json().catch(() => null)) as { ok?: boolean; error?: string } | null
    if (!response.ok || !json?.ok) {
      throw new Error(json?.error || "Submission failed.")
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
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
                        <a href="mailto:scholarlyopen@gmail.com" className="text-primary hover:underline">
                          scholarlyopen@gmail.com
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
                  Please provide your contact information to begin the submission process.
                </p>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Corresponding Author Information</CardTitle>
                  <CardDescription>
                    The corresponding author will receive all communications regarding the manuscript.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
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
                            <option value="engineering">Engineering</option>
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
                        <Link href="/publication-ethics" className="text-primary hover:underline">{t("nav.publicationEthics")}</Link>, and{" "}
                        <Link href="/open-access" className="text-primary hover:underline">{t("nav.openAccess")}</Link>.
                        I confirm that all authors have agreed to this submission.
                      </label>
                    </div>
                    
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
                        try {
                          await submitToEditorialOffice(formData)
                          setStatus("success")
                        } catch (err) {
                          setStatus("error")
                          setErrorMessage(err instanceof Error ? err.message : "Submission failed.")
                        }
                      }}
                    >
                      {status === "submitting" ? "Submitting..." : t("nav.submitManuscript")}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>

                    {status === "success" && (
                      <div className="rounded-lg border border-border bg-muted/30 p-4 text-sm">
                        <p className="font-medium">Submitted.</p>
                        <p className="mt-1 text-muted-foreground">
                          Your manuscript has been emailed to the editorial office. You will be contacted at the email address you provided.
                        </p>
                      </div>
                    )}
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

      <Footer />
    </div>
  )
}
