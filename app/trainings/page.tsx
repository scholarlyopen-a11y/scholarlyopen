"use client"

import { useState } from "react"
import Link from "next/link"
import { 
  Sparkles, 
  FileText, 
  BookOpen, 
  ShieldCheck, 
  Award, 
  Database, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  GraduationCap, 
  BadgeCheck, 
  Send,
  Linkedin,
  X,
  Search
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/lib/language-context"

interface Course {
  id: string
  title: string
  badge: string
  icon: any
  category: string
  duration: string
  date: string
  description: string
  highlights: string[]
}

const courses: Course[] = [
  {
    id: "ai-writing",
    title: "Generative AI for Scientific Writing & Literature Review",
    badge: "Trending 2026",
    icon: Sparkles,
    category: "AI & Tools",
    duration: "2 Hours",
    date: "Monthly Live",
    description: "Master AI tools (ChatGPT, Scite, Elicit) for research synthesis while maintaining integrity and publisher compliance.",
    highlights: ["Prompting techniques", "Avoiding AI hallucinations", "Journal disclosure rules"],
  },
  {
    id: "grant-writing",
    title: "Persuasive Grant Writing & Proposal Strategy",
    badge: "Grants & Funding",
    icon: FileText,
    category: "Funding",
    duration: "3 Hours",
    date: "Bi-Weekly",
    description: "Structure compelling narratives, work packages, and budgets for ERC, Horizon Europe, and national funding.",
    highlights: ["Impact & Excellence sections", "Risk management", "Reviewer rubrics"],
  },
  {
    id: "high-impact",
    title: "Publishing in High-Impact Journals & Avoiding Desk Rejections",
    badge: "Top Requested",
    icon: BookOpen,
    category: "Publishing",
    duration: "2.5 Hours",
    date: "Monthly",
    description: "Learn journal selection, persuasive cover letter drafting, and structuring papers to pass initial editor screening.",
    highlights: ["Cover letter drafting", "Avoiding desk rejection flags", "Journal matching"],
  },
  {
    id: "peer-review",
    title: "Navigating Peer Review & Protecting Scientific Claims",
    badge: "Author Control",
    icon: ShieldCheck,
    category: "Peer Review",
    duration: "2 Hours",
    date: "Bi-Monthly",
    description: "Craft professional response letters, address tough reviewer comments, and defend your core methodology.",
    highlights: ["Response letter tables", "Declining unreasonable requests", "Reviewer ethics"],
  },
  {
    id: "visibility",
    title: "Building an Online Researcher Profile & Citation Impact",
    badge: "Visibility",
    icon: Award,
    category: "Career",
    duration: "1.5 Hours",
    date: "On-Demand",
    description: "Maximize paper reach and citations using LinkedIn for Academics, ORCID, Altmetrics, and graphical abstracts.",
    highlights: ["LinkedIn & ORCID setup", "Graphical abstracts", "Altmetric tracking"],
  },
  {
    id: "open-science",
    title: "Open Science, Data Sovereignty & Rights Retention",
    badge: "Open Access",
    icon: Database,
    category: "Open Science",
    duration: "2 Hours",
    date: "Monthly",
    description: "Retain copyright under Plan S CC-BY strategy, build FAIR Data Management Plans, and use open repositories.",
    highlights: ["Plan S CC-BY retention", "FAIR data compliance", "Zenodo deposition"],
  },
]

export default function TrainingsPage() {
  const { t } = useLanguage()
  const [searchQuery, setSearchQuery] = useState("")
  const [modalCourse, setModalCourse] = useState<Course | null>(null)
  const [includeCert, setIncludeCert] = useState(true)
  const [regSuccess, setRegSuccess] = useState(false)

  const filteredCourses = courses.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <Header />

      <main className="flex-grow">
        {/* Concise Hero Section */}
        <section 
          className="py-14 text-white"
          style={{
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-mid) 50%, var(--primary-dark) 100%)',
          }}
        >
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur-md mb-4 text-accent">
                <GraduationCap className="h-4 w-4" /> Scholarly Open Academy
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Online Trainings & Masterclasses
              </h1>
              <p className="mt-3 text-sm sm:text-base text-white/85 leading-relaxed">
                Practical, concise workshops empowering researchers with AI tools, grant writing skills, and open science control.
              </p>
            </div>
          </div>
        </section>

        {/* €50 Verified Certificate Bar */}
        <section className="py-6 bg-muted/40 border-b">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="rounded-xl bg-card border p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-2.5 text-primary shrink-0">
                  <BadgeCheck className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-base font-bold">Earn an Official Verified Certificate (€50)</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Optional digital credential with unique verification ID for CVs and LinkedIn.
                  </p>
                </div>
              </div>
              <a href="#courses" className="inline-flex items-center gap-1.5 rounded-md bg-primary text-primary-foreground px-4 py-2 text-xs font-semibold hover:bg-primary/90 transition-colors whitespace-nowrap">
                Browse Courses <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </section>

        {/* Course Catalog Section */}
        <section id="courses" className="py-12">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            {/* Search Filter */}
            <div className="max-w-md mx-auto relative mb-8">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search courses..."
                className="w-full rounded-full border bg-card pl-10 pr-4 py-2 text-xs shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Concise Course Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => {
                const IconComp = course.icon
                return (
                  <Card key={course.id} className="flex flex-col h-full border-muted hover:border-primary/40 hover:shadow-md transition-all">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="inline-flex items-center rounded bg-primary/10 px-2 py-0.5 text-[11px] font-bold text-primary">
                          {course.badge}
                        </span>
                        <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {course.duration}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mb-1">
                        <IconComp className="h-5 w-5 text-primary shrink-0" />
                        <CardTitle className="text-base font-bold leading-snug">{course.title}</CardTitle>
                      </div>
                    </CardHeader>

                    <CardContent className="flex-grow flex flex-col justify-between pt-0 space-y-3">
                      <p className="text-xs text-muted-foreground leading-normal">
                        {course.description}
                      </p>

                      <div className="space-y-1 text-[11px] pt-2 border-t">
                        {course.highlights.map((h, i) => (
                          <div key={i} className="flex items-center gap-1.5 text-foreground">
                            <CheckCircle2 className="h-3 w-3 text-primary shrink-0" />
                            <span>{h}</span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-3 mt-auto flex items-center justify-between border-t text-xs">
                        <span className="text-muted-foreground text-[11px]">{course.date}</span>
                        <Button 
                          onClick={() => { setModalCourse(course); setRegSuccess(false); }}
                          size="sm" 
                          className="h-8 text-xs font-semibold px-3"
                        >
                          Enroll Free
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* Concise Speaker Recruitment Section */}
        <section className="py-10 bg-muted/30 border-y">
          <div className="mx-auto max-w-4xl px-4 lg:px-8">
            <div className="rounded-xl border bg-card p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-1 text-[11px] font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded mb-2">
                  <Linkedin className="h-3 w-3" /> Guest Speakers Needed
                </div>
                <h3 className="text-lg font-bold">Join as a Masterclass Trainer</h3>
                <p className="text-xs text-muted-foreground mt-1 max-w-md">
                  Are you an expert in open science, grant writing, or peer review? Connect with our team to lead live sessions.
                </p>
              </div>
              <Button asChild variant="outline" className="shrink-0 text-xs gap-1.5">
                <Link href="/contact">
                  Apply to Teach <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Enrollment Modal */}
      {modalCourse && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border rounded-xl max-w-md w-full p-6 shadow-xl relative">
            <button onClick={() => setModalCourse(null)} className="absolute top-3 right-3 text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>

            {regSuccess ? (
              <div className="text-center py-4 space-y-3">
                <CheckCircle2 className="h-10 w-10 text-primary mx-auto" />
                <h3 className="text-lg font-bold">Registration Confirmed</h3>
                <p className="text-xs text-muted-foreground">Access details sent to your email.</p>
                <Button onClick={() => setModalCourse(null)} size="sm" className="w-full">Close</Button>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setRegSuccess(true); }} className="space-y-3 text-xs">
                <h3 className="text-base font-bold">{modalCourse.title}</h3>
                <p className="text-muted-foreground text-[11px]">{modalCourse.duration} • {modalCourse.date}</p>

                <div>
                  <label className="block font-semibold mb-1">Full Name *</label>
                  <input type="text" required placeholder="Dr. Jane Doe" className="w-full rounded border bg-background px-2.5 py-1.5 text-xs" />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Email *</label>
                  <input type="email" required placeholder="researcher@univ.edu" className="w-full rounded border bg-background px-2.5 py-1.5 text-xs" />
                </div>

                <div className="rounded border bg-muted/30 p-2.5 flex items-center gap-2">
                  <input type="checkbox" id="cert-toggle" checked={includeCert} onChange={(e) => setIncludeCert(e.target.checked)} />
                  <label htmlFor="cert-toggle" className="cursor-pointer text-[11px]">
                    Include Verified Digital Certificate (€50)
                  </label>
                </div>

                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="font-bold">Total: {includeCert ? "€50" : "FREE"}</span>
                  <Button type="submit" size="sm">Register Now</Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
