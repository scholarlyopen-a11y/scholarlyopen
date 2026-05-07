import { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Target, Eye, Award, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "About Us | Scholarisch",
  description: "Learn about Scholarisch, an international open-access publisher dedicated to advancing scholarly communication.",
}

const values = [
  {
    icon: Target,
    title: "Integrity",
    description: "We uphold the highest ethical standards in scholarly publishing, ensuring transparency and accountability in all our processes.",
  },
  {
    icon: Eye,
    title: "Openness",
    description: "We believe knowledge should be freely accessible to all, breaking down barriers to scientific and scholarly information.",
  },
  {
    icon: Award,
    title: "Excellence",
    description: "We are committed to publishing only the highest quality research through rigorous peer review and editorial oversight.",
  },
  {
    icon: Globe,
    title: "Global Impact",
    description: "We connect researchers across borders, fostering international collaboration and knowledge exchange.",
  },
]

const timeline = [
  {
    year: "2024",
    title: "Foundation",
    description: "Scholarisch was established with a vision to transform scholarly publishing.",
  },
  {
    year: "2024",
    title: "First Journals Launched",
    description: "Launch of our flagship journals in Artificial Intelligence, Clinical Medicine, and related disciplines.",
  },
  {
    year: "2025",
    title: "Compliance Standards",
    description: "Aligned with the highest standards in open access publishing and research integrity.",
  },
  {
    year: "2025",
    title: "Indexing Milestones",
    description: "Journals indexed in major international databases and discovery services.",
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-muted/30 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8 lg:py-24">
            <div className="max-w-3xl">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-balance">
                About Scholarisch
              </h1>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                We are an international open-access publisher committed to advancing scholarly communication through innovative publishing practices and unwavering commitment to research integrity.
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
                  <span className="text-sm font-medium text-primary uppercase tracking-wider">Our Mission</span>
                  <h2 className="mt-2 text-3xl font-bold tracking-tight">
                    Democratizing Knowledge
                  </h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Our mission is to facilitate the global dissemination of high-quality research by providing open access to peer-reviewed scholarly articles. We believe that knowledge should not be constrained by financial or geographical barriers.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  We work with researchers, institutions, and funders worldwide to ensure that important discoveries in Artificial Intelligence, Clinical Medicine, Sustainability, Data Science, and Engineering reach the audiences who need them most.
                </p>
              </div>
              <div className="space-y-6">
                <div>
                  <span className="text-sm font-medium text-primary uppercase tracking-wider">Our Vision</span>
                  <h2 className="mt-2 text-3xl font-bold tracking-tight">
                    A More Open Future
                  </h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  We envision a world where all scholarly research is freely accessible, where researchers are recognized for their contributions, and where the advancement of human knowledge benefits everyone equally.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Through continuous innovation in publishing technology and processes, we strive to create a sustainable and equitable publishing ecosystem that serves the global research community.
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
                Our Core Values
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                These principles guide everything we do at Scholarisch.
              </p>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {values.map((value) => (
                <div key={value.title} className="bg-background rounded-lg border border-border p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
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
                Our Journey
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Key milestones in the development of Scholarisch.
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
                <span className="text-sm font-medium text-primary uppercase tracking-wider">Our Reach</span>
                <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                  Serving Researchers Worldwide
                </h2>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  Scholarisch is dedicated to connecting researchers across the globe. We work with authors, reviewers, and institutions from every continent to advance scholarly communication.
                </p>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  Our international editorial board and global network of peer reviewers ensure that research from all regions receives the attention and rigorous evaluation it deserves.
                </p>
              </div>
              <div className="aspect-video rounded-lg bg-muted border border-border flex items-center justify-center">
                <div className="text-center p-8">
                  <Globe className="h-16 w-16 mx-auto text-primary/20" />
                  <p className="mt-4 text-sm text-muted-foreground">Connecting researchers worldwide</p>
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
                Join Our Community
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Whether as an author, reviewer, or editorial board member, we welcome your participation in advancing open scholarship.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link href="/submit">
                    Submit Your Research
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/contact">Contact Us</Link>
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
