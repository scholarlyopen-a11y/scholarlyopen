"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Send, User, Mail, Building, Briefcase, BookOpen, Link as LinkIcon, CheckCircle2, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/lib/language-context"

export default function JoinEditorialBoardPage() {
  const { t } = useLanguage()
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [journal, setJournal] = useState("")
  const [selectedRole, setSelectedRole] = useState("Editor-in-Chief")

  useEffect(() => {
    if (typeof window !== "undefined") {
      document.title = `${t("join.heroTitle")} | Scholarly Open`
      
      const params = new URLSearchParams(window.location.search)
      const j = params.get("journal")
      if (j) {
        setJournal(j)
      }
    }
  }, [t])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    if (!form.reportValidity()) return
    setSubmitting(true)
    setErrorMessage(null)
    try {
      const formData = new FormData(form)
      const response = await fetch("/api/join-editorial-board", { method: "POST", body: formData })
      const json = (await response.json().catch(() => null)) as { ok?: boolean; error?: string } | null
      if (!response.ok || !json?.ok) {
        throw new Error(json?.error || "Failed to send application.")
      }
      setSubmitted(true)
      setJournal("")
      form.reset()
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Failed to send application.")
    } finally {
      setSubmitting(false)
    }
  }

  const journals = [
    { id: "social-sciences-humanities", name: t("journals.ss.title") },
    { id: "biology", name: t("journals.bio.title") },
    { id: "chemistry", name: t("journals.chem.title") },
    { id: "medicine", name: t("journals.med.title") },
    { id: "data-science", name: t("journals.ds.title") },
    { id: "engineering", name: t("journals.eng.title") },
    { id: "environmental-science", name: t("journals.env.title") },
    { id: "clinical-ai-digital-health", name: t("journals.clinical-ai.title") },
    { id: "ai-safety-governance", name: t("journals.ai-safety.title") },
    { id: "decarbonization-carbon-tech", name: t("journals.decarbonization.title") },
    { id: "quantum-engineering", name: t("journals.quantum-engineering.title") },
    { id: "synthetic-biology-bio-design", name: t("journals.synthetic-biology.title") },
    { id: "space-resources-orbital-economy", name: t("journals.space-resources.title") },
  ]

  const roles = [
    { 
      id: "eic", 
      value: "Editor-in-Chief",
      title: t("join.roleEIC"), 
      desc: t("join.roleEICDesc") 
    },
    { 
      id: "associate", 
      value: "Associate Editor",
      title: t("join.roleAE"), 
      desc: t("join.roleAEDesc") 
    },
    { 
      id: "board", 
      value: "Editorial Board Member",
      title: t("join.roleEBM"), 
      desc: t("join.roleEBMDesc") 
    },
    { 
      id: "eceb", 
      value: "Early Career Editorial Board",
      title: t("join.roleECEB"), 
      desc: t("join.roleECEBDesc") 
    },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-muted/30 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8 lg:py-24">
            <div className="max-w-3xl">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-balance">
                {t("join.heroTitle")}
              </h1>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                {t("join.heroSubtitle")}
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            


            <div className="grid gap-12 lg:grid-cols-12">
              
              <div className="lg:col-span-5 space-y-8">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight mb-6">Responsibilities</h2>
                  <div className="space-y-6">
                    {roles.filter(r => r.value === selectedRole).map((role) => (
                      <div key={role.id} className="border border-primary/20 rounded-xl p-8 bg-primary/5 shadow-sm animate-in fade-in slide-in-from-left-4 duration-500">
                        <div className="flex items-start gap-4">
                          <CheckCircle2 className="h-6 w-6 text-primary mt-1 shrink-0" />
                          <div>
                            <h3 className="font-bold text-xl mb-3">{role.title}</h3>
                            <div 
                              className="text-base text-muted-foreground leading-relaxed space-y-2 [&>ul]:list-disc [&>ul]:pl-5 [&>ul>li]:mt-1"
                              dangerouslySetInnerHTML={{ __html: role.desc }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mt-8 bg-primary/5 rounded-xl p-6 border border-primary/10">
                  <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                    <Globe className="h-5 w-5 text-primary" />
                    Diversity, Equity, & Inclusion
                  </h3>
                  <p className="text-sm text-foreground/80 leading-relaxed">
                    {t("join.form.ediStatement")}
                  </p>
                </div>
              </div>
              
              <div className="lg:col-span-7">
                <Card className="border-border shadow-sm overflow-hidden">
                  <div className="bg-muted/10 border-b border-border/50 p-4 sm:px-6 flex flex-wrap gap-2">
                    {roles.map(r => (
                      <button 
                        key={r.id} 
                        type="button"
                        onClick={() => setSelectedRole(r.value)}
                        className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors border ${
                          selectedRole === r.value 
                            ? "bg-primary/20 text-primary border-primary/20 shadow-sm" 
                            : "bg-muted text-muted-foreground border-transparent hover:bg-muted/80 hover:text-foreground"
                        }`}
                      >
                        {r.title}
                      </button>
                    ))}
                  </div>
                  <CardHeader className="pb-6 pt-6">
                    <CardTitle className="text-2xl">{t("join.form.title")}</CardTitle>
                    <CardDescription className="text-base mt-2">
                      {t("join.form.subtitle")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    {submitted ? (
                      <div className="text-center py-12">
                        <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                          <Send className="h-10 w-10 text-primary" />
                        </div>
                        <h3 className="text-2xl font-semibold mb-3">{t("join.form.successTitle")}</h3>
                        <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
                          {t("join.form.successDesc")}
                        </p>
                        <Button 
                          size="lg"
                          variant="outline" 
                          onClick={() => setSubmitted(false)}
                        >
                          {t("join.form.successButton")}
                        </Button>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid gap-5 sm:grid-cols-2">
                          <div className="space-y-2">
                            <label htmlFor="name" className="text-sm font-semibold">
                              {t("join.form.labelName")}
                            </label>
                            <div className="relative">
                              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input id="name" name="name" placeholder="Dr. Jane Doe" className="pl-10" required />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-semibold">
                              {t("join.form.labelEmail")}
                            </label>
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input id="email" name="email" type="email" placeholder="jane.doe@university.edu" className="pl-10" required />
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <label htmlFor="affiliation" className="text-sm font-semibold">
                            {t("join.form.labelAffiliation")}
                          </label>
                          <div className="relative">
                            <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input id="affiliation" name="affiliation" placeholder="University of ..." className="pl-10" required />
                          </div>
                        </div>
                        
                        <input type="hidden" name="role" value={selectedRole} />
                        <div className="space-y-2">
                          <label htmlFor="journal" className="text-sm font-semibold">
                            {t("join.form.labelJournal")}
                          </label>
                          <div className="relative">
                            <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                            <select 
                              id="journal" 
                              name="journal"
                              value={journal}
                              onChange={(e) => setJournal(e.target.value)}
                              className="w-full h-10 pl-10 pr-3 rounded-md border border-input bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                              required
                            >
                              <option value="" disabled>Select a journal...</option>
                              {journals.map(j => (
                                <option key={j.id} value={j.id}>{j.name}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <label htmlFor="expertise" className="text-sm font-semibold">
                            {t("join.form.labelExpertise")}
                          </label>
                          <Textarea 
                            id="expertise" 
                            name="expertise"
                            placeholder="Please list your main areas of research and expertise..." 
                            rows={4}
                            className="resize-none"
                            required 
                          />
                        </div>

                        <div className="space-y-2">
                          <label htmlFor="cvUrl" className="text-sm font-semibold">
                            {t("join.form.labelCV")}
                          </label>
                          <div className="relative">
                            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input id="cvUrl" name="cvUrl" type="url" placeholder="https://orcid.org/0000-0000-0000-0000" className="pl-10" required />
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3 pt-2">
                          <input type="checkbox" id="privacy" name="privacy" value="true" className="mt-1" required />
                          <label htmlFor="privacy" className="text-sm text-muted-foreground leading-relaxed">
                            {t("contact.form.privacyRead")}{" "}
                            <Link href="/privacy" className="text-primary hover:underline">
                              {t("footer.privacy")}
                            </Link>
                            . {t("contact.form.privacyConsent")}
                          </label>
                        </div>
                        
                        {errorMessage && (
                          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive font-medium">
                            {errorMessage}
                          </div>
                        )}
                        <Button type="submit" size="lg" className="w-full text-base font-semibold h-12" disabled={submitting}>
                          <Send className="mr-2 h-5 w-5" />
                          {submitting ? t("join.form.submitting") : t("join.form.submit")}
                        </Button>
                      </form>
                    )}
                  </CardContent>
                </Card>
              </div>

            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  )
}
