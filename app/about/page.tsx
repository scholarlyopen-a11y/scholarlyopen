"use client"

import Link from "next/link"
import { useEffect } from "react"
import { ArrowRight, Target, Eye, Award, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/lib/language-context"

export default function AboutPage() {
  const { t } = useLanguage()

  useEffect(() => {
    if (typeof window !== "undefined") {
      document.title = `${t("about.heroTitle")} | Scholarly Open`
    }
  }, [t])

  const values = [
    {
      icon: Target,
      title: t("about.value1.title"),
      description: t("about.value1.desc"),
    },
    {
      icon: Eye,
      title: t("about.value2.title"),
      description: t("about.value2.desc"),
    },
    {
      icon: Award,
      title: t("about.value3.title"),
      description: t("about.value3.desc"),
    },
    {
      icon: Globe,
      title: t("about.value4.title"),
      description: t("about.value4.desc"),
    },
  ]

  const timeline = [
    {
      year: "2024",
      title: t("about.time1.title"),
      description: t("about.time1.desc"),
    },
    {
      year: "2025",
      title: t("about.time2.title"),
      description: t("about.time2.desc"),
    },
    {
      year: "2025",
      title: t("about.time3.title"),
      description: t("about.time3.desc"),
    },
    {
      year: "2026",
      title: t("about.time4.title"),
      description: t("about.time4.desc"),
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
                {t("about.heroTitle")}
              </h1>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                {t("about.heroSubtitle")}
              </p>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-2">
              <div className="space-y-6">
                <div>
                  <span className="text-sm font-medium text-primary uppercase tracking-wider">{t("about.ourMission")}</span>
                  <h2 className="mt-2 text-3xl font-bold tracking-tight">
                    {t("about.missionTitle")}
                  </h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {t("about.missionP1")}
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  {t("about.missionP2")}
                </p>
              </div>
              <div className="space-y-6">
                <div>
                  <span className="text-sm font-medium text-primary uppercase tracking-wider">{t("about.ourVision")}</span>
                  <h2 className="mt-2 text-3xl font-bold tracking-tight">
                    {t("about.visionTitle")}
                  </h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {t("about.visionP1")}
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  {t("about.visionP2")}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 lg:py-24 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {t("about.valuesTitle")}
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                {t("about.valuesSub")}
              </p>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {values.map((value) => (
                <div key={value.title} className="bg-background rounded-lg border border-border p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <value.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">{value.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="max-w-2xl mb-12">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {t("about.journeyTitle")}
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                {t("about.journeySub")}
              </p>
            </div>
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-px bg-border lg:left-1/2 lg:-translate-x-px" />
              <div className="space-y-12">
                {timeline.map((item, index) => (
                  <div key={index} className="relative pl-12 lg:pl-0">
                    <div className={`lg:flex lg:items-center lg:gap-8 ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
                      <div className={`lg:w-1/2 ${index % 2 === 0 ? 'lg:text-right lg:pr-12' : 'lg:pl-12'}`}>
                        <span className="text-sm font-medium text-primary">{item.year}</span>
                        <h3 className="mt-1 text-xl font-semibold">{item.title}</h3>
                        <p className="mt-2 text-muted-foreground">{item.description}</p>
                      </div>
                      <div className="absolute left-0 top-1 flex h-8 w-8 items-center justify-center rounded-full border-4 border-background bg-primary lg:static lg:shrink-0">
                        <div className="h-2 w-2 rounded-full bg-primary-foreground" />
                      </div>
                      <div className="hidden lg:block lg:w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Global Reach */}
        <section className="py-16 lg:py-24 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <div>
                <span className="text-sm font-medium text-primary uppercase tracking-wider">{t("stats.reach")}</span>
                <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                  {t("about.reachTitle")}
                </h2>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  {t("about.reachP1")}
                </p>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  {t("about.reachP2")}
                </p>
              </div>
              <div className="aspect-video rounded-lg bg-muted border border-border flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="flex h-24 w-24 mx-auto items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Globe className="h-12 w-12 text-primary" />
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground">{t("oaModels.fromMainz")}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {t("about.communityTitle")}
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                {t("about.communitySub")}
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild className="font-semibold">
                  <Link href="/submit">
                    {t("about.communitySubmit")}
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
