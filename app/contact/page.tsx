"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Mail, MapPin, Phone, Clock, Send, Building, User, MessageSquare, BookOpen, CreditCard, Wrench, ShieldAlert } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/lib/language-context"
import { AntiSpamFields } from "@/components/anti-spam-fields"
import { HumanVerification } from "@/components/human-verification"

export default function ContactPage() {
  const { t } = useLanguage()
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [testingMail, setTestingMail] = useState(false)
  const [testMessage, setTestMessage] = useState<string | null>(null)
  const [subject, setSubject] = useState("")

  useEffect(() => {
    if (typeof window !== "undefined") {
      document.title = `${t("contact.heroTitle")} | Scholarly Open`
      
      const params = new URLSearchParams(window.location.search)
      const sub = params.get("subject")
      if (sub) {
        setSubject(sub)
      }
    }
  }, [t])

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      details: [
        { label: t("contact.info.general"), value: "info@scholarlyopen.org" },
        { label: t("contact.info.editorial"), value: "editorial@scholarlyopen.org" },
        { label: t("contact.info.submissions"), value: "info@scholarlyopen.org" },
      ],
    },
    {
      icon: MapPin,
      title: t("contact.info.address"),
      details: [
        { label: t("contact.info.address"), value: "Am Gonsenheim 49a, 55122 Mainz, Germany" },
        { label: t("contact.info.headquarters"), value: "Scholarly Open i.G." },
      ],
    },
    {
      icon: Phone,
      title: t("contact.info.phone"),
      details: [
        { label: t("contact.info.phone"), value: "+49 15228080302" },
      ],
    },
    {
      icon: Clock,
      title: t("contact.info.hours"),
      details: [
        { label: t("contact.info.weekday"), value: "9:00 - 17:00 CET" },
        { label: t("contact.info.weekend"), value: t("contact.info.weekendVal") },
      ],
    },
  ]

  const departments = [
    {
      name: t("contact.info.editorial"),
      email: "editorial@scholarlyopen.org",
      description: t("contact.dept1.desc"),
      icon: BookOpen,
    },
    {
      name: t("nav.forAuthors"),
      email: "author-support@scholarlyopen.org",
      description: t("contact.dept2.desc"),
      icon: User,
    },
    {
      name: t("contact.dept3.name"),
      email: "finance@scholarlyopen.org",
      description: t("contact.dept3.desc"),
      icon: CreditCard,
    },
    {
      name: t("contact.dept4.name"),
      email: "technical-support@scholarlyopen.org",
      description: t("contact.dept4.desc"),
      icon: Wrench,
    },
    {
      name: t("contact.dept5.name"),
      email: "ethics-support@scholarlyopen.org",
      description: t("contact.dept5.desc"),
      icon: ShieldAlert,
    },
  ]

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    if (!form.reportValidity()) return
    setSubmitting(true)
    setErrorMessage(null)
    try {
      const formData = new FormData(form)
      const response = await fetch("/api/contact", { method: "POST", body: formData })
      const json = (await response.json().catch(() => null)) as { ok?: boolean; error?: string } | null
      if (!response.ok || !json?.ok) {
        throw new Error(json?.error || "Failed to send message.")
      }
      setSubmitted(true)
      setSubject("")
      form.reset()
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Failed to send message.")
    } finally {
      setSubmitting(false)
    }
  }

  const handleTestEmail = async () => {
    setTestingMail(true)
    setTestMessage(null)
    try {
      const response = await fetch("/api/test-email", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" })
      const json = (await response.json().catch(() => null)) as { ok?: boolean; sentTo?: string; error?: string } | null
      if (!response.ok || !json?.ok) {
        throw new Error(json?.error || "SMTP test failed.")
      }
      setTestMessage(`Test email sent to ${json.sentTo}.`)
    } catch (err) {
      setTestMessage(err instanceof Error ? err.message : "SMTP test failed.")
    } finally {
      setTestingMail(false)
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
                {t("contact.heroTitle")}
              </h1>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                {t("contact.heroSubtitle")}
              </p>
            </div>
          </div>
        </section>

        {/* Contact Info Cards */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {contactInfo.map((item, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
                      <item.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {item.details.map((detail, idx) => (
                        <div key={idx} className="text-base">
                          {detail.label && (
                            <span className="text-muted-foreground">{detail.label}: </span>
                          )}
                          {detail.value.includes('@') ? (
                            <a 
                              href={`mailto:${detail.value}`} 
                              className="text-primary hover:underline font-medium"
                            >
                              {detail.value}
                            </a>
                          ) : (
                            <span className="text-foreground font-medium">{detail.value}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Departments */}
        <section className="py-16 lg:py-24 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="max-w-2xl mb-12">
              <h2 className="text-3xl font-bold tracking-tight">{t("contact.deptsTitle")}</h2>
              <p className="mt-4 text-muted-foreground">
                {t("contact.deptsSub")}
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {departments.map((dept) => (
                <div key={dept.name} className="p-6 rounded-lg bg-background border border-border flex flex-col justify-between">
                  <div>
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
                      <dept.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg">{dept.name}</h3>
                    <p className="text-sm text-muted-foreground mt-2">{dept.description}</p>
                  </div>
                  <a 
                    href={`mailto:${dept.email}`}
                    className="inline-flex items-center text-sm text-primary hover:underline mt-4 self-start"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    {dept.email}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-2">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">{t("contact.form.title")}</h2>
                <p className="mt-4 text-muted-foreground">
                  {t("contact.form.subtitle")}
                </p>
                <div className="mt-8 p-6 rounded-lg bg-muted/50 border border-border">
                  <h3 className="font-semibold mb-4">{t("contact.form.faqHeader")}</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>
                      <Link href="/author-guidelines" className="text-primary font-medium hover:text-primary/80 hover:underline">
                        {t("nav.authorGuidelines")}
                      </Link>
                      {" "}- {t("about.time3.desc")}
                    </li>
                    <li>
                      <Link href="/apc-fees" className="text-primary font-medium hover:text-primary/80 hover:underline">
                        {t("nav.apcFees")}
                      </Link>
                      {" "}- {t("contact.dept3.desc")}
                    </li>
                    <li>
                      <Link href="/peer-review" className="text-primary font-medium hover:text-primary/80 hover:underline">
                        {t("nav.peerReview")}
                      </Link>
                      {" "}- {t("nav.peerReview")}
                    </li>
                    <li>
                      <Link href="/publication-ethics" className="text-primary font-medium hover:text-primary/80 hover:underline">
                        {t("nav.publicationEthics")}
                      </Link>
                      {" "}- {t("contact.faq.ethicsDesc")}
                    </li>
                    <li>
                      <Link href="/open-access" className="text-primary font-medium hover:text-primary/80 hover:underline">
                        {t("nav.openAccess")}
                      </Link>
                      {" "}- {t("oaModels.gold.description")}
                    </li>
                  </ul>
                </div>
                {process.env.NODE_ENV !== "production" && (
                  <div className="mt-6 p-4 rounded-lg bg-muted/50 border border-border space-y-3">
                    <p className="text-sm font-medium">Local SMTP Test</p>
                    <Button type="button" variant="outline" onClick={handleTestEmail} disabled={testingMail}>
                      {testingMail ? "Testing SMTP..." : "Send Test Email"}
                    </Button>
                    {testMessage && <p className="text-sm text-muted-foreground">{testMessage}</p>}
                  </div>
                )}
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>{t("contact.form.cardTitle")}</CardTitle>
                  <CardDescription>
                    {t("contact.form.cardSub")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {submitted ? (
                    <div className="text-center py-8">
                      <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <Send className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{t("contact.form.sentTitle")}</h3>
                      <p className="text-muted-foreground">
                        {t("contact.form.sentDesc")}
                      </p>
                      <Button 
                        variant="outline" 
                        className="mt-6"
                        onClick={() => setSubmitted(false)}
                      >
                        {t("contact.form.sentButton")}
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <AntiSpamFields />
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <label htmlFor="name" className="text-sm font-medium">
                            {t("contact.form.labelName")}
                          </label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input id="name" name="name" placeholder={t("contact.form.labelName").replace(" *", "")} className="pl-10" required />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="email" className="text-sm font-medium">
                            {t("contact.form.labelEmail")}
                          </label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input id="email" name="email" type="email" placeholder="your@email.com" className="pl-10" required />
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="affiliation" className="text-sm font-medium">
                          {t("contact.form.labelAffiliation")}
                        </label>
                        <div className="relative">
                          <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input id="affiliation" name="affiliation" placeholder={t("contact.form.labelAffiliation")} className="pl-10" />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="subject" className="text-sm font-medium">
                          {t("contact.form.labelSubject")}
                        </label>
                        <select 
                          id="subject" 
                          name="subject"
                          value={subject}
                          onChange={(e) => setSubject(e.target.value)}
                          className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                          required
                        >
                          <option value="">{t("contact.form.optDefault")}</option>
                          <option value="submission">{t("contact.form.optSubmission")}</option>
                          <option value="review">{t("contact.form.optReview")}</option>
                          <option value="apc">{t("contact.form.optAPC")}</option>
                          <option value="technical">{t("contact.form.optTechnical")}</option>
                          <option value="editorial">{t("contact.form.optEditorial")}</option>
                          <option value="ethics">{t("contact.form.optEthics")}</option>
                          <option value="partnership">{t("contact.form.optPartner")}</option>
                          <option value="other">{t("contact.form.optOther")}</option>
                        </select>
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="message" className="text-sm font-medium">
                          {t("contact.form.labelMessage")}
                        </label>
                        <div className="relative">
                          <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Textarea 
                            id="message" 
                            name="message"
                            placeholder={t("contact.form.labelMessage").replace(" *", "")} 
                            rows={6}
                            className="pl-10"
                            required 
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <input type="checkbox" id="privacy" name="privacy" value="true" className="mt-1" required />
                        <label htmlFor="privacy" className="text-sm text-muted-foreground">
                          {t("contact.form.privacyRead")}{" "}
                          <Link href="/privacy" className="text-primary hover:underline">
                            {t("footer.privacy")}
                          </Link>
                          . {t("contact.form.privacyConsent")}
                        </label>
                      </div>

                      <HumanVerification />
                      
                      {errorMessage && (
                        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-muted-foreground">
                          {errorMessage}
                        </div>
                      )}
                      <Button type="submit" size="lg" className="w-full" disabled={submitting}>
                        <Send className="mr-2 h-4 w-4" />
                        {submitting ? t("contact.form.buttonSending") : t("contact.form.buttonSend")}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-16 lg:py-24 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl font-bold tracking-tight">{t("contact.map.title")}</h2>
              <p className="mt-4 text-muted-foreground">
                {t("contact.map.subtitle")}
              </p>
            </div>
            <div className="aspect-video rounded-lg bg-muted border border-border flex items-center justify-center">
              <div className="text-center p-8">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 text-primary">
                  <MapPin className="h-8 w-8 text-primary" />
                </div>
                <p className="mt-4 font-semibold">{t("contact.map.basedIn")}</p>
                <p className="text-sm text-muted-foreground">Am Gonsenheim 49a, 55122 Mainz, Germany</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
