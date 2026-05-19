"use client"

import { useState } from "react"
import Link from "next/link"
import { Mail, MapPin, Phone, Clock, Send, Building, User, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

const contactInfo = [
  {
    icon: Mail,
    title: "Email",
    details: [
      { label: "General Inquiries", value: "info@scholarlyopen.org" },
      { label: "Editorial Office", value: "editorial@scholarlyopen.org" },
      { label: "Submissions", value: "submissions@scholarlyopen.org" },
    ],
  },
  {
    icon: MapPin,
    title: "Location",
    details: [
      { label: "Address", value: "Am Gonsenheim 49a, 55122 Mainz, Germany" },
      { label: "Headquarters", value: "Scholarly Open i.G." },
    ],
  },
  {
    icon: Phone,
    title: "Phone",
    details: [
      { label: "Main Office", value: "+49 15228080302" },
    ],
  },
  {
    icon: Clock,
    title: "Office Hours",
    details: [
      { label: "Monday - Friday", value: "9:00 - 17:00 CET" },
      { label: "Saturday - Sunday", value: "Closed" },
    ],
  },
]

const departments = [
  {
    name: "Editorial Office",
    email: "editorial@scholarlyopen.org",
    description: "For manuscript-related inquiries, peer review questions, and editorial decisions.",
  },
  {
    name: "Author Support",
    email: "author-support@scholarlyopen.org",
    description: "For submission assistance, formatting questions, and author guidelines.",
  },
  {
    name: "Finance & APCs",
    email: "finance@scholarlyopen.org",
    description: "For invoices, payment inquiries, and APC waiver requests.",
  },
  {
    name: "Technical Support",
    email: "technical-support@scholarlyopen.org",
    description: "For website issues, submission system problems, and technical questions.",
  },
]

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [testingMail, setTestingMail] = useState(false)
  const [testMessage, setTestMessage] = useState<string | null>(null)

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
                Contact Us
              </h1>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                Have questions about submitting your research, our peer review process, or open access policies? Our team is here to help.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Info Cards */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {contactInfo.map((item) => (
                <Card key={item.title}>
                  <CardHeader>
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <item.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {item.details.map((detail, index) => (
                        <div key={index} className="text-sm">
                          {detail.label && (
                            <span className="text-muted-foreground">{detail.label}: </span>
                          )}
                          {detail.value.includes('@') ? (
                            <a 
                              href={`mailto:${detail.value}`} 
                              className="text-primary hover:underline"
                            >
                              {detail.value}
                            </a>
                          ) : (
                            <span className="text-foreground">{detail.value}</span>
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
              <h2 className="text-3xl font-bold tracking-tight">Department Contacts</h2>
              <p className="mt-4 text-muted-foreground">
                For faster response, please contact the appropriate department directly.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {departments.map((dept) => (
                <div key={dept.name} className="p-6 rounded-lg bg-background border border-border">
                  <h3 className="font-semibold text-lg">{dept.name}</h3>
                  <p className="text-sm text-muted-foreground mt-2">{dept.description}</p>
                  <a 
                    href={`mailto:${dept.email}`}
                    className="inline-flex items-center text-sm text-primary hover:underline mt-4"
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
                <h2 className="text-3xl font-bold tracking-tight">Send Us a Message</h2>
                <p className="mt-4 text-muted-foreground">
                  Fill out the form below and we will get back to you within 1-2 business days.
                </p>
                <div className="mt-8 p-6 rounded-lg bg-muted/50 border border-border">
                  <h3 className="font-semibold mb-4">Before contacting us, you might find answers in:</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>
                      <Link href="/author-guidelines" className="text-primary font-medium hover:text-primary/80 hover:underline">
                        Author Guidelines
                      </Link>
                      {" "}- Manuscript preparation and submission requirements
                    </li>
                    <li>
                      <Link href="/apc-fees" className="text-primary font-medium hover:text-primary/80 hover:underline">
                        APC & Fees
                      </Link>
                      {" "}- Pricing, waivers, and payment information
                    </li>
                    <li>
                      <Link href="/peer-review" className="text-primary font-medium hover:text-primary/80 hover:underline">
                        Peer Review Process
                      </Link>
                      {" "}- How we review manuscripts
                    </li>
                    <li>
                      <Link href="/open-access" className="text-primary font-medium hover:text-primary/80 hover:underline">
                        Open Access Policy
                      </Link>
                      {" "}- Licensing and author rights
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
                  <CardTitle>Contact Form</CardTitle>
                  <CardDescription>
                    All fields marked with * are required.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {submitted ? (
                    <div className="text-center py-8">
                      <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <Send className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">Message Sent</h3>
                      <p className="text-muted-foreground">
                        Thank you for contacting us. We will respond within 1-2 business days.
                      </p>
                      <Button 
                        variant="outline" 
                        className="mt-6"
                        onClick={() => setSubmitted(false)}
                      >
                        Send Another Message
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <label htmlFor="name" className="text-sm font-medium">
                            Full Name *
                          </label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input id="name" name="name" placeholder="Your name" className="pl-10" required />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="email" className="text-sm font-medium">
                            Email Address *
                          </label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input id="email" name="email" type="email" placeholder="your@email.com" className="pl-10" required />
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="affiliation" className="text-sm font-medium">
                          Institution / Organization
                        </label>
                        <div className="relative">
                          <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input id="affiliation" name="affiliation" placeholder="Your institution (optional)" className="pl-10" />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="subject" className="text-sm font-medium">
                          Subject *
                        </label>
                        <select 
                          id="subject" 
                          name="subject"
                          className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                          required
                        >
                          <option value="">Select a subject</option>
                          <option value="submission">Manuscript Submission</option>
                          <option value="review">Peer Review Status</option>
                          <option value="apc">APC / Payment</option>
                          <option value="technical">Technical Issue</option>
                          <option value="editorial">Editorial Board</option>
                          <option value="partnership">Partnership / Collaboration</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="message" className="text-sm font-medium">
                          Message *
                        </label>
                        <div className="relative">
                          <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Textarea 
                            id="message" 
                            name="message"
                            placeholder="Please describe your inquiry in detail..." 
                            rows={6}
                            className="pl-10"
                            required 
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <input type="checkbox" id="privacy" name="privacy" value="true" className="mt-1" required />
                        <label htmlFor="privacy" className="text-sm text-muted-foreground">
                          I have read and agree to the{" "}
                          <Link href="/privacy" className="text-primary hover:underline">
                            Privacy Policy
                          </Link>
                          . I consent to the processing of my personal data for the purpose of handling my inquiry.
                        </label>
                      </div>
                      
                      {errorMessage && (
                        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-muted-foreground">
                          {errorMessage}
                        </div>
                      )}
                      <Button type="submit" size="lg" className="w-full" disabled={submitting}>
                        <Send className="mr-2 h-4 w-4" />
                        {submitting ? "Sending..." : "Send Message"}
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
              <h2 className="text-3xl font-bold tracking-tight">Global Reach</h2>
              <p className="mt-4 text-muted-foreground">
                Scholarly Open serves researchers worldwide, connecting scholars across all continents.
              </p>
            </div>
            <div className="aspect-video rounded-lg bg-muted border border-border flex items-center justify-center">
              <div className="text-center p-8">
                <MapPin className="h-16 w-16 mx-auto text-primary/20" />
                <p className="mt-4 font-semibold">Based in Mainz, Germany</p>
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

