"use client"

import Link from "next/link"
import { useEffect } from "react"
import { ArrowRight, FileText, Image, Table, BookOpen, Download, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/lib/language-context"

const manuscriptSections = [
  {
    title: "Title Page",
    items: [
      "Concise and informative title (max 20 words)",
      "Full names and affiliations of all authors",
      "Corresponding author contact details",
      "Running title (max 50 characters)",
      "Word count and number of figures/tables",
    ],
  },
  {
    title: "Abstract",
    items: [
      "Structured abstract (Background, Methods, Results, Conclusions)",
      "Maximum 300 words",
      "No references or abbreviations",
      "Include 4-6 keywords",
    ],
  },
  {
    title: "Main Text",
    items: [
      "Introduction: Background, objectives, hypothesis",
      "Methods: Detailed, reproducible methodology",
      "Results: Clear presentation of findings",
      "Discussion: Interpretation and implications",
      "Conclusions: Summary and future directions",
    ],
  },
  {
    title: "References",
    items: [
      "APA 7th edition for social sciences & humanities and most journals",
      "AMA style or ICMJE recommendations for medical submissions",
      "Other discipline-appropriate guidelines where noted",
    ],
  },
]

const fileFormats = [
  {
    icon: FileText,
    title: "Manuscript",
    formats: "Microsoft Word (.docx) or LaTeX (.tex)",
    notes: "Double-spaced, 12pt font, numbered lines",
  },
  {
    icon: Image,
    title: "Figures",
    formats: "TIFF, EPS, or high-resolution PDF",
    notes: "Minimum 300 DPI, separate files",
  },
  {
    icon: Table,
    title: "Tables",
    formats: "Editable Word or Excel format",
    notes: "One table per page, clear headings",
  },
  {
    icon: BookOpen,
    title: "Supplementary",
    formats: "PDF, video (MP4), data files",
    notes: "Clearly labeled and referenced",
  },
]

export default function AuthorGuidelinesPage() {
  const { t } = useLanguage()

  useEffect(() => {
    if (typeof window !== "undefined") {
      document.title = `${t("nav.authorGuidelines")} | Scholarly Open`
    }
  }, [t])

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-muted/30 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8 lg:py-24">
            <div className="max-w-3xl">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-balance">
                {t("nav.authorGuidelines")}
              </h1>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                {t("guidelines.heroSubtitle")}
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/95 font-semibold">
                  <Link href="/submit">
                    {t("nav.submitManuscript")}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <a href="#" download>
                    <Download className="mr-2 h-4 w-4" />
                    {t("guidelines.downloadTemplate")}
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Before You Submit */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="max-w-3xl">
              <h2 className="text-3xl font-bold tracking-tight">{t("guidelines.beforeSubmit")}</h2>
              <p className="mt-4 text-muted-foreground">
                {t("guidelines.beforeSubmitSub")}
              </p>
              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-3 p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary mt-0.5">
                    <AlertCircle className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t("guidelines.originalWork")}</h3>
                    <p className="text-sm text-muted-foreground">
                      {t("guidelines.originalWorkDesc")}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50 border border-border">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary mt-0.5">
                    <AlertCircle className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t("guidelines.authorAgreement")}</h3>
                    <p className="text-sm text-muted-foreground">
                      {t("guidelines.authorAgreementDesc")}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50 border border-border">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary mt-0.5">
                    <AlertCircle className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t("guidelines.ethicsApproval")}</h3>
                    <p className="text-sm text-muted-foreground">
                      {t("guidelines.ethicsApprovalDesc")}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50 border border-border">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary mt-0.5">
                    <AlertCircle className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t("guidelines.conflictOfInterest")}</h3>
                    <p className="text-sm text-muted-foreground">
                      {t("guidelines.conflictOfInterestDesc")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Manuscript Structure */}
        <section className="py-16 lg:py-24 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="max-w-2xl mb-12">
              <h2 className="text-3xl font-bold tracking-tight">Manuscript Structure</h2>
              <p className="mt-4 text-muted-foreground">
                Organize your manuscript according to these sections for original research articles.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {manuscriptSections.map((section) => (
                <Card key={section.title}>
                  <CardHeader>
                    <CardTitle>{section.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {section.items.map((item, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary shrink-0 mt-2" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* File Formats */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="max-w-2xl mb-12">
              <h2 className="text-3xl font-bold tracking-tight">File Formats & Requirements</h2>
              <p className="mt-4 text-muted-foreground">
                Submit your files in the following formats for optimal processing.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {fileFormats.map((format) => (
                <div key={format.title} className="p-6 rounded-lg border border-border">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
                    <format.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold">{format.title}</h3>
                  <p className="text-sm text-primary mt-1">{format.formats}</p>
                  <p className="text-sm text-muted-foreground mt-2">{format.notes}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Formatting Guidelines */}
        <section className="py-16 lg:py-24 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-2">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">Text Formatting</h2>
                <p className="mt-4 text-muted-foreground mb-6">
                  Follow these formatting guidelines for your manuscript text.
                </p>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-background border border-border">
                    <h4 className="font-medium">Font & Spacing</h4>
                    <ul className="mt-2 text-sm text-muted-foreground space-y-1">
                      <li>Times New Roman or Arial, 12pt</li>
                      <li>Double-spaced throughout</li>
                      <li>2.5cm margins on all sides</li>
                      <li>Continuous line numbering</li>
                    </ul>
                  </div>
                  <div className="p-4 rounded-lg bg-background border border-border">
                    <h4 className="font-medium">Headings</h4>
                    <ul className="mt-2 text-sm text-muted-foreground space-y-1">
                      <li>Level 1: Bold, centered</li>
                      <li>Level 2: Bold, left-aligned</li>
                      <li>Level 3: Italic, left-aligned</li>
                      <li>Consistent numbering optional</li>
                    </ul>
                  </div>
                  <div className="p-4 rounded-lg bg-background border border-border">
                    <h4 className="font-medium">Language</h4>
                    <ul className="mt-2 text-sm text-muted-foreground space-y-1">
                      <li>American or British English (consistent)</li>
                      <li>SI units for measurements</li>
                      <li>Define abbreviations at first use</li>
                      <li>Avoid jargon where possible</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div>
                <h2 className="text-3xl font-bold tracking-tight">Figures & Tables</h2>
                <p className="mt-4 text-muted-foreground mb-6">
                  Guidelines for preparing visual elements.
                </p>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-background border border-border">
                    <h4 className="font-medium">Figures</h4>
                    <ul className="mt-2 text-sm text-muted-foreground space-y-1">
                      <li>Minimum 300 DPI resolution</li>
                      <li>Maximum width 17cm for full page</li>
                      <li>Legible text (minimum 8pt when printed)</li>
                      <li>Color figures at no extra charge</li>
                      <li>Include figure legends separately</li>
                    </ul>
                  </div>
                  <div className="p-4 rounded-lg bg-background border border-border">
                    <h4 className="font-medium">Tables</h4>
                    <ul className="mt-2 text-sm text-muted-foreground space-y-1">
                      <li>Editable format (not images)</li>
                      <li>Clear column and row headers</li>
                      <li>Footnotes for explanations</li>
                      <li>Avoid excessive gridlines</li>
                      <li>One table per page</li>
                    </ul>
                  </div>
                  <div className="p-4 rounded-lg bg-background border border-border">
                    <h4 className="font-medium">Supplementary Material</h4>
                    <ul className="mt-2 text-sm text-muted-foreground space-y-1">
                      <li>Clearly labeled (S1, S2, etc.)</li>
                      <li>Referenced in main text</li>
                      <li>Video files in MP4 format</li>
                      <li>Data files with documentation</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* References */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="max-w-3xl">
              <h2 className="text-3xl font-bold tracking-tight">Reference Style</h2>
              <p className="mt-4 text-muted-foreground mb-8">
                Use APA 7th edition citation style for social sciences & humanities and most journals, and AMA style or ICMJE recommendations for medical submissions. Always follow the journal-specific instructions for final formatting.
              </p>
              
              <div className="space-y-6">
                <div className="p-6 rounded-lg bg-muted/50 border border-border">
                  <h4 className="font-semibold mb-3">Journal Article</h4>
                  <p className="text-sm text-muted-foreground font-mono bg-background p-3 rounded">
                    {"Author, A. A., & Author, B. B. (Year). Title of article. Journal Name, Volume(Issue), Page-Page. https://doi.org/xxxxx"}
                  </p>
                </div>
                
                <div className="p-6 rounded-lg bg-muted/50 border border-border">
                  <h4 className="font-semibold mb-3">Book</h4>
                  <p className="text-sm text-muted-foreground font-mono bg-background p-3 rounded">
                    Author, A. A. (Year). Title of work: Capital letter also for subtitle. Publisher.
                  </p>
                </div>
                
                <div className="p-6 rounded-lg bg-muted/50 border border-border">
                  <h4 className="font-semibold mb-3">Book Chapter</h4>
                  <p className="text-sm text-muted-foreground font-mono bg-background p-3 rounded">
                    Author, A. A. (Year). Title of chapter. In E. E. Editor (Ed.), Title of book (pp. xx-xx). Publisher.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-secondary text-secondary-foreground">
          <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8 lg:py-20">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {t("cta.title")}
              </h2>
              <p className="mt-4 text-lg text-secondary-foreground/80">
                Once your manuscript is prepared according to these guidelines, you can submit through our online system.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link href="/submit">
                    {t("nav.submitManuscript")}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/contact">{t("nav.contact")}</Link>
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
