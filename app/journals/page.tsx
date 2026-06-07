"use client"

import Link from "next/link"
import { ArrowRight, Globe, Users, Leaf, Beaker, Heart, Brain, Settings, Stethoscope, Cpu, Sprout, Speech } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/lib/language-context"

const journals = [
  {
    titleKey: "journals.ss.title",
    descriptionKey: "journals.ss.description",
    icon: Speech,
    href: "/journals/social-sciences",
    iconColor: "text-amber-500",
  },
  {
    titleKey: "journals.bio.title",
    descriptionKey: "journals.bio.description",
    icon: Leaf,
    href: "/journals/biology",
    iconColor: "text-green-500",
  },
  {
    titleKey: "journals.chem.title",
    descriptionKey: "journals.chem.description",
    icon: Beaker,
    href: "/journals/chemistry",
    iconColor: "text-yellow-500",
  },
  {
    titleKey: "journals.med.title",
    descriptionKey: "journals.med.description",
    icon: Stethoscope,
    href: "/journals/medicine",
    iconColor: "text-rose-500",
  },
  {
    titleKey: "journals.ds.title",
    descriptionKey: "journals.ds.description",
    icon: Cpu,
    href: "/journals/data-science",
    iconColor: "text-blue-500",
  },
  {
    titleKey: "journals.eng.title",
    descriptionKey: "journals.eng.description",
    icon: Settings,
    href: "/journals/engineering",
    iconColor: "text-slate-500",
  },
  {
    titleKey: "journals.env.title",
    descriptionKey: "journals.env.description",
    icon: Sprout,
    href: "/journals/environmental-science",
    iconColor: "text-lime-500",
  },
]

export default function JournalsIndexPage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-muted/30 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8 lg:py-24">
            <div className="max-w-3xl">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-balance">
                {t("nav.journals")}
              </h1>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                Explore our portfolio of Scholarly Open journals across seven disciplines, each publishing FAIR-friendly research with Gold open access.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {journals.map((journal) => (
                <Card key={journal.href} className="border-border hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <journal.icon className="h-6 w-6 text-primary" />
                      </div>
                      <Badge className="bg-accent text-accent-foreground">Gold OA</Badge>
                    </div>
                    <CardTitle className="mt-4">{t(journal.titleKey)}</CardTitle>
                    <CardDescription>{t(journal.descriptionKey)}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link href={journal.href} className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                      View Journal
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
