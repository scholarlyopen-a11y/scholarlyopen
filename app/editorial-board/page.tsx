import { Metadata } from "next"
import Link from "next/link"
import { Mail, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "Editorial Board | PeerRex",
  description: "Meet our distinguished editorial board members who ensure the highest standards of scholarly publishing.",
}

const editorInChief = {
  name: "Prof. Dr. Maria Schmidt",
  role: "Editor-in-Chief",
  affiliation: "European University Institute",
  specialization: "Social Sciences & Research Methodology",
  email: "abbas.qurasani+editorial-board-scholarisch@gmail.com",
}

const seniorEditors = [
  {
    name: "Prof. Dr. Hans Weber",
    role: "Senior Editor, Social Sciences",
    affiliation: "Heidelberg University, Germany",
    specialization: "Political Science & International Relations",
  },
  {
    name: "Prof. Dr. Elena Rossi",
    role: "Senior Editor, Archaeology",
    affiliation: "University of Rome La Sapienza, Italy",
    specialization: "Classical Archaeology & Cultural Heritage",
  },
  {
    name: "Prof. Dr. James Thompson",
    role: "Senior Editor, Medical Sciences",
    affiliation: "University of Oxford, United Kingdom",
    specialization: "Public Health & Epidemiology",
  },
]

const editorialBoard = {
  socialSciences: [
    {
      name: "Dr. Anna Kowalski",
      affiliation: "Jagiellonian University, Poland",
      specialization: "Sociology & Social Policy",
    },
    {
      name: "Prof. Dr. Pierre Dubois",
      affiliation: "Sorbonne University, France",
      specialization: "Economics & Development Studies",
    },
    {
      name: "Dr. Sarah Chen",
      affiliation: "National University of Singapore",
      specialization: "Psychology & Behavioral Sciences",
    },
    {
      name: "Prof. Dr. Carlos Martinez",
      affiliation: "Autonomous University of Madrid, Spain",
      specialization: "Anthropology & Migration Studies",
    },
  ],
  archaeology: [
    {
      name: "Prof. Dr. Michael Brown",
      affiliation: "University of Cambridge, United Kingdom",
      specialization: "Prehistoric Archaeology",
    },
    {
      name: "Dr. Yuki Tanaka",
      affiliation: "University of Tokyo, Japan",
      specialization: "Archaeological Science & Dating Methods",
    },
    {
      name: "Prof. Dr. Fatima Al-Hassan",
      affiliation: "American University of Beirut, Lebanon",
      specialization: "Near Eastern Archaeology",
    },
    {
      name: "Dr. Lars Andersson",
      affiliation: "Uppsala University, Sweden",
      specialization: "Medieval Archaeology",
    },
  ],
  medicalSciences: [
    {
      name: "Prof. Dr. Lisa Mueller",
      affiliation: "Charité - Universitätsmedizin Berlin, Germany",
      specialization: "Clinical Medicine & Diagnostics",
    },
    {
      name: "Dr. Raj Patel",
      affiliation: "All India Institute of Medical Sciences, India",
      specialization: "Infectious Diseases",
    },
    {
      name: "Prof. Dr. Emily Williams",
      affiliation: "Harvard Medical School, USA",
      specialization: "Biomedical Research",
    },
    {
      name: "Dr. Kim Soo-Jin",
      affiliation: "Seoul National University, South Korea",
      specialization: "Pharmaceutical Sciences",
    },
  ],
}

export default function EditorialBoardPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-muted/30 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8 lg:py-24">
            <div className="max-w-3xl">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-balance">
                Editorial Board
              </h1>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                Our distinguished editorial board comprises leading scholars from renowned institutions worldwide, ensuring the highest standards of peer review and editorial excellence.
              </p>
            </div>
          </div>
        </section>

        {/* Editor-in-Chief */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="max-w-2xl mb-12">
              <h2 className="text-3xl font-bold tracking-tight">Editor-in-Chief</h2>
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
              <h2 className="text-3xl font-bold tracking-tight">Senior Editors</h2>
              <p className="mt-4 text-muted-foreground">
                Our senior editors lead the editorial direction for each of our core disciplines.
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
              <h2 className="text-3xl font-bold tracking-tight">Editorial Board Members</h2>
              <p className="mt-4 text-muted-foreground">
                Our editorial board members bring diverse expertise from institutions around the world.
              </p>
            </div>

            {/* Social Sciences */}
            <div className="mb-12">
              <h3 className="text-xl font-semibold mb-6 pb-2 border-b border-border">Social Sciences</h3>
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
              <h3 className="text-xl font-semibold mb-6 pb-2 border-b border-border">Archaeology</h3>
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
              <h3 className="text-xl font-semibold mb-6 pb-2 border-b border-border">Medical Sciences</h3>
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
        <section className="py-16 lg:py-24 bg-primary text-primary-foreground">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Join Our Editorial Team
              </h2>
              <p className="mt-4 text-lg text-primary-foreground/80">
                We are always looking for distinguished scholars to join our editorial board. If you are interested in contributing to the advancement of open scholarship, we would love to hear from you.
              </p>
              <div className="mt-8">
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/contact">
                    Express Interest
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
