"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { 
  Download, Check, Copy, Printer, Mail, ChevronRight, CheckCircle2, FileCode, FileText
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { samLeeArticleFullText, ArticleTable } from "@/lib/data/fulltext/somed-26-rw01"
import { slugify } from "@/lib/utils"

function OrcidIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="ORCID iD"
    >
      <circle cx="12" cy="12" r="12" fill="#A6CE39" />
      <path
        fill="#FFFFFF"
        d="M7.369 4.378c.525 0 .947.431.947.947s-.422.947-.947.947a.95.95 0 0 1-.947-.947c0-.525.422-.947.947-.947zm-.722 3.038h1.444v10.041H6.647V7.416zm3.562 0h3.9c3.712 0 5.344 2.653 5.344 5.025 0 2.578-2.016 5.025-5.325 5.025h-3.919V7.416zm1.444 1.303v7.444h2.297c3.272 0 4.022-2.484 4.022-3.722 0-2.016-1.284-3.722-4.097-3.722h-2.222z"
      />
    </svg>
  )
}

export function ArticleFullTextViewer() {
  const article = samLeeArticleFullText
  const [activeSection, setActiveSection] = useState<string>("abstract")
  const [copiedCitation, setCopiedCitation] = useState<string | null>(null)
  const [highlightedRef, setHighlightedRef] = useState<string | null>(null)

  // Scrollspy to update active section in PeerJ-style Table of Contents
  useEffect(() => {
    const handleScroll = () => {
      const headings = document.querySelectorAll("section[id], div[id^='table-'], div[id='figure-1']")
      const scrollPosition = window.scrollY + 160

      headings.forEach((heading) => {
        const top = (heading as HTMLElement).offsetTop
        const height = (heading as HTMLElement).offsetHeight
        const id = heading.getAttribute("id")

        if (id && scrollPosition >= top && scrollPosition < top + height) {
          setActiveSection(id)
        }
      })
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      const yOffset = -90
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: "smooth" })
      setActiveSection(id)

      if (id.startsWith("ref-")) {
        setHighlightedRef(id)
        setTimeout(() => setHighlightedRef(null), 3000)
      }
    }
  }

  const copyToClipboard = (text: string, format: string) => {
    navigator.clipboard.writeText(text)
    setCopiedCitation(format)
    setTimeout(() => setCopiedCitation(null), 3000)
  }

  // Helper to parse in-text citations into interactive superscripts crosslinked to references
  const renderTextWithCitations = (text: string) => {
    const uniMap: Record<string, string> = {
      '¹':'1', '²':'2', '³':'3', '⁴':'4', '⁵':'5',
      '⁶':'6', '⁷':'7', '⁸':'8', '⁹':'9', '⁰':'0',
      '˒':',', '⁻':'-', '–':'-'
    }

    // Match unicode superscript groups OR trailing numeric citation groups like .7, 8, 10, 11, 28–30
    const citationRegex = /([¹²³⁴⁵⁶⁷⁸⁹⁰˒⁻–]+)|(?<=[.!?]\s*)([0-9]+(?:\s*[,–-]\s*[0-9]+)+)/g
    const parts: React.ReactNode[] = []
    let lastIndex = 0
    let match: RegExpExecArray | null

    while ((match = citationRegex.exec(text)) !== null) {
      if (match[0] === '–' || match[0] === '⁻' || match[0] === '˒') continue

      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index))
      }

      const rawMatch = match[0]
      const cleaned = rawMatch
        .split('')
        .map(c => uniMap[c] || c)
        .join('')
        .replace(/\s+/g, '')

      const citeTokens = cleaned.split(/([,-])/)
      const citeNodes: React.ReactNode[] = []

      citeTokens.forEach((token, tIdx) => {
        const num = parseInt(token, 10)
        if (!isNaN(num) && num >= 1 && num <= 40) {
          citeNodes.push(
            <a
              key={tIdx}
              href={`#ref-${num}`}
              onClick={(e) => {
                e.preventDefault()
                scrollTo(`ref-${num}`)
              }}
              className="text-primary hover:text-primary hover:bg-primary/10 rounded px-0.5 transition-colors cursor-pointer font-semibold"
              title={`View Reference [${num}]`}
            >
              {num}
            </a>
          )
        } else if (token === ',') {
          citeNodes.push(', ')
        } else if (token === '-') {
          citeNodes.push('–')
        } else {
          citeNodes.push(token)
        }
      })

      parts.push(
        <sup key={match.index} className="text-[11px] font-semibold text-primary ml-0.5 select-none">
          [{citeNodes}]
        </sup>
      )

      lastIndex = match.index + rawMatch.length
    }

    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex))
    }

    return parts.length > 0 ? parts : text
  }

  const amaCitation = `Lee S. Prevent Earlier, Recognize Sooner, Treat Faster: A Proposed Evidence-Based Medicine–Integrated Rapid Response Framework (EBM-IRRF) for Acute Aortic Dissection. Scholarly Open: Medicine. 2026;1(1):SOMED-26-RW01.`
  const apaCitation = `Lee, S. (2026). Prevent Earlier, Recognize Sooner, Treat Faster: A Proposed Evidence-Based Medicine–Integrated Rapid Response Framework (EBM-IRRF) for Acute Aortic Dissection. Scholarly Open: Medicine, 1(1), SOMED-26-RW01.`
  const bibtexCitation = `@article{lee2026prevent,
  title={Prevent Earlier, Recognize Sooner, Treat Faster: A Proposed Evidence-Based Medicine–Integrated Rapid Response Framework (EBM-IRRF) for Acute Aortic Dissection},
  author={Lee, Sam},
  journal={Scholarly Open: Medicine},
  volume={1},
  number={1},
  pages={SOMED-26-RW01},
  year={2026},
  publisher={Scholarly Open}
}`

  // Render a clean PeerJ-styled scientific table (clean header with print action, no awkward orphan footer text)
  const renderTable = (table: ArticleTable) => (
    <div key={table.id} id={table.id} className="scroll-mt-24 my-8 rounded-xl border border-border bg-card shadow-xs overflow-hidden">
      <div className="p-4 sm:p-5 border-b border-border bg-muted/30 flex items-center justify-between gap-4">
        <h4 className="font-bold text-sm sm:text-base text-foreground leading-snug">
          {table.caption}
        </h4>
        <button
          onClick={() => window.print()}
          className="shrink-0 hover:text-primary transition-colors inline-flex items-center gap-1.5 text-xs text-muted-foreground font-medium px-2.5 py-1 rounded-md border border-border/60 hover:bg-background"
          title="Print or export table"
        >
          <Printer className="h-3 w-3" />
          <span>Print table</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs sm:text-sm text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-muted/50 text-foreground font-semibold">
              {table.headers.map((h, i) => (
                <th key={i} className="py-3 px-4 font-bold border-r border-border/40 last:border-r-0">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {table.rows.map((row, rIdx) => (
              <tr key={rIdx} className="hover:bg-muted/20 transition-colors">
                {row.map((cell, cIdx) => (
                  <td key={cIdx} className="py-3 px-4 text-muted-foreground align-top border-r border-border/40 last:border-r-0 leading-relaxed font-normal">
                    {renderTextWithCitations(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend Footer with exact Table Note - clean, no orphan 'Table 1' footer text */}
      {table.note && (
        <div className="p-3.5 bg-muted/20 border-t border-border/60 text-xs text-muted-foreground leading-relaxed font-normal">
          <span className="font-semibold text-foreground/90 not-italic mr-1.5">Note:</span>
          <span className="italic">{table.note.replace(/^Note\.\s*/i, "")}</span>
        </div>
      )}
    </div>
  )

  return (
    <div className="space-y-8 font-sans antialiased text-slate-800 dark:text-slate-200">
      
      {/* PeerJ Style Breadcrumb & Header Masthead */}
      <div className="border-b border-border pb-6 space-y-4 relative">
        {/* Subtle Brand Yellow Micro Accent Line */}
        {/* Navigation Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Link href="/journals" className="hover:text-primary transition-colors">Journals</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/journals/medicine" className="hover:text-primary transition-colors font-medium text-foreground">
              Scholarly Open: Medicine
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span>Vol. 1 (2026)</span>
            <ChevronRight className="h-3 w-3" />
            <span className="font-semibold text-primary">{article.id}</span>
          </div>

          {/* Unified Single Status Badge (Eliminates the 'two heads' clashing pills) */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-600/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 text-xs font-medium shadow-2xs">
            <span className="flex items-center gap-1 font-semibold text-emerald-700 dark:text-emerald-300">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              Peer-Reviewed
            </span>
            <span className="text-emerald-600/40 dark:text-emerald-400/40">•</span>
            <span>Open Access (CC BY 4.0)</span>
          </div>
        </div>

        {/* Article Title */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground leading-[1.25]">
          {article.title}
        </h1>

        {/* Authors Line with ORCID, Mail, Affiliations & Correspondence */}
        <div className="space-y-3 pt-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-base sm:text-lg font-semibold text-foreground">
            {article.authors.map((author, aIdx) => (
              <span key={aIdx} className="inline-flex items-center gap-1 flex-wrap">
                <span className="text-foreground font-bold">{author.name}</span>
                {/* Official ORCID iD Icon stuck right next to academic credentials */}
                <a
                  href={`https://orcid.org/${article.authors[0].orcid || "0009-0009-6801-4031"}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="ORCID: 0009-0009-6801-4031"
                  className="inline-flex items-center hover:opacity-85 transition-opacity ml-1"
                  aria-label="Author ORCID Record"
                >
                  <OrcidIcon className="h-4 w-4" />
                </a>
                {/* Mail Icon stuck right next to credentials */}
                {author.corresponding && (
                  <a
                    href={`mailto:${author.email}`}
                    title={`Contact Corresponding Author: ${author.email}`}
                    className="inline-flex items-center justify-center text-muted-foreground hover:text-primary transition-colors ml-0.5"
                    aria-label={`Email ${author.name}`}
                  >
                    <Mail className="h-3.5 w-3.5" />
                  </a>
                )}
                {/* Affiliation superscripts */}
                <sup className="text-xs text-primary font-bold tracking-tight ml-0.5">1,2,*</sup>
              </span>
            ))}
          </div>

          <div className="space-y-1.5 text-xs text-muted-foreground">
            {article.authors[0].affiliations.map((aff, idx) => (
              <div key={idx} className="flex items-baseline gap-2 leading-relaxed">
                <span className="font-semibold text-primary select-none text-[11px] min-w-[14px]">{idx + 1}</span>
                <span>{aff}</span>
              </div>
            ))}
            <div className="flex items-baseline gap-2 pt-1 border-t border-border/50 text-[11px] text-muted-foreground">
              <span className="font-bold text-primary select-none min-w-[14px]">*</span>
              <span>
                <strong className="text-foreground font-semibold">Correspondence:</strong>{" "}
                <a
                  href={`mailto:${article.authors[0].email}`}
                  className="text-primary hover:underline font-medium hover:text-[#B45309] dark:hover:text-[#F6BB14] transition-colors"
                  title={`Email ${article.authors[0].email}`}
                >
                  {article.authors[0].email}
                </a>
              </span>
            </div>
          </div>
        </div>

        {/* Editorial Metadata Strip (Uniform typography across Identifier and DOI) */}
        <div className="pt-3 border-t border-border flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
          <div className="flex flex-wrap items-center gap-4">
            <span>Published: <strong className="text-foreground">{article.date}</strong></span>
            <span>•</span>
            <span>Academic Editor: <strong className="text-foreground">{article.handlingEditor.name}</strong></span>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span>Identifier: <strong className="text-foreground font-semibold">{article.accessionId}</strong></span>
            <span>•</span>
            <span>DOI: <strong className="text-foreground font-semibold">Pending Crossref Deposit</strong></span>
          </div>
        </div>

        {/* Action Bar (Download PDF, XML, Word, Print) */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-muted/40 rounded-xl border border-border">
          <div className="flex flex-wrap items-center gap-2">
            <Button asChild size="sm" className="font-semibold shadow-xs">
              <a href={article.pdfUrl} target="_blank" rel="noopener noreferrer">
                <Download className="h-4 w-4 mr-1.5" />
                Download PDF <span className="ml-1 text-[11px] opacity-80 font-normal">(1.55 MB)</span>
              </a>
            </Button>
            <Button asChild variant="outline" size="sm" className="text-xs">
              <a href={article.xmlUrl} target="_blank" rel="noopener noreferrer">
                <FileCode className="h-4 w-4 mr-1.5 text-primary" />
                JATS XML
              </a>
            </Button>
            <Button asChild variant="ghost" size="sm" className="text-xs text-muted-foreground">
              <a href={article.docxUrl} download>
                <FileText className="h-3.5 w-3.5 mr-1" />
                Word (.docx)
              </a>
            </Button>
          </div>

          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <Badge variant="outline" className="text-xs font-medium border-accent/60 bg-accent/15 text-foreground">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent mr-1.5" />
              Inaugural Volume · CC BY 4.0
            </Badge>
            <Button variant="outline" size="sm" onClick={() => window.print()} className="text-xs">
              <Printer className="h-3.5 w-3.5 mr-1" />
              Print
            </Button>
          </div>
        </div>
      </div>

      {/* Main Tabs (Article | Peer Review History | Cite & Metrics) */}
      <Tabs defaultValue="article" className="w-full">
        <TabsList className="grid grid-cols-3 max-w-lg mx-auto mb-8 bg-muted/60 p-1 rounded-xl">
          <TabsTrigger value="article" className="font-semibold text-xs sm:text-sm  data-[state=active]:text-foreground">
            Article
          </TabsTrigger>
          <TabsTrigger value="transparency" className="font-semibold text-xs sm:text-sm  data-[state=active]:text-foreground">
            Peer Review History
          </TabsTrigger>
          <TabsTrigger value="metadata" className="font-semibold text-xs sm:text-sm  data-[state=active]:text-foreground">
            Cite &amp; Metrics
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: FULL TEXT ARTICLE */}
        <TabsContent value="article" className="focus-visible:outline-none">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Sticky Left Navigation (Outline) */}
            <aside className="hidden lg:block lg:col-span-1">
              <div className="sticky top-24 space-y-4 max-h-[calc(100vh-7rem)] overflow-y-auto pr-3 text-xs">
                <div className="font-bold uppercase tracking-wider text-muted-foreground pb-2 border-b border-border">
                  Contents
                </div>

                <nav className="space-y-1">
                  <button
                    onClick={() => scrollTo("abstract")}
                    className={`w-full text-left px-2.5 py-1.5 rounded-md transition-colors ${activeSection === "abstract" ? "bg-primary/10 border-l-2 border-primary text-foreground font-bold" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    Abstract
                  </button>

                  <div className="pt-2 pb-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 px-2">
                    Sections
                  </div>

                  {article.sections.map((sec) => (
                    <button
                      key={sec.id}
                      onClick={() => scrollTo(sec.id)}
                      className={`w-full text-left py-1 rounded-md transition-colors truncate ${sec.level === 3 ? "pl-5 text-[11px]" : "px-2.5 font-medium"} ${activeSection === sec.id ? "bg-primary/10 border-l-2 border-primary text-foreground font-bold" : "text-muted-foreground hover:text-foreground"}`}
                      title={sec.title}
                    >
                      {sec.title}
                    </button>
                  ))}

                  <div className="pt-2 pb-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 px-2">
                    Tables &amp; Figures
                  </div>

                  {article.tables.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => scrollTo(t.id)}
                      className={`w-full text-left px-2.5 py-1 rounded-md transition-colors truncate text-[11px] ${activeSection === t.id ? "bg-primary/10 border-l-2 border-primary text-foreground font-bold" : "text-muted-foreground hover:text-foreground"}`}
                      title={t.caption}
                    >
                      Table {t.number}
                    </button>
                  ))}

                  <button
                    onClick={() => scrollTo("figure-1")}
                    className={`w-full text-left px-2.5 py-1 rounded-md transition-colors truncate text-[11px] ${activeSection === "figure-1" ? "bg-primary/10 border-l-2 border-primary text-foreground font-bold" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    Figure 1 (EBM-IRRF Care Continuum)
                  </button>

                  <div className="pt-2 pb-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 px-2">
                    References
                  </div>

                  <button
                    onClick={() => scrollTo("references")}
                    className={`w-full text-left px-2.5 py-1.5 rounded-md transition-colors ${activeSection === "references" ? "bg-primary/10 border-l-2 border-primary text-foreground font-bold" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    References (1–40)
                  </button>
                </nav>

                <div className="pt-4 border-t border-border">
                  <Button asChild size="sm" variant="outline" className="w-full text-xs">
                    <a href={article.pdfUrl} target="_blank" rel="noopener noreferrer">
                      <Download className="h-3.5 w-3.5 mr-1" /> PDF (1.55 MB)
                    </a>
                  </Button>
                </div>
              </div>
            </aside>

            {/* Main Reading Column */}
            <div className="lg:col-span-3 space-y-8 text-base leading-[1.75]">
              
              {/* Structured Abstract */}
              <section id="abstract" className="scroll-mt-24 p-6 sm:p-7 rounded-2xl bg-card border border-border shadow-xs space-y-4">
                <div className="border-b border-border pb-3">
                  <h2 className="text-xl font-extrabold text-foreground tracking-tight">Abstract</h2>
                </div>

                <div className="space-y-3 leading-relaxed text-[15px] sm:text-base font-normal">
                  <p>
                    <strong className="text-foreground font-semibold">Background: </strong>
                    {renderTextWithCitations(article.abstract.background)}
                  </p>
                  <p>
                    <strong className="text-foreground font-semibold">Objective: </strong>
                    {renderTextWithCitations(article.abstract.objective)}
                  </p>
                  <p>
                    <strong className="text-foreground font-semibold">Methods: </strong>
                    {renderTextWithCitations(article.abstract.methods)}
                  </p>
                  <p>
                    <strong className="text-foreground font-semibold">Results (Evidence Synthesis and Proposed Framework): </strong>
                    {renderTextWithCitations(article.abstract.results)}
                  </p>
                  <p>
                    <strong className="text-foreground font-semibold">Conclusions: </strong>
                    {renderTextWithCitations(article.abstract.conclusions)}
                  </p>
                </div>

                {/* Clickable Keywords Matching Topics & Editors */}
                <div className="pt-4 border-t border-border flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground mr-1">Keywords:</span>
                  {article.abstract.keywords.map((kw, idx) => {
                    const cleanKw = kw.replace(/\.$/, "").trim()
                    return (
                      <Link 
                        key={idx} 
                        href={`/topics/${slugify(cleanKw)}`}
                        className="inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-md bg-muted/50 hover:bg-primary/10 hover:text-primary transition-colors border border-border/60"
                        title={`Explore articles and editorial board members in ${cleanKw}`}
                      >
                        {cleanKw}
                      </Link>
                    )
                  })}
                </div>
              </section>

              {/* Main Body Sections & Tables */}
              {article.sections.map((sec) => (
                <section key={sec.id} id={sec.id} className="scroll-mt-24 space-y-4 pt-6 border-t border-border/60">
                  {sec.level === 2 ? (
                    <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                      {sec.title}
                    </h2>
                  ) : (
                    <h3 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
                      {sec.title}
                    </h3>
                  )}

                  <div className="space-y-4 text-foreground/90 leading-relaxed text-[15px] sm:text-base font-normal">
                    {sec.paragraphs.map((p, pIdx) => {
                      // Check for Table Reference trigger
                      if (p.startsWith("__TABLE_REF__:")) {
                        const caption = p.replace("__TABLE_REF__:", "").trim()
                        const matchedTable = article.tables.find(t => caption.startsWith(`Table ${t.number}.`))
                        if (matchedTable) {
                          return renderTable(matchedTable)
                        }
                        return null
                      }

                      // Check for Figure 1 trigger (As it is in the manuscript - authentic text-flowchart without custom drawn mock cards)
                      if (p === "__FIGURE_1_REF__") {
                        return (
                          <div key={pIdx} id="figure-1" className="scroll-mt-24 my-8 p-6 sm:p-7 rounded-xl border border-border bg-card shadow-xs space-y-6">
                            <div className="border-b border-border pb-3">
                              <h4 className="font-bold text-base sm:text-lg text-foreground tracking-tight">
                                Figure 1. EBM-IRRF: Clinical Care Continuum and Cross-Cutting Enabling Functions
                              </h4>
                            </div>

                            <div className="space-y-6 text-xs sm:text-sm font-sans">
                              {/* SECTION 1: PRINCIPAL CLINICAL AND COORDINATION COMPONENTS */}
                              <div className="space-y-3">
                                <h5 className="font-bold text-xs uppercase tracking-wider text-muted-foreground border-b border-border/60 pb-1.5">
                                  Principal Clinical and Coordination Components
                                </h5>
                                
                                <div className="space-y-2 max-w-2xl mx-auto">
                                  <div className="p-3 rounded-lg border border-border bg-muted/30 text-center font-medium text-foreground">
                                    1. Prevention and Risk-Based Surveillance
                                  </div>
                                  <div className="text-center text-muted-foreground font-bold text-base leading-none">↓</div>
                                  <div className="p-3 rounded-lg border border-border bg-muted/30 text-center font-medium text-foreground">
                                    2. Early Recognition and Diagnostic Escalation
                                  </div>
                                  <div className="text-center text-muted-foreground font-bold text-base leading-none">↓</div>
                                  <div className="p-3 rounded-lg border border-border bg-muted/30 text-center font-medium text-foreground">
                                    3. Regional Referral and Interhospital Transfer
                                  </div>
                                  <div className="text-center text-muted-foreground font-bold text-base leading-none">↓</div>
                                  <div className="p-3 rounded-lg border border-border bg-muted/30 text-center font-medium text-foreground">
                                    4. Multidisciplinary Emergency Readiness and Definitive Treatment
                                  </div>
                                </div>
                              </div>

                              {/* SECTION 2: CROSS-CUTTING ENABLING FUNCTIONS */}
                              <div className="space-y-3 pt-3 border-t border-border/60">
                                <h5 className="font-bold text-xs uppercase tracking-wider text-muted-foreground border-b border-border/60 pb-1.5">
                                  Cross-Cutting Enabling Functions (Support Components 1–4)
                                </h5>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                  <div className="p-3 rounded-lg border border-border bg-muted/30 space-y-1">
                                    <span className="font-semibold text-foreground block">5. Continuous Evidence-Based Medicine Support</span>
                                    <p className="text-muted-foreground text-xs leading-relaxed font-normal">Including optional independent third-party EBM consultation.</p>
                                  </div>
                                  <div className="p-3 rounded-lg border border-border bg-muted/30 space-y-1">
                                    <span className="font-semibold text-foreground block">6. Appropriately Validated, Clinician-Supervised AI Assistance</span>
                                    <p className="text-muted-foreground text-xs leading-relaxed font-normal">Clinician-supervised diagnostic and triage algorithmic assistance.</p>
                                  </div>
                                  <div className="p-3 rounded-lg border border-border bg-muted/30 space-y-1">
                                    <span className="font-semibold text-foreground block">7. Tiered Organizational Leadership, Accountability, and Continuous Quality Improvement</span>
                                    <p className="text-muted-foreground text-xs leading-relaxed font-normal">Institutional escalation, resource availability, and safety accountability.</p>
                                  </div>
                                </div>
                              </div>

                              {/* SECTION 3: PATIENT-CENTERED PRINCIPLE */}
                              <div className="space-y-2 pt-3 border-t border-border/60">
                                <h5 className="font-bold text-xs uppercase tracking-wider text-muted-foreground border-b border-border/60 pb-1.5">
                                  Patient-Centered Principle Across All Components
                                </h5>
                                <div className="p-3 rounded-lg border border-border bg-muted/20 text-center text-xs sm:text-sm font-medium text-foreground">
                                  Patient Participation • Patient Autonomy • Informed Decision-Making • Patient Safety
                                </div>
                              </div>
                            </div>

                            {/* LEGEND NOTE */}
                            <div className="pt-3 border-t border-border/60 text-xs text-muted-foreground italic leading-relaxed">
                              <p>
                                <strong>Note.</strong> EBM-IRRF = Evidence-Based Medicine–Integrated Rapid Response Framework; AI = artificial intelligence. Components 1–4 represent the principal clinical and coordination functions, whereas Components 5–7 provide cross-cutting support. The framework is conceptual and has not been prospectively validated. The arrows illustrate the care continuum rather than a mandatory sequential workflow. Patient-specific clinical decisions remain under qualified clinician authority, and supporting functions must not delay emergency evaluation, transfer, or definitive treatment.
                              </p>
                            </div>
                          </div>
                        )
                      }

                      // Check for Section 4.4 subheadings (properly styled)
                      if (p === "Principal Clinical and Coordination Components" || p === "Cross-Cutting Clinical and Organizational Support Components") {
                        return (
                          <h4 key={pIdx} className="text-base sm:text-lg font-bold text-foreground mt-6 mb-2 tracking-tight">
                            {p}
                          </h4>
                        )
                      }

                      // Check for Numbered Components 1-7 (bold lead-in ONLY, text in normal font weight with crosslinked citations)
                      const numberedMatch = p.match(/^([1-7]\.\s+[^.]+\.)\s+(.+)$/)
                      if (numberedMatch) {
                        return (
                          <p key={pIdx} className="text-foreground/90 leading-relaxed font-normal">
                            <strong className="font-bold text-foreground">{numberedMatch[1]}</strong>{" "}
                            <span>{renderTextWithCitations(numberedMatch[2])}</span>
                          </p>
                        )
                      }

                      return (
                        <p key={pIdx} className="text-foreground/90 leading-relaxed font-normal">
                          {renderTextWithCitations(p)}
                        </p>
                      )
                    })}
                  </div>
                </section>
              ))}

              {/* Complete References List (1 to 40 AMA) */}
              <section id="references" className="scroll-mt-24 space-y-6 pt-8 border-t-2 border-border">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                    References
                  </h3>
                  <Badge variant="outline" className="text-xs font-semibold">
                    40 AMA 11th Ed. Citations
                  </Badge>
                </div>

                <ol className="space-y-3 text-xs sm:text-sm text-muted-foreground list-decimal list-inside leading-relaxed">
                  {article.references.map((ref) => (
                    <li 
                      key={ref.num} 
                      id={`ref-${ref.num}`} 
                      className={`transition-colors p-2.5 rounded-lg scroll-mt-28 ${highlightedRef === `ref-${ref.num}` ? "bg-primary/10 text-foreground ring-1 ring-primary/40 border-l-2 border-primary font-medium" : "hover:text-foreground hover:bg-muted/30"}`}
                    >
                      <span className="text-foreground/90 font-normal">{ref.fullText}</span>
                    </li>
                  ))}
                </ol>
              </section>

              {/* Creative Commons License & Copyright Footer */}
              <div className="p-4 sm:p-5 rounded-xl bg-muted/30 border border-border text-xs text-muted-foreground space-y-1">
                <p className="font-semibold text-foreground">
                  © 2026 The Author(s). Published by Scholarly Open.
                </p>
                <p>
                  This is an open access article distributed under the terms of the{" "}
                  <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">
                    Creative Commons Attribution 4.0 International License (CC BY 4.0)
                  </a>
                  , which permits unrestricted use, distribution, and reproduction in any medium, provided the original work is properly cited.
                </p>
              </div>

            </div>
          </div>
        </TabsContent>

        {/* TAB 2: TRANSPARENT PEER REVIEW RECORD (REAL REFEREE COMMENTS & DECISION) */}
        <TabsContent value="transparency" className="space-y-6 focus-visible:outline-none">
          <Card className="border-border">
            <CardHeader className="border-b border-border bg-muted/20">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <CardTitle className="text-lg font-bold">Transparent Peer Review Record</CardTitle>
                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 text-xs font-semibold">
                  Open Peer Review
                </Badge>
              </div>
              <CardDescription className="text-xs text-muted-foreground pt-1">
                In accordance with Scholarly Open's commitment to open scientific discourse and transparency, the unedited peer review comments, author responses, and editorial decision history are published alongside the final article.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
              {/* Editorial Timeline */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                  Editorial Processing Timeline
                </h4>
                <div className="relative pl-6 border-l-2 border-primary/30 space-y-4 text-xs">
                  {article.peerReviewTransparency.timeline.map((step, idx) => (
                    <div key={idx} className="relative">
                      <div className="absolute -left-[31px] top-0.5 h-3.5 w-3.5 rounded-full bg-primary border-2 border-background" />
                      <span className="text-muted-foreground font-semibold">{step.date}</span>
                      <p className="text-foreground font-medium text-xs sm:text-sm">{step.event}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Official Reviewer Reports from reviews.json and rebuttal */}
              <div className="space-y-4 pt-4 border-t border-border">
                <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                  Official Referee Reports
                </h4>
                <div className="space-y-4">
                  {article.peerReviewTransparency.reviewers.map((rev, idx) => (
                    <Card key={idx} className="bg-muted/20 border-border">
                      <CardHeader className="pb-3 border-b border-border/60">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div>
                            <CardTitle className="text-sm font-bold text-foreground">{rev.id}</CardTitle>
                            <CardDescription className="text-xs text-muted-foreground">Evaluation Date: {rev.date}</CardDescription>
                          </div>
                          <Badge variant="outline" className={rev.recommendation.includes("Accept") ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 text-xs font-semibold" : "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30 text-xs font-semibold"}>
                            Recommendation: {rev.recommendation}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-3 text-xs text-foreground/90 leading-relaxed font-sans whitespace-pre-line">
                        {rev.comments}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Author Rebuttal & Editorial Decision */}
              <div className="space-y-4 pt-4 border-t border-border">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                    Author Rebuttal &amp; Point-by-Point Response
                  </h4>
                  <div className="flex items-center gap-2">
                    <Button asChild size="sm" variant="outline" className="text-xs">
                      <a href={article.rebuttalPdfUrl} target="_blank" rel="noopener noreferrer">
                        <Download className="h-3.5 w-3.5 mr-1 text-primary" />
                        Download Rebuttal PDF (357 KB)
                      </a>
                    </Button>
                    <Button asChild size="sm" variant="ghost" className="text-xs text-muted-foreground">
                      <a href={article.rebuttalDocxUrl} download>
                        <FileText className="h-3.5 w-3.5 mr-1" />
                        Word Rebuttal
                      </a>
                    </Button>
                  </div>
                </div>

                <div className="p-4 bg-muted/30 rounded-xl border border-border text-xs text-muted-foreground space-y-2 leading-relaxed">
                  <p className="font-bold text-foreground text-sm flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    Editorial Decision by Handling Editor: {article.handlingEditor.name}
                  </p>
                  <p className="text-foreground/90 font-normal">
                    The author submitted a comprehensive 14-page point-by-point rebuttal responding directly to all referee comments. In accordance with the reviewers' recommendations, the manuscript has been concised, structured with 5 formal comparative academic tables, expanded to 40 references, and enriched with the EBM-IRRF operational care continuum. Revisions are verified as scientifically sound and complete. The manuscript is accepted for publication in Volume 1.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 3: CITE & METRICS */}
        <TabsContent value="metadata" className="space-y-6 focus-visible:outline-none">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-base font-bold">
                  Citation Formats
                </CardTitle>
                <CardDescription className="text-xs">
                  Export citation into EndNote, Zotero, or Mendeley.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-xs font-sans">
                {/* AMA */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-foreground uppercase tracking-wider text-[11px]">AMA (11th ed.)</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => copyToClipboard(amaCitation, "ama")}
                      className="h-7 text-xs text-primary"
                    >
                      {copiedCitation === "ama" ? <Check className="h-3 w-3 mr-1 text-emerald-500" /> : <Copy className="h-3 w-3 mr-1" />}
                      {copiedCitation === "ama" ? "Copied" : "Copy"}
                    </Button>
                  </div>
                  <div className="p-3.5 bg-muted/30 rounded-lg text-xs leading-relaxed text-foreground border border-border/80 font-sans select-all">
                    {amaCitation}
                  </div>
                </div>

                {/* APA */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-foreground uppercase tracking-wider text-[11px]">APA (7th ed.)</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => copyToClipboard(apaCitation, "apa")}
                      className="h-7 text-xs text-primary"
                    >
                      {copiedCitation === "apa" ? <Check className="h-3 w-3 mr-1 text-emerald-500" /> : <Copy className="h-3 w-3 mr-1" />}
                      {copiedCitation === "apa" ? "Copied" : "Copy"}
                    </Button>
                  </div>
                  <div className="p-3.5 bg-muted/30 rounded-lg text-xs leading-relaxed text-foreground border border-border/80 font-sans select-all">
                    {apaCitation}
                  </div>
                </div>

                {/* BibTeX */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-foreground uppercase tracking-wider text-[11px]">BibTeX</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => copyToClipboard(bibtexCitation, "bibtex")}
                      className="h-7 text-xs text-primary"
                    >
                      {copiedCitation === "bibtex" ? <Check className="h-3 w-3 mr-1 text-emerald-500" /> : <Copy className="h-3 w-3 mr-1" />}
                      {copiedCitation === "bibtex" ? "Copied" : "Copy"}
                    </Button>
                  </div>
                  <pre className="p-3.5 bg-muted/30 rounded-lg text-xs leading-relaxed text-foreground border border-border/80 font-mono select-all overflow-x-auto whitespace-pre">
                    {bibtexCitation}
                  </pre>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-base font-bold">
                  Indexing &amp; Discovery Metadata
                </CardTitle>
                <CardDescription className="text-xs">
                  Active academic indexing tags and archiving compliance.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-xs text-muted-foreground font-sans">
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-foreground">Google Scholar Indexing: </strong>
                      <span>Fully compliant Highwire Press &amp; Dublin Core tags active in HTML head.</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-foreground">Schema.org ScholarlyArticle: </strong>
                      <span>Machine-readable JSON-LD schema with author institutional affiliations.</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-foreground">JATS XML (NISO Z39.96): </strong>
                      <span>Full XML archive formatted for PubMed Central (PMC) ingest.</span>
                    </div>
                  </li>
                </ul>

                <div className="pt-4 border-t border-border space-y-2">
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Live COUNTER-compliant article usage statistics (views and downloads) will activate upon formal Crossref DOI registry deposit.
                  </p>
                  <Button asChild variant="outline" size="sm" className="w-full text-xs">
                    <a href={article.pdfUrl} target="_blank" rel="noopener noreferrer">
                      <Download className="h-3.5 w-3.5 mr-1" />
                      View Full PDF Document
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
