"use client"

import Link from "next/link"
import { ArrowRight, Leaf, Beaker, Stethoscope, Cpu, Settings, Sprout, UsersRound, HeartPulse, Shield, Wind, Atom, Dna, Rocket } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useLanguage } from "@/lib/language-context"

const coreJournals = [
  {
    titleKey: "journals.ss.title",
    descriptionKey: "journals.ss.description",
    icon: UsersRound,
    href: "/journals/social-sciences-humanities",
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

const frontiersJournals = [
  {
    titleKey: "journals.clinical-ai.title",
    descriptionKey: "journals.clinical-ai.description",
    icon: HeartPulse,
    href: "/journals/clinical-ai",
    iconColor: "text-green-500",
  },
  {
    titleKey: "journals.ai-safety.title",
    descriptionKey: "journals.ai-safety.description",
    icon: Shield,
    href: "/journals/ai-safety",
    iconColor: "text-green-500",
  },
  {
    titleKey: "journals.decarbonization.title",
    descriptionKey: "journals.decarbonization.description",
    icon: Wind,
    href: "/journals/decarbonization",
    iconColor: "text-green-500",
  },
  {
    titleKey: "journals.quantum-engineering.title",
    descriptionKey: "journals.quantum-engineering.description",
    icon: Atom,
    href: "/journals/quantum-engineering",
    iconColor: "text-green-500",
  },
  {
    titleKey: "journals.synthetic-biology.title",
    descriptionKey: "journals.synthetic-biology.description",
    icon: Dna,
    href: "/journals/synthetic-biology",
    iconColor: "text-green-500",
  },
  {
    titleKey: "journals.space-resources.title",
    descriptionKey: "journals.space-resources.description",
    icon: Rocket,
    href: "/journals/space-resources",
    iconColor: "text-green-500",
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
                Explore our portfolio of Scholarly Open journals, including our Core Disciplinary Series and our new Emerging Frontiers Series of specialized high-demand titles.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <Tabs defaultValue="core" className="w-full">
              <TabsList className="grid w-full max-w-md grid-cols-2 mb-12">
                <TabsTrigger value="core" className="font-semibold text-sm">Core Series</TabsTrigger>
                <TabsTrigger value="frontiers" className="font-semibold text-sm">Emerging Frontiers</TabsTrigger>
              </TabsList>

              <TabsContent value="core" className="mt-0 focus-visible:outline-none animate-in fade-in duration-300">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {coreJournals.map((journal) => (
                    <Card key={journal.href} className="border-border hover:border-primary/50 transition-colors flex flex-col justify-between">
                      <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <journal.icon className={`h-6 w-6 ${journal.iconColor}`} />
                          </div>
                          <Badge className="bg-accent text-accent-foreground font-semibold">Gold OA</Badge>
                        </div>
                        <CardTitle className="mt-4 text-xl font-bold">{t(journal.titleKey)}</CardTitle>
                        <CardDescription className="mt-2 text-sm text-muted-foreground leading-normal">{t(journal.descriptionKey)}</CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <Link href={journal.href} className="inline-flex items-center text-sm font-semibold text-primary hover:text-primary/80 transition-colors">
                          View Journal
                          <ArrowRight className="ml-1.5 h-4 w-4" />
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="frontiers" className="mt-0 focus-visible:outline-none animate-in fade-in duration-300">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {frontiersJournals.map((journal) => (
                    <Card key={journal.href} className="border-border hover:border-primary/50 transition-colors flex flex-col justify-between ring-1 ring-primary/5">
                      <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <journal.icon className={`h-6 w-6 ${journal.iconColor}`} />
                          </div>
                          <Badge className="bg-accent text-accent-foreground font-semibold">Gold OA</Badge>
                        </div>
                        <CardTitle className="mt-4 text-xl font-bold">{t(journal.titleKey)}</CardTitle>
                        <CardDescription className="mt-2 text-sm text-muted-foreground leading-normal">{t(journal.descriptionKey)}</CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <Link href={journal.href} className="inline-flex items-center text-sm font-semibold text-primary hover:text-primary/80 transition-colors">
                          View Journal
                          <ArrowRight className="ml-1.5 h-4 w-4" />
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
