"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight, BookOpen, Users, Shield, Globe, FileCheck, Microscope, Landmark, Brain, Beaker, Lock, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/lib/language-context"

export default function HomePage() {
  const { t } = useLanguage()

  const features = [
    {
      icon: Globe,
      title: t("features.openAccess.title"),
      description: t("features.openAccess.description"),
    },
    {
      icon: Shield,
      title: t("features.peerReview.title"),
      description: t("features.peerReview.description"),
    },
    {
      icon: FileCheck,
      title: t("features.rapidPublication.title"),
      description: t("features.rapidPublication.description"),
    },
    {
      icon: Users,
      title: t("features.editorialBoard.title"),
      description: t("features.editorialBoard.description"),
    },
  ]

  const journals = [
    {
      title: t("journals.sso.title"),
      description: t("journals.sso.description"),
      icon: Brain,
      href: "/journals/social-sciences-open",
      type: "Gold OA",
      typeColor: "bg-accent text-accent-foreground",
    },
    {
      title: t("journals.af.title"),
      description: t("journals.af.description"),
      icon: Landmark,
      href: "/journals/archaeological-frontiers",
      type: "Gold OA",
      typeColor: "bg-accent text-accent-foreground",
    },
    {
      title: t("journals.mrr.title"),
      description: t("journals.mrr.description"),
      icon: Microscope,
      href: "/journals/medical-research-review",
      type: "Gold OA",
      typeColor: "bg-accent text-accent-foreground",
    },
    {
      title: t("journals.jahs.title"),
      description: t("journals.jahs.description"),
      icon: Beaker,
      href: "/journals/applied-health-sciences",
      type: "Gold OA",
      typeColor: "bg-accent text-accent-foreground",
    },
  ]

  const stats = [
    { value: "100%", label: t("stats.openAccess") },
    { value: "4", label: t("stats.journals") },
    { value: "Global", label: t("stats.reach") },
    { value: "COPE", label: t("stats.guidelines") },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section - Gulf Air Maroon Theme */}
        <section className="relative overflow-hidden bg-primary">
          {/* Decorative Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-accent rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
          </div>
          <div className="relative mx-auto max-w-7xl px-4 py-20 lg:px-8 lg:py-28">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="inline-flex items-center rounded-full bg-accent px-4 py-1.5 text-sm font-medium text-accent-foreground mb-6">
                  {t("brand.tagline")}
                </span>
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl text-primary-foreground text-balance">
                  {t("hero.title")}
                </h1>
                <p className="mt-6 text-lg text-primary-foreground/85 leading-relaxed max-w-2xl">
                  {t("hero.subtitle")}
                </p>
                <div className="mt-10 flex flex-col sm:flex-row gap-4">
                  <Button size="lg" asChild className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold">
                    <Link href="/submit">
                      {t("hero.cta.submit")}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild className="border-primary-foreground/40 bg-primary-foreground/5 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
                    <Link href="/about">{t("hero.cta.learn")}</Link>
                  </Button>
                </div>
              </div>
              <div className="hidden lg:block relative">
                {/* Scholarly Illustration */}
                <div className="relative">
                  {/* Main card with book/journal visual */}
                  <div className="aspect-[4/3] rounded-2xl bg-primary-foreground/10 border border-primary-foreground/20 backdrop-blur-sm p-8 flex flex-col items-center justify-center">
                    {/* Open book illustration */}
                    <div className="relative mb-6">
                      <div className="flex gap-1">
                        {/* Left page */}
                        <div className="w-24 h-32 bg-primary-foreground/95 rounded-l-sm shadow-lg transform -rotate-3 flex flex-col p-3">
                          <div className="h-1 w-12 bg-primary/30 rounded mb-1" />
                          <div className="h-1 w-16 bg-primary/20 rounded mb-1" />
                          <div className="h-1 w-14 bg-primary/20 rounded mb-1" />
                          <div className="h-1 w-10 bg-primary/20 rounded mb-2" />
                          <div className="h-1 w-16 bg-primary/20 rounded mb-1" />
                          <div className="h-1 w-12 bg-primary/20 rounded mb-1" />
                          <div className="h-1 w-14 bg-primary/20 rounded" />
                        </div>
                        {/* Right page */}
                        <div className="w-24 h-32 bg-primary-foreground/95 rounded-r-sm shadow-lg transform rotate-3 flex flex-col p-3">
                          <div className="h-1 w-14 bg-primary/30 rounded mb-1" />
                          <div className="h-1 w-12 bg-primary/20 rounded mb-1" />
                          <div className="h-1 w-16 bg-primary/20 rounded mb-1" />
                          <div className="h-1 w-10 bg-primary/20 rounded mb-2" />
                          <div className="h-1 w-14 bg-primary/20 rounded mb-1" />
                          <div className="h-1 w-16 bg-primary/20 rounded mb-1" />
                          <div className="h-1 w-12 bg-primary/20 rounded" />
                        </div>
                      </div>
                      {/* Book spine shadow */}
                      <div className="absolute inset-y-0 left-1/2 w-1 bg-primary/20 -translate-x-1/2" />
                    </div>
                    
                    {/* Brand badge */}
                    <div className="bg-accent text-accent-foreground px-6 py-3 rounded-lg font-bold text-xl tracking-wide">
                      Scholarisch
                    </div>
                    <p className="text-primary-foreground/80 text-sm mt-3 text-center">
                      {t("oaModels.fromMainz")}
                    </p>
                    
                    {/* Floating badges */}
                    <div className="absolute -top-3 -right-3 bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                      DOAJ
                    </div>
                    <div className="absolute -bottom-3 -left-3 bg-primary-foreground text-primary px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                      COPE
                    </div>
                  </div>
                  
                  {/* Decorative elements */}
                  <div className="absolute -z-10 top-4 left-4 w-full h-full rounded-2xl border border-accent/30" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Bar */}
        <section className="border-b border-border bg-muted/50">
          <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl font-bold text-primary lg:text-3xl">{stat.value}</div>
                  <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Journals Section */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-balance">
                {t("journals.title")}
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                {t("journals.subtitle")}
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {journals.map((journal) => (
                <Card key={journal.title} className="relative overflow-hidden border-border hover:border-primary/50 transition-colors group">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                        <journal.icon className="h-6 w-6 text-primary" />
                      </div>
                      <Badge className={journal.typeColor}>{journal.type}</Badge>
                    </div>
                    <CardTitle className="mt-4 group-hover:text-primary transition-colors">{journal.title}</CardTitle>
                    <CardDescription className="text-base">{journal.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link 
                      href={journal.href} 
                      className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                    >
                      {t("journals.viewJournal")}
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 lg:py-24 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-balance">
                {t("features.title")}
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                {t("features.subtitle")}
              </p>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => (
                <div key={feature.title} className="text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                    <feature.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Open Access Models */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <div>
                <span className="text-sm font-medium text-accent uppercase tracking-wider">{t("oaModels.subtitle")}</span>
                <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl text-balance">
                  {t("oaModels.title")}
                </h2>
                <p className="mt-4 text-lg text-muted-foreground">
                  {t("oaModels.description")}
                </p>
                <div className="mt-8 space-y-6">
                  <div className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                      <Lock className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{t("oaModels.gold.title")}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {t("oaModels.gold.description")}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                      <Zap className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{t("oaModels.hybrid.title")}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {t("oaModels.hybrid.description")}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-8">
                  <Button asChild>
                    <Link href="/open-access">
                      {t("oaModels.learnMore")}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-square rounded-2xl bg-gradient-to-br from-muted/50 via-primary/5 to-accent/10 border border-border p-8 flex items-center justify-center">
                  <div className="text-center">
                    <BookOpen className="h-24 w-24 mx-auto text-primary/30" />
                    <p className="mt-4 text-muted-foreground font-medium">{t("oaModels.accessible")}</p>
                    <p className="mt-2 text-sm text-muted-foreground">{t("oaModels.fromMainz")}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section 
          className="text-white"
          style={{
            background: 'linear-gradient(135deg, oklch(0.45 0.12 200) 0%, oklch(0.35 0.10 220) 50%, oklch(0.28 0.08 240) 100%)'
          }}
        >
          <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8 lg:py-20">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-balance">
                {t("cta.title")}
              </h2>
              <p className="mt-4 text-lg text-white/80">
                {t("cta.subtitle")}
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold">
                  <Link href="/submit">
                    {t("cta.submit")}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="border-white/30 bg-white/5 text-white hover:bg-white/10 hover:text-white">
                  <Link href="/author-guidelines">{t("cta.guidelines")}</Link>
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
