"use client"

import Link from "next/link"
import { ArrowRight, BookOpen, Users, Shield, Globe, FileCheck, Microscope, Landmark, Brain, Beaker, Lock, Zap, Leaf, Heart, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/lib/language-context"
import { HeroGlobe } from "@/components/hero-globe"

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
      title: t("journals.ss.title"),
      description: t("journals.ss.description"),
      icon: Users,
      href: "/journals/social-sciences",
      type: "Gold OA",
      typeColor: "bg-accent text-accent-foreground",
    },
    {
      title: t("journals.bio.title"),
      description: t("journals.bio.description"),
      icon: Leaf,
      href: "/journals/biology",
      type: "Gold OA",
      typeColor: "bg-accent text-accent-foreground",
    },
    {
      title: t("journals.chem.title"),
      description: t("journals.chem.description"),
      icon: Beaker,
      href: "/journals/chemistry",
      type: "Gold OA",
      typeColor: "bg-accent text-accent-foreground",
    },
    {
      title: t("journals.med.title"),
      description: t("journals.med.description"),
      icon: Heart,
      href: "/journals/medicine",
      type: "Gold OA",
      typeColor: "bg-accent text-accent-foreground",
    },
    {
      title: t("journals.ds.title"),
      description: t("journals.ds.description"),
      icon: Brain,
      href: "/journals/data-science",
      type: "Gold OA",
      typeColor: "bg-accent text-accent-foreground",
    },
    {
      title: t("journals.eng.title"),
      description: t("journals.eng.description"),
      icon: Settings,
      href: "/journals/engineering",
      type: "Gold OA",
      typeColor: "bg-accent text-accent-foreground",
    },
    {
      title: t("journals.env.title"),
      description: t("journals.env.description"),
      icon: Globe,
      href: "/journals/environmental-science",
      type: "Gold OA",
      typeColor: "bg-accent text-accent-foreground",
    },
  ]

  const stats = [
    { value: "100%", label: t("stats.openAccess") },
    { value: "7", label: t("stats.journals") },
    { value: "Global", label: t("stats.reach") },
    { value: "COPE", label: t("stats.guidelines") },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section - Scholarly Open Leafy Green Theme */}
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
              <div className="flex items-center justify-center relative">
                <HeroGlobe />
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
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg" style={{background: 'var(--primary-foreground)'}}>
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
                  <Button variant="secondary" asChild className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">
                    <Link href="/open-access">
                      {t("oaModels.learnMore")}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-square rounded-2xl bg-gradient-to-r from-[var(--primary)] via-[var(--primary-mid)] to-[var(--primary-dark)] border border-border p-8 flex items-center justify-center">
                  <div className="text-center text-white">
                    <BookOpen className="h-24 w-24 mx-auto text-white" />
                    <p className="mt-4 font-medium">{t("oaModels.accessible")}</p>
                    <p className="mt-2 text-sm text-white/80">{t("oaModels.fromMainz")}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-secondary text-foreground">
          <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8 lg:py-20">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-balance">
                {t("cta.title")}
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                {t("cta.subtitle")}
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold">
                  <Link href="/submit">
                    {t("cta.submit")}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="border-primary bg-background text-foreground hover:bg-primary/10 hover:text-foreground">
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

