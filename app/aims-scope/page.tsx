import { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Brain, Landmark, Microscope, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "Aims & Scope | PeerRex",
  description: "Discover the aims, scope, and research areas covered by PeerRex journals.",
}

const disciplines = [
  {
    icon: Brain,
    title: "Social Sciences",
    description: "Our social sciences journals publish cutting-edge research that advances understanding of human society, behavior, and institutions.",
    areas: [
      "Sociology and Social Policy",
      "Political Science and International Relations",
      "Economics and Development Studies",
      "Psychology and Behavioral Sciences",
      "Anthropology and Cultural Studies",
      "Education and Pedagogy",
      "Communication and Media Studies",
      "Law and Legal Studies",
    ],
    color: "primary",
  },
  {
    icon: Landmark,
    title: "Archaeology",
    description: "Our archaeology journals advance the study of human history through material remains, from prehistoric times to the recent past.",
    areas: [
      "Prehistoric and Protohistoric Archaeology",
      "Classical and Mediterranean Archaeology",
      "Medieval and Historical Archaeology",
      "Archaeological Science and Methods",
      "Cultural Heritage and Conservation",
      "Near Eastern and Asian Archaeology",
      "African and American Archaeology",
      "Maritime and Underwater Archaeology",
    ],
    color: "accent",
  },
  {
    icon: Microscope,
    title: "Medical Sciences",
    description: "Our medical science journals publish research that improves human health through clinical, translational, and public health research.",
    areas: [
      "Clinical Medicine and Diagnostics",
      "Public Health and Epidemiology",
      "Biomedical Research",
      "Pharmaceutical Sciences",
      "Nursing and Allied Health",
      "Mental Health and Psychiatry",
      "Global Health and Health Policy",
      "Medical Education",
    ],
    color: "chart-3",
  },
]

const aims = [
  {
    title: "Advance Knowledge",
    description: "Publish high-quality, peer-reviewed research that contributes significantly to scholarly understanding in our focus disciplines.",
  },
  {
    title: "Promote Open Access",
    description: "Ensure research is freely available to readers worldwide, breaking down barriers to scientific and scholarly information.",
  },
  {
    title: "Foster Collaboration",
    description: "Create platforms that connect researchers across disciplines and borders, encouraging interdisciplinary dialogue.",
  },
  {
    title: "Uphold Ethics",
    description: "Maintain the highest standards of publication ethics and research integrity in all our editorial processes.",
  },
  {
    title: "Support Authors",
    description: "Provide excellent author services, including efficient peer review, professional editing, and wide dissemination.",
  },
  {
    title: "Serve Society",
    description: "Publish research that addresses real-world challenges and contributes to the betterment of human society.",
  },
]

export default function AimsScopePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-muted/30 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8 lg:py-24">
            <div className="max-w-3xl">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-balance">
                Aims & Scope
              </h1>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                PeerRex is dedicated to publishing impactful research across Social Sciences, Archaeology, and Medical Sciences, serving the global scholarly community through open access.
              </p>
            </div>
          </div>
        </section>

        {/* Our Aims */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="max-w-2xl mb-12">
              <h2 className="text-3xl font-bold tracking-tight">Our Aims</h2>
              <p className="mt-4 text-muted-foreground">
                Our publishing activities are guided by these core objectives.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {aims.map((aim) => (
                <div key={aim.title} className="flex gap-4">
                  <CheckCircle className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold">{aim.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{aim.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Disciplines */}
        <section className="py-16 lg:py-24 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="max-w-2xl mb-12">
              <h2 className="text-3xl font-bold tracking-tight">Research Areas</h2>
              <p className="mt-4 text-muted-foreground">
                We publish peer-reviewed research in three major disciplines, covering a wide range of specialized areas.
              </p>
            </div>
            <div className="space-y-12">
              {disciplines.map((discipline) => (
                <Card key={discipline.title} className="overflow-hidden">
                  <CardHeader className="bg-background">
                    <div className="flex items-start gap-4">
                      <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${
                        discipline.color === 'primary' ? 'bg-primary/10' :
                        discipline.color === 'accent' ? 'bg-accent/10' : 'bg-chart-3/20'
                      }`}>
                        <discipline.icon className={`h-6 w-6 ${
                          discipline.color === 'primary' ? 'text-primary' :
                          discipline.color === 'accent' ? 'text-accent' : 'text-foreground'
                        }`} />
                      </div>
                      <div>
                        <CardTitle className="text-2xl">{discipline.title}</CardTitle>
                        <CardDescription className="mt-2 text-base">{discipline.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                      Areas of Focus
                    </h4>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {discipline.areas.map((area) => (
                        <div key={area} className="flex items-center gap-2 text-sm">
                          <div className={`h-1.5 w-1.5 rounded-full ${
                            discipline.color === 'primary' ? 'bg-primary' :
                            discipline.color === 'accent' ? 'bg-accent' : 'bg-chart-3'
                          }`} />
                          {area}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Submission Types */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="max-w-2xl mb-12">
              <h2 className="text-3xl font-bold tracking-tight">Article Types</h2>
              <p className="mt-4 text-muted-foreground">
                We welcome various types of scholarly contributions.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="p-6 rounded-lg border border-border">
                <h3 className="font-semibold text-lg">Original Research</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Full-length articles reporting new findings from original empirical or theoretical research.
                </p>
              </div>
              <div className="p-6 rounded-lg border border-border">
                <h3 className="font-semibold text-lg">Review Articles</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Comprehensive reviews synthesizing current knowledge on specific topics within our scope.
                </p>
              </div>
              <div className="p-6 rounded-lg border border-border">
                <h3 className="font-semibold text-lg">Short Communications</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Brief reports of significant preliminary findings or novel methodological approaches.
                </p>
              </div>
              <div className="p-6 rounded-lg border border-border">
                <h3 className="font-semibold text-lg">Case Studies</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Detailed examinations of specific cases that provide broader insights for the field.
                </p>
              </div>
              <div className="p-6 rounded-lg border border-border">
                <h3 className="font-semibold text-lg">Perspectives</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Opinion pieces and commentaries on important developments in the field.
                </p>
              </div>
              <div className="p-6 rounded-lg border border-border">
                <h3 className="font-semibold text-lg">Data Papers</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Papers describing datasets made publicly available for reuse by the research community.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-primary text-primary-foreground">
          <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8 lg:py-20">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Ready to Submit Your Research?
              </h2>
              <p className="mt-4 text-lg text-primary-foreground/80">
                If your research falls within our scope, we invite you to submit your manuscript for consideration.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/submit">
                    Submit Manuscript
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                  <Link href="/author-guidelines">Author Guidelines</Link>
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
