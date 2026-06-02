"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Mail, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/lib/language-context"

export default function EditorialBoardPage() {
  const { t } = useLanguage()

  useEffect(() => {
    if (typeof window !== "undefined") {
      document.title = `${t("editorial.title")} | Scholarly Open`
    }
  }, [t])

  const editorInChief = {
    name: "Prof. Dr. Maria Schmidt",
    role: t("editorial.editorInChief.role"),
    affiliation: "European University Institute",
    specialization: t("editorial.editorInChief.specialization"),
    email: "editorial-board@scholarlyopen.org",
  }

  const seniorEditors = [
    {
      name: "Prof. Dr. Hans Weber",
      role: t("editorial.senior1.role"),
      affiliation: "Heidelberg University, Germany",
      specialization: t("editorial.senior1.specialization"),
    },
    {
      name: "Prof. Dr. Elena Rossi",
      role: t("editorial.senior2.role"),
      affiliation: "University of Rome La Sapienza, Italy",
      specialization: t("editorial.senior2.specialization"),
    },
    {
      name: "Prof. Dr. James Thompson",
      role: t("editorial.senior3.role"),
      affiliation: "University of Oxford, United Kingdom",
      specialization: t("editorial.senior3.specialization"),
    },
  ]

  const editorialBoard = {
    socialSciences: [
      {
        name: "Dr. Anna Kowalski",
        affiliation: "Jagiellonian University, Poland",
        specialization: t("editorial.member.soc1.specialization"),
      },
      {
        name: "Prof. Dr. Pierre Dubois",
        affiliation: "Sorbonne University, France",
        specialization: t("editorial.member.soc2.specialization"),
      },
      {
        name: "Dr. Sarah Chen",
        affiliation: "National University of Singapore",
        specialization: t("editorial.member.soc3.specialization"),
      },
      {
        name: "Prof. Dr. Carlos Martinez",
        affiliation: "Autonomous University of Madrid, Spain",
        specialization: t("editorial.member.soc4.specialization"),
      },
    ],
    archaeology: [
      {
        name: "Prof. Dr. Michael Brown",
        affiliation: "University of Cambridge, United Kingdom",
        specialization: t("editorial.member.arc1.specialization"),
      },
      {
        name: "Dr. Yuki Tanaka",
        affiliation: "University of Tokyo, Japan",
        specialization: t("editorial.member.arc2.specialization"),
      },
      {
        name: "Prof. Dr. Fatima Al-Hassan",
        affiliation: "American University of Beirut, Lebanon",
        specialization: t("editorial.member.arc3.specialization"),
      },
      {
        name: "Dr. Lars Andersson",
        affiliation: "Uppsala University, Sweden",
        specialization: t("editorial.member.arc4.specialization"),
      },
    ],
    medicalSciences: [
      {
        name: "Prof. Dr. Lisa Mueller",
        affiliation: "Charité - Universitätsmedizin Berlin, Germany",
        specialization: t("editorial.member.med1.specialization"),
      },
      {
        name: "Dr. Raj Patel",
        affiliation: "All India Institute of Medical Sciences, India",
        specialization: t("editorial.member.med2.specialization"),
      },
      {
        name: "Prof. Dr. Emily Williams",
        affiliation: "Harvard Medical School, USA",
        specialization: t("editorial.member.med3.specialization"),
      },
      {
        name: "Dr. Kim Soo-Jin",
        affiliation: "Seoul National University, South Korea",
        specialization: t("editorial.member.med4.specialization"),
      },
    ],
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
                {t("editorial.title")}
              </h1>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                {t("editorial.subtitle")}
              </p>
            </div>
          </div>
        </section>

        {/* Editor-in-Chief */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="max-w-2xl mb-12">
              <h2 className="text-3xl font-bold tracking-tight">{t("editorial.editorInChief")}</h2>
            </div>
            <Card className="max-w-2xl">
              <CardHeader>
                <div className="flex items-start gap-6">
                  <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-2xl font-bold text-primary">MS</span>
                  </div>
                  <div>
                    <CardTitle className="text-xl">{editorInChief.name}</CardTitle>
                    <CardDescription className="text-base mt-1">{editorInChief.role}</CardDescription>
                    <p className="text-sm text-muted-foreground mt-2">{editorInChief.affiliation}</p>
                    <p className="text-sm text-primary mt-1">{editorInChief.specialization}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <a 
                  href={`mailto:${editorInChief.email}`}
                  className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  {editorInChief.email}
                </a>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Senior Editors */}
        <section className="py-16 lg:py-24 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="max-w-2xl mb-12">
              <h2 className="text-3xl font-bold tracking-tight">{t("editorial.seniorEditors")}</h2>
              <p className="mt-4 text-muted-foreground">
                {t("editorial.seniorEditorsSubtitle")}
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {seniorEditors.map((editor) => (
                <Card key={editor.name}>
                  <CardHeader>
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <span className="text-lg font-bold text-primary">
                        {editor.name.split(' ').slice(-1)[0].charAt(0)}{editor.name.split(' ')[0].charAt(0)}
                      </span>
                    </div>
                    <CardTitle className="text-lg">{editor.name}</CardTitle>
                    <CardDescription>{editor.role}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{editor.affiliation}</p>
                    <p className="text-sm text-primary mt-1">{editor.specialization}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Editorial Board by Discipline */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="max-w-2xl mb-12">
              <h2 className="text-3xl font-bold tracking-tight">{t("editorial.boardMembers")}</h2>
              <p className="mt-4 text-muted-foreground">
                {t("editorial.boardMembersSubtitle")}
              </p>
            </div>

            {/* Social Sciences */}
            <div className="mb-12">
              <h3 className="text-xl font-semibold mb-6 pb-2 border-b border-border">{t("editorial.discipline.socialSciences")}</h3>
              <div className="grid gap-4 md:grid-cols-2">
                {editorialBoard.socialSciences.map((member) => (
                  <div key={member.name} className="flex items-start gap-4 p-4 rounded-lg bg-muted/30">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-sm font-semibold text-primary">
                        {member.name.split(' ').slice(-1)[0].charAt(0)}{member.name.split(' ')[0].charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-medium">{member.name}</h4>
                      <p className="text-sm text-muted-foreground">{member.affiliation}</p>
                      <p className="text-sm text-primary">{member.specialization}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Archaeology */}
            <div className="mb-12">
              <h3 className="text-xl font-semibold mb-6 pb-2 border-b border-border">{t("editorial.discipline.archaeology")}</h3>
              <div className="grid gap-4 md:grid-cols-2">
                {editorialBoard.archaeology.map((member) => (
                  <div key={member.name} className="flex items-start gap-4 p-4 rounded-lg bg-muted/30">
                    <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                      <span className="text-sm font-semibold text-accent">
                        {member.name.split(' ').slice(-1)[0].charAt(0)}{member.name.split(' ')[0].charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-medium">{member.name}</h4>
                      <p className="text-sm text-muted-foreground">{member.affiliation}</p>
                      <p className="text-sm text-accent">{member.specialization}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Medical Sciences */}
            <div>
              <h3 className="text-xl font-semibold mb-6 pb-2 border-b border-border">{t("editorial.discipline.medicalSciences")}</h3>
              <div className="grid gap-4 md:grid-cols-2">
                {editorialBoard.medicalSciences.map((member) => (
                  <div key={member.name} className="flex items-start gap-4 p-4 rounded-lg bg-muted/30">
                    <div className="h-12 w-12 rounded-full bg-chart-3/20 flex items-center justify-center shrink-0">
                      <span className="text-sm font-semibold text-foreground">
                        {member.name.split(' ').slice(-1)[0].charAt(0)}{member.name.split(' ')[0].charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-medium">{member.name}</h4>
                      <p className="text-sm text-muted-foreground">{member.affiliation}</p>
                      <p className="text-sm text-muted-foreground">{member.specialization}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Join Editorial Board */}
        <section className="py-16 lg:py-24 bg-secondary text-secondary-foreground">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {t("editorial.joinTeam")}
              </h2>
              <p className="mt-4 text-lg text-secondary-foreground/80">
                {t("editorial.joinTeamSubtitle")}
              </p>
              <div className="mt-8">
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/contact">
                    {t("editorial.expressInterest")}
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Link>
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
