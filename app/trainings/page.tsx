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
  Linkedin,
  X,
  Search,
  Download,
  AlertCircle
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

const getLocalizedCourses = (t: (key: string) => string): Course[] => [
  {
    id: "ai-writing",
    title: t("trainings.course.ai-writing.title"),
    badge: t("trainings.course.ai-writing.badge"),
    icon: Sparkles,
    category: t("trainings.course.ai-writing.category"),
    duration: t("trainings.course.ai-writing.duration"),
    date: t("trainings.course.ai-writing.date"),
    description: t("trainings.course.ai-writing.description"),
    highlights: [
      t("trainings.course.ai-writing.h1"),
      t("trainings.course.ai-writing.h2"),
      t("trainings.course.ai-writing.h3")
    ],
  },
  {
    id: "grant-writing",
    title: t("trainings.course.grant-writing.title"),
    badge: t("trainings.course.grant-writing.badge"),
    icon: FileText,
    category: t("trainings.course.grant-writing.category"),
    duration: t("trainings.course.grant-writing.duration"),
    date: t("trainings.course.grant-writing.date"),
    description: t("trainings.course.grant-writing.description"),
    highlights: [
      t("trainings.course.grant-writing.h1"),
      t("trainings.course.grant-writing.h2"),
      t("trainings.course.grant-writing.h3")
    ],
  },
  {
    id: "ethics-integrity",
    title: t("trainings.course.ethics-integrity.title"),
    badge: t("trainings.course.ethics-integrity.badge"),
    icon: ShieldCheck,
    category: t("trainings.course.ethics-integrity.category"),
    duration: t("trainings.course.ethics-integrity.duration"),
    date: t("trainings.course.ethics-integrity.date"),
    description: t("trainings.course.ethics-integrity.description"),
    highlights: [
      t("trainings.course.ethics-integrity.h1"),
      t("trainings.course.ethics-integrity.h2"),
      t("trainings.course.ethics-integrity.h3")
    ],
  },
  {
    id: "peer-rebuttals",
    title: t("trainings.course.peer-rebuttals.title"),
    badge: t("trainings.course.peer-rebuttals.badge"),
    icon: BookOpen,
    category: t("trainings.course.peer-rebuttals.category"),
    duration: t("trainings.course.peer-rebuttals.duration"),
    date: t("trainings.course.peer-rebuttals.date"),
    description: t("trainings.course.peer-rebuttals.description"),
    highlights: [
      t("trainings.course.peer-rebuttals.h1"),
      t("trainings.course.peer-rebuttals.h2"),
      t("trainings.course.peer-rebuttals.h3")
    ],
  },
  {
    id: "fair-metadata",
    title: t("trainings.course.fair-metadata.title"),
    badge: t("trainings.course.fair-metadata.badge"),
    icon: Database,
    category: t("trainings.course.fair-metadata.category"),
    duration: t("trainings.course.fair-metadata.duration"),
    date: t("trainings.course.fair-metadata.date"),
    description: t("trainings.course.fair-metadata.description"),
    highlights: [
      t("trainings.course.fair-metadata.h1"),
      t("trainings.course.fair-metadata.h2"),
      t("trainings.course.fair-metadata.h3")
    ],
  },
  {
    id: "authorship-rights",
    title: t("trainings.course.authorship-rights.title"),
    badge: t("trainings.course.authorship-rights.badge"),
    icon: Award,
    category: t("trainings.course.authorship-rights.category"),
    duration: t("trainings.course.authorship-rights.duration"),
    date: t("trainings.course.authorship-rights.date"),
    description: t("trainings.course.authorship-rights.description"),
    highlights: [
      t("trainings.course.authorship-rights.h1"),
      t("trainings.course.authorship-rights.h2"),
      t("trainings.course.authorship-rights.h3")
    ],
  },
]

export default function TrainingsPage() {
  const { t } = useLanguage()
  const [searchQuery, setSearchQuery] = useState("")
  const [modalCourse, setModalCourse] = useState<Course | null>(null)
  const [includeCert, setIncludeCert] = useState(true)
  const [regSuccess, setRegSuccess] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")

  const openModal = (course: Course) => {
    setModalCourse(course)
    setRegSuccess(false)
    setName("")
    setEmail("")
    setIsSubmitting(false)
    setSubmitError("")
  }

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!modalCourse) return

    setIsSubmitting(true)
    setSubmitError("")

    try {
      const response = await fetch("/api/register-webinar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          courseTitle: modalCourse.title,
          includeCert,
        }),
      })

      const data = await response.json()
      if (response.ok && data.ok) {
        setRegSuccess(true)
      } else {
        setSubmitError(data.error || "Something went wrong. Please try again.")
      }
    } catch (err) {
      setSubmitError("Failed to connect to the email server. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const localizedCourses = getLocalizedCourses(t)

  const filteredCourses = localizedCourses.filter(c => 
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
            <div className="max-w-5xl">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur-md mb-4 text-accent">
                <GraduationCap className="h-4 w-4" /> {t("trainings.hero.badge")}
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white whitespace-nowrap">
                {t("trainings.hero.title")}
              </h1>
              <p className="mt-3 text-sm sm:text-base text-white/85 leading-relaxed max-w-2xl">
                {t("trainings.hero.subtitle")}
              </p>
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
                placeholder={t("trainings.search.placeholder")}
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

                      <div className="pt-3 mt-auto flex items-center justify-end border-t text-xs">
                        <Button 
                          onClick={() => openModal(course)}
                          size="sm" 
                          className="h-8 text-xs font-semibold px-3 cursor-pointer"
                        >
                          {t("trainings.enroll.free")}
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
                  <Linkedin className="h-3 w-3" /> {t("trainings.speaker.badge")}
                </div>
                <h3 className="text-lg font-bold">{t("trainings.speaker.title")}</h3>
                <p className="text-xs text-muted-foreground mt-1 max-w-md">
                  {t("trainings.speaker.desc")}
                </p>
              </div>
              <Button asChild variant="outline" className="shrink-0 text-xs gap-1.5">
                <Link href="/contact">
                  {t("trainings.speaker.cta")} <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Learning Resources & Handouts Section */}
        <section className="py-12 bg-muted/10 border-t">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-10">
              <h2 className="text-3xl font-bold tracking-tight">{t("trainings.resources.title")}</h2>
              <p className="text-sm text-muted-foreground mt-2">
                {t("trainings.resources.subtitle")}
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {/* Resource 1 */}
              <Card className="flex flex-col h-full bg-card border shadow-xs hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="rounded-lg bg-primary/10 p-2.5 text-primary w-fit mb-3">
                    <FileText className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-base font-bold leading-snug">
                    {t("trainings.resources.checklist.title")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col flex-grow text-xs text-muted-foreground">
                  <p className="flex-grow">{t("trainings.resources.checklist.desc")}</p>
                  <div className="pt-4 mt-auto">
                    <Button asChild variant="outline" size="sm" className="w-full text-xs gap-1.5 h-9 font-medium cursor-pointer">
                      <a href="/downloads/Scholarly_Open_Author_Checklist.txt" download>
                        <Download className="h-3.5 w-3.5" /> {t("trainings.resources.download")}
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Resource 2 */}
              <Card className="flex flex-col h-full bg-card border shadow-xs hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="rounded-lg bg-primary/10 p-2.5 text-primary w-fit mb-3">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-base font-bold leading-snug">
                    {t("trainings.resources.rights.title")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col flex-grow text-xs text-muted-foreground">
                  <p className="flex-grow">{t("trainings.resources.rights.desc")}</p>
                  <div className="pt-4 mt-auto">
                    <Button asChild variant="outline" size="sm" className="w-full text-xs gap-1.5 h-9 font-medium cursor-pointer">
                      <a href="/downloads/Rights_Retention_Cover_Letter_Template.txt" download>
                        <Download className="h-3.5 w-3.5" /> {t("trainings.resources.download")}
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Resource 3 */}
              <Card className="flex flex-col h-full bg-card border shadow-xs hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="rounded-lg bg-primary/10 p-2.5 text-primary w-fit mb-3">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-base font-bold leading-snug">
                    {t("trainings.resources.template.title")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col flex-grow text-xs text-muted-foreground">
                  <p className="flex-grow">{t("trainings.resources.template.desc")}</p>
                  <div className="pt-4 mt-auto">
                    <Button asChild variant="outline" size="sm" className="w-full text-xs gap-1.5 h-9 font-medium cursor-pointer">
                      <a href="/downloads/Scholarly_Open_Manuscript_Template.txt" download>
                        <Download className="h-3.5 w-3.5" /> {t("trainings.resources.download")}
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
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
                <h3 className="text-lg font-bold">{t("trainings.modal.title.confirmed")}</h3>
                <p className="text-xs text-muted-foreground">{t("trainings.modal.desc.confirmed")}</p>
                <Button onClick={() => setModalCourse(null)} size="sm" className="w-full">{t("trainings.modal.button.close")}</Button>
              </div>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="space-y-3 text-xs">
                <h3 className="text-base font-bold">{modalCourse.title}</h3>
                <p className="text-muted-foreground text-[11px]">{modalCourse.duration}</p>

                {submitError && (
                  <div className="rounded bg-destructive/10 text-destructive p-2.5 text-[11px] flex items-center gap-1.5 border border-destructive/20">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    <span>{submitError}</span>
                  </div>
                )}

                <div>
                  <label className="block font-semibold mb-1">{t("trainings.modal.field.name")}</label>
                  <input 
                    type="text" 
                    required 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t("trainings.modal.placeholder.name")} 
                    className="w-full rounded border bg-background px-2.5 py-1.5 text-xs" 
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">{t("trainings.modal.field.email")}</label>
                  <input 
                    type="email" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t("trainings.modal.placeholder.email")} 
                    className="w-full rounded border bg-background px-2.5 py-1.5 text-xs" 
                  />
                </div>

                <div className="rounded border bg-muted/30 p-2.5 flex items-center gap-2">
                  <input type="checkbox" id="cert-toggle" checked={includeCert} onChange={(e) => setIncludeCert(e.target.checked)} />
                  <label htmlFor="cert-toggle" className="cursor-pointer text-[11px]">
                    {t("trainings.modal.field.cert")}
                  </label>
                </div>

                <div className="flex justify-end pt-2 border-t">
                  <Button type="submit" size="sm" disabled={isSubmitting} className="cursor-pointer">
                    {isSubmitting ? "Registering..." : t("trainings.modal.button.register")}
                  </Button>
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
